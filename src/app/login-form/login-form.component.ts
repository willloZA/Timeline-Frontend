import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  alert: { type: string, message: string };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email     : ['', Validators.required],
      password  : ['', Validators.required]
    });
  }

  // attempt login with current values
  onLoginSubmit() {
    this.authService.login(this.loginForm.value, (resp) => {
      if (resp === 'logged in') {
        // reset form and display message on success
        this.loginForm.reset();
        this.alert = { type: 'success', message: 'Successful login' };
        setTimeout(() => {
          this.alert = undefined;
          // redirect to timeline
          this.router.navigate(['/timeline']);
        }, 1000);
      } else {
        // alert for either invalid email/password or http error
        if (resp.error) {
          this.alert = { type: 'danger', message: resp.error };
        } else {
          this.alert = { type: 'danger', message: `${resp.status}, please try again` };
        }

        setTimeout(() => this.alert = undefined, 5000);
      }
    });
  }
  ngOnInit() {
  }

}
