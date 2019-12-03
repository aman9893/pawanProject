import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

//interface
interface  signupEmailData{
  email: string;
  ErrorCode:any;
  ErrorMessage:string;
  Email:string;
  UserAccount:any;
  Token:any;
  Status:any;
  LoginUser:any;
  SocialLogin: any,
  error:any;
  login:boolean;
  UserId:string;
  ForgotPassword:any;
  key:any;
  LoginItineraryUser_Output:any;
  userKeyId:any;
  Params:any;
  registration:any;
  GetItineraryList_Output:any;
  count:any;
}
@Injectable({
  providedIn: "root"
})
export class AuthenticationService {

  Url = environment.baseUrl;
  constructor(private http: HttpClient) {}
  // To send login request
  loginUser(obj) {
    const url = this.Url + `Account/LoginUser`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
  //To send signup request
  createAcoount(obj){
    const url = this.Url + `Account/CreateUserAccount`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
  //Method GetItineraryList
  loginItineraryUser(obj){
    const url = this.Url + `LoginItineraryUser`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
  //Method to send request for forgot password
  forgotPassword(obj){
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set("Authorization", "UniqueSessionToken" + sessionStorage.getItem('UniqueId'));
    const url = this.Url + `Account/ForgotPassword`;
    return this.http.post<signupEmailData>(url, obj, {headers});
  }
  //Method to validate reset password link
  validateresetPasswordLink(obj){
  const url = this.Url + `Account/ValidatePasswordResetLink`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
  //Method to do reset password
  resetPassword(obj){
    const url = this.Url + `Account/ResetPassword`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
  //GetItineraryList
  getItineraryList(obj){
    const url = this.Url + `GetItineraryList`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
  //Method to get session details of user
  sessionMapping(){
    const url = this.Url + `SessionMapping`;
    return this.http.post<signupEmailData>(url,{"action":"Login"}, {});
  }
  // social login
  SocialLogin(obj) {
    const url = this.Url + `Account/SocialSignIn`;
    return this.http.post<signupEmailData>(url, obj, {});
  }
}
