import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
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
import { SubmitModalComponent } from './submit-modal/submit-modal.component';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { environment } from '../environments/environment';

const socketConfig: ISailsClientConfig = { uri: environment.url };

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
    LoginFormComponent,
    SubmitModalComponent,
    ConfirmDeleteModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbAlertModule,
    SailsClientModule.configureClient(socketConfig)
  ],
  entryComponents: [
    SubmitModalComponent,
    ConfirmDeleteModalComponent
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
