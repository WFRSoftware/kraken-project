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
} from '../models';
import {
    ApiErrorResponseFromJSON,
    ApiErrorResponseToJSON,
} from '../models';

/**
 * 
 */
export class WebsocketApi extends runtime.BaseAPI {

    /**
     * Start a websocket connection  A heartbeat PING packet is sent constantly (every 10s). If no response is retrieved within 30s of the last transmission, the socket will be closed.
     * Start a websocket connection
     */
    async websocketRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/ws`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Start a websocket connection  A heartbeat PING packet is sent constantly (every 10s). If no response is retrieved within 30s of the last transmission, the socket will be closed.
     * Start a websocket connection
     */
    async websocket(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.websocketRaw(initOverrides);
    }

}
