import { Component } from '@angular/core';

import { NavController, ToastController, Events } from 'ionic-angular';

import { PinterestService } from '../../app/pinterest.service';
import { LocationService } from '../../app/location.service';
import { ErrorService } from '../../app/error.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public username;
  public userLocation;
  public userLocationError;
  public toast;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public service: PinterestService,
    public location: LocationService,
    public error: ErrorService,
    public bus: Events
  ) {
  }

  ngOnInit() {
    this.requestLocation();
  }

  requestLocation() {
    this.location.request().subscribe( loc => {
      if (!loc || loc.error){
        this.showToast(loc.error);
        this.userLocationError = true;
        this.bus.publish('auth:logout');
      }
      else {
        this.userLocationError = false;
        this.userLocation = loc;
        this.username = this.service.username;
        if (this.username) {
          this.bus.publish('auth:login', this.username);
        }
      }
    });
  }

  login() {
    this.service
      .auth()
      .subscribe( username => {
        this.username = username;
        this.bus.publish('auth:login', username);
      })
  }
  logout() {
    this.service.logout();
    this.username = null;
    this.bus.publish('auth:logout');
  }

  showToast(error: {code:number, message: string}=null) {

    if (this.toast) {
      this.toast.dismissAll();
    }

    this.toast = this.toastCtrl.create({
      message: `Can not access your location ${this.error.code(ErrorService.Type.GEOLOCATION, error)}`,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Close'
    });
    this.toast.onDidDismiss(() => {
      this.toast = null;
    });
    this.toast.present();
  }

}
