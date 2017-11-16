import { Component,ViewChild,ElementRef } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform,AlertController,MenuController} from 'ionic-angular';

import {DataProvider} from '../../providers/data/data';

import {Storage} from '@ionic/storage';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-quick-search',
  templateUrl: 'quick-search.html',
})
export class QuickSearchPage {

  httpRequest : boolean = false;

  httpReceivedData:any;

  @ViewChild('searchInput') searchInput:ElementRef;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,private _dataService : DataProvider, private _platform:Platform, private _storage:Storage,private _alertCtrl : AlertController,private _menuCtrl:MenuController, private _el:ElementRef) {
  }

  ionViewDidLoad() {

    console.log(this.searchInput.nativeElement)

    //disbale side menu
    this._menuCtrl.enable(false);

    let user_data:any = '';

    this._storage.get("user_data")
    .then((val) => {
      if(val == null){
        this.navCtrl.setRoot(LoginPage);
      }else{
        user_data = JSON.parse(val);
        this.callHttp(user_data.Token)
      }
    })
    //call quickSearch service
      
    
  };//

  callHttp(token){
    this.httpRequest = true
    this._dataService.quickSearchRequest(token)
      .finally(() => {
        console.log('http completed');
        this.httpRequest  = false;
      })
      .subscribe(
        (response) => {
          this.httpReceivedData = response;
          console.log(this.httpReceivedData)
        },
        (error) => {
          this.processErrorFromHttp(error)
        }
      )
  }



  processErrorFromHttp(err){

    if(err.status == 401){
      console.log("Invalid User",err.message);
      this._dataService.clearUserData()
        .then(() => {
          console.log('user deleted');
          this.navCtrl.setRoot(LoginPage)
        })
        .catch(() => {
          console.log('user not deleted but redirecting');
          this.navCtrl.setRoot(LoginPage)
        })
    }

  }

  getLoadingimg() {
    if (this._platform.is('core')) {
      return "../assets/imgs/loading.svg";
    } else if (this._platform.is('android')) {
      return "assets/imgs/loading.svg";
    } else {
      return "assets/imgs/loading.svg";
    }
  }

}
