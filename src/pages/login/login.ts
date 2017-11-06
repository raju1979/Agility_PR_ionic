import { LandingPage } from './../landing/landing';
import { Component } from '@angular/core';
import { NavController, NavParams,Platform,AlertController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

import {FormsModule} from '@angular/forms';

import { Storage } from '@ionic/storage';

declare var moment:any;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  httpRequest:boolean = false;

  noOfAttempt:number = 0;

  excessInvalidAttempts:boolean = false;

  warningAttempts:number = 2;
  maximumInvalidAttempts:number = 3;
  lockInMinutes:number = 2;

  invalidLoginStartTime:any;
  invalidLoginEndTime:any;

  userFormData:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private _dataService:DataProvider,private _platform:Platform, private _alertCtrl:AlertController,private _storage:Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  getLoadingimg(){
    if (this._platform.is('core')) {
      return "../assets/imgs/loading.svg";
    } else if (this._platform.is('android')) {
      return "assets/imgs/loading.svg";
    } else {
      return "assets/imgs/loading1.svg";
    }
  }

  onSubmit(valid,value){    

    if(valid){

      this.httpRequest = true;
      this.userFormData = value;
      let isUserLocked = this.checkUserLockStatus(value);

      isUserLocked.then((data:any) => {
        if(data == null){//if no lockUserData Exists
          this.proceedWithLogin(value);
        }else{
          let lockPayloadData = JSON.parse(data);
          if(lockPayloadData.email == value.Email){
            let balanceTime =  this.getUserRemainingTime(lockPayloadData.lockOutTime);
            if(balanceTime > 0){
              this._storage.remove("lockOutPayload");
              this.noOfAttempt = 0;
              this.proceedWithLogin(value);
            }else{
              this.httpRequest = false;
              this.showLockOutAlert();
            }

          }else{
            this._storage.remove("lockOutPayload");
            this.noOfAttempt = 0;
            this.proceedWithLogin(value);
          }
        }
      });//end isUserLocked.then

      
    }//end if valid

  }//end onSubmit
  
  proceedWithLogin(value){


    this.userFormData = value;
    this._dataService.loginUser(value)
    .finally(() => {
      this.httpRequest = false;
    })
    .subscribe(
      (response) => {          
        console.log(response)
      },
      (error) => {
        this.noOfAttempt++;
        console.log(this.noOfAttempt);
        if( this.noOfAttempt < this.warningAttempts){
          this.showUserNotFoundErrorAlert(error)
        }else if( (this.noOfAttempt >= this.warningAttempts && this.noOfAttempt < this.maximumInvalidAttempts)){
          this.showUserNotFoundErrorAlertOnThirdAttempt(error)
        }
        else if( this.noOfAttempt == this.maximumInvalidAttempts){
          this.showUserNotFoundErrorAlertOnFifthAttempt(error)
        }
        
      }
    )

  };//end proceedWithLogin


  checkUserLockStatus(userData){

    return new Promise((resolve) => {
      this._storage.get("lockOutPayload")
        .then((val) => {
          console.log(val);
          resolve(val)
        })
    })

  };//

  getUserRemainingTime(lockTime){
    return this.getRemainingMinuteInLogin(lockTime);
  }

  showUserNotFoundErrorAlert(msg:any){
    let alert = this._alertCtrl.create({
      title: 'Invalid User',
      subTitle: 'The username and/or password is incorrect. Please enter a valid username and password ',
      buttons: ['Dismiss']
    });
    alert.present();

  }

  showUserNotFoundErrorAlertOnThirdAttempt(msg:any){
    let alert = this._alertCtrl.create({
      title: 'Invalid User',
      subTitle: `The username and/or password is incorrect. Please enter a valid username and password <p class='errorRed'>Notice: You will be locked out for 15 minutes after 5 failed login attempts</p>`,
      buttons: ['Dismiss']
    });
    alert.present();

  }

  showUserNotFoundErrorAlertOnFifthAttempt(msg:any){
    this.excessInvalidAttempts  = true;

    this.invalidLoginStartTime = moment();
    this.invalidLoginEndTime = moment().add(this.lockInMinutes, 'minutes');

    const lockPayload = {
      email:this.userFormData.Email,
      lockOutTime:moment(this.invalidLoginEndTime).format()
    }

    this._storage.set('lockOutPayload',JSON.stringify(lockPayload));

    console.log(lockPayload);

    let alert = this._alertCtrl.create({
      title: 'Invalid User',
      subTitle: `The username and/or password is incorrect. Please enter a valid username and password <p class='errorFiveRed'>Notice: You have been locked out for 15 minutes due to excessive failed login attempts</p>`,
      buttons: ['Dismiss']
    });
    alert.present();

  }


  showLockOutAlert(msg?:any){
    let alert = this._alertCtrl.create({
      title: 'User Locked',
      subTitle: `You are currently locked`,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  getRemainingMinuteInLogin(lockOutTime){
    let now = moment(); //todays date
    let duration = moment.duration(now.diff(lockOutTime));
    let minutesLeft = duration.asMinutes();
    console.log(minutesLeft)
    return minutesLeft;
  }


  onLogin(){
    this.navCtrl.setRoot(LandingPage);
  }
}
