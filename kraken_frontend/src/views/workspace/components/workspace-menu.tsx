import React from "react";
import SearchIcon from "../../../svg/search";
import AttackIcon from "../../../svg/attack";
import DataIcon from "../../../svg/data";
import SettingsIcon from "../../../svg/settings";
import { ROUTES } from "../../../routes";
import "../../../styling/workspace-menu.css";
import HostIcon from "../../../svg/host";
import { WorkspaceView } from "../workspace";

type WorkspaceMenuProps = {
    uuid: string;
    active: WorkspaceView;
};
type WorkspaceMenuState = {};

export default class WorkspaceMenu extends React.Component<WorkspaceMenuProps, WorkspaceMenuState> {
    render() {
        return (
            <div className={"workspace-menu pane"}>
                <div
                    className={this.props.active === "search" ? "workspace-menu-item active" : "workspace-menu-item"}
                    {...ROUTES.WORKSPACE_SEARCH.clickHandler({ uuid: this.props.uuid })}
                >
                    <SearchIcon />
                    <div className={"workspace-menu-hint"}>Search</div>
                </div>
                <div
                    className={this.props.active === "attacks" ? "workspace-menu-item active" : "workspace-menu-item"}
                    {...ROUTES.WORKSPACE_ATTACKS.clickHandler({ uuid: this.props.uuid })}
                >
                    <AttackIcon />
                    <div className={"workspace-menu-hint"}>Attacks</div>
                </div>
                <div
                    className={this.props.active === "data" ? "workspace-menu-item active" : "workspace-menu-item"}
                    {...ROUTES.WORKSPACE_DATA.clickHandler({ uuid: this.props.uuid })}
                >
                    <DataIcon />
                    <div className={"workspace-menu-hint"}>Data</div>
                </div>
                <div
                    className={this.props.active === "hosts" ? "workspace-menu-item active" : "workspace-menu-item"}
                    {...ROUTES.WORKSPACE_HOSTS.clickHandler({ uuid: this.props.uuid })}
                >
                    <HostIcon />
                    <div className={"workspace-menu-hint"}>Hosts</div>
                </div>
                <div
                    className={this.props.active === "settings" ? "workspace-menu-item active" : "workspace-menu-item"}
                    {...ROUTES.WORKSPACE_SETTINGS.clickHandler({ uuid: this.props.uuid })}
                >
                    <SettingsIcon />
                    <div className={"workspace-menu-hint"}>Workspace Settings</div>
                </div>
            </div>
        );
    }
}
