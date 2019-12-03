import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {FormBuilder,FormGroup,Validators,AbstractControl} from "@angular/forms";
import { AuthenticationService } from "./../../Service/auth.service";
import { MustMatch } from "./../../_helpers/mush-match.validator";
import { Router } from "@angular/router";
import { TranslateService } from 'src/app/Service/translate.service';
import * as $ from "jquery";
declare var $: any;

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.less"]
})
export class SignUpComponent implements OnInit {
  cnfPassword: string;
  registerForm: FormGroup;
  submitted = false;
  confirmPassword = false;
  email_ErrMsg: string;
  showLogin: boolean;
  userId: any;
  @Output() changeLoginForm = new EventEmitter<boolean>();

  constructor(
    private authservice: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private transdata: TranslateService
  ) { }

  ngOnInit() {
    sessionStorage.removeItem("login_details");
    //Sign up page validation
    this.registerForm = this.formBuilder.group(
      {
        firstname: ["",[Validators.required, /* Validators.pattern("[a-zA-Z ]*") */]],
        lastname: ["", [Validators.required, /* Validators.pattern("[a-zA-Z ]*") */]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(7)]],
        passwordsalt: ["", Validators.required],
        usertype: ["", Validators.required]
      },
      {
        validator: MustMatch("password", "passwordsalt")
      }
    );
  }
  // convenience getter for easy access to form fields
  get sign_up_form() {
    return this.registerForm.controls;
  }
  //Method to create new account and call other API after successful signup
  signupUser() {
    this.submitted = true;
    if (this.registerForm.invalid){
      return;
    }else{
      let CreateUserAccount_Input = {};
      let LoginItineraryUser_Input = {};
      let GetItineraryList_Input = {};
      CreateUserAccount_Input = {CreateUserAccount_Input: this.registerForm.value};
      this.authservice.createAcoount(CreateUserAccount_Input).subscribe(data => {
        sessionStorage.setItem("Token", data.UserAccount.SessionToken);
        if(data.UserAccount.Email){
          LoginItineraryUser_Input = {
            LoginItineraryUser_Input: {
              customerCode: "ONWIBE2",
              lang: "EN",
              userName: data.UserAccount.UserId,
              password: "ghf56hjgjghfhgf7fhfgh"
            }
          };
          this.authservice.loginItineraryUser(LoginItineraryUser_Input).subscribe(response => {
            if(response.LoginItineraryUser_Output.userKeyId){
              GetItineraryList_Input = {
                GetItineraryList_Input: {
                  customerCode: "ONWIBE2",
                  lang: "EN",
                  userName: data.UserAccount.UserId,
                  userKeyId: response.LoginItineraryUser_Output.userKeyId
                }
              };
              this.authservice.getItineraryList(GetItineraryList_Input).subscribe(output => {
                if(output.GetItineraryList_Output) {
                  if (output.GetItineraryList_Output.count) {
                    //alert("Any itineraries are not saved for this user");
                    sessionStorage.setItem("userAccount",JSON.stringify(data.UserAccount));
                    window.location.reload();
                    $("#loginModal").modal("hide");
                    this.router.navigate(["/"]);
                  }
                }else if(output.registration["error"]) {
                  if(output.registration["error"].code === "5005"){
                    //alert("Any itineraries are not saved for this user");
                    sessionStorage.setItem("userAccount",JSON.stringify(data.UserAccount));
                    window.location.reload();
                    $("#loginModal").modal("hide");
                    this.router.navigate(["/"]);
                  }
                }
              },
                error => {
                  this.email_ErrMsg = error.error;
                  alert(this.email_ErrMsg);
                }
              );
            }
          },
            error => {
              this.email_ErrMsg = error.error;
              alert(this.email_ErrMsg);
            }
          );
        }
        if (data.UserAccount.ErrorCode === "EmailAlreadyExists") {
          alert(this.transdata.data.AUTHENTICATION_ERROR_11);
        }else if (data.ErrorCode === "PasswordNotValid") {
          alert(this.transdata.data.AUTHENTICATION_ERROR_10);
        }
      },
        error => {
          this.email_ErrMsg = error.error;
          alert(this.email_ErrMsg);
        }
      );
    }
  }
  //Method to change layout from login dialog to signup dialog
  changeLayout() {
    this.showLogin = false;
    this.changeLoginForm.emit(this.showLogin);
  }
}
