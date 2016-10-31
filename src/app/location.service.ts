import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class LocationService {

    public userLocation: { latitude: number, longitude: number };

    constructor() {
        this.userLocation = {
            latitude: null,
            longitude: null
        };
    }

    request() {
        let s = new Subject<any>();
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                s.next(this.userLocation);
            }, (error) => {
                console.error(error);
                s.next({error});
            });
        }
        else {
            s.next(null);
        }

        return s;
    }
}