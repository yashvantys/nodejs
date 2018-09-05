import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule,  ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './/app-routing.module'
import { LoginComponent } from './login/login.component'
import { ApiService } from './api.service'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpModule } from '@angular/http'
import { DashboardComponent } from './dashboard/dashboard.component'
import { AdminHeaderComponent } from './_layout/admin-header/admin-header.component'
import { AdminFooterComponent } from './_layout/admin-footer/admin-footer.component'
import { AdminLayoutComponent } from './_layout/admin-layout/admin-layout.component'
import { UsersComponent } from './users/users.component'
import { DataTablesModule } from 'angular-datatables'
import { UsersService } from './services/users.service'
import { ContentsService } from './services/contents.service'
import { ContentComponent } from './content/content.component'
import { AuthInterceptorService} from './authInterceptor.service'
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { HeaderComponent } from './_layout/front/header/header.component';
import { FooterComponent } from './_layout/front/footer/footer.component';
import { MainLayoutComponent } from './_layout/front/main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services/services.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminLayoutComponent,
    UsersComponent,
    ContentComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ServicesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    DataTablesModule,
    FroalaEditorModule,
    FroalaViewModule
  ],
  providers: [ApiService, AuthService, AuthGuard, UsersService, ContentsService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
