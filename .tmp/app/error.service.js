import { Injectable } from '@angular/core';
export var ErrorService = (function () {
    function ErrorService() {
    }
    ErrorService.prototype.code = function (type, error) {
        return "[ERR" + type + "0" + (error.code || ErrorService.ErrorCode.UNKNOWN) + "]";
    };
    /**
     * [ERR001]: User denied Geolocation
     * [ERR002]: Location Unavailable
     */
    ErrorService.Type = {
        GEOLOCATION: 0,
        PINTEREST: 1,
        TRYCATCH: 9
    };
    ErrorService.ErrorCode = {
        UNKNOWN: 9
    };
    ErrorService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ErrorService.ctorParameters = [];
    return ErrorService;
}());
