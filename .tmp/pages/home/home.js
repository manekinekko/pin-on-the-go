import { Component } from '@angular/core';
import { NavController, ToastController, Events } from 'ionic-angular';
import { PinterestService } from '../../app/pinterest.service';
import { LocationService } from '../../app/location.service';
import { ErrorService } from '../../app/error.service';
export var HomePage = (function () {
    function HomePage(navCtrl, toastCtrl, service, location, error, bus) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.location = location;
        this.error = error;
        this.bus = bus;
    }
    HomePage.prototype.ngOnInit = function () {
        this.requestLocation();
    };
    HomePage.prototype.requestLocation = function () {
        var _this = this;
        this.location.request().subscribe(function (loc) {
            if (!loc || loc.error) {
                _this.showToast(loc.error);
                _this.userLocationError = true;
                _this.bus.publish('auth:logout');
            }
            else {
                _this.userLocationError = false;
                _this.userLocation = loc;
                _this.username = _this.service.username;
                if (_this.username) {
                    _this.bus.publish('auth:login', _this.username);
                }
            }
        });
    };
    HomePage.prototype.login = function () {
        var _this = this;
        this.service
            .auth()
            .subscribe(function (username) {
            _this.username = username;
            _this.bus.publish('auth:login', username);
        });
    };
    HomePage.prototype.logout = function () {
        this.service.logout();
        this.username = null;
        this.bus.publish('auth:logout');
    };
    HomePage.prototype.showToast = function (error) {
        var _this = this;
        if (error === void 0) { error = null; }
        if (this.toast) {
            this.toast.dismissAll();
        }
        this.toast = this.toastCtrl.create({
            message: "Can not access your location " + this.error.code(ErrorService.Type.GEOLOCATION, error),
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Close'
        });
        this.toast.onDidDismiss(function () {
            _this.toast = null;
        });
        this.toast.present();
    };
    HomePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-home',
                    templateUrl: 'home.html'
                },] },
    ];
    /** @nocollapse */
    HomePage.ctorParameters = [
        { type: NavController, },
        { type: ToastController, },
        { type: PinterestService, },
        { type: LocationService, },
        { type: ErrorService, },
        { type: Events, },
    ];
    return HomePage;
}());
