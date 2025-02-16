import { Api } from "../../../api/api";
import React, { useState } from "react";
import { FullAggregationSource, FullHost, FullService, TagType } from "../../../api/generated";
import { handleApiError } from "../../../utils/helper";
import Textarea from "../../../components/textarea";
import { toast } from "react-toastify";
import EditableTags from "../components/editable-tags";
import { WORKSPACE_CONTEXT } from "../workspace";
import WorkspaceDataDetailsResults from "./workspace-data-details-results";
import ArrowLeftIcon from "../../../svg/arrow-left";
import ArrowRightIcon from "../../../svg/arrow-right";

export type WorkspaceDataServiceDetailsProps = {
    service: string;
    updateService?: (uuid: string, update: Partial<FullService>) => void;
    tab: "general" | "results" | "relations";
};

export function WorkspaceDataServiceDetails(props: WorkspaceDataServiceDetailsProps) {
    const { service: uuid, updateService: signalUpdate, tab: tab } = props;
    const {
        workspace: { uuid: workspace },
    } = React.useContext(WORKSPACE_CONTEXT);
    const [attacks, setAttacks] = useState({} as FullAggregationSource);
    const [limit, setLimit] = useState(0);
    const [page, setPage] = useState(0);
    const [service, setService] = React.useState<FullService | null>(null);
    React.useEffect(() => {
        Api.workspaces.services.get(workspace, uuid).then(handleApiError(setService));
        Api.workspaces.services.sources(workspace, uuid).then(
            handleApiError((x) => {
                setAttacks(x);
                setLimit(x.attacks.length - 1);
            })
        );
    }, [workspace, uuid]);
    React.useEffect(() => {
        setPage(0);
    }, [uuid]);

    /** Send an update to the server and parent component */
    function update(uuid: string, update: Partial<FullService>, msg?: string) {
        const { tags, comment } = update;
        Api.workspaces.services
            .update(workspace, uuid, {
                comment,
                workspaceTags:
                    tags && tags.filter(({ tagType }) => tagType === TagType.Workspace).map(({ uuid }) => uuid),
                globalTags: tags && tags.filter(({ tagType }) => tagType === TagType.Global).map(({ uuid }) => uuid),
            })
            .then(
                handleApiError(() => {
                    if (msg !== undefined) toast.success(msg);
                    if (signalUpdate !== undefined) signalUpdate(uuid, update);
                })
            );
    }

    if (service === null) return null;
    return (
        <>
            {tab === "general" ? (
                <>
                    <div className={"workspace-data-details-pane"}>
                        <h3 className={"sub-heading"}>Service</h3>
                        {`${service.name} running on ${service.host.ipAddr}`}
                        {!service.port ? "" : ` (Port ${service.port.port})`}
                    </div>
                    <div className={"workspace-data-details-pane"}>
                        <h3 className={"sub-heading"}>Comment</h3>
                        <Textarea value={service.comment} onChange={(comment) => setService({ ...service, comment })} />
                        <button
                            className={"button"}
                            onClick={() =>
                                service && update(service.uuid, { comment: service.comment }, "Updated comment")
                            }
                        >
                            Update
                        </button>
                    </div>
                    <div className={"workspace-data-details-pane"}>
                        <h3 className={"sub-heading"}>Tags</h3>
                        <EditableTags
                            workspace={workspace}
                            tags={service.tags}
                            onChange={(tags) => {
                                setService((service) => service && { ...service, tags });
                                update(service.uuid, { tags });
                            }}
                        />
                    </div>
                </>
            ) : (
                <>
                    {tab === "results" ? (
                        <div className="workspace-data-details-flex">
                            <WorkspaceDataDetailsResults attack={attacks.attacks[page]} uuid={service.uuid} />
                            <div className="workspace-data-details-table-controls">
                                <div className="workspace-data-details-controls-container">
                                    <button
                                        className={"workspace-table-button"}
                                        disabled={page === 0}
                                        onClick={() => {
                                            setPage(page - 1);
                                        }}
                                    >
                                        <ArrowLeftIcon />
                                    </button>
                                    <div className="workspace-table-controls-page-container">
                                        <span>
                                            {page + 1} of {limit + 1}
                                        </span>
                                    </div>
                                    <button
                                        className={"workspace-table-button"}
                                        disabled={page === limit}
                                        onClick={() => {
                                            setPage(page + 1);
                                        }}
                                    >
                                        <ArrowRightIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div> service relations</div>
                    )}
                </>
            )}
        </>
    );
}
