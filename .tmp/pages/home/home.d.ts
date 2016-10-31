import { NavController, ToastController, Events } from 'ionic-angular';
import { PinterestService } from '../../app/pinterest.service';
import { LocationService } from '../../app/location.service';
import { ErrorService } from '../../app/error.service';
export declare class HomePage {
    navCtrl: NavController;
    toastCtrl: ToastController;
    service: PinterestService;
    location: LocationService;
    error: ErrorService;
    bus: Events;
    username: any;
    userLocation: any;
    userLocationError: any;
    toast: any;
    constructor(navCtrl: NavController, toastCtrl: ToastController, service: PinterestService, location: LocationService, error: ErrorService, bus: Events);
    ngOnInit(): void;
    requestLocation(): void;
    login(): void;
    logout(): void;
    showToast(error?: {
        code: number;
        message: string;
    }): void;
}
