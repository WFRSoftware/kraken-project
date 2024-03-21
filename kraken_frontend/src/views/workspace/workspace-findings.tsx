import React, { CSSProperties } from "react";
import { Api } from "../../api/api";
import { SimpleFinding } from "../../api/generated";
import Input from "../../components/input";
import { ROUTES } from "../../routes";
import "../../styling/tabs.css";
import "../../styling/workspace-findings.css";
import GraphIcon from "../../svg/graph";
import PlusIcon from "../../svg/plus";
import TableIcon from "../../svg/table";
import { handleApiError } from "../../utils/helper";
import SeverityIcon from "./components/severity-icon";
import { WORKSPACE_CONTEXT } from "./workspace";
import { DynamicTreeGraph } from "./workspace-finding/workspace-finding-dynamic-tree";

export type WorkspaceFindingsProps = {
    view: "table" | "graph";
};

export default function WorkspaceFindings(props: WorkspaceFindingsProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [findings, setFindings] = React.useState<Array<SimpleFinding>>([]);
    const [search, setSearch] = React.useState("");

    const [roots, setRoots] = React.useState<string[]>([]);

    React.useEffect(() => {
        Api.workspaces.findings.all(workspace).then(
            handleApiError(({ findings }): void => {
                setFindings(findings);
                setRoots(findings.map((f) => f.uuid));
            }),
        );
    }, [workspace]);

    // @ts-ignore
    const style: CSSProperties = { "--columns": "0.1fr 1fr 1fr" };

    const body = (() => {
        switch (props.view) {
            case "table":
                return (
                    <>
                        <div className={"workspace-table-pre-header"}>
                            <Input placeholder={"Search findings..."} value={search} onChange={setSearch} />
                            <button
                                className={"button"}
                                title={"Create finding"}
                                {...ROUTES.WORKSPACE_FINDINGS_CREATE.clickHandler({ uuid: workspace })}
                            >
                                <PlusIcon />
                            </button>
                        </div>
                        <div className="workspace-findings-table" style={style}>
                            <div className={"workspace-table-header"}>
                                <span>Severity</span>
                                <span>Name</span>
                                <span>CVE</span>
                            </div>
                            <div className="workspace-table-body">
                                {findings
                                    .filter((f) => {
                                        let q = search.toLowerCase();
                                        return f.name.toLowerCase().includes(q) || f.cve?.toLowerCase().includes(q);
                                    })
                                    .map((f) => (
                                        <div
                                            key={f.uuid}
                                            className="workspace-table-row"
                                            {...ROUTES.WORKSPACE_FINDINGS_EDIT.clickHandler({
                                                wUuid: workspace,
                                                fUuid: f.uuid,
                                            })}
                                        >
                                            <span className="workspace-data-certainty-icon">
                                                <SeverityIcon severity={f.severity} />
                                            </span>
                                            <span>{f.name}</span>
                                            <span>{f.cve}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                );
            case "graph":
                return <DynamicTreeGraph maximizable workspace={workspace} uuids={roots} />;
        }
    })();

    return (
        <div className="workspace-findings-layout">
            <div className="tabs-selector-container">
                <div
                    className={`icon-tabs ${props.view === "table" ? "selected-icon-tab" : ""}`}
                    {...ROUTES.WORKSPACE_FINDINGS_LIST.clickHandler({ uuid: workspace })}
                >
                    <TableIcon />
                </div>
                <div
                    className={`icon-tabs ${props.view === "graph" ? "selected-icon-tab" : ""}`}
                    {...ROUTES.WORKSPACE_FINDINGS_GRAPH.clickHandler({ uuid: workspace })}
                >
                    <GraphIcon />
                </div>
            </div>
            <div className="pane workspace-findings-body">{body}</div>
        </div>
    );
}
