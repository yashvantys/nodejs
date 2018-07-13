import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  userName: string
  TOKEN_KEY = 'token'
  constructor(private router: Router) { }

  ngOnInit() {
    //console.log(localStorage.getItem('token'))
  }

  userLogout(){
        localStorage.clear()
        localStorage.removeItem(this.TOKEN_KEY)
        this.router.navigate(['']);
  }

}
