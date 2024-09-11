import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddItemComponent } from './add-item/add-item.component';
import { HeaderComponent } from './header/header.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AlertComponent } from './alert/alert.component';
import { JwtInterceptor } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    HeaderComponent,
    ListItemsComponent,
    WelcomeComponent,
    LoginComponent,
    SignupComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule 
  ],
  providers: [
    provideHttpClient(),
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
