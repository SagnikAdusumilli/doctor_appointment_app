import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { User } from './user.model';
import { ErrorService } from '../errors/error.service';

@Injectable()
export class AuthService {
    // private BE_URL = 'http://localhost:3000/';
    private BE_URL = 'https://message-app-2.herokuapp.com/';
    constructor(private http: Http, private errorService: ErrorService) {}

    public signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.BE_URL + 'user', body, {headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    public signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(this.BE_URL + 'user/signin', body, {headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    public logout() {
        localStorage.clear();
    }

    public isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}
