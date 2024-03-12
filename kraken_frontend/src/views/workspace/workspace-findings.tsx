import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { WORKSPACE_CONTEXT } from "./workspace";
import "../../styling/workspace-findings.css";
import TableIcon from "../../svg/table";
import GraphIcon from "../../svg/graph";
import SeverityIcon from "../../svg/severity";
import ArrowDownIcon from "../../svg/arrow-down";
import FilterInput, { useFilter } from "./components/filter-input";
import { StatelessWorkspaceTable, useTable } from "./components/workspace-table";
import {
    FullDomain,
    FullFindingDefinition,
    FullHost,
    FullPort,
    FullService,
    SimpleFindingDefinition,
} from "../../api/generated";
import { Api } from "../../api/api";
import TagList from "./components/tag-list";
import { CertaintyIcon } from "./workspace-data";
import ArrowLeftIcon from "../../svg/arrow-left";
import RelationLeftIcon from "../../svg/relation-left";
import "../../styling/tabs.css";
import * as d3 from "d3";
import ArrowRightIcon from "../../svg/arrow-right";
import Input from "../../components/input";
import PlusIcon from "../../svg/plus";
import { handleApiError } from "../../utils/helper";
import { ROUTES } from "../../routes";

const TABS = { table: "Table", graph: "Graph" };
const FINDING_TAB = { details: "Details", relation: "Relation" };
const DATA_TAB = { domains: "Domains", hosts: "Hosts", ports: "Ports", services: "Services" };

type WorkspaceFindingsProps = {};

type Finding = {
    name: string;
    severity: "Ok" | "Low" | "Medium" | "High" | "Critical";
    cve: string;
    findingDefinition: FullFindingDefinition;
    screenshot?: string;
    file?: string;
    affected?: string;
};

export default function WorkspaceFindings(props: WorkspaceFindingsProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [tab, setTab] = React.useState<keyof typeof TABS>("table");
    const [findingTab, setFindingTab] = React.useState<keyof typeof FINDING_TAB>("relation");
    const [dataTab, setDataTab] = React.useState<keyof typeof DATA_TAB>("hosts");
    const [selected, setSelected] = React.useState(false);
    const [findings, setFindings] = React.useState<Array<Finding>>([]);
    const [defs, setDefs] = React.useState([] as Array<SimpleFindingDefinition>);
    const [search, setSearch] = React.useState("");

    const globalFilter = useFilter(workspace, "global");
    const domainFilter = useFilter(workspace, "domain");
    const hostFilter = useFilter(workspace, "host");
    const portFilter = useFilter(workspace, "port");
    const serviceFilter = useFilter(workspace, "service");

    const { items: domains, ...domainsTable } = useTable<FullDomain>(
        (limit, offset) =>
            Api.workspaces.domains.all(workspace, limit, offset, {
                globalFilter: globalFilter.applied,
                domainFilter: domainFilter.applied,
            }),
        [workspace, globalFilter.applied, domainFilter.applied],
    );
    const { items: hosts, ...hostsTable } = useTable<FullHost>(
        (limit, offset) =>
            Api.workspaces.hosts.all(workspace, limit, offset, {
                globalFilter: globalFilter.applied,
                hostFilter: hostFilter.applied,
            }),
        [workspace, globalFilter.applied, hostFilter.applied],
    );
    const { items: ports, ...portsTable } = useTable<FullPort>(
        (limit, offset) =>
            Api.workspaces.ports.all(workspace, limit, offset, {
                globalFilter: globalFilter.applied,
                portFilter: portFilter.applied,
            }),
        [workspace, globalFilter.applied, portFilter.applied],
    );
    const { items: services, ...servicesTable } = useTable<FullService>(
        (limit, offset) =>
            Api.workspaces.services.all(workspace, limit, offset, {
                globalFilter: globalFilter.applied,
                serviceFilter: serviceFilter.applied,
            }),
        [workspace, globalFilter.applied, serviceFilter.applied],
    );

    React.useEffect(() => {
        Api.knowledgeBase.findingDefinitions
            .all()
            .then(handleApiError(({ findingDefinitions }) => setDefs(findingDefinitions)));
    }, []);

    // Jump to first page if filter changed
    React.useEffect(() => {
        domainsTable.setOffset(0);
        hostsTable.setOffset(0);
        portsTable.setOffset(0);
        servicesTable.setOffset(0);
    }, [globalFilter.applied]);
    React.useEffect(() => domainsTable.setOffset(0), [domainFilter.applied]);
    React.useEffect(() => hostsTable.setOffset(0), [hostFilter.applied]);
    React.useEffect(() => portsTable.setOffset(0), [portFilter.applied]);
    React.useEffect(() => servicesTable.setOffset(0), [serviceFilter.applied]);

    const tableElement = (() => {
        switch (dataTab) {
            case "domains":
                return (
                    <StatelessWorkspaceTable
                        key={"domain-table"}
                        {...domainsTable}
                        columnsTemplate={"0.3fr 1fr 1fr 1fr 0.2fr 0.2fr"}
                        filter={domainFilter}
                    >
                        <div className={"workspace-table-header"}>
                            <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                <RelationLeftIcon />
                            </span>
                            <span>Domain</span>
                            <span>Tags</span>
                            <span>Comment</span>
                            <span>Severity</span>
                            <span>Certainty</span>
                        </div>
                        {/*TODO filter items that are not in findings already*/}
                        {domains.map((domain) => (
                            <div className="workspace-table-row">
                                <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                    <RelationLeftIcon />
                                </span>
                                <span>{domain.domain}</span>
                                <TagList tags={domain.tags} />
                                <span>{domain.comment}</span>
                                <span className="workspace-data-certainty-icon">
                                    <SeverityIcon />
                                </span>
                                {domain.certainty === "Unverified"
                                    ? CertaintyIcon({ certaintyType: "Unverified" })
                                    : CertaintyIcon({ certaintyType: "Verified" })}
                            </div>
                        ))}
                    </StatelessWorkspaceTable>
                );
            case "hosts":
                return (
                    <StatelessWorkspaceTable
                        key={"host-table"}
                        {...hostsTable}
                        columnsTemplate={"0.3fr 35ch 1fr 1fr 0.2fr 0.2fr"}
                        filter={hostFilter}
                    >
                        <div className={"workspace-table-header"}>
                            <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                <RelationLeftIcon />
                            </span>
                            <span>IP</span>
                            <span>Tags</span>
                            <span>Comment</span>
                            <span>Severity</span>
                            <span>Certainty</span>
                        </div>
                        {/*TODO filter items that are not in findings already*/}
                        {hosts.map((host) => (
                            <div className="workspace-table-row deleted">
                                <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                    <RelationLeftIcon />
                                </span>
                                <span>{host.ipAddr}</span>
                                <TagList tags={host.tags} />
                                <span>{host.comment}</span>
                                <span className="workspace-data-certainty-icon">
                                    <SeverityIcon />
                                </span>
                                {host.certainty === "Verified"
                                    ? CertaintyIcon({ certaintyType: "Verified" })
                                    : host.certainty === "Historical"
                                      ? CertaintyIcon({ certaintyType: "Historical" })
                                      : CertaintyIcon({ certaintyType: "SupposedTo" })}
                            </div>
                        ))}
                    </StatelessWorkspaceTable>
                );
            case "ports":
                return (
                    <StatelessWorkspaceTable
                        key={"port-table"}
                        {...portsTable}
                        columnsTemplate={"0.3fr 5ch 8ch 35ch 1fr 1fr 0.2fr 0.2fr"}
                        filter={portFilter}
                    >
                        <div className={"workspace-table-header"}>
                            <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                <RelationLeftIcon />
                            </span>
                            <span>Port</span>
                            <span>Protocol</span>
                            <span>IP</span>
                            <span>Tags</span>
                            <span>Comment</span>
                            <span>Severity</span>
                            <span>Certainty</span>
                        </div>
                        {/*TODO filter items that are not in findings already*/}
                        {ports.map((port) => (
                            <div className="workspace-table-row">
                                <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                    <RelationLeftIcon />
                                </span>
                                <span>{port.port}</span>
                                <span>{port.protocol.toUpperCase()}</span>
                                <span>{port.host.ipAddr}</span>
                                <TagList tags={port.tags} />
                                <span>{port.comment}</span>
                                <span className="workspace-data-certainty-icon">
                                    <SeverityIcon />
                                </span>
                                {port.certainty === "Verified"
                                    ? CertaintyIcon({ certaintyType: "Verified" })
                                    : port.certainty === "Historical"
                                      ? CertaintyIcon({ certaintyType: "Historical" })
                                      : CertaintyIcon({ certaintyType: "SupposedTo" })}
                            </div>
                        ))}
                    </StatelessWorkspaceTable>
                );
            case "services":
                return (
                    <StatelessWorkspaceTable
                        key={"service-table"}
                        {...servicesTable}
                        columnsTemplate={"0.3fr 0.5fr 25ch 5ch 10ch 1fr 1fr 0.2fr 0.2fr"}
                        filter={serviceFilter}
                    >
                        <div className={"workspace-table-header"}>
                            <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                <RelationLeftIcon />
                            </span>
                            <span>Service</span>
                            <span>IP</span>
                            <span>Port</span>
                            <span>Protocol</span>
                            <span>Tags</span>
                            <span>Comment</span>
                            <span>Severity</span>
                            <span>Certainty</span>
                        </div>
                        {/*TODO filter items that are not in findings already*/}
                        {services.map((service) => (
                            <div className="workspace-table-row">
                                <span className="workspace-data-certainty-icon workspace-finding-selection-arrow">
                                    <RelationLeftIcon />
                                </span>
                                <span>{service.name}</span>
                                <span>{service.host.ipAddr}</span>
                                <span>{service.port?.port}</span>
                                <span>{service.port?.protocol}</span>
                                <TagList tags={service.tags} />
                                <span>{service.comment}</span>
                                <span className="workspace-data-certainty-icon">
                                    <SeverityIcon />
                                </span>
                                {service.certainty === "Historical"
                                    ? CertaintyIcon({ certaintyType: "Historical" })
                                    : service.certainty === "SupposedTo"
                                      ? CertaintyIcon({ certaintyType: "SupposedTo" })
                                      : service.certainty === "UnknownService"
                                        ? CertaintyIcon({ certaintyType: "UnknownService" })
                                        : service.certainty === "MaybeVerified"
                                          ? CertaintyIcon({ certaintyType: "MaybeVerified" })
                                          : CertaintyIcon({ certaintyType: "DefinitelyVerified" })}
                            </div>
                        ))}
                    </StatelessWorkspaceTable>
                );
            default:
                return "Unimplemented";
        }
    })();

    // @ts-ignore
    const style: CSSProperties = { "--columns": "0.1fr 1fr 1fr" };

    const body = () => {
        switch (tab) {
            case "table":
                /*TODO use workspace-table, implement filtering */
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
                                <div
                                    className="workspace-table-row"
                                    onClick={() => {
                                        setSelected(true);
                                    }}
                                >
                                    <span className="workspace-data-certainty-icon">
                                        <SeverityIcon />
                                    </span>
                                    <span>sadsada</span> <span>sadsadas</span>
                                </div>

                                <div className="workspace-table-row">
                                    <span className="workspace-data-certainty-icon">
                                        <SeverityIcon />
                                    </span>
                                    <span>sadsada</span> <span>sadsadas</span>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "graph":
                return (
                    <div className="workspace-findings-graph-container">
                        <Tree />
                    </div>
                );
            default:
                return "Unimplemented";
        }
    };

    const findingBody = () => {
        switch (findingTab) {
            case "details":
                return <></>;
            case "relation":
                return (
                    <div className="workspace-findings-selection-container">
                        <div className="workspace-findings-selection-info pane">
                            <ArrowLeftIcon
                                title={"Back"}
                                onClick={() => {
                                    setSelected(false);
                                }}
                            />
                        </div>
                        <div className="workspace-data-table">
                            <div className="tabs-selector-container">
                                {Object.entries(DATA_TAB).map(([key, displayName]) => (
                                    <div
                                        className={`tabs ${dataTab !== key ? "" : " selected-tab"}`}
                                        onClick={() => setDataTab(key as keyof typeof DATA_TAB)}
                                    >
                                        <h3 className={"heading"}>{displayName}</h3>
                                    </div>
                                ))}
                            </div>
                            {tableElement}
                        </div>
                    </div>
                );
            default:
                return "Unimplemented";
        }
    };

    return (
        <>
            {selected ? (
                findingBody()
            ) : (
                <div className="workspace-findings-layout">
                    <div className="tabs-selector-container">
                        {Object.entries(TABS).map(([key, name]) => (
                            <div
                                className={`icon-tabs ${tab !== key ? "" : "selected-icon-tab"}`}
                                onClick={() => setTab(key as keyof typeof TABS)}
                            >
                                {name === "Table" ? <TableIcon /> : <GraphIcon />}
                            </div>
                        ))}
                    </div>
                    <div className="pane workspace-findings-body">{body()}</div>
                </div>
            )}
        </>
    );
}

type TreeNode = {
    name: string;
    type: "Host" | "Port" | "Service";
    severity?: number;
    children?: Array<TreeNode>;
    hidden?: boolean;
};

const treeData: TreeNode = {
    name: "Top Levelffffffffffffffffffffffffffffffffffffffffffffffffffff",
    type: "Host",
    severity: 5,
    children: [
        {
            name: "Level 2: A",
            type: "Port",
            severity: 4,
            children: [
                { name: "Son of A", type: "Service", severity: 2 },
                { name: "Daughter of A", type: "Service", severity: 3 },
            ],
        },
        { name: "Level 2: B", type: "Port", severity: 1 },
    ],
};

//TODO height und width dynamisch bestimmen
const width = 1000;
const height = 1000;

function Tree() {
    const nodeDimension = { width: 130, height: 150 };
    const gap = 16;

    //use dummy to trigger rerender
    const [_, setDummy] = React.useState(0);
    const [treemap] = React.useState(() =>
        d3
            .tree<TreeNode>()
            .size([height, width])
            .nodeSize([nodeDimension.height + gap, nodeDimension.width]),
    );
    const [root] = React.useState(() => d3.hierarchy(treeData, (d) => d.children));
    const tree = treemap(root);

    const nodes = tree.descendants();
    const links = tree.descendants().slice(1);

    let [severityColor] = React.useState("");
    let [severityBackground] = React.useState("");
    let [pathColor] = React.useState("");
    let [pathFilter] = React.useState("");

    // Normalize for fixed-depth. -> aka the collapsed tree doesn't take the whole width
    nodes.forEach((d: any) => {
        d.y = d.depth * (nodeDimension.width + 70);
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s: any, d: any) {
        let sx = s.x + nodeDimension.height / 2;
        let dx = d.x + nodeDimension.height / 2;
        let dy = d.y + nodeDimension.width;
        return `M ${s.y} ${sx}
            C ${(s.y + dy) / 2} ${sx},
              ${(s.y + dy) / 2} ${dx},
              ${dy} ${dx}`;
    }

    // Toggle children on click.
    /*function click(d: any) {
        if (d.children) {
            d._children = d.children;
            d.children = undefined;
        } else {
            d.children = d._children;
            d._children = undefined;
        }
        setDummy((n) => n + 1);
    }*/

    function toggle(d: TreeNode, hideChild?: boolean) {
        if (d.children && d.children[0]) {
            if (hideChild === undefined) hideChild = !d.children[0].hidden;

            for (const child of d.children) {
                child.hidden = hideChild;
                if (hideChild) toggle(child, hideChild);
            }
        }
        setDummy((n) => n + 1);
    }

    function setNodeColor(node: TreeNode) {
        switch (node.severity) {
            case 1:
                severityColor = "#00ff8840";
                severityBackground = "#00ff8810";
                break;
            case 2:
                severityColor = "#ffcc0040";
                severityBackground = "#ffcc0010";
                break;
            case 3:
                severityColor = "#ff6a0040";
                severityBackground = "#ff6a0010";
                break;
            case 4:
                severityColor = "#ff000040";
                severityBackground = "#ff000010";
                break;
            case 5:
                severityColor = "#9900ff40";
                severityBackground = "#9900ff10";
                break;
            default:
                severityColor = "#00ccff40";
                severityBackground = "#00ccff10";
                break;
        }
    }

    function setPathColor(node: TreeNode) {
        switch (node.severity) {
            case 1:
                pathColor = "#C0FDCCB2";
                pathFilter = "#0f8";
                break;
            case 2:
                pathColor = "#FFF092B2";
                pathFilter = "#ffcc00";
                break;
            case 3:
                pathColor = "#FFCC92B2";
                pathFilter = "#ff6a00";
                break;
            case 4:
                pathColor = "#FF9292B2";
                pathFilter = "#ff0000";
                break;
            case 5:
                pathColor = "#D792FFB2";
                pathFilter = "#9900ff";
                break;
            default:
                pathColor = "#00ccff70";
                pathFilter = "#0cf";
                break;
        }
    }

    let minX = Math.min(...nodes.map((node) => node.x));
    let maxX = Math.max(...nodes.map((node) => node.x + nodeDimension.height));

    let minY = Math.min(...nodes.map((node) => node.y));
    let maxY = Math.max(...nodes.map((node) => node.y + nodeDimension.width));

    let offsetY = -minX;
    let actualHeight = maxX - minX;
    let actualWidth = maxY - minY;

    return (
        <div className="tree">
            <svg className="tree-link-animation" width={actualWidth} height={actualHeight}>
                <g transform={`translate(0, ${offsetY})`}>
                    {links.map((link, i) => {
                        setPathColor(link.data);
                        return (
                            <>
                                {!link.data.hidden && link.parent && (
                                    <path
                                        style={
                                            {
                                                //  stroke: pathColor,
                                                //filter: `brightness(0) invert() drop-shadow(0 0 2px ${pathFilter}`,
                                            }
                                        }
                                        key={i}
                                        className=" tree-link"
                                        d={diagonal(link, link.parent)}
                                    ></path>
                                )}
                            </>
                        );
                    })}
                    {nodes.map((node, i) => {
                        setNodeColor(node.data);
                        return (
                            <>
                                {!node.data.hidden && (
                                    <g
                                        key={i}
                                        transform={`translate(${node.y}, ${node.x})`}
                                        onClick={() => {
                                            toggle(node.data);
                                        }}
                                    >
                                        <foreignObject
                                            x={0}
                                            y={0}
                                            width={nodeDimension.width}
                                            height={nodeDimension.height}
                                        >
                                            <div
                                                className="tree-node tree-wordwrap"
                                                style={
                                                    {
                                                        // border: `2px solid ${severityColor}`,
                                                        // backgroundColor: severityBackground,
                                                    }
                                                }
                                            >
                                                <div className="tree-node-content">
                                                    <div
                                                        className="tree-node-heading"
                                                        // style={{ backgroundColor: severityColor }}
                                                    >
                                                        <span>{node.data.name}</span>
                                                    </div>
                                                    <span className="tree-node-type">{node.data.type}</span>
                                                    <div className="tree-node-body">
                                                        <span>Tags:</span>
                                                        {node.data.type === "Service" ? (
                                                            <span>
                                                                Finding: info dfhbisdbcfdgdgd dg df gdgdfg gf gdggvb hs
                                                                sdjinbsvcjdsj
                                                            </span>
                                                        ) : (
                                                            <span></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </foreignObject>
                                        {node.data.children && node.data.children[0].hidden ? (
                                            <foreignObject
                                                width={30}
                                                height={30}
                                                style={{ cursor: "pointer" }}
                                                x={nodeDimension.width}
                                                y={nodeDimension.height / 2 - 15}
                                            >
                                                <ArrowRightIcon />
                                            </foreignObject>
                                        ) : undefined}
                                    </g>
                                )}
                            </>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
