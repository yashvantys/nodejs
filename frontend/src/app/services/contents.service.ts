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

    addContent(contentData){
        return this.http.post<any>(this.path + '/addContent', contentData).map(res => {
            return res
        },error =>{
           console.log("error:"+ error)
           return error
        })
    }

    updateContent(contentData, contentId){
       
        return this.http.post<any>(this.path + '/updateContent/'+contentId, contentData).map(res => {
            return res
        },error =>{
           console.log("error:"+ error)
           return error
        })
    }

    deleteContent(contentId, flag){
        
        return this.http.delete<any>(this.path + '/deleteContent/'+contentId+'/'+flag).map(res => {
            return res
        },error =>{
           console.log("error:"+ error)
           return error
        })
    }
       
}