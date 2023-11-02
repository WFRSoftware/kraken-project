import React, { CSSProperties } from "react";
import { handleApiError } from "../../../utils/helper";
import Select from "react-select";
import { selectStyles } from "../../../components/select-menu";
import { Result } from "../../../utils/result";
import { ApiError } from "../../../api/error";
import Input from "../../../components/input";
import "../../../styling/workspace-table.css";
import ArrowLeftIcon from "../../../svg/arrow-left";
import ArrowRightIcon from "../../../svg/arrow-right";
import ArrowFirstIcon from "../../../svg/arrow-first";
import ArrowLastIcon from "../../../svg/arrow-last";

export type WorkspaceDataTableProps<T> = {
    /** Method used to query a page */
    query: (limit: number, offset: number) => Promise<Result<GenericPage<T>, ApiError>>;

    /**
     * List of dependencies captured by `query`.
     *
     * I.e. add every variable the `query` function captures from its environment.
     * Read about {@link React.useEffect}'s second argument for more details.
     */
    queryDeps?: React.DependencyList;

    /** The table's header row and a function for rendering the body's rows */
    children: [React.ReactNode, (item: T) => React.ReactNode];

    /** The `grid-template-rows` to use */
    columnsTemplate: string;

    /** The table's "type" (controls the table's body's css class) */
    type?: "Host" | "Data";
};
export type GenericPage<T> = {
    items: Array<T>;
    limit: number;
    offset: number;
    total: number;
};

/**
 * Stateful table handling pagination
 *
 * Consider {@link StatelessWorkspaceTable} and {@link useTable} when you need control of the table's state.
 */
export default function WorkspaceTable<T extends { uuid: string }>(props: WorkspaceDataTableProps<T>) {
    const {
        query,
        queryDeps,
        children: [header, renderItem],
        columnsTemplate,
        type,
    } = props;

    const { items, ...table } = useTable(query, queryDeps);

    return StatelessWorkspaceTable({
        ...table,
        children: [header, items.map(renderItem)],
        columnsTemplate,
        type,
    });
}

export type StatelessWorkspaceTableProps = {
    /** The total number of items across all pages */
    total: number;

    /** The number of items per page */
    limit: number;
    setLimit: (limit: number) => void;

    /** The number of items in the pages before the current one */
    offset: number;
    setOffset: (offset: number) => void;

    /** The table's header row and body rows*/
    children: [React.ReactNode, Array<React.ReactNode>];

    /** The `grid-template-rows` to use */
    columnsTemplate: string;

    /** The table's "type" (controls the table's body's css class) */
    type?: "Host" | "Data";
};
export function StatelessWorkspaceTable(props: StatelessWorkspaceTableProps) {
    const {
        total,
        limit,
        setLimit,
        offset,
        setOffset: setRawOffset,
        children: [header, body],
        columnsTemplate,
        type,
    } = props;

    const lastOffset = Math.floor(total / limit) * limit;
    function setOffset(offset: number) {
        if (offset < 0) {
            setRawOffset(0);
        } else if (offset > lastOffset) {
            setRawOffset(lastOffset);
        } else {
            setRawOffset(offset);
        }
    }

    // @ts-ignore
    const style: CSSProperties = { "--columns": columnsTemplate };
    return (
        <div className={"workspace-table pane"} style={style}>
            <Input
                className={"input workspace-table-filter"}
                placeholder={"Filter..."}
                value={""}
                onChange={console.log}
            />
            {header}
            <div className={type === "Host" ? "workspace-table-body-host" : "workspace-table-body"}>{body}</div>
            <div className={"workspace-table-controls"}>
                <div className={"workspace-table-controls-button-container"}>
                    <button className={"workspace-table-button"} disabled={offset === 0} onClick={() => setOffset(0)}>
                        <ArrowFirstIcon />
                    </button>
                    <button
                        className={"workspace-table-button"}
                        disabled={offset === 0}
                        onClick={() => setOffset(offset - limit)}
                    >
                        <ArrowLeftIcon />
                    </button>
                    <button
                        className={"workspace-table-button"}
                        disabled={offset === lastOffset}
                        onClick={() => setOffset(offset + limit)}
                    >
                        <ArrowRightIcon />
                    </button>
                    <button
                        className={"workspace-table-button"}
                        disabled={offset === lastOffset}
                        onClick={() => setOffset(lastOffset)}
                    >
                        <ArrowLastIcon />
                    </button>
                </div>
                <div className={"workspace-table-controls-page-container"}>
                    <span>{`${offset + 1} - ${Math.min(total, offset + limit + 1)} of ${total}`}</span>
                    <Select<{ label: string; value: number }, false>
                        menuPlacement={"auto"}
                        value={{ value: limit, label: String(limit) }}
                        options={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => ({ value: n, label: String(n) }))}
                        onChange={(value) => {
                            setLimit(value?.value || limit);
                        }}
                        styles={selectStyles("default")}
                    />
                </div>
            </div>
        </div>
    );
}

/** Hook which provides the data required for {@link StatelessWorkspaceTable} */
export function useTable<T extends { uuid: string }>(
    query: (limit: number, offset: number) => Promise<Result<GenericPage<T>, ApiError>>,
    queryDeps?: React.DependencyList,
) {
    const [limit, setLimit] = React.useState(20);
    const [offset, setOffset] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [items, setItems] = React.useState<Array<T>>([]);

    React.useEffect(() => {
        query(limit, offset).then(
            handleApiError(({ items, total }) => {
                setItems(items);
                setTotal(total);
            }),
        );
    }, [limit, offset, ...(queryDeps || [])]);

    return {
        /** The current number of items per page*/
        limit,
        /** Change the number of items per page */
        setLimit,

        /** The index of the first item of the current page */
        offset,
        /** Set the index of the first item of the current page i.e. changing the shown page */
        setOffset,

        /** The total number of items found by the query */
        total,

        /** The current page's items */
        items,

        /**
         * Updates the item identified by `uuid` without querying the backend again
         *
         * If the item is not shown on the current page i.e. not in local memory, this function will do nothing
         *
         * @param uuid is the uuid identifying the item to update
         * @param update is an arbitrary subset of `T`'s fields to overwrite the original values with
         * @returns `true` if the item is on the current page and therefore has been updated
         */
        updateItem(uuid: string, update: Partial<T>) {
            const index = items.findIndex(({ uuid: u }) => u === uuid);
            if (index > -1) {
                items[index] = { ...items[index], ...update };
                setItems([...items]);
                return true;
            } else {
                return false;
            }
        },
    };
}
