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
import WorkspaceFindingTable from "./workspace-finding-table";

type WorkspaceEditFindingProps = {
    /** The finding's uuid */
    uuid: string;
};

export default function WorkspaceEditFinding(props: WorkspaceEditFindingProps) {
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);

    return (
        <div className="workspace-findings-selection-container">
            <div className="workspace-findings-selection-info pane">
                <ArrowLeftIcon title={"Back"} {...ROUTES.WORKSPACE_FINDINGS.clickHandler({ uuid: workspace })} />
            </div>
            <WorkspaceFindingTable />
        </div>
    );
}
