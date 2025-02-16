import React from "react";
import StartAttack from "../components/start-attack";
import Select from "react-select";
import Input from "../../../components/input";
import "../../../styling/workspace-attacks-dehashed.css";
import { Api, UUID } from "../../../api/api";
import { toast } from "react-toastify";
import { Query } from "../../../api/generated";
import SelectMenu from "../../../components/select-menu";
import { WORKSPACE_CONTEXT } from "../workspace";
import { PrefilledAttackParams, TargetType } from "../workspace-attacks";
import { handleApiError } from "../../../utils/helper";

export type DehashedQueryType =
    | "email"
    | "domain"
    | "vin"
    | "username"
    | "password"
    | "hashed_password"
    | "address"
    | "phone"
    | "name"
    | "ip_address";

type SelectValue = {
    label: string;
    value: DehashedQueryType;
};

const DEHASHED_SEARCH_TYPES: Array<SelectValue> = [
    { label: "Domain", value: "domain" },
    { label: "Email", value: "email" },
    { label: "Name", value: "name" },
    { label: "Username", value: "username" },
    { label: "Password", value: "password" },
    { label: "Hashed password", value: "hashed_password" },
    { label: "Address", value: "address" },
    { label: "Phone", value: "phone" },
    { label: "IP Address", value: "ip_address" },
    { label: "Vin", value: "vin" },
];

type WorkspaceAttacksDehashedProps = { prefilled: PrefilledAttackParams; targetType: TargetType | null };
type WorkspaceAttacksDehashedState = {
    type: null | SelectValue;
    search: string;
};

export default class WorkspaceAttacksDehashed extends React.Component<
    WorkspaceAttacksDehashedProps,
    WorkspaceAttacksDehashedState
> {
    static contextType = WORKSPACE_CONTEXT;
    declare context: React.ContextType<typeof WORKSPACE_CONTEXT>;

    constructor(props: WorkspaceAttacksDehashedProps) {
        super(props);

        this.state = {
            search:
                (this.props.targetType === "domain" ? this.props.prefilled.domain : this.props.prefilled.ipAddr) || "",
            type: null,
        };
    }

    componentDidUpdate(prevProps: Readonly<WorkspaceAttacksDehashedProps>) {
        if (this.props.targetType === "domain") {
            if (this.props.prefilled.domain !== undefined && this.props.prefilled.domain !== prevProps.prefilled.domain)
                this.setState({ search: this.props.prefilled.domain });
        } else {
            if (this.props.prefilled.ipAddr !== undefined && this.props.prefilled.ipAddr !== prevProps.prefilled.ipAddr)
                this.setState({ search: this.props.prefilled.ipAddr });
        }
    }

    startAttack() {
        if (this.state.search === "" || this.state.type === null) {
            toast.error("Search and type necessary to start an attack");
            return;
        }

        let query;
        switch (this.state.type.value) {
            case "email":
                query = { email: { simple: this.state.search } };
                break;
            case "domain":
                query = { domain: { simple: this.state.search } };
                break;
            case "vin":
                query = { vin: { simple: this.state.search } };
                break;
            case "username":
                query = { username: { simple: this.state.search } };
                break;
            case "password":
                query = { password: { simple: this.state.search } };
                break;
            case "hashed_password":
                query = { hashedPassword: { simple: this.state.search } };
                break;
            case "address":
                query = { address: { simple: this.state.search } };
                break;
            case "phone":
                query = { phone: { simple: this.state.search } };
                break;
            case "name":
                query = { name: { simple: this.state.search } };
                break;
            case "ip_address":
                query = { ipAddress: { simple: this.state.search } };
                break;
            default:
                toast.error("Encountered unknown type");
                return;
        }

        Api.attacks
            .queryDehashed(this.context.workspace.uuid, query)
            .then(handleApiError((uuid) => toast.success("Attack started")));
    }

    render() {
        return (
            <form
                className={"workspace-attacks-dehashed-container"}
                onSubmit={(event) => {
                    event.preventDefault();
                    this.startAttack();
                }}
            >
                <div className={"workspace-attacks-dehashed"}>
                    <SelectMenu
                        required
                        options={DEHASHED_SEARCH_TYPES}
                        theme={"default"}
                        value={this.state.type}
                        onChange={(type) => {
                            this.setState({ type });
                        }}
                    />
                    <Input
                        required
                        autoFocus
                        placeholder={"dehashed query"}
                        value={this.state.search}
                        onChange={(search) => {
                            this.setState({ search });
                        }}
                    />
                </div>
                <StartAttack />
            </form>
        );
    }
}
