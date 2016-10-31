import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {

    /**
     * [ERR001]: User denied Geolocation
     * [ERR002]: Location Unavailable
     */

    static Type = {
        GEOLOCATION: 0,
        PINTEREST: 1,
        TRYCATCH: 9
    };

    static ErrorCode = {
        UNKNOWN: 9
    };

    constructor() { }

    code(type: number, error: { code: number, message: string }) {
        return `[ERR${ type }0${ error.code || ErrorService.ErrorCode.UNKNOWN }]`;
    }
}