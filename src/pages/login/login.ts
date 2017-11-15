import {LandingPage} from './../landing/landing';
import {Component} from '@angular/core';
import {NavController, NavParams, Platform, AlertController,MenuController} from 'ionic-angular';
import {DataProvider} from '../../providers/data/data';

import {FormsModule} from '@angular/forms';

import {Storage} from '@ionic/storage';

declare var moment : any;
declare var _ : any;

@Component({selector: 'page-login', templateUrl: 'login.html'})
export class LoginPage {

  httpRequest : boolean = false;

  noOfAttempt : number = 0;
  invalidAttemptArray : Array < any > = [];

  excessInvalidAttempts : boolean = false;

  warningAttempts : number = 2;
  maximumInvalidAttempts : number = 3;
  lockInMinutes : number = 1;

  invalidLoginStartTime : any;
  invalidLoginEndTime : any;

  userFormData : any;

  checkingExistingLogin:boolean = true;

  constructor(public navCtrl : NavController, public navParams : NavParams, private _dataService : DataProvider, private _platform : Platform, private _alertCtrl : AlertController, private _storage : Storage,private _menuCtrl:MenuController) {}

  ionViewDidLoad() {

    
    
    this._menuCtrl.enable(false);
    //check any existing login in the indexedDB
    this._storage.get("user_data")
      .then((data) => {
        console.log(data)
        if(data == null){
          this.checkingExistingLogin = false;
        }else{
          console.log('helll')
          this.gotoLandingIfLoginExists();
        }
        
      })
      .catch((err) => {
        this.checkingExistingLogin = false;
      })
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

  onSubmit(valid, value) {

    if (valid) {

      this.httpRequest = true;
      this.userFormData = value;

      this
        ._storage
        .get("lockOutPayload")
        .then((data) => {
          console.log(data)
          if (data == null) {
            this.proceedWithLogin(value)

          } else {
            //JSON.parse the value retreived from indexedDB
            let userStoredVal = JSON.parse(data);
            // compare the userEmail entered in the form with the value retreived from indexedDB
            let userInvalidDataIndex = _.findIndex(userStoredVal, (o) => {
              return o.email == value.Email;
            });
            

            //if there is a match(!= -1) then hold user else procedd with login attempts
            if (userInvalidDataIndex == -1) {
              this.proceedWithLogin(value)
            } else { //
              const remainingTime = this.getUserRemainingTime(userStoredVal[userInvalidDataIndex].lockOutTime)
              this.httpRequest = false;
              // check if remaining time is < 0 then the user is still locked else clear the
              // lockOutPayload in indexedDB and proceed with login
              if (remainingTime > 0) {
                this
                  ._storage
                  .remove('lockOutPayload')
                  .then((data) => {
                    this.invalidAttemptArray = [];
                    console.log('you are good to go now')
                    this.proceedWithLogin(value);
                  })
              } else {
                console.log(`Already locked out :: remaining time ${remainingTime}`);
                this.showLockOutAlert(remainingTime)
              }

            }

          }

        }) //end this._storage

    } //end if valid

  } //end onSubmit

  proceedWithLogin(value) {

    this.userFormData = value;
    this
      ._dataService
      .loginUser(value)
      . finally(() => {
        this.httpRequest = false;
      })
      .subscribe((response) => {
        console.log(response)
        //login successfull now redirect
        this.onLogin(response.AuthenticateResponse);
      }, (error) => {
        this.noOfAttempt++;
        console.log(error)
        console.log(this.noOfAttempt);

        let userInvalidData = _.findIndex(this.invalidAttemptArray, (o) => {
          return o.user == value.Email;
        });

        if (userInvalidData == -1) {
          const userInvalidDataObj = {
            user: value.Email,
            invalidAttempt: 1
          }
          this
            .invalidAttemptArray
            .push(userInvalidDataObj);
          this.whichAttemptAlertToShow(0, error)
        } else {
          console.log(userInvalidData, this.invalidAttemptArray)

          this.invalidAttemptArray[userInvalidData].invalidAttempt = this.invalidAttemptArray[userInvalidData].invalidAttempt + 1;
          let invalidAttemptCounter = this.invalidAttemptArray[userInvalidData].invalidAttempt;

          this.whichAttemptAlertToShow(invalidAttemptCounter, error)

        }

        console.log(this.invalidAttemptArray)

      })

  }; //end proceedWithLogin

  whichAttemptAlertToShow(invalidAttemptCounter, error) {
    if (invalidAttemptCounter < this.warningAttempts) {
      this.showUserNotFoundErrorAlert(error)
    } else if ((invalidAttemptCounter >= this.warningAttempts && invalidAttemptCounter < this.maximumInvalidAttempts)) {
      this.showUserNotFoundErrorAlertOnThirdAttempt(error)
    } else if (invalidAttemptCounter == this.maximumInvalidAttempts) {
      this.showUserNotFoundErrorAlertOnFifthAttempt(error)
    }
  }

  getUserRemainingTime(lockTime) {
    return this.getRemainingMinuteInLogin(lockTime);
  }

  showUserNotFoundErrorAlert(msg : any) {
    let alert = this
      ._alertCtrl
      .create({
        title: 'Invalid User',
        subTitle: 'The username and/or password is incorrect. Please enter a valid username and pas' +
            'sword ',
        buttons: ['Dismiss']
      });
    alert.present();

  }

  showUserNotFoundErrorAlertOnThirdAttempt(msg : any) {
    let alert = this
      ._alertCtrl
      .create({title: 'Invalid User', subTitle: `The username and/or password is incorrect. Please enter a valid username and password <p class='errorRed'>Notice: You will be locked out for 15 minutes after 5 failed login attempts</p>`, buttons: ['Dismiss']});
    alert.present();

  }

  showUserNotFoundErrorAlertOnFifthAttempt(msg : any) {
    this.excessInvalidAttempts = true;

    this.invalidLoginStartTime = moment();
    this.invalidLoginEndTime = moment().add(this.lockInMinutes, 'minutes');

    const lockPayloadArr = [];

    const lockPayload = {
      email: this.userFormData.Email,
      lockOutTime: moment(this.invalidLoginEndTime).format()
    }

    lockPayloadArr.push(lockPayload)

    this
      ._storage
      .set('lockOutPayload', JSON.stringify(lockPayloadArr))
      .then((data) => {
        console.log('local set')

        let alert = this
          ._alertCtrl
          .create({title: 'Invalid User', subTitle: `The username and/or password is incorrect. <p class='errorFiveRed'>Notice: You have been locked out for 15 minutes due to excessive failed login attempts</p>`, buttons: ['Dismiss']});
        alert.present();
      })
      .catch((err) => {
        console.log(err)
      })

  }

  showLockOutAlert(msg?: any) {
    const remainingTime = msg.toFixed(2) * -1;
    let alert = this
      ._alertCtrl
      .create({title: 'User Locked', subTitle: `You are currently locked. Please try after <span class='errorFiveRed'> ${remainingTime} </span> minutes`, buttons: ['Ok']});
    alert.present();
  }

  getRemainingMinuteInLogin(lockOutTime) {
    let now = moment(); //todays date
    let duration = moment.duration(now.diff(lockOutTime));
    let minutesLeft = duration.asMinutes();
    console.log(minutesLeft)
    return minutesLeft;
  }

  onLogin(response) {
    this._storage.clear()
      .then(() => {
        this._storage.set('user_data',JSON.stringify(response))
          .then(() => {
            this
            .navCtrl
            .setRoot(LandingPage);
          })
      })
    
  }

  gotoLandingIfLoginExists(){
    this
    .navCtrl
    .setRoot(LandingPage);
  }

} //end class