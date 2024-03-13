import ArrowLeftIcon from "../../../svg/arrow-left";
import React from "react";
import { StatelessWorkspaceTable, useTable } from "../components/workspace-table";
import RelationLeftIcon from "../../../svg/relation-left";
import TagList from "../components/tag-list";
import SeverityIcon from "../../../svg/severity";
import { CertaintyIcon } from "../workspace-data";
import { useFilter } from "../components/filter-input";
import { FullDomain, FullHost, FullPort, FullService } from "../../../api/generated";
import { Api } from "../../../api/api";
import { WORKSPACE_CONTEXT } from "../workspace";
import { ROUTES } from "../../../routes";

type WorkspaceEditFindingProps = {
    /** The finding's uuid */
    uuid: string;
};

const DATA_TAB = { domains: "Domains", hosts: "Hosts", ports: "Ports", services: "Services" };

export default function WorkspaceEditFinding(props: WorkspaceEditFindingProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);

    const [dataTab, setDataTab] = React.useState<keyof typeof DATA_TAB>("hosts");

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

    return (
        <div className="workspace-findings-selection-container">
            <div className="workspace-findings-selection-info pane">
                <ArrowLeftIcon title={"Back"} {...ROUTES.WORKSPACE_FINDINGS.clickHandler({ uuid: workspace })} />
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
}
