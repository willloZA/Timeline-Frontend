import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from './post/post.component';
import { PostFormComponent } from './post-form/post-form.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TimelineComponent,
    ProfileComponent,
    PostComponent,
    PostFormComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
