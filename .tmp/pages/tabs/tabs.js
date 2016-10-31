import { Component, ViewChild } from '@angular/core';
import { Tabs, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PinsPage } from '../pins/pins';
import { PinterestService } from '../../app/pinterest.service';
export var TabsPage = (function () {
    function TabsPage(service, bus) {
        var _this = this;
        this.service = service;
        this.bus = bus;
        this.tab0Root = HomePage;
        this.tab1Root = PinsPage;
        this.isLoggedIn = false;
        this.bus.subscribe('auth:login', function (_) {
            setTimeout(function () {
                _this.tabRef.getByIndex(1).enabled = true;
                _this.tabRef.select(1);
            }, 800);
        });
        this.bus.subscribe('auth:logout', function (_) {
            _this.tabRef.getByIndex(1).enabled = false;
            _this.tabRef.select(0);
        });
    }
    TabsPage.prototype.ngOnInit = function () {
        this.isLoggedIn = (this.service.username !== null);
    };
    TabsPage.decorators = [
        { type: Component, args: [{
                    templateUrl: 'tabs.html'
                },] },
    ];
    /** @nocollapse */
    TabsPage.ctorParameters = [
        { type: PinterestService, },
        { type: Events, },
    ];
    TabsPage.propDecorators = {
        'tabRef': [{ type: ViewChild, args: [Tabs,] },],
    };
    return TabsPage;
}());
