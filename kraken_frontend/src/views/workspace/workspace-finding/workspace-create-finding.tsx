import Editor from "@monaco-editor/react";
import React, { ChangeEvent } from "react";
import Select, { components } from "react-select";
import { Api } from "../../../api/api";
import {
    CreateFindingAffectedRequest,
    FindingSeverity,
    FullDomain,
    FullHost,
    FullPort,
    FullService,
    SimpleFindingDefinition,
} from "../../../api/generated";
import { GithubMarkdown } from "../../../components/github-markdown";
import { SelectPrimitive, selectStyles } from "../../../components/select-menu";
import BookIcon from "../../../svg/book";
import FileIcon from "../../../svg/file";
import InformationIcon from "../../../svg/information";
import RelationLeftRightIcon from "../../../svg/relation-left-right";
import ScreenshotIcon from "../../../svg/screenshot";
import { handleApiError } from "../../../utils/helper";
import { setupMonaco } from "../../knowledge-base";
import { useSectionsState } from "../../knowledge-base/finding-definition/sections";
import { WORKSPACE_CONTEXT } from "../workspace";

import { toast } from "react-toastify";
import { ROUTES } from "../../../routes";
import ArrowDownIcon from "../../../svg/arrow-down";
import PlusIcon from "../../../svg/plus";
import Domain from "../components/domain";
import IpAddr from "../components/host";
import PortNumber from "../components/port";
import { Screenshot, ScreenshotInput } from "../components/screenshot-input";
import ServiceName from "../components/service";
import TagList from "../components/tag-list";
import WorkspaceFindingTable from "./workspace-finding-table";

export type CreateFindingProps = {};

type LocalAffected = CreateFindingAffectedRequest & {
    _localScreenshot?: Screenshot;
    _fileDataURL?: string;
} & (
        | { type: "Domain"; _data: FullDomain }
        | { type: "Host"; _data: FullHost }
        | { type: "Service"; _data: FullService }
        | { type: "Port"; _data: FullPort }
    );

const SECTION = { definition: "Definition", description: "Description", affected: "Affected" };

export function WorkspaceCreateFinding(props: CreateFindingProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [severity, setSeverity] = React.useState<FindingSeverity>("Medium");
    const [section, setSection] = React.useState<keyof typeof SECTION>("definition");
    const [findingDef, setFindingDef] = React.useState<string | undefined>(undefined); // selected definition
    const [defs, setDefs] = React.useState([] as Array<SimpleFindingDefinition>); // all definitions
    const [hover, setHover] = React.useState<SimpleFindingDefinition | undefined>(); // hovered definition
    const [file, setFile] = React.useState<File>();
    const [fileDataURL, setFileDataURL] = React.useState<string | undefined>("");
    const [description, setDescription] = React.useState<boolean>(true);
    const [affectedVisible, setAffectedVisible] = React.useState<boolean>(true);
    const [affected, setAffected] = React.useState<Array<LocalAffected>>([]);
    const [screenshot, setScreenshotDataURL] = React.useState<Screenshot | undefined>(undefined);

    const addAffected = (newAffected: LocalAffected) => {
        setAffected((affected) => {
            if (affected.some((a) => a.uuid == newAffected.uuid)) return affected;

            return [
                ...affected,
                {
                    _fileDataURL: undefined,
                    _screenshotDataURL: undefined,
                    ...newAffected,
                },
            ].sort((a, b) => {
                if (a.type < b.type) return -1;
                if (a.type > b.type) return 1;
                // TODO: type-based sorters
                if (a.uuid < b.uuid) return -1;
                if (a.uuid > b.uuid) return 1;
                return 0;
            });
        });
    };

    const sections = useSectionsState();

    React.useEffect(() => {
        Api.knowledgeBase.findingDefinitions.all().then(
            handleApiError(({ findingDefinitions }) => {
                setDefs(findingDefinitions);
            }),
        );
    }, []);

    const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const fileUploadInput = e.target;

        if (!fileUploadInput) {
            return; //File input element not found
        }

        // @ts-ignore
        const f = fileUploadInput.files[0];

        if (!f) {
            return; //No file selected
        }

        //TODO typecheck?

        setFile(f);
        setFileDataURL(URL.createObjectURL(f));
    };

    const editor = () => {
        switch (section) {
            case "definition":
                return (
                    <>
                        {hover !== undefined ? (
                            <FindingDefinitionDetails {...hover} />
                        ) : (
                            // @ts-ignore
                            <FindingDefinitionDetails {...defs.find((finding) => finding.uuid === findingDef)} />
                        )}
                    </>
                );
            case "description":
                return (
                    <Editor
                        className={"knowledge-base-editor"}
                        theme={"custom"}
                        beforeMount={setupMonaco}
                        {...sections["Description"].editor}
                        onChange={(value, event) => {
                            if (value !== undefined) sections["Description"].set(value);
                        }}
                    />
                );
            case "affected":
                return (
                    <div className="workspace-finding-data-table">
                        <WorkspaceFindingTable
                            onAddDomain={(d) =>
                                addAffected({
                                    type: "Domain",
                                    uuid: d.uuid,
                                    _data: d,
                                })
                            }
                            onAddHost={(d) =>
                                addAffected({
                                    type: "Host",
                                    uuid: d.uuid,
                                    _data: d,
                                })
                            }
                            onAddPort={(d) =>
                                addAffected({
                                    type: "Port",
                                    uuid: d.uuid,
                                    _data: d,
                                })
                            }
                            onAddService={(d) =>
                                addAffected({
                                    type: "Service",
                                    uuid: d.uuid,
                                    _data: d,
                                })
                            }
                        />
                    </div>
                );
            default:
                return "Unimplemented";
        }
    };

    return (
        <>
            <div className="pane">
                <div className="workspace-findings-selection-info">
                    <h1 className="heading">Create new finding</h1>
                </div>
                <div className="create-finding-container">
                    <form
                        className="create-finding-form"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (findingDef === undefined) {
                                return toast.error("Please select finding definition");
                            }

                            const affectedUploaded = await Promise.all(
                                affected.map(async (a) => {
                                    let { _fileDataURL: file, _localScreenshot: screenshot, ...request } = a;
                                    if (screenshot?.file !== undefined) {
                                        let r = await Api.workspaces.files.uploadImage(
                                            workspace,
                                            screenshot.file.name,
                                            screenshot.file,
                                        );
                                        request.screenshot = r.unwrap().uuid;
                                    }
                                    if (file !== undefined) {
                                        // TODO: upload file
                                    }
                                    return request;
                                }),
                            ).catch((e) => {
                                console.error("Failed uploading affected screenshot: ", e);
                                return null;
                            });
                            if (affectedUploaded === null) {
                                return toast.error("Some files for affected data couldn't be uploaded");
                            }

                            let screenshotUuid = screenshot?.file
                                ? await Api.workspaces.files
                                      .uploadImage(workspace, screenshot.file.name, screenshot.file)
                                      .then((r) => r.unwrap().uuid)
                                      .catch((e) => {
                                          console.error("Failed uploading screenshot: ", e);
                                          return null;
                                      })
                                : undefined;
                            if (screenshotUuid === null) {
                                return toast.error("Couldn't upload finding screenshot");
                            }

                            Api.workspaces.findings
                                .create(workspace, {
                                    severity: severity,
                                    definition: findingDef,
                                    details: sections.Description.value,
                                    logFile: undefined, // TODO: upload file
                                    screenshot: screenshotUuid,
                                })
                                .then(
                                    handleApiError(async ({ uuid }) => {
                                        await Promise.all(
                                            affectedUploaded.map((a) =>
                                                Api.workspaces.findings
                                                    .addAffected(workspace, uuid, a)
                                                    .then(handleApiError()),
                                            ),
                                        );
                                        ROUTES.WORKSPACE_FINDINGS_EDIT.visit({ wUuid: workspace, fUuid: uuid });
                                    }),
                                );
                        }}
                    >
                        <div className="create-finding-header">
                            <h2 className={"sub-heading"}>Severity</h2>
                            <h2 className={"sub-heading"}>
                                <InformationIcon /> Finding Definition
                            </h2>

                            <SelectPrimitive
                                value={severity}
                                options={[
                                    FindingSeverity.Okay,
                                    FindingSeverity.Low,
                                    FindingSeverity.Medium,
                                    FindingSeverity.High,
                                    FindingSeverity.Critical,
                                ]}
                                onChange={(value) => setSeverity(value || severity)}
                            />
                            <Select<{ label: string; value: string }>
                                required={true}
                                className={"dropdown"}
                                components={{
                                    Option: (props) => (
                                        <div
                                            onMouseOver={(e) => {
                                                if (section !== "definition") {
                                                    setSection("definition");
                                                }
                                                let def = defs.find((finding) => finding.name === props.label);
                                                setHover(def);
                                            }}
                                            onMouseOut={() => {
                                                setHover(undefined);
                                            }}
                                        >
                                            <components.Option {...props} />
                                        </div>
                                    ),
                                }}
                                options={
                                    defs.map((def) => ({
                                        label: def.name,
                                        value: def.uuid,
                                    })) ?? []
                                }
                                value={
                                    findingDef === undefined
                                        ? undefined
                                        : {
                                              label: defs.find((finding) => finding.uuid === findingDef)?.name || "",
                                              value: findingDef,
                                          }
                                }
                                onChange={(value) => {
                                    if (value !== undefined && value !== null) {
                                        setFindingDef(value.value);
                                        setHover(undefined);
                                    }
                                }}
                                isClearable={false}
                                autoFocus={false}
                                styles={selectStyles("default")}
                            />
                        </div>

                        <div>
                            <h2 className={"sub-heading"}>
                                <BookIcon />
                                Description
                                <div
                                    className="create-finding-section-toggle"
                                    onClick={() => setDescription(!description)}
                                >
                                    <ArrowDownIcon inverted={description} />
                                </div>
                            </h2>
                            {description ? <GithubMarkdown>{sections.Description.value}</GithubMarkdown> : <div />}
                        </div>
                        <div>
                            <h2 className={"sub-heading"}>
                                <RelationLeftRightIcon />
                                Affected
                                <div
                                    className="create-finding-section-toggle"
                                    onClick={() => setAffectedVisible(!affectedVisible)}
                                >
                                    <ArrowDownIcon inverted={affectedVisible} />
                                </div>
                            </h2>
                            {affectedVisible && (
                                <div className="affected-list">
                                    {affected.length > 0 ? (
                                        affected.map((a) => (
                                            <div className={`affected affected-${a.type}`}>
                                                <div>
                                                    {a.type == "Domain" ? (
                                                        <Domain domain={a._data} pretty />
                                                    ) : a.type == "Host" ? (
                                                        <IpAddr host={a._data} pretty />
                                                    ) : a.type == "Port" ? (
                                                        <PortNumber port={a._data} pretty />
                                                    ) : a.type == "Service" ? (
                                                        <ServiceName service={a._data} pretty />
                                                    ) : (
                                                        "not implemented"
                                                    )}
                                                </div>
                                                <TagList tags={a._data.tags} />
                                                <ScreenshotInput
                                                    shortText
                                                    className="screenshot"
                                                    screenshot={a._localScreenshot}
                                                    onChange={(v) => {
                                                        setAffected((affected) =>
                                                            affected.map((orig) =>
                                                                orig.uuid == a.uuid
                                                                    ? {
                                                                          ...orig,
                                                                          _localScreenshot: v,
                                                                      }
                                                                    : orig,
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    <ScreenshotIcon />
                                                </ScreenshotInput>
                                                <div className="logfile">
                                                    <FileIcon />
                                                    Upload Attachment
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No affected items yet</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="create-finding-files">
                            <h2 className={"sub-heading"}>
                                <ScreenshotIcon />
                                Screenshot
                            </h2>
                            <h2 className={"sub-heading"}>
                                <FileIcon />
                                Log File
                            </h2>
                            <ScreenshotInput
                                screenshot={screenshot}
                                onChange={setScreenshotDataURL}
                                className="create-finding-screenshot-container"
                            />
                            <div className="create-finding-file-container">
                                <div className="create-finding-log-file">
                                    <label className="button create-finding-file-upload" htmlFor="upload">
                                        Upload
                                    </label>
                                    <input id="upload" type="file" onChange={fileHandler} />
                                </div>
                                {file ? (
                                    <div className="create-finding-file-grid">
                                        <button
                                            title="Remove file"
                                            className="button"
                                            onClick={() => {
                                                setFileDataURL("");
                                                setFile(undefined);
                                            }}
                                        >
                                            <PlusIcon />
                                        </button>
                                        <a className="create-finding-file-name" download={file.name} href={fileDataURL}>
                                            <span>{file.name}</span>
                                        </a>
                                    </div>
                                ) : undefined}
                            </div>
                        </div>
                        <button type={"submit"} className="button">
                            Create
                        </button>
                    </form>
                    <div className="create-finding-editor-container">
                        <div className="knowledge-base-editor-tabs">
                            <button
                                title={"Finding Definition"}
                                className={`knowledge-base-editor-tab ${section === "definition" ? "selected" : ""}`}
                                onClick={() => {
                                    setSection("definition");
                                }}
                            >
                                <InformationIcon />
                            </button>
                            <button
                                title={"Description"}
                                className={`knowledge-base-editor-tab ${section === "description" ? "selected" : ""}`}
                                onClick={() => {
                                    setSection("description");
                                }}
                            >
                                <BookIcon />
                            </button>
                            <button
                                title={"Affected"}
                                className={`knowledge-base-editor-tab ${section === "affected" ? "selected" : ""}`}
                                onClick={() => {
                                    setSection("affected");
                                }}
                            >
                                <RelationLeftRightIcon />
                            </button>
                        </div>
                        {editor()}
                    </div>
                </div>
            </div>
        </>
    );
}

export function FindingDefinitionDetails(props: SimpleFindingDefinition) {
    const { name, severity, summary } = props;
    return (
        <div className={"create-finding-pane"}>
            <h1 className={"sub-heading"}>
                {name} <small>{severity}</small>
            </h1>
            <p>{summary}</p>
        </div>
    );
}
