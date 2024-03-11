import React from "react";
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

export type CreateFindingProps = {};

const SECTION = { definition: "Definition", description: "Description", affected: "Affected" };

export function CreateFinding(props: CreateFindingProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [name, setName] = React.useState("");
    const [severity, setSeverity] = React.useState("Medium");
    const [section, setSection] = React.useState<keyof typeof SECTION>("definition");
    const [cve, setCve] = React.useState("");
    const [findingDef, setFindingDef] = React.useState(""); // selected definition
    const [defs, setDefs] = React.useState([] as Array<SimpleFindingDefinition>); // all definitions
    const [hover, setHover] = React.useState<SimpleFindingDefinition | undefined>();

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

    return (
        <div className="pane">
            <div className="workspace-findings-selection-info">
                {/*<ArrowLeftIcon title={"Back"} {...ROUTES.WORKSPACE_FINDINGS.clickHandler({ uuid: workspace })} />*/}
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
                        <h2 className={"sub-heading"}>Finding Definition</h2>
                        <Select<{ label: string; value: string }>
                            className={"dropdown"}
                            components={{
                                Option: (props) => (
                                    <div
                                        onMouseOver={(e) => {
                                            let def = defs.find((finding) => finding.name === props.label);
                                            setHover(def);
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
                        <input className="create-finding-upload" type="file" onChange={Upload} accept={"image/*"} />
                        <input className="create-finding-upload" type="file" onChange={Upload} accept={"image/*"} />
                    </div>
                    {/*TODO Create finding on button click*/}
                    <button className="button">Create</button>
                </div>
                <div className="create-finding-definition-editor">
                    <div className="knowledge-base-editor-tabs">
                        <button
                            title={"Finding Definition"}
                            className={`knowledge-base-editor-tab ${section === "definition" ? "selected" : ""}`}
                            onClick={() => {
                                setSection("definition");
                            }}
                        >
                            FD
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
                    {hover !== undefined ? <Details {...hover} /> : <div />}
                </div>
            </div>
        </div>
    );
}

export function Upload() {}
