import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

import { LocationService } from './location.service';

@Injectable()
export class PinterestService {

  public session: string = null;;
  public minDistance: number = 3; // in km

  constructor(
    public location: LocationService
  ) {}

  get username() {
    return window.localStorage.getItem('potg:username');
  }

  set username(name: string) {
    if (name === null) {
      window.localStorage.removeItem('potg:username');  
    }
    else {
      window.localStorage.setItem('potg:username', name);
    }
  }

  auth(): Observable<any> {
    return this.login().flatMap(_ => this.me() );
  }

  login() {
    let s = new Subject<any[]>();
    PDK.login({ scope : 'read_public,write_public,read_relationships,write_relationships' }, (args) => {
      this.session = args;
      s.next(args);
    });
    return s;
  }

  logout() {
    PDK.logout();
    this.session = null;
    this.username = null;
  }

  me() {
    let s = new Subject<string>();
    PDK.me('', { fields: 'username' }, (args) => {
      this.username = args.data.username;
      s.next(this.username);
    });
    return s;
  }

  // @not-used
  boards() {
    let s = new Subject<any[]>();
    let data = [];
    PDK.me('boards', { fields: 'id,url,name,image[small],description' }, (args) => {
      console.log(args);
      data = data.concat(args.data).map( board => {
        board.slug = board.url.replace('https://www.pinterest.com/', '').slice(0, -1);
        return board;
      })

      if (args.hasNext) {
        args.next();
      }
      else {
        s.next(data);
      }
    });
    return s;
  }

  pins(boardname='pin-on-the-go') {
    let s = new Subject<any[] | any>();
    let data = [];
    PDK.request(`/v1/boards/${this.username}/${boardname}/pins/`, { fields: 'id,note,attribution,metadata,image[small]' }, (args) => {
      data = data.concat(args.data);

      if (args.hasNext) {
        args.next();
      }
      else {

        try {
          data = this.findNearestPins(data);
          s.next(data);
        } catch (error) {
          s.next(error);
        }

      }
    });
    return s;
  }

  private findNearestPins(pins) {
    let pinLocation = (pin) => {
      pin.metadata.place = pin.metadata.place || {
        latitude: 9999,
        longitude: 9999
      };
      return {
        latitude: pin.metadata.place.latitude,
        longitude: pin.metadata.place.longitude
      };
    };

    return pins.filter( pin => {
      let pinHasPlaceInfo = false;

      if (pin.metadata.place) {
        let computedDistance = this.distance(pinLocation(pin));
        if (computedDistance <= this.minDistance) {
          pin.distance = pin.distance || {};
          pin.distance.km = computedDistance.toFixed(3);
          pin.distance.time = this.computeWalkingPace(computedDistance);
          pinHasPlaceInfo = true;
        }
      }

      return pinHasPlaceInfo;
    });
  }

  private computeWalkingPace(computedDistance: number) {
    let averageSpeedPace = 5.00; // => km/h
    return this.toHHMMSS((computedDistance / averageSpeedPace) * 3600);
  }

  // return time in "hh:mm:ss"
  private toHHMMSS(secs) {
    let sec_num = parseInt(secs, 10);
    let hours   = Math.floor(sec_num / 3600) % 24;
    let minutes = Math.floor(sec_num / 60) % 60;
    let seconds = sec_num % 60;
    return [hours,minutes,seconds]
      .map(v => v < 10 ? '0' + v : v)
      .filter((v,i) => v !== '00' || i > 0)
      .join(':');
  }

  private toRad(value) {
    return value * (Math.PI / 180);
  }

  // φ1 = userLocation.latitude
  // φ2 = pinLocation.latitude
  // a = sin²(Δφ/2) + cos φ1 * cos φ2 * sin²(Δλ/2)
  // c = 2 * atan2( √a, √(1−a) )
  // d = R * c
  // return distance in km
  private distance(pinLocation): number {
    let R = 6371; // 6371 km or 3959 miles
    let dLat = this.toRad( (pinLocation.latitude - this.location.userLocation.latitude ) );
    let dLon = this.toRad( (pinLocation.longitude - this.location.userLocation.longitude ) );
    let a = (Math.sin(dLat / 2) * Math.sin(dLat / 2) )+
            Math.cos( this.toRad( this.location.userLocation.latitude )) * 
            Math.cos( this.toRad( pinLocation.latitude ) ) *
            (Math.sin(dLon / 2) * Math.sin(dLon / 2));
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

}