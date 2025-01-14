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
import type { AggregationType } from './AggregationType';
import {
    AggregationTypeFromJSON,
    AggregationTypeFromJSONTyped,
    AggregationTypeToJSON,
} from './AggregationType';

/**
 * Global tags were updated on an aggregation
 * @export
 * @interface WsMessageOneOf16
 */
export interface WsMessageOneOf16 {
    /**
     * The workspace the aggregation is related to
     * @type {string}
     * @memberof WsMessageOneOf16
     */
    workspace: string;
    /**
     * 
     * @type {AggregationType}
     * @memberof WsMessageOneOf16
     */
    aggregation: AggregationType;
    /**
     * The uuid of the model
     * @type {string}
     * @memberof WsMessageOneOf16
     */
    uuid: string;
    /**
     * The updated list of tags
     * @type {Array<string>}
     * @memberof WsMessageOneOf16
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof WsMessageOneOf16
     */
    type: WsMessageOneOf16TypeEnum;
}


/**
 * @export
 */
export const WsMessageOneOf16TypeEnum = {
    UpdatedGlobalTags: 'UpdatedGlobalTags'
} as const;
export type WsMessageOneOf16TypeEnum = typeof WsMessageOneOf16TypeEnum[keyof typeof WsMessageOneOf16TypeEnum];


/**
 * Check if a given object implements the WsMessageOneOf16 interface.
 */
export function instanceOfWsMessageOneOf16(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "workspace" in value;
    isInstance = isInstance && "aggregation" in value;
    isInstance = isInstance && "uuid" in value;
    isInstance = isInstance && "tags" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function WsMessageOneOf16FromJSON(json: any): WsMessageOneOf16 {
    return WsMessageOneOf16FromJSONTyped(json, false);
}

export function WsMessageOneOf16FromJSONTyped(json: any, ignoreDiscriminator: boolean): WsMessageOneOf16 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'workspace': json['workspace'],
        'aggregation': AggregationTypeFromJSON(json['aggregation']),
        'uuid': json['uuid'],
        'tags': json['tags'],
        'type': json['type'],
    };
}

export function WsMessageOneOf16ToJSON(value?: WsMessageOneOf16 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'workspace': value.workspace,
        'aggregation': AggregationTypeToJSON(value.aggregation),
        'uuid': value.uuid,
        'tags': value.tags,
        'type': value.type,
    };
}

