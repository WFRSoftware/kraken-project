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
 * Numbers how many attacks of a certain kind found an aggregated model
 * @export
 * @interface SimpleAggregationSource
 */
export interface SimpleAggregationSource {
    /**
     * Bruteforce subdomains via DNS requests
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    bruteforceSubdomains: number;
    /**
     * Scan tcp ports
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    tcpPortScan: number;
    /**
     * Query certificate transparency
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    queryCertificateTransparency: number;
    /**
     * Query the dehashed API
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    queryDehashed: number;
    /**
     * Check if a host is reachable via icmp
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    hostAlive: number;
    /**
     * Detect the service that is running on a port
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    serviceDetection: number;
    /**
     * Resolve domain names
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    dnsResolution: number;
    /**
     * Perform forced browsing
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    forcedBrowsing: number;
    /**
     * Detect the OS of the target
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    osDetection: number;
    /**
     * Detect if anti-port scanning techniques are in place
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    antiPortScanningDetection: number;
    /**
     * Scan udp ports
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    udpPortScan: number;
    /**
     * Perform version detection
     * @type {number}
     * @memberof SimpleAggregationSource
     */
    versionDetection: number;
    /**
     * Manually inserted
     * @type {boolean}
     * @memberof SimpleAggregationSource
     */
    manual: boolean;
}

/**
 * Check if a given object implements the SimpleAggregationSource interface.
 */
export function instanceOfSimpleAggregationSource(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "bruteforceSubdomains" in value;
    isInstance = isInstance && "tcpPortScan" in value;
    isInstance = isInstance && "queryCertificateTransparency" in value;
    isInstance = isInstance && "queryDehashed" in value;
    isInstance = isInstance && "hostAlive" in value;
    isInstance = isInstance && "serviceDetection" in value;
    isInstance = isInstance && "dnsResolution" in value;
    isInstance = isInstance && "forcedBrowsing" in value;
    isInstance = isInstance && "osDetection" in value;
    isInstance = isInstance && "antiPortScanningDetection" in value;
    isInstance = isInstance && "udpPortScan" in value;
    isInstance = isInstance && "versionDetection" in value;
    isInstance = isInstance && "manual" in value;

    return isInstance;
}

export function SimpleAggregationSourceFromJSON(json: any): SimpleAggregationSource {
    return SimpleAggregationSourceFromJSONTyped(json, false);
}

export function SimpleAggregationSourceFromJSONTyped(json: any, ignoreDiscriminator: boolean): SimpleAggregationSource {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'bruteforceSubdomains': json['bruteforce_subdomains'],
        'tcpPortScan': json['tcp_port_scan'],
        'queryCertificateTransparency': json['query_certificate_transparency'],
        'queryDehashed': json['query_dehashed'],
        'hostAlive': json['host_alive'],
        'serviceDetection': json['service_detection'],
        'dnsResolution': json['dns_resolution'],
        'forcedBrowsing': json['forced_browsing'],
        'osDetection': json['os_detection'],
        'antiPortScanningDetection': json['anti_port_scanning_detection'],
        'udpPortScan': json['udp_port_scan'],
        'versionDetection': json['version_detection'],
        'manual': json['manual'],
    };
}

export function SimpleAggregationSourceToJSON(value?: SimpleAggregationSource | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'bruteforce_subdomains': value.bruteforceSubdomains,
        'tcp_port_scan': value.tcpPortScan,
        'query_certificate_transparency': value.queryCertificateTransparency,
        'query_dehashed': value.queryDehashed,
        'host_alive': value.hostAlive,
        'service_detection': value.serviceDetection,
        'dns_resolution': value.dnsResolution,
        'forced_browsing': value.forcedBrowsing,
        'os_detection': value.osDetection,
        'anti_port_scanning_detection': value.antiPortScanningDetection,
        'udp_port_scan': value.udpPortScan,
        'version_detection': value.versionDetection,
        'manual': value.manual,
    };
}

