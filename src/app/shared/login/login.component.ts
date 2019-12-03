import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";
import { AuthenticationService } from "./../../Service/auth.service";
import { SocialUser } from "angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedInLoginProvider
} from "angularx-social-login";
import { AuthService } from "angularx-social-login";
import { Router } from "@angular/router";
import * as $ from "jquery";
import { TranslateService } from 'src/app/Service/translate.service';
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  login: any = {};
  model: any = {};
  user: SocialUser;
  loggedIn: boolean;
  email: string;
  firstname: string;
  lastname: string;
  SocialLoginProvider: string;
  SocialLoginToken: string;
  submitted: boolean = false;
  showLogin: boolean;
  show: boolean = false;
  showForgotPassword: boolean;
  email_ErrMsg: any;
  action: string;
  password_field_type="password";
  toggle_eye_and_eyeslash:boolean=true;
  loginData: any;

  socialLogin = {
    "SocialSignIn_Input": {
      "email": "",
      "firstname": "",
      "lastname": "",
      "SocialLoginProvider": "",
      "SocialLoginToken": ""
    }
  };
  constructor(
    private authservice: AuthenticationService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private transdata: TranslateService
  ) { }

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      this.user = user;
      this.loggedIn = user != null;
    });

    this.loginForm = this.formBuilder.group({
      Email: ["", [Validators.required, Validators.email]],
      Password: ["", [Validators.required]]
    });


    $(".toggle-password").click(function () {
      $(this).toggleClass("fa-eye fa-eye-slash");
      var input = $($(this).attr("toggle"));
      if (input.attr("type") == "password") {
        input.attr("type", "text");
      } else {
        input.attr("type", "Password");
      }
    });
  }
  //Get form control instance
  get login_form() {
  
    return this.loginForm.controls;
  }
  //Method to show and hide password
  showHidePassword(){
    if(this.password_field_type ==="password"){
      this.password_field_type= 'text';
      this.toggle_eye_and_eyeslash=false;
    }else if(this.password_field_type ==="text") {
     this.password_field_type= 'password';
     this.toggle_eye_and_eyeslash=true;
    }
  }
  // Method to do login and and call other API after login
  login_user() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    let LoginItineraryUser_Input = {};
    let GetItineraryList_Input = {};
    let LoginUser_Input = {};
    this.loginForm.value.ForgotPasswordLink = "";
    LoginUser_Input = { LoginUser_Input: this.loginForm.value };
    this.authservice.loginUser(LoginUser_Input).subscribe(data => {
      if (data) {
        this.loginData = data;
        sessionStorage.setItem("login_details", JSON.stringify(data));
        sessionStorage.setItem("isLoggedIn", data.LoginUser.login);
        sessionStorage.setItem("Token", data.LoginUser.Token);

        if (data.LoginUser.login != "false") {
          this.getsessionMapping();
         this.getloginItineraryUser(this.loginData.LoginUser.UserId);

        } else {
          alert(this.transdata.data.AUTHENTICATION_ERROR_9);
        }
      }
    },
      error => {
        this.email_ErrMsg = error.error;
        alert(this.email_ErrMsg);
      }
    );
  }
  //Social Login Methods
  signInWithGoogle(): void {
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      if (x) {
        this.socialLogin = {
          "SocialSignIn_Input": {
            "email": x.email,
            "firstname": x.firstName,
            "lastname": x.lastName,
            "SocialLoginProvider": x.provider,
            "SocialLoginToken": x.authToken
          }
        };

        this.authservice.SocialLogin(this.socialLogin).subscribe(data => {
          if (data) {
            this.loginData = data;
            sessionStorage.setItem("login_details", JSON.stringify(data));
            sessionStorage.setItem("isLoggedIn", data.LoginUser.login);
            sessionStorage.setItem("Token", data.LoginUser.Token);
    
            if (data.LoginUser.login != "false") {
              this.getsessionMapping();
             this.getloginItineraryUser(data.LoginUser.UserId);
    
            } else {
              alert("Google!!");
            }
          }
        },
          error => {
            alert('general error');
          });
      }
    });

  }

  signInWithFB(): void {
    this.auth.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      if (x) {
        this.socialLogin = {
          "SocialSignIn_Input": {
            "email": x['facebook'].email,
            "firstname": x['facebook'].first_name,
            "lastname": x['facebook'].last_name,
            "SocialLoginProvider": "facebook",
            "SocialLoginToken": x.authToken
          }
        };
        this.authservice.SocialLogin(this.socialLogin).subscribe(data => {
          if (data) {
            this.loginData = data;
            sessionStorage.setItem("login_details", JSON.stringify(data));
            sessionStorage.setItem("isLoggedIn", data.LoginUser.Login);
            sessionStorage.setItem("Token", data.LoginUser.Token);
    
            if (data.LoginUser.login != "false") {
              this.getsessionMapping();
             this.getloginItineraryUser(data.LoginUser.UserId);
    
            } else {
              alert("Facebook!!");
            }
          }
        },
          error => {
            alert('general error');
          });
      }
    });

  }

  getsessionMapping() {
    this.authservice.sessionMapping().subscribe(session => {
      if (session) {
      }
    });
  }
getloginItineraryUser(UserId){
 const LoginItineraryUser_Input = {
    LoginItineraryUser_Input: {
      customerCode: "ONWIBE2",
      lang: "EN",
      userName: UserId,
      password: "ghf56hjgjghfhgf7fhfgh"
    }
  };

  this.authservice.loginItineraryUser(LoginItineraryUser_Input).subscribe(response => {
    if (response.LoginItineraryUser_Output.userKeyId) {
    const GetItineraryList_Input = {
        GetItineraryList_Input: {
          customerCode: "ONWIBE2",
          lang: "EN",
          userName: UserId,
          userKeyId: response.LoginItineraryUser_Output.userKeyId
        }
      };
      this.authservice.getItineraryList(GetItineraryList_Input).subscribe(output => {
        if (output.GetItineraryList_Output) {
          if (output.GetItineraryList_Output.count) {
            //alert("Few itineraries are save for this user");
            sessionStorage.setItem("login_details", JSON.stringify(this.loginData));
            window.location.reload();
            $("#loginModal").modal("hide");
            this.router.navigate(["/"]);
          }
        } else {
          if (output.registration["error"]) {
            if (output.registration["error"].code === "5005") {
              //alert("Any itineraries are not saved for this user");
              sessionStorage.setItem("login_details", JSON.stringify(this.loginData));
              window.location.reload();
              $("#loginModal").modal("hide");
              this.router.navigate(["/"]);
            }
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
  /*  signInWithLinkedIn(): void {
    alert('working............');
    this.auth.signIn(LinkedInLoginProvider.PROVIDER_ID).then(x =>  {
      if(x){
        console.log(x);
        this.Email = x.email;
       this.FirstName = x.firstName;
       this.LastName = x.lastName;
       this.authService.signUp_email(this.Email, this.FirstName, this.LastName).subscribe(data => {
        if(data){
          this.router.navigate(['home']);
        }
      },
      error => {
        alert('general error');
      });
      }
    });
  } */
  //Methods to change layout from login to signup and via-versa
  changeLayout() {
    this.showLogin = !this.showLogin;
  }
  changeLoginForm(event) {
    this.showLogin = event;
  }

  //Methods to change layout from login to forgot password and via-versa
  changeModal() {
    this.showForgotPassword = !this.showForgotPassword;
  }
  changeForgotPassowrdForm(event) {
    this.showForgotPassword = event;
  }
}
