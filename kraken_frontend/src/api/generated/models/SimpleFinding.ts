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
import type { FindingSeverity } from './FindingSeverity';
import {
    FindingSeverityFromJSON,
    FindingSeverityFromJSONTyped,
    FindingSeverityToJSON,
} from './FindingSeverity';

/**
 * A simple finding
 * @export
 * @interface SimpleFinding
 */
export interface SimpleFinding {
    /**
     * The uuid of the finding
     * @type {string}
     * @memberof SimpleFinding
     */
    uuid: string;
    /**
     * The uuid of the finding definition
     * @type {string}
     * @memberof SimpleFinding
     */
    definition: string;
    /**
     * The name of the finding definition
     * @type {string}
     * @memberof SimpleFinding
     */
    name: string;
    /**
     * The CVE of the finding definition
     * @type {string}
     * @memberof SimpleFinding
     */
    cve?: string | null;
    /**
     * 
     * @type {FindingSeverity}
     * @memberof SimpleFinding
     */
    severity: FindingSeverity;
    /**
     * The point in time this finding definition was created
     * @type {Date}
     * @memberof SimpleFinding
     */
    createdAt: Date;
}

/**
 * Check if a given object implements the SimpleFinding interface.
 */
export function instanceOfSimpleFinding(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "uuid" in value;
    isInstance = isInstance && "definition" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "severity" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function SimpleFindingFromJSON(json: any): SimpleFinding {
    return SimpleFindingFromJSONTyped(json, false);
}

export function SimpleFindingFromJSONTyped(json: any, ignoreDiscriminator: boolean): SimpleFinding {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'uuid': json['uuid'],
        'definition': json['definition'],
        'name': json['name'],
        'cve': !exists(json, 'cve') ? undefined : json['cve'],
        'severity': FindingSeverityFromJSON(json['severity']),
        'createdAt': (new Date(json['created_at'])),
    };
}

export function SimpleFindingToJSON(value?: SimpleFinding | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'uuid': value.uuid,
        'definition': value.definition,
        'name': value.name,
        'cve': value.cve,
        'severity': FindingSeverityToJSON(value.severity),
        'created_at': (value.createdAt.toISOString()),
    };
}
