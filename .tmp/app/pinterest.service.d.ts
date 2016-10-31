import { Subject, Observable } from 'rxjs/Rx';
import { LocationService } from './location.service';
export declare class PinterestService {
    location: LocationService;
    session: string;
    minDistance: number;
    constructor(location: LocationService);
    username: string;
    auth(): Observable<any>;
    login(): Subject<any[]>;
    logout(): void;
    me(): Subject<string>;
    boards(): Subject<any[]>;
    pins(boardname?: string): Subject<any>;
    private findNearestPins(pins);
    private computeWalkingPace(computedDistance);
    private toHHMMSS(secs);
    private toRad(value);
    private distance(pinLocation);
}
