import { NavController, LoadingController, Refresher } from 'ionic-angular';
import { PinterestService } from '../../app/pinterest.service';
export declare class PinsPage {
    navCtrl: NavController;
    loadingCtrl: LoadingController;
    service: PinterestService;
    pins: any[];
    isLoading: boolean;
    constructor(navCtrl: NavController, loadingCtrl: LoadingController, service: PinterestService);
    ngOnInit(): void;
    refresh(refresher?: Refresher): void;
    pulling(refresher: Refresher): void;
    openMaps(pin: any): void;
    visit(pin: any): void;
}
