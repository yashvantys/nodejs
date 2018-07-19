import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/map'
import 'rxjs/Rx'

@Injectable()
export class UsersService {
    path = environment.path + '/users'
    constructor(private http: HttpClient){}   
    
    getUsers(){
        /*return this.http.get<any>(this.path ).map(res => {
           return res.json()            
        },error =>{
            return false
        })*/
        const response = this.http.get(this.path ).map(res => res)
        return response
    }
    addUsers(userData){
        return this.http.post<any>(this.path + '/addUser', userData).map(res => {
            return res
        },error =>{
           console.log("error:"+ error)
           return error
        })
    }

    updateUsers(userData, userId){
        if(userData.newpassword != null)
            userData.password = userData.newpassword
        return this.http.post<any>(this.path + '/updateUser/'+userId, userData).map(res => {
            return res
        },error =>{
           console.log("error:"+ error)
           return error
        })
    }

    deleteUser(userId){
        //console.log("user service called:" +userId)
        return this.http.delete<any>(this.path + '/deleteUser/'+userId).map(res => {
            return res
        },error =>{
           console.log("error:"+ error)
           return error
        })
    }

    
}
