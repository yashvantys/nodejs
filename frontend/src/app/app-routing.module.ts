import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'
import { AuthGuard } from './auth.guard'
import { AdminLayoutComponent } from './_layout/admin-layout/admin-layout.component'
import { UsersComponent } from './users/users.component'
import { ContentComponent } from './content/content.component'
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

  //no layout routes

  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent},
  { path: '', redirectTo:'/login', pathMatch:'full'},
  { path: '**', redirectTo: '/login' },
  
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
