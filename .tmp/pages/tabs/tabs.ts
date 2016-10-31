import { Component, ViewChild } from '@angular/core';

import { Tabs, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { PinsPage } from '../pins/pins';

import { PinterestService } from '../../app/pinterest.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild(Tabs) tabRef: Tabs;
  
  tab0Root: any = HomePage;
  tab1Root: any = PinsPage;

  isLoggedIn: boolean = false;

  constructor(
    public service: PinterestService,
    public bus: Events
  ) {
    this.bus.subscribe('auth:login', _ => {
      setTimeout( () => {
        this.tabRef.getByIndex(1).enabled = true;
        this.tabRef.select(1);
      }, 800);
    });
    this.bus.subscribe('auth:logout', _ => {
      this.tabRef.getByIndex(1).enabled = false;
      this.tabRef.select(0);
    });
  }

  ngOnInit() {
    this.isLoggedIn = (this.service.username !== null);
  }
}
