import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DaylyMenu} from '../../model/DaylyMenu';
import {DataService} from '../../services/data.service';
import { AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  rootPage:any;
  error : string;
  dayList : DaylyMenu[];
  authToken : string;
  loading : any;
  constructor(public loadingCtrl: LoadingController, 
      public navCtrl: NavController, public alertCtrl: AlertController, 
      private dataService : DataService) {

  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading ...',
      duration: 2500,
      dismissOnPageChange: true
    }).present();
  }

  ngOnInit() {
    this.getMenu(null)
  }

  getMenu(refresher){
    let loading = this.loadingCtrl.create({content: 'Loading...'});
    loading.present();
    this.dataService.getMenu().subscribe(
                       response => {
                         this.dayList = response;
                         loading.dismiss();
                         if(refresher!=null)
                           refresher.complete();
                       },
                       error => {
                         this.error = error._body;
                         let errorObj : TokenError = JSON.parse(error._body.toString());
                         loading.dismiss();
                        if(errorObj.error == 'invalid_token'){
                          //this.navCtrl.push(LoginPage);
                         this.navCtrl.setRoot(LoginPage);
                        }else{
                          let alert = this.alertCtrl.create({
                              title: errorObj.error,
                              subTitle: errorObj.error_description,
                              buttons: ['OK']
                            });
                          alert.present();
                        }
                       }
                     );   
  }
  
}

interface TokenError{
  error : string;
  error_description : string;
}