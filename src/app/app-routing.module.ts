import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  {path: '', redirectTo: '/timeline', pathMatch: 'full'},
  {path: 'timeline', component: TimelineComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
