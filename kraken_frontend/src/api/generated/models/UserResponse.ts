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
 * This struct holds the user information.
 * 
 * Note that `username` is unique, but as it is changeable,
 * identify the user by its `uuid`
 * @export
 * @interface UserResponse
 */
export interface UserResponse {
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    uuid: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponse
     */
    displayName: string;
}

/**
 * Check if a given object implements the UserResponse interface.
 */
export function instanceOfUserResponse(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "uuid" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "displayName" in value;

    return isInstance;
}

export function UserResponseFromJSON(json: any): UserResponse {
    return UserResponseFromJSONTyped(json, false);
}

export function UserResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'uuid': json['uuid'],
        'username': json['username'],
        'displayName': json['display_name'],
    };
}

export function UserResponseToJSON(value?: UserResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'uuid': value.uuid,
        'username': value.username,
        'display_name': value.displayName,
    };
}

