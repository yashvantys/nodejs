import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  passwordRegex: any = /^(?=.{8,32}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/
  loginData = {} 
  error:boolean = false;
  constructor(private loginFormBuilder: FormBuilder, private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.loginFormBuilder.group({
        email: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        password: ['', [ Validators.required]]
    })
  }

  login(){
     this.authservice.loginUser(this.loginForm.value)
     .subscribe(
      data => {
        this.router.navigate(['/admin/dashboard'])
      },
      error => {
         this.error = true
      });
  }

}
