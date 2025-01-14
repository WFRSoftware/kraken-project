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
import type { SimpleService } from './SimpleService';
import {
    SimpleServiceFromJSON,
    SimpleServiceFromJSONTyped,
    SimpleServiceToJSON,
} from './SimpleService';

/**
 * A new service was found
 * @export
 * @interface WsMessageOneOf15
 */
export interface WsMessageOneOf15 {
    /**
     * The workspace this service is related to
     * @type {string}
     * @memberof WsMessageOneOf15
     */
    workspace: string;
    /**
     * 
     * @type {SimpleService}
     * @memberof WsMessageOneOf15
     */
    service: SimpleService;
    /**
     * 
     * @type {string}
     * @memberof WsMessageOneOf15
     */
    type: WsMessageOneOf15TypeEnum;
}


/**
 * @export
 */
export const WsMessageOneOf15TypeEnum = {
    NewService: 'NewService'
} as const;
export type WsMessageOneOf15TypeEnum = typeof WsMessageOneOf15TypeEnum[keyof typeof WsMessageOneOf15TypeEnum];


/**
 * Check if a given object implements the WsMessageOneOf15 interface.
 */
export function instanceOfWsMessageOneOf15(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "workspace" in value;
    isInstance = isInstance && "service" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function WsMessageOneOf15FromJSON(json: any): WsMessageOneOf15 {
    return WsMessageOneOf15FromJSONTyped(json, false);
}

export function WsMessageOneOf15FromJSONTyped(json: any, ignoreDiscriminator: boolean): WsMessageOneOf15 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'workspace': json['workspace'],
        'service': SimpleServiceFromJSON(json['service']),
        'type': json['type'],
    };
}

export function WsMessageOneOf15ToJSON(value?: WsMessageOneOf15 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'workspace': value.workspace,
        'service': SimpleServiceToJSON(value.service),
        'type': value.type,
    };
}

