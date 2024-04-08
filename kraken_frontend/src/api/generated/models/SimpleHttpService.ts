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
/**
 * The simple representation of a http service
 * @export
 * @interface SimpleHttpService
 */
export interface SimpleHttpService {
    /**
     * The primary key of the http service
     * @type {string}
     * @memberof SimpleHttpService
     */
    uuid: string;
    /**
     * The http service's name
     * @type {string}
     * @memberof SimpleHttpService
     */
    name: string;
    /**
     * The http service's domain
     * @type {string}
     * @memberof SimpleHttpService
     */
    domain?: string | null;
    /**
     * The http service's ip address
     * @type {string}
     * @memberof SimpleHttpService
     */
    host: string;
    /**
     * The http service's port
     * @type {string}
     * @memberof SimpleHttpService
     */
    port: string;
    /**
     * The base path the http service is routed on
     * @type {string}
     * @memberof SimpleHttpService
     */
    basePath: string;
    /**
     * Is this a https service?
     * @type {boolean}
     * @memberof SimpleHttpService
     */
    tls: boolean;
    /**
     * Does this http service require sni?
     * @type {boolean}
     * @memberof SimpleHttpService
     */
    sniRequired: boolean;
    /**
     * A comment
     * @type {string}
     * @memberof SimpleHttpService
     */
    comment: string;
    /**
     * The workspace this http service is in
     * @type {string}
     * @memberof SimpleHttpService
     */
    workspace: string;
    /**
     * The point in time, the record was created
     * @type {Date}
     * @memberof SimpleHttpService
     */
    createdAt: Date;
}

/**
 * Check if a given object implements the SimpleHttpService interface.
 */
export function instanceOfSimpleHttpService(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "uuid" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "host" in value;
    isInstance = isInstance && "port" in value;
    isInstance = isInstance && "basePath" in value;
    isInstance = isInstance && "tls" in value;
    isInstance = isInstance && "sniRequired" in value;
    isInstance = isInstance && "comment" in value;
    isInstance = isInstance && "workspace" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function SimpleHttpServiceFromJSON(json: any): SimpleHttpService {
    return SimpleHttpServiceFromJSONTyped(json, false);
}

export function SimpleHttpServiceFromJSONTyped(json: any, ignoreDiscriminator: boolean): SimpleHttpService {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'uuid': json['uuid'],
        'name': json['name'],
        'domain': !exists(json, 'domain') ? undefined : json['domain'],
        'host': json['host'],
        'port': json['port'],
        'basePath': json['base_path'],
        'tls': json['tls'],
        'sniRequired': json['sni_required'],
        'comment': json['comment'],
        'workspace': json['workspace'],
        'createdAt': (new Date(json['created_at'])),
    };
}

export function SimpleHttpServiceToJSON(value?: SimpleHttpService | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'uuid': value.uuid,
        'name': value.name,
        'domain': value.domain,
        'host': value.host,
        'port': value.port,
        'base_path': value.basePath,
        'tls': value.tls,
        'sni_required': value.sniRequired,
        'comment': value.comment,
        'workspace': value.workspace,
        'created_at': (value.createdAt.toISOString()),
    };
}

