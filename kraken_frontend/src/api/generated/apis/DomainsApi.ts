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


import * as runtime from '../runtime';
import type {
  ApiErrorResponse,
  GetAllDomainsResponse,
} from '../models';
import {
    ApiErrorResponseFromJSON,
    ApiErrorResponseToJSON,
    GetAllDomainsResponseFromJSON,
    GetAllDomainsResponseToJSON,
} from '../models';

export interface GetAllDomainsRequest {
    uuid: string;
}

/**
 * 
 */
export class DomainsApi extends runtime.BaseAPI {

    /**
     * Retrieve all domains of a specific workspace
     * Retrieve all domains of a specific workspace
     */
    async getAllDomainsRaw(requestParameters: GetAllDomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetAllDomainsResponse>> {
        if (requestParameters.uuid === null || requestParameters.uuid === undefined) {
            throw new runtime.RequiredError('uuid','Required parameter requestParameters.uuid was null or undefined when calling getAllDomains.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/workspaces/{uuid}/domains`.replace(`{${"uuid"}}`, encodeURIComponent(String(requestParameters.uuid))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetAllDomainsResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all domains of a specific workspace
     * Retrieve all domains of a specific workspace
     */
    async getAllDomains(requestParameters: GetAllDomainsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetAllDomainsResponse> {
        const response = await this.getAllDomainsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}