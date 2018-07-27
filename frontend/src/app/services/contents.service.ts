import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/map'
import 'rxjs/Rx'

@Injectable()
export class ContentsService {
    path = environment.path + '/contents'
    constructor(private http: HttpClient){}   
    
    getContents(){        
        const response = this.http.get(this.path ).map(res => res)
        return response
    }
       
}