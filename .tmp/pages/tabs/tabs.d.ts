import { Tabs, Events } from 'ionic-angular';
import { PinterestService } from '../../app/pinterest.service';
export declare class TabsPage {
    service: PinterestService;
    bus: Events;
    tabRef: Tabs;
    tab0Root: any;
    tab1Root: any;
    isLoggedIn: boolean;
    constructor(service: PinterestService, bus: Events);
    ngOnInit(): void;
}
