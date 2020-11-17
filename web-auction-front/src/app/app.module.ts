import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SiteFrameworkModule} from './site-framework/site-framework.module';
import {LoginComponent} from './welcome/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { RegisterComponent } from './welcome/register/register.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SiteFrameworkModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    providers: [],
    exports: []
    ,
    bootstrap: [AppComponent]
})
export class AppModule {
}
