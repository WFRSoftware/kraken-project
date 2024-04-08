/* tslint:disable */
/* eslint-disable */
/**
 * kraken
 * The core component of kraken-project
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: git@omikron.dev
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { SimpleUser } from './SimpleUser';
import {
    SimpleUserFromJSON,
    SimpleUserFromJSONTyped,
    SimpleUserToJSON,
} from './SimpleUser';

/**
 * A manually inserted http service
 * @export
 * @interface ManualInsertOneOf4
 */
export interface ManualInsertOneOf4 {
    /**
     * The service's name
     * @type {string}
     * @memberof ManualInsertOneOf4
     */
    name: string;
    /**
     * The service's domain
     * @type {string}
     * @memberof ManualInsertOneOf4
     */
    domain?: string | null;
    /**
     * The service's ip address
     * @type {string}
     * @memberof ManualInsertOneOf4
     */
    ipAddr: string;
    /**
     * The service's port
     * @type {number}
     * @memberof ManualInsertOneOf4
     */
    port: number;
    /**
     * The base path the service is routed on
     * @type {string}
     * @memberof ManualInsertOneOf4
     */
    basePath: string;
    /**
     * Is this a https service?
     * @type {boolean}
     * @memberof ManualInsertOneOf4
     */
    tls: boolean;
    /**
     * Does this service require sni?
     * @type {boolean}
     * @memberof ManualInsertOneOf4
     */
    sniRequire: boolean;
    /**
     * 
     * @type {SimpleUser}
     * @memberof ManualInsertOneOf4
     */
    user: SimpleUser;
    /**
     * The workspace the http service was inserted to
     * @type {string}
     * @memberof ManualInsertOneOf4
     */
    workspace: string;
    /**
     * The point in time, the http service was inserted
     * @type {Date}
     * @memberof ManualInsertOneOf4
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof ManualInsertOneOf4
     */
    type: ManualInsertOneOf4TypeEnum;
}


/**
 * @export
 */
export const ManualInsertOneOf4TypeEnum = {
    HttpService: 'HttpService'
} as const;
export type ManualInsertOneOf4TypeEnum = typeof ManualInsertOneOf4TypeEnum[keyof typeof ManualInsertOneOf4TypeEnum];


/**
 * Check if a given object implements the ManualInsertOneOf4 interface.
 */
export function instanceOfManualInsertOneOf4(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "ipAddr" in value;
    isInstance = isInstance && "port" in value;
    isInstance = isInstance && "basePath" in value;
    isInstance = isInstance && "tls" in value;
    isInstance = isInstance && "sniRequire" in value;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "workspace" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function ManualInsertOneOf4FromJSON(json: any): ManualInsertOneOf4 {
    return ManualInsertOneOf4FromJSONTyped(json, false);
}

export function ManualInsertOneOf4FromJSONTyped(json: any, ignoreDiscriminator: boolean): ManualInsertOneOf4 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'domain': !exists(json, 'domain') ? undefined : json['domain'],
        'ipAddr': json['ip_addr'],
        'port': json['port'],
        'basePath': json['base_path'],
        'tls': json['tls'],
        'sniRequire': json['sni_require'],
        'user': SimpleUserFromJSON(json['user']),
        'workspace': json['workspace'],
        'createdAt': (new Date(json['created_at'])),
        'type': json['type'],
    };
}

export function ManualInsertOneOf4ToJSON(value?: ManualInsertOneOf4 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'domain': value.domain,
        'ip_addr': value.ipAddr,
        'port': value.port,
        'base_path': value.basePath,
        'tls': value.tls,
        'sni_require': value.sniRequire,
        'user': SimpleUserToJSON(value.user),
        'workspace': value.workspace,
        'created_at': (value.createdAt.toISOString()),
        'type': value.type,
    };
}

