import React, { ChangeEvent, DragEvent } from "react";
import { WORKSPACE_CONTEXT } from "../workspace";
import { SelectPrimitive, selectStyles } from "../../../components/select-menu";
import { useSectionsState } from "../../knowledge-base/finding-definition/sections";
import BookIcon from "../../../svg/book";
import { FullDomain, FullHost, FullPort, FullService, SimpleFindingDefinition } from "../../../api/generated";
import { Api } from "../../../api/api";
import { handleApiError } from "../../../utils/helper";
import Select from "react-select";
import { components } from "react-select";
import RelationLeftRightIcon from "../../../svg/relation-left-right";
import FileIcon from "../../../svg/file";
import ScreenshotIcon from "../../../svg/screenshot";
import { GithubMarkdown } from "../../../components/github-markdown";
import { setupMonaco } from "../../knowledge-base";
import Editor from "@monaco-editor/react";
import InformationIcon from "../../../svg/information";

import Popup from "reactjs-popup";
import PlusIcon from "../../../svg/plus";
import ArrowDownIcon from "../../../svg/arrow-down";
import WorkspaceFindingTable from "./workspace-finding-table";
import { useFilter } from "../components/filter-input";
import { StatelessWorkspaceTable, useTable } from "../components/workspace-table";
import RelationLeftIcon from "../../../svg/relation-left";
import Domain from "../components/domain";
import TagList from "../components/tag-list";
import { CertaintyIcon } from "../workspace-data";
import IpAddr from "../components/host";
import OsIcon from "../../../components/os-icon";
import PortNumber from "../components/port";
import ServiceName from "../components/service";
import Indicator from "../../../components/indicator";

export type CreateFindingProps = {};

const SECTION = { definition: "Definition", description: "Description", affected: "Affected" };

export function WorkspaceCreateFinding(props: CreateFindingProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [severity, setSeverity] = React.useState("Medium");
    const [section, setSection] = React.useState<keyof typeof SECTION>("definition");
    const [findingDef, setFindingDef] = React.useState(""); // selected definition
    const [defs, setDefs] = React.useState([] as Array<SimpleFindingDefinition>); // all definitions
    const [hover, setHover] = React.useState<SimpleFindingDefinition | undefined>(); // hovered definition
    const [file, setFile] = React.useState<File>();
    const [screenshotDataURL, setScreenshotDataURL] = React.useState<string | undefined>("");
    const [fileDataURL, setFileDataURL] = React.useState<string | undefined>("");
    const [popup, setPopup] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<boolean>(true);
    const [affected, setAffected] = React.useState<boolean>(true);
    const [drag, setDrag] = React.useState<boolean>(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const sections = useSectionsState();

    React.useEffect(() => {
        Api.knowledgeBase.findingDefinitions.all().then(
            handleApiError(({ findingDefinitions }) => {
                setDefs(findingDefinitions);
                if (defs.length > 0) {
                    setFindingDef(defs[0].uuid);
                }
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

    const updateImage = () => {
        const fileUploadInput = inputRef.current;

        if (!fileUploadInput) {
            return; //File input element not found
        }

        // @ts-ignore
        const image = fileUploadInput.files[0];

        if (!image) {
            return; //No file selected
        }

        if (!image.type.includes("image")) {
            return; //file is no image, only .png, .jpg, .jpeg
        }

        //TODO maybe check file size
        /**
         *  if (image.size > 10_000_000) {
         *     return; //('Maximum upload size is 10MB!')
         *   }
         * */

        const fileReader = new FileReader();
        fileReader.readAsDataURL(image);

        fileReader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                setScreenshotDataURL(result);
            }
        };
        setDrag(false);
    };
    const dropHandler = (e: DragEvent<HTMLInputElement>) => {
        console.log(e);
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.files = e.dataTransfer.files;
            updateImage();
        }
    };

    const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updateImage();
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
                        <WorkspaceFindingTable />
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
                    {/*   <ArrowLeftIcon title={"Back"} {...ROUTES.WORKSPACE_FINDINGS.clickHandler({ uuid: workspace })} />*/}
                    <h1 className="heading">Create new finding</h1>
                </div>
                <div className="create-finding-container">
                    <div className="create-finding-form">
                        <div className="create-finding-header">
                            <h2 className={"sub-heading"}>Severity</h2>
                            <h2 className={"sub-heading"}>
                                <InformationIcon /> Finding Definition
                            </h2>

                            <SelectPrimitive
                                value={severity}
                                options={["Okay", "Low", "Medium", "High", "Critical"]}
                                onChange={(value) => setSeverity(value || severity)}
                            />
                            <Select<{ label: string; value: string }>
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
                                value={{
                                    label: defs.find((finding) => finding.uuid === findingDef)?.name || "",
                                    value: findingDef,
                                }}
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
                                <div className="create-finding-section-toggle" onClick={() => setAffected(!affected)}>
                                    <ArrowDownIcon inverted={affected} />
                                </div>
                            </h2>
                            {affected ? <FindingAffectedTable /> : <div />}
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
                            <div className="create-finding-screenshot-container">
                                {screenshotDataURL ? (
                                    <button
                                        title={"Remove screenshot"}
                                        className="button create-finding-close-screenshot"
                                        onClick={() => {
                                            setScreenshotDataURL("");
                                        }}
                                    >
                                        <PlusIcon />
                                    </button>
                                ) : undefined}
                                <div
                                    className="create-finding-screenshot"
                                    onDrop={dropHandler}
                                    onDragOver={(e) => {
                                        if (!drag) {
                                            setDrag(true);
                                        }
                                        e.preventDefault();
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                    }}
                                    onDragLeave={() => setDrag(false)}
                                >
                                    <input
                                        ref={inputRef}
                                        className="create-finding-upload"
                                        type="file"
                                        onChange={imageHandler}
                                        accept={".png, .jpeg, .jpg"}
                                    />
                                    {screenshotDataURL ? (
                                        <>
                                            <div
                                                onClick={() => {
                                                    setPopup(true);
                                                }}
                                            >
                                                <img src={screenshotDataURL} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {drag ? (
                                                <span>Drop image here</span>
                                            ) : (
                                                <span>Drag your image here or click in this area</span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
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
                        {/*TODO Create finding on button click*/}
                        <button className="button">Create</button>
                    </div>
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
            <Popup nested modal open={popup} onClose={() => setPopup(false)}>
                <div className="create-finding-screenshot-popup" onClick={() => setPopup(false)}>
                    <img src={screenshotDataURL} />
                </div>
            </Popup>
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

const DATA_TAB = { domains: "Domains", hosts: "Hosts", ports: "Ports", services: "Services" };
export function FindingAffectedTable() {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);

    const [dataTab, setDataTab] = React.useState<keyof typeof DATA_TAB>("hosts");

    const tab = () => {
        switch (dataTab) {
            case "domains":
                return <div></div>;
            case "hosts":
                return <div></div>;
            case "ports":
                return <div></div>;
            case "services":
                return <div></div>;
        }
    };

    return (
        <div>
            <div className="workspace-finding-affected-selector">
                {Object.entries(DATA_TAB).map(([key, displayName]) => (
                    <h3
                        className={"heading " + (dataTab !== key ? "" : "workspace-finding-affected-selected-tab")}
                        onClick={() => setDataTab(key as keyof typeof DATA_TAB)}
                    >
                        {displayName}
                    </h3>
                ))}
            </div>
        </div>
    );
}
