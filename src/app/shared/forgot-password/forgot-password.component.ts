import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,Validators,AbstractControl} from "@angular/forms";
import { AuthenticationService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from 'src/app/Service/translate.service';
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  showForgotPassword:boolean;
  submitted: boolean=false;
  @Output() changeForgotPassowrdForm = new EventEmitter<boolean>();
  
  constructor( private formBuilder: FormBuilder,private authservice: AuthenticationService, private router: Router,private transdata: TranslateService) { }

  ngOnInit(){
    this.forgotPasswordForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
  //get control instance of form
  get forgot_password_form() {
    return this.forgotPasswordForm.controls;
  }
  //Method to change layout from login dialog to forgot password dialog 
  changeModal(){
    this.showForgotPassword=false;
    this.changeForgotPassowrdForm.emit(this.showForgotPassword)
  }
  submitEmail(){
    this.submitted = true;
    if (this.forgotPasswordForm.invalid){
      return;
    }
    this.forgotPasswordForm.value.ForgotPasswordLink="";
    this.forgotPasswordForm.value.password="";
    let LoginUser_Input = {};
    LoginUser_Input={LoginUser_Input:this.forgotPasswordForm.value};
    this.authservice.forgotPassword(LoginUser_Input).subscribe(data => {
      if(data.ForgotPassword.ErrorCode==='EmailDoesNotExist'){
        alert(this.transdata.data.AUTHENTICATION_ERROR_8);
      }else if(data.ForgotPassword.Status==='Sent'){
        alert(this.transdata.data.FORGOT_PASS_SUCCESS_TEXT);
        $("#loginModal").modal("hide");
        this.router.navigate(["/"]);
      }
    });
  }
}
