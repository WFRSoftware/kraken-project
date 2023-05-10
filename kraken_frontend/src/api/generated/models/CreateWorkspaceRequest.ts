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
 * 
 * @export
 * @interface CreateWorkspaceRequest
 */
export interface CreateWorkspaceRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateWorkspaceRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CreateWorkspaceRequest
     */
    description?: string | null;
}

/**
 * Check if a given object implements the CreateWorkspaceRequest interface.
 */
export function instanceOfCreateWorkspaceRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function CreateWorkspaceRequestFromJSON(json: any): CreateWorkspaceRequest {
    return CreateWorkspaceRequestFromJSONTyped(json, false);
}

export function CreateWorkspaceRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateWorkspaceRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
    };
}

export function CreateWorkspaceRequestToJSON(value?: CreateWorkspaceRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'description': value.description,
    };
}

