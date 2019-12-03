import { Component, OnInit } from "@angular/core";
import {FormBuilder,FormGroup,Validators,AbstractControl} from "@angular/forms";
import { AuthenticationService } from "./../../Service/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MustMatch } from './../../_helpers/mush-match.validator';

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.less"]
})
export class ResetPasswordComponent implements OnInit {
  setPasswordForm: FormGroup;
  submitted: boolean = false;
  cnfPassword: string;
  confirmPassword = false;
  linkKey: string;
  email_ErrMsg: any;

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.setPasswordForm = this.formBuilder.group({
      password: ["", [Validators.required, Validators.minLength(7)]],
      confirm_password: ["", Validators.required]
    },
    {
      validator: MustMatch('password', 'confirm_password')
    }
    );
    //Catch reset password link
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.Linkkey) {
        this.linkKey = params.Linkkey;
        this.validateHashLink(params.Linkkey);
      } else {
      }
    });
  }
  //Method to validate reset password link
  validateHashLink(key) {
    let LoginUser_Input = {};
    LoginUser_Input = {
      LoginUser_Input: {
        email: "renuk@zen3.co.uk",
        password: "",
        ForgotPasswordLink: this.linkKey
      }
    };
    this.authservice.validateresetPasswordLink(LoginUser_Input).subscribe(data => {
      if (data["ValidatePasswordResetLink"].Status === "Validated") {
      
      }else if (data["Error"]) {
        alert("Acivation link is invalid");
        this.router.navigate(["/"]);
      }
    },
      error => {
        this.email_ErrMsg = error.error;
        alert(error.error);
      });
    }

  // convenience getter for easy access to form fields
  get reset_password_form() {
    return this.setPasswordForm.controls;
  }

  //Method to reset password
  submitPassword(){
    this.submitted = true;
    if(this.setPasswordForm.invalid){
      return;
    }else{
   /*this.setPasswordForm.value.email = "renuk@clickwt.com"; */
      this.setPasswordForm.value.ForgotPasswordLink = this.linkKey;
      let LoginUser_Input = {};
      LoginUser_Input = {
        LoginUser_Input: {
          email: "",
          password: this.setPasswordForm.value.password,
          ForgotPasswordLink: this.setPasswordForm.value.ForgotPasswordLink
        }
      };
      this.authservice.resetPassword(LoginUser_Input).subscribe(data => {
        if(data['ResetPasswordResponse'].ErrorCode==='PasswordSameAsPrevious')
        {
          alert("New password must not match previous password");
        }
        else if(data['ResetPasswordResponse'].ErrorCode==='success'){
          alert("Your password for renuk@clickwt.com account has been successfully set");
          this.router.navigate(["/"]);
        }
      });
    } 
  }
}
