import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';


@Component({
  selector: 'page-outlet-info',
  templateUrl: 'outlet-info.html',
})
export class OutletInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private _dataService:DataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OutletInfoPage');
  }

}
