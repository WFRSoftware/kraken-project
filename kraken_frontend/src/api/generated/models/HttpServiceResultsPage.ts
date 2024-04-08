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
import type { FullHttpService } from './FullHttpService';
import {
    FullHttpServiceFromJSON,
    FullHttpServiceFromJSONTyped,
    FullHttpServiceToJSON,
} from './FullHttpService';

/**
 * Response containing paginated data
 * @export
 * @interface HttpServiceResultsPage
 */
export interface HttpServiceResultsPage {
    /**
     * The page's items
     * @type {Array<FullHttpService>}
     * @memberof HttpServiceResultsPage
     */
    items: Array<FullHttpService>;
    /**
     * The limit this page was retrieved with
     * @type {number}
     * @memberof HttpServiceResultsPage
     */
    limit: number;
    /**
     * The offset this page was retrieved with
     * @type {number}
     * @memberof HttpServiceResultsPage
     */
    offset: number;
    /**
     * The total number of items this page is a subset of
     * @type {number}
     * @memberof HttpServiceResultsPage
     */
    total: number;
}

/**
 * Check if a given object implements the HttpServiceResultsPage interface.
 */
export function instanceOfHttpServiceResultsPage(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "items" in value;
    isInstance = isInstance && "limit" in value;
    isInstance = isInstance && "offset" in value;
    isInstance = isInstance && "total" in value;

    return isInstance;
}

export function HttpServiceResultsPageFromJSON(json: any): HttpServiceResultsPage {
    return HttpServiceResultsPageFromJSONTyped(json, false);
}

export function HttpServiceResultsPageFromJSONTyped(json: any, ignoreDiscriminator: boolean): HttpServiceResultsPage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'items': ((json['items'] as Array<any>).map(FullHttpServiceFromJSON)),
        'limit': json['limit'],
        'offset': json['offset'],
        'total': json['total'],
    };
}

export function HttpServiceResultsPageToJSON(value?: HttpServiceResultsPage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'items': ((value.items as Array<any>).map(FullHttpServiceToJSON)),
        'limit': value.limit,
        'offset': value.offset,
        'total': value.total,
    };
}

