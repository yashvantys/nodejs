import { Component, OnInit } from '@angular/core'
import { DataTablesModule } from 'angular-datatables'
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { UsersService } from '../services/users.service'
import { Observable } from 'rxjs/Observable'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ajaxDelete } from 'rxjs/observable/dom/AjaxObservable'
import { Http } from '@angular/http'
import * as decode from 'jwt-decode'
declare var bootbox:any
class UsersData {
  _id: string
  first_name: string
  last_name: string
  email: string
  role: string
}
class DataTablesResponse {
  data: any[]
  draw: number
  recordsFiltered: number
  recordsTotal: number
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  dtOptions: DataTables.Settings = {}
  path = environment.path 
  error:boolean = false
  usersdata:  UsersData[]  
  dataTable: any
  userForm: FormGroup
  userId: string = null
  firstName: string = null
  lastName: string = null
  userEmail: string = null
  userRole: string = null
  loggedInUserId: string = null
  loggedInUserRole: string = null 

  constructor(private http: HttpClient, private usersservice: UsersService, private userFormBuilder: FormBuilder) {}

  ngOnInit() {
      const token = localStorage.getItem('token');
      const tokenPayload = decode(token)
      this.loggedInUserId = tokenPayload.sub
      this.loggedInUserRole = tokenPayload.userRole
      this.userRole = ""
      this.ajaxList(this.loggedInUserId, this.loggedInUserRole)
      this.userForm = this.userFormBuilder.group({
        user_id:[''],
        first_name:['', [ Validators.required]],
        last_name: ['', Validators.required],
        email: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        password: ['', [ Validators.required]],
        newpassword:[''],
        conformpassword:[''],
        role:['', Validators.required]       
        },   
        {validator: this.matchingPasswords('newpassword', 'conformpassword')}      
      ) 
  
    
  this.userForm.get('user_id').valueChanges.subscribe((user_id:string)=>{
        if(user_id != null){
            this.userForm.get("password").setValidators(null)
        }else{
            this.userForm.get("password").setValidators([Validators.required])
        }
          this.userForm.get('password').updateValueAndValidity()
    })
    
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {    
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey]
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        }
      }
    }
  }
    
  ajaxList(loggedInUserId, loggedInUserRole){
        this.dtOptions = {
              responsive: true,
              pageLength:10,
              lengthChange:false,
              serverSide: true,
              processing: true,
              searching: true,                
              "language": {
                "emptyTable": "No data available in Users",
                "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
              },
             order : [[2, 'asc']],           
            ajax: (dataTablesParameters: any, callback) => {
                this.http
                    .post<DataTablesResponse>(this.path+ '/users', dataTablesParameters)
                    .map((resp: any) => resp)
                    .subscribe((resp: any) => {
                        this.usersdata = resp.users                                                                       
                        callback({
                            recordsTotal: resp.recordsTotal,
                            recordsFiltered: resp.recordsTotal,
                            data: this.usersdata,
                        })
                    })
            },
            columns: [
                { data: "first_name" },
                { data: "last_name" },
                { data: "email" },
                {
                  data: null, render: function (data, type, row) {
                      var html = ''
                      if(loggedInUserId == data._id ){
                            html = '<button type="button" class="btn btn-primary editbutton" users-id="${data._id}" users-first-name="${data.first_name}" users-last-name="${data.last_name}" users-email="${data.email}" users-role="${data.role}">Edit</button>'
                      }else{
                          if(loggedInUserRole == 'Admin')
                            html = `<button type="button" class="btn btn-primary editbutton" users-id="${data._id}" users-first-name="${data.first_name}" users-last-name="${data.last_name}" users-email="${data.email}" users-role="${data.role}">Edit</button>
                                    <button type="button" class="btn btn-danger deletebutton" users-id="${data._id}">Delete</button>`                            
                      }
                      return html
                  },
                  "orderable": false
              }
            ],
        }

        document.querySelector('body').addEventListener('click', (event)=> {
            let target = <Element>event.target; // Cast EventTarget into an Element
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('editbutton')) {
                  this.userId = target.getAttribute('users-id')
                  this.firstName = target.getAttribute('users-first-name')
                  this.lastName = target.getAttribute('users-last-name')
                  this.userEmail = target.getAttribute('users-email');
                  this.userRole = target.getAttribute('users-role'); 
                  (<any>$('#user-add')).modal('show')
            }
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('closeForm')) {
                  this.userForm.reset()
            }
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('close')) {
                  this.userForm.reset()
            }
            if (target.tagName.toLowerCase() == 'button' && $(target).hasClass('deletebutton')) {
                  let userId = target.getAttribute('users-id');
                  bootbox.confirm("Are you sure want to delete?", (result)=> {
                      if(result){
                            this.usersservice.deleteUser(userId)
                              .subscribe(res => {
                                if(res['statusCode'] == 200) {
                                  $('#ajaxResults').addClass('alert alert-success').html('User deleted successfully') ;
                                    setTimeout(function() {
                                         $('#ajaxResults').removeClass('alert alert-success').html('');
                                       }, 2000);
                                  var table = $('#users-list').DataTable();
                                  table.ajax.reload(null, false);
                                }
                          }, err => {
                            $('#ajaxResults').addClass('alert alert-danger').html('Sorry for the inconvenience. Please try again later.') ;
                            setTimeout(function() {
                                 $('#ajaxResults').removeClass('alert alert-danger').html('');
                               }, 2000);            
                          });
                       }
                  })
            }
        })
               
    }

    saveDetails(){
      let userId = this.userForm.value.user_id
      if(userId != null){
        //console.log("inside component:" + userId)
          this.usersservice.updateUsers(this.userForm.value, userId)
          .subscribe( response => {
            if(response['statusCode'] == 200) {
            this.userForm.reset();
            (<any>$('#user-add')).modal('hide')
            $('#ajaxResults').addClass('alert alert-success').html('User updated successfully') 
              setTimeout(function() {
                  $('#ajaxResults').removeClass('alert alert-success').html('')
                }, 2000);
            var table = $('#users-list').DataTable()
            table.ajax.reload(null, false);
          }
        },
        error => {
          this.error = true
        })
      }else{
        this.usersservice.addUsers(this.userForm.value)
        .subscribe(
          response => {
              if(response['statusCode'] == 200) {
              this.userForm.reset();
              (<any>$('#user-add')).modal('hide')
              $('#ajaxResults').addClass('alert alert-success').html('User added successfully') 
                setTimeout(function() {
                    $('#ajaxResults').removeClass('alert alert-success').html('')
                  }, 2000);
              var table = $('#users-list').DataTable()
              table.ajax.reload(null, false);
            }
          },
          error => {
            this.error = true
          })
      } 
     
    }   
    
}
