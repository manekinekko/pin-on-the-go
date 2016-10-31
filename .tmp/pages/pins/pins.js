import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PinterestService } from '../../app/pinterest.service';
export var PinsPage = (function () {
    // public loader;
    function PinsPage(navCtrl, loadingCtrl, service) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.pins = [];
        this.isLoading = false;
    }
    PinsPage.prototype.ngOnInit = function () {
        this.refresh();
    };
    PinsPage.prototype.refresh = function (refresher) {
        // adding a loader causes the refresher to fail because "ViewController.prototype.pageRef"
        // return NULL. Perhaps "ViewController.prototype.init" is never called ?!
        // this.loader = this.loadingCtrl.create({
        //   content: 'Finding your pins around here...'
        // });
        // this.loader.present().then( _ => {
        var _this = this;
        if (refresher === void 0) { refresher = null; }
        this.isLoading = true;
        this.service
            .pins()
            .subscribe(function (pins) {
            if (pins.error) {
                console.log(pins.error);
            }
            else {
                _this.pins = pins;
            }
            _this.isLoading = false;
            //this.loader.dismissAll();
            if (refresher) {
                refresher.complete();
            }
        });
        //});
    };
    PinsPage.prototype.pulling = function (refresher) { };
    PinsPage.prototype.openMaps = function (pin) {
        if (pin.metadata && pin.metadata.place) {
            window.open("geo:#q=" + pin.metadata.place.latitude + "+" + pin.metadata.place.longitude + "&17z&t=k&mrt=all", '_system', 'location=yes');
        }
    };
    PinsPage.prototype.visit = function (pin) {
        if (pin.metadata && pin.metadata.place && pin.metadata.place.source_url) {
            window.open("" + pin.metadata.place.source_url, '_blank');
        }
    };
    PinsPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-pins',
                    templateUrl: 'pins.html'
                },] },
    ];
    /** @nocollapse */
    PinsPage.ctorParameters = [
        { type: NavController, },
        { type: LoadingController, },
        { type: PinterestService, },
    ];
    return PinsPage;
}());
