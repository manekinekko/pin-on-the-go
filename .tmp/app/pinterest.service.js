import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { LocationService } from './location.service';
export var PinterestService = (function () {
    function PinterestService(location) {
        this.location = location;
        this.session = null;
        this.minDistance = 3; // in km
    }
    ;
    Object.defineProperty(PinterestService.prototype, "username", {
        get: function () {
            return window.localStorage.getItem('potg:username');
        },
        set: function (name) {
            if (name === null) {
                window.localStorage.removeItem('potg:username');
            }
            else {
                window.localStorage.setItem('potg:username', name);
            }
        },
        enumerable: true,
        configurable: true
    });
    PinterestService.prototype.auth = function () {
        var _this = this;
        return this.login().flatMap(function (_) { return _this.me(); });
    };
    PinterestService.prototype.login = function () {
        var _this = this;
        var s = new Subject();
        PDK.login({ scope: 'read_public,write_public,read_relationships,write_relationships' }, function (args) {
            _this.session = args;
            s.next(args);
        });
        return s;
    };
    PinterestService.prototype.logout = function () {
        PDK.logout();
        this.session = null;
        this.username = null;
    };
    PinterestService.prototype.me = function () {
        var _this = this;
        var s = new Subject();
        PDK.me('', { fields: 'username' }, function (args) {
            _this.username = args.data.username;
            s.next(_this.username);
        });
        return s;
    };
    // @not-used
    PinterestService.prototype.boards = function () {
        var s = new Subject();
        var data = [];
        PDK.me('boards', { fields: 'id,url,name,image[small],description' }, function (args) {
            console.log(args);
            data = data.concat(args.data).map(function (board) {
                board.slug = board.url.replace('https://www.pinterest.com/', '').slice(0, -1);
                return board;
            });
            if (args.hasNext) {
                args.next();
            }
            else {
                s.next(data);
            }
        });
        return s;
    };
    PinterestService.prototype.pins = function (boardname) {
        var _this = this;
        if (boardname === void 0) { boardname = 'pin-on-the-go'; }
        var s = new Subject();
        var data = [];
        PDK.request("/v1/boards/" + this.username + "/" + boardname + "/pins/", { fields: 'id,note,attribution,metadata,image[small]' }, function (args) {
            data = data.concat(args.data);
            if (args.hasNext) {
                args.next();
            }
            else {
                try {
                    data = _this.findNearestPins(data);
                    s.next(data);
                }
                catch (error) {
                    s.next(error);
                }
            }
        });
        return s;
    };
    PinterestService.prototype.findNearestPins = function (pins) {
        var _this = this;
        var pinLocation = function (pin) {
            pin.metadata.place = pin.metadata.place || {
                latitude: 9999,
                longitude: 9999
            };
            return {
                latitude: pin.metadata.place.latitude,
                longitude: pin.metadata.place.longitude
            };
        };
        return pins.filter(function (pin) {
            var pinHasPlaceInfo = false;
            if (pin.metadata.place) {
                var computedDistance = _this.distance(pinLocation(pin));
                if (computedDistance <= _this.minDistance) {
                    pin.distance = pin.distance || {};
                    pin.distance.km = computedDistance.toFixed(3);
                    pin.distance.time = _this.computeWalkingPace(computedDistance);
                    pinHasPlaceInfo = true;
                }
            }
            return pinHasPlaceInfo;
        });
    };
    PinterestService.prototype.computeWalkingPace = function (computedDistance) {
        var averageSpeedPace = 5.00; // => km/h
        return this.toHHMMSS((computedDistance / averageSpeedPace) * 3600);
    };
    // return time in "hh:mm:ss"
    PinterestService.prototype.toHHMMSS = function (secs) {
        var sec_num = parseInt(secs, 10);
        var hours = Math.floor(sec_num / 3600) % 24;
        var minutes = Math.floor(sec_num / 60) % 60;
        var seconds = sec_num % 60;
        return [hours, minutes, seconds]
            .map(function (v) { return v < 10 ? '0' + v : v; })
            .filter(function (v, i) { return v !== '00' || i > 0; })
            .join(':');
    };
    PinterestService.prototype.toRad = function (value) {
        return value * (Math.PI / 180);
    };
    // φ1 = userLocation.latitude
    // φ2 = pinLocation.latitude
    // a = sin²(Δφ/2) + cos φ1 * cos φ2 * sin²(Δλ/2)
    // c = 2 * atan2( √a, √(1−a) )
    // d = R * c
    // return distance in km
    PinterestService.prototype.distance = function (pinLocation) {
        var R = 6371; // 6371 km or 3959 miles
        var dLat = this.toRad((pinLocation.latitude - this.location.userLocation.latitude));
        var dLon = this.toRad((pinLocation.longitude - this.location.userLocation.longitude));
        var a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
            Math.cos(this.toRad(this.location.userLocation.latitude)) *
                Math.cos(this.toRad(pinLocation.latitude)) *
                (Math.sin(dLon / 2) * Math.sin(dLon / 2));
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    };
    PinterestService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    PinterestService.ctorParameters = [
        { type: LocationService, },
    ];
    return PinterestService;
}());
