import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { PinsPage } from '../pages/pins/pins';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PinterestService } from './pinterest.service';
import { LocationService } from './location.service';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [
    MyApp,
    PinsPage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PinsPage,
    HomePage,
    TabsPage
  ],
  providers: [
    PinterestService,
    LocationService,
    ErrorService
  ],
})
export class AppModule {}
