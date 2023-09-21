import React from "react";
import "../../styling/workspace-host.css";
import { FullWorkspace, SimpleHost } from "../../api/generated";
import FreeBSDIcon from "../../svg/freebsd";
import { Api, UUID } from "../../api/api";
import { toast } from "react-toastify";
import { getOsIcon } from "../../utils/helper";
import { ROUTES } from "../../routes";

type WorkspaceProps = {
    workspace: FullWorkspace;
    host_uuid: UUID;
};
type WorkspaceState = {
    selectedTab: "domains" | "ips" | "ports" | "services" | "other";
    host: SimpleHost | null;
    hostList: Array<SimpleHost>;
};

export default class WorkspaceHost extends React.Component<WorkspaceProps, WorkspaceState> {
    constructor(props: WorkspaceProps) {
        super(props);

        this.state = { selectedTab: "domains", host: null, hostList: [] };
    }

    async getHostList() {
        (await Api.workspaces.hosts.all(this.props.workspace.uuid)).match(
            (hosts) => {
                this.setState({ hostList: hosts.hosts.filter((x) => x.uuid !== this.props.host_uuid) });
            },
            (err) => toast.error(err.message)
        );
    }

    async getHost() {
        (await Api.workspaces.hosts.get(this.props.workspace.uuid, this.props.host_uuid)).match(
            (host) => this.setState({ host }),
            (err) => toast.error(err.message)
        );
    }

    componentDidUpdate(prevProps: Readonly<WorkspaceProps>, prevState: Readonly<WorkspaceState>, snapshot?: any) {
        if (prevProps.host_uuid !== this.props.host_uuid) {
            Promise.all([this.getHost(), this.getHostList()]).then();
        }
    }

    componentDidMount() {
        Promise.all([this.getHost(), this.getHostList()]).then();
    }

    render() {
        return (
            <div className={"workspace-host-container"}>
                <div className={"workspace-host-hosts-list"}>
                    {this.state.hostList.map((x) => {
                        return (
                            <button
                                key={x.uuid}
                                className={"pane workspace-host-hosts-item"}
                                onClick={() => {
                                    ROUTES.WORKSPACE_SINGLE_HOST.visit({
                                        w_uuid: this.props.workspace.uuid,
                                        h_uuid: x.uuid,
                                    });
                                }}
                            >
                                {getOsIcon(x.osType)}
                                <div className={"workspace-host-hosts-info"}>
                                    <h2 className={"sub-heading"}>{x.ipAddr}</h2>
                                    <span>{x.comment}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className={"pane workspace-host-host-container"}>
                    {this.state.host !== null ? (
                        <>
                            {getOsIcon(this.state.host.osType)}
                            <div className={"workspace-host-details"}>
                                <h2 className={"heading"}>Host {this.state.host.ipAddr}</h2>
                                <span>OS: {this.state.host.osType}</span>
                                <span>Comment: {this.state.host.comment}</span>
                            </div>
                        </>
                    ) : (
                        <div>Loading ..</div>
                    )}
                </div>
                <div className={"workspace-host-section-selector"}>
                    <div
                        className={this.state.selectedTab === "domains" ? "pane workspace-host-selected-tab" : "pane"}
                        onClick={() => {
                            this.setState({ selectedTab: "domains" });
                        }}
                    >
                        <h3 className={"heading"}>Domains</h3>
                    </div>
                    <div
                        className={this.state.selectedTab === "ports" ? "pane workspace-host-selected-tab" : "pane"}
                        onClick={() => {
                            this.setState({ selectedTab: "ports" });
                        }}
                    >
                        <h3 className={"heading"}>Ports</h3>
                    </div>
                    <div
                        className={this.state.selectedTab === "services" ? "pane workspace-host-selected-tab" : "pane"}
                        onClick={() => {
                            this.setState({ selectedTab: "services" });
                        }}
                    >
                        <h3 className={"heading"}>Services</h3>
                    </div>
                    <div
                        className={this.state.selectedTab === "other" ? "pane workspace-host-selected-tab" : "pane"}
                        onClick={() => {
                            this.setState({ selectedTab: "other" });
                        }}
                    >
                        <h3 className={"heading"}>Other</h3>
                    </div>
                </div>
                <div className={"workspace-host-content-table"}>
                    <div className={"pane workspace-host-content-row"}>
                        <span>Domain</span>
                        <span>DNS</span>
                        <span>Tags</span>
                        <span>Attacks</span>
                        <span>Comment</span>
                    </div>
                    <div className={"pane workspace-host-content-row"}>
                        <span>trufflepig-forensics.com</span>
                        <div className={"bubble-list"}>
                            <div className={"bubble"}>A</div>
                            <div className={"bubble"}>AAAA</div>
                            <div className={"bubble"}>MX</div>
                            <div className={"bubble"}>TXT</div>
                        </div>
                        <div className={"bubble-list"}>
                            <div className={"bubble red"}>Critical</div>
                        </div>
                        <div className={"bubble-list"}>
                            <div className={"bubble"}>CT 2</div>
                            <div className={"bubble"}>BS 17</div>
                        </div>
                        <span>Netscaler</span>
                    </div>
                </div>
                <div className={"workspace-host-content-details pane"}>
                    <h2 className={"heading"}>Details</h2>
                </div>
            </div>
        );
    }
}