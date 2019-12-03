import { Component, OnInit,Input } from '@angular/core';
import {Router} from '@angular/router';
import * as $ from "jquery";
declare var $: any;
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  user_details:any = {};
  action:string;
  
  constructor(private router: Router) {}

  ngOnInit() {
   
    let user_Data = JSON.parse(sessionStorage.getItem('login_details'));
    let user_Account = JSON.parse(sessionStorage.getItem('userAccount'));
    console.log(user_Data)
    console.log(user_Account)
      if(user_Data){
        this.user_details = user_Data.SocialLogin;
        $("#loginModal").modal('hide');
      }else if(user_Account){
        this.user_details = user_Account;
        $("#loginModal").modal('hide');
      }
  }
  signIn_signUp(){
    $("#loginModal").modal('show');
  }
  logout(){
    sessionStorage.removeItem('login_details');
    sessionStorage.removeItem('userAccount');
    this.user_details = {};
    this.router.navigate(['/']);
  }
}