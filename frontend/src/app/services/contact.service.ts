import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

@Injectable()
export class ContactService {
    path = environment.path + '/contact'
    constructor(private http: HttpClient) { }

    sendEmail(formData) {
        return this.http.post<any>(this.path + '/sendEmail', formData).map(res => {
            return res;
        }, error => {
            return error
        });
    }

}