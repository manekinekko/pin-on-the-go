import { Component } from '@angular/core';

import { NavController, LoadingController, Refresher } from 'ionic-angular';

import { PinterestService } from '../../app/pinterest.service';

@Component({
  selector: 'page-pins',
  templateUrl: 'pins.html'
})
export class PinsPage {

  public pins = [];
  public isLoading: boolean;
  // public loader;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public service: PinterestService
  ) {
    this.isLoading = false;
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(refresher: Refresher = null) {

    // adding a loader causes the refresher to fail because "ViewController.prototype.pageRef"
    // return NULL. Perhaps "ViewController.prototype.init" is never called ?!
    // this.loader = this.loadingCtrl.create({
    //   content: 'Finding your pins around here...'
    // });
    // this.loader.present().then( _ => {
      
      this.isLoading = true;
      this.service
        .pins()
        .subscribe((pins) => {

          if (pins.error) {
            console.log(pins.error);
          }
          else {
            this.pins = pins;
          }

          this.isLoading = false;
          //this.loader.dismissAll();

          if (refresher) {
            refresher.complete();
          }

        });
    //});
  }

  pulling(refresher: Refresher) {}

  openMaps(pin: any){
    if (pin.metadata && pin.metadata.place) {
      window.open(`geo:#q=${ pin.metadata.place.latitude }+${ pin.metadata.place.longitude }&17z&t=k&mrt=all`, '_system', 'location=yes');
    }
  }

  visit(pin) {
    if (pin.metadata && pin.metadata.place && pin.metadata.place.source_url) {
      window.open(`${pin.metadata.place.source_url}`, '_blank');
    }
  }

}
