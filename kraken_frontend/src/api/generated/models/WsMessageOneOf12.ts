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
import type { SimpleDomain } from './SimpleDomain';
import {
    SimpleDomainFromJSON,
    SimpleDomainFromJSONTyped,
    SimpleDomainToJSON,
} from './SimpleDomain';

/**
 * A new domain was found
 * @export
 * @interface WsMessageOneOf12
 */
export interface WsMessageOneOf12 {
    /**
     * The workspace this domain is related to
     * @type {string}
     * @memberof WsMessageOneOf12
     */
    workspace: string;
    /**
     * 
     * @type {SimpleDomain}
     * @memberof WsMessageOneOf12
     */
    domain: SimpleDomain;
    /**
     * 
     * @type {string}
     * @memberof WsMessageOneOf12
     */
    type: WsMessageOneOf12TypeEnum;
}


/**
 * @export
 */
export const WsMessageOneOf12TypeEnum = {
    NewDomain: 'NewDomain'
} as const;
export type WsMessageOneOf12TypeEnum = typeof WsMessageOneOf12TypeEnum[keyof typeof WsMessageOneOf12TypeEnum];


/**
 * Check if a given object implements the WsMessageOneOf12 interface.
 */
export function instanceOfWsMessageOneOf12(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "workspace" in value;
    isInstance = isInstance && "domain" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function WsMessageOneOf12FromJSON(json: any): WsMessageOneOf12 {
    return WsMessageOneOf12FromJSONTyped(json, false);
}

export function WsMessageOneOf12FromJSONTyped(json: any, ignoreDiscriminator: boolean): WsMessageOneOf12 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'workspace': json['workspace'],
        'domain': SimpleDomainFromJSON(json['domain']),
        'type': json['type'],
    };
}

export function WsMessageOneOf12ToJSON(value?: WsMessageOneOf12 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'workspace': value.workspace,
        'domain': SimpleDomainToJSON(value.domain),
        'type': value.type,
    };
}

