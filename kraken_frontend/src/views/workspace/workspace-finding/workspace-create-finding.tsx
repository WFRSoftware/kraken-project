import React, { ChangeEvent } from "react";
import { WORKSPACE_CONTEXT } from "../workspace";
import Input from "../../../components/input";
import { SelectPrimitive, selectStyles } from "../../../components/select-menu";
import { useSectionsState } from "../../knowledge-base/finding-definition/sections";
import BookIcon from "../../../svg/book";
import { SimpleFindingDefinition } from "../../../api/generated";
import { Api } from "../../../api/api";
import { handleApiError } from "../../../utils/helper";
import Select from "react-select";
import { components } from "react-select";
import RelationLeftRightIcon from "../../../svg/relation-left-right";
import FileIcon from "../../../svg/file";
import ScreenshotIcon from "../../../svg/screenshot";
import { Details } from "../../knowledge-base/list-finding-definition";
import { GithubMarkdown } from "../../../components/github-markdown";
import { setupMonaco } from "../../knowledge-base";
import Editor from "@monaco-editor/react";
import InformationIcon from "../../../svg/information";
import ArrowLeftIcon from "../../../svg/arrow-left";
import { ROUTES } from "../../../routes";

export type CreateFindingProps = {};

const SECTION = { definition: "Definition", description: "Description", affected: "Affected" };

export function WorkspaceCreateFinding(props: CreateFindingProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [name, setName] = React.useState("");
    const [severity, setSeverity] = React.useState("Medium");
    const [section, setSection] = React.useState<keyof typeof SECTION>("definition");
    const [cve, setCve] = React.useState("");
    const [findingDef, setFindingDef] = React.useState(""); // selected definition
    const [defs, setDefs] = React.useState([] as Array<SimpleFindingDefinition>); // all definitions
    const [hover, setHover] = React.useState<SimpleFindingDefinition | undefined>(); // hovered definition
    const [screenshot, setScreenshot] = React.useState<File>();
    const [file, setFile] = React.useState<File>();
    const [fileDataURL, setFileDataURL] = React.useState<string | undefined>("");

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

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const fileUploadInput = e.target;

        if (!fileUploadInput) {
            return; //File input element not found
        }

        // @ts-ignore
        const image = fileUploadInput.files[0];

        if (!image) {
            return; //No file selected
        }

        if (!image.type.includes("image")) {
            return; //file is no image
        }

        //TODO maybe check file size
        /**
         *  if (image.size > 10_000_000) {
         *     return; //('Maximum upload size is 10MB!')
         *   }
         * */

        setFile(file);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(image);

        fileReader.onload = (e) => {
            const result = e.target?.result as string;
            if (result) {
                setFileDataURL(result);
            }
        };
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
                return <div></div>;
            default:
                return "Unimplemented";
        }
    };

    console.log(fileDataURL);
    console.log(file);
    return (
        <div className="pane">
            <div className="workspace-findings-selection-info">
                <ArrowLeftIcon title={"Back"} {...ROUTES.WORKSPACE_FINDINGS.clickHandler({ uuid: workspace })} />
                <h1 className="heading">Create new finding</h1>
            </div>
            <div className="create-finding-container">
                <div className="create-finding-form">
                    <div className={"create-finding-definition-header"}>
                        <h2 className={"sub-heading"}>Name</h2>
                        <h2 className={"sub-heading"}>Severity</h2>
                        <h2 className={"sub-heading"}>CVE</h2>
                        <Input maxLength={255} value={name} onChange={setName} />
                        <SelectPrimitive
                            value={severity}
                            options={["Okay", "Low", "Medium", "High", "Critical"]}
                            onChange={(value) => setSeverity(value || severity)}
                        />
                        <Input maxLength={255} value={cve} onChange={setCve} />
                    </div>
                    <div>
                        <h2 className={"sub-heading"}>
                            <InformationIcon /> Finding Definition
                        </h2>
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
                        </h2>
                        <GithubMarkdown>{sections.Description.value}</GithubMarkdown>
                    </div>
                    <div>
                        <h2 className={"sub-heading"}>
                            <RelationLeftRightIcon />
                            Affected
                        </h2>
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
                        <div className="create-finding-screenshot">
                            <h1 className="upload-icon">
                                <i className="fa fa-plus fa-2x" aria-hidden={true}></i>
                            </h1>
                            <input
                                className="create-finding-upload"
                                type="file"
                                onChange={changeHandler}
                                accept={"image/*"}
                            />
                        </div>

                        <a href={fileDataURL} target={"_blank"}>
                            <img src={fileDataURL} />
                        </a>
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
                    <div className="create-finding-editor">{editor()}</div>
                </div>
            </div>
        </div>
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

export function Upload() {
    const fileUploadInput = document.querySelector<HTMLInputElement>(".create-finding-upload");

    if (!fileUploadInput) {
        return; //File input element not found
    }

    // @ts-ignore
    const image = fileUploadInput.files[0];

    if (!image) {
        return; //No file selected
    }

    if (!image.type.includes("image")) {
        return; //file is no image
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
        const img = document.querySelector<HTMLElement>(".create-finding-screenshot");
        if (img) {
            img.style.backgroundImage = `url(${e.target?.result})`;
        }
    };
}
