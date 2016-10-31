import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
export var LocationService = (function () {
    function LocationService() {
        this.userLocation = {
            latitude: null,
            longitude: null
        };
    }
    LocationService.prototype.request = function () {
        var _this = this;
        var s = new Subject();
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                _this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                s.next(_this.userLocation);
            }, function (error) {
                console.error(error);
                s.next({ error: error });
            });
        }
        else {
            s.next(null);
        }
        return s;
    };
    LocationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LocationService.ctorParameters = [];
    return LocationService;
}());
