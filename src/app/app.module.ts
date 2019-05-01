import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ISailsClientConfig, SailsClientModule } from 'ngx-sails';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PostComponent } from './post/post.component';
import { PostFormComponent } from './post-form/post-form.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './auth.service';
import { LoginFormComponent } from './login-form/login-form.component';

const socketConfig: ISailsClientConfig = { uri: 'http://localhost:1337' };

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TimelineComponent,
    PostComponent,
    PostFormComponent,
    CommentComponent,
    CommentFormComponent,
    SignupComponent,
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SailsClientModule.configureClient(socketConfig)
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
