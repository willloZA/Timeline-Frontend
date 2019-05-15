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
    this.authService.login(this.loginForm.value)
      .then((resp: string) => {
        // reset form and display message on success
        this.loginForm.reset();
        this.alert = { type: 'success', message: resp };
        setTimeout(() => {
          this.alert = undefined;
          // redirect to timeline
          this.router.navigate(['/timeline']);
        }, 1000);
      })
      .catch((err) => {
        // alert for either invalid email/password or http error
        if (err.error) {
          this.alert = { type: 'danger', message: err.error };
        } else {
          this.alert = { type: 'danger', message: `${err.status}, please try again` };
        }

        setTimeout(() => this.alert = undefined, 5000);
      });
  }
  ngOnInit() {
  }

}
