import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class PinterestService {

  username = '';
  session;
  public minDistance = 0; // in Kms

  constructor() {
    this.me();
  }

  login() {
    let s = new Subject<any[]>();
    PDK.login({ scope : 'read_public,write_public,read_relationships,write_relationships' }, (args) => {
      console.log(args);
      this.session = args;
      s.next(args);
      this.me();
    });
    return s;
  }

  logout() {
    PDK.logout();
  }

  me() {
    PDK.me('', { fields: 'username' }, (args) => {
      this.username = args.data.username;
    });
  }

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
        console.log('fetching next url');
        args.next();
      }
      else {
        s.next(data);
      }
    });
    return s;
  }

  pins(boardname) {
    let s = new Subject<any[]>();
    let data = [];
    PDK.request(`/v1/boards/${boardname}/pins/`, { fields: 'id,note,attribution,metadata,image[small]' }, (args) => {
      data = data.concat(args.data);

      if (args.hasNext) {
        console.log('fetching next url');
        args.next();
      }
      else {

        console.log(data);
        data = this.findNearestPins(data);
        console.log(data);
        s.next(data);
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
      return pin.metadata.place && this.distance(pinLocation(pin)) <= this.minDistance;
    });
  }

  private toRad(value) {
    return value * Math.PI / 180;
  }

  private distance(pinLocation) {
    let R = 6371; // km
    let dLat = this.toRad( (pinLocation.latitude - (<any>window).userLocation.latitude ) );
    let dLon = this.toRad( (pinLocation.longitude - (<any>window).userLocation.longitude ) );
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos( this.toRad( (<any>window).userLocation.latitude )) * Math.cos( this.toRad( pinLocation.latitude ) ) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }

}
