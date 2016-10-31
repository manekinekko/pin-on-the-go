import { Subject } from 'rxjs/Rx';
export declare class LocationService {
    userLocation: {
        latitude: number;
        longitude: number;
    };
    constructor();
    request(): Subject<any>;
}
