import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { AuthenticationService } from '@/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(/* private authenticationService: AuthenticationService */) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = sessionStorage.getItem('Token');
        const UniqueSessionToken  = sessionStorage.getItem('UniqueId');
        const isLoggedIn =  sessionStorage.getItem('isLoggedIn');
        const isApiUrl = "" //= request.url.startsWith(config.apiUrl);
        if (UniqueSessionToken ||  currentUser) {
            request = request.clone({
                setHeaders: {
                    Token: `${currentUser}`,
                    UniqueSessionToken: `${UniqueSessionToken}`,
                    'Content-Disposition': 'attachment; filename=api.json',
                    'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }else {
            request = request.clone({
                setHeaders: { 
                    'Content-Disposition': 'attachment; filename=api.json',
                    'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }

        return next.handle(request);
    }
}