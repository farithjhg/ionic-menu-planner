import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import { AlertController, LoadingController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit{
  public error : string;
  public logo : string = "assets/imgs/logo.png";
  email : string;
  password: string;
  rootPage:any;

  constructor(public loadingCtrl: LoadingController, 
              public navCtrl: NavController,
              private dataService : DataService,
              public alertCtrl: AlertController) {

  }


  ngOnInit() {
          localStorage.setItem('user', null);
          localStorage.setItem('token', null);
          localStorage.setItem('expires_in', null);
  }

  login() {
    let loading = this.loadingCtrl.create({content: 'Loading...'});
    loading.present();
    this.dataService.login(this.email, this.password).subscribe(
      response => {
        let token = response.access_token;
        if(token != null){
          localStorage.setItem('user', this.email);
          localStorage.setItem('token', response.access_token);
          var expires_in : number = <number>response.expires_in;
          var milisec : number = Math.round(new Date().getTime()/1000.0) + expires_in;
          
          localStorage.setItem('expires_in', milisec+"");
          this.navCtrl.setRoot(HomePage);
        }
      },
      error => {
        console.log(error._body);
        if (error._body instanceof ProgressEvent ) {
          console.log("ProgressEvent");
          
          this.error = 'Error: Services are down!';
        }else{
          let errorObj : MyError = JSON.parse(error._body.toString());
          this.error = errorObj.error+' ['+errorObj.error_description+']';
          console.log(this.error);
       }

        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: this.error,
          buttons: ['OK']
        });
    alert.present();

      });
      loading.dismiss();


  }

}

interface MyError {
    error: string;
    error_description: string;
}