import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthGuard } from './auth.guard'
import { AdminLayoutComponent } from './_layout/admin-layout/admin-layout.component'
import { UsersComponent } from './users/users.component'
import { ContentComponent } from './content/content.component'
import { MainLayoutComponent } from './_layout/front/main-layout/main-layout.component'
import { HomeComponent } from './home/home.component'
import { AboutComponent } from './about/about.component'
import { ContactComponent } from './contact/contact.component'
import { ServicesComponent } from './services/services.component'

const routes: Routes = [
  
     //Admin layout routes 
     { 
      path: 'admin', 
      component: AdminLayoutComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
        { path: 'users', component: UsersComponent, pathMatch: 'full', canActivate: [AuthGuard] },
        { path: 'users/ajaxList', component: UsersComponent, pathMatch: 'full', canActivate: [AuthGuard] },
        { path: 'content', component: ContentComponent, pathMatch: 'full', canActivate: [AuthGuard] }              
      ]
  },

  // front layout routes
    { path: 'home', component: MainLayoutComponent,
      children:[
        {path: '', component:HomeComponent, pathMatch: 'full'},
        {path: 'about', component:AboutComponent, pathMatch: 'full'},
        {path: 'contact', component:ContactComponent, pathMatch: 'full'},
        {path: 'services', component:ServicesComponent, pathMatch: 'full'}

      ]
    },
    
  


  //no layout routes

  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent},
  { path: '', redirectTo:'/home', pathMatch:'full'},
  { path: '**', redirectTo: '/home' },
  
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
   exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
