import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    path = environment.path + '/auth'

    TOKEN_KEY = 'token'

    constructor(private http: HttpClient, private router: Router){}

    get token(){
        return localStorage.getItem(this.TOKEN_KEY)
    }

    get isAuthenticated(){
        return !!localStorage.getItem(this.TOKEN_KEY)
    }

    logout(){
       localStorage.removeItem(this.TOKEN_KEY)
    }
    
    loginUser(loginData){
        return this.http.post<any>(this.path + '/login', loginData).map(res => {
            this.saveToken(res.token)
            return true            
        },error =>{
            return false
        })
    }

    saveToken(token){
        localStorage.setItem(this.TOKEN_KEY, token)
    }
}
