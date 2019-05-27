import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  alert: { type: string, message: string };
  submitted = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  get f() { return this.loginForm.controls; }

  // attempt login with current values
  onLoginSubmit() {
    // display validation errors if any
    this.submitted = true;
    // return if invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      //
      this.submitted = true;
      this.authService.login(this.loginForm.value)
        .then((resp: string) => {
          this.submitted = false;
          // reset form and display message on success
          this.loginForm.reset();
          this.alert = { type: 'success', message: resp };
          this.cdr.detectChanges();
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
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email     : ['', [Validators.required, Validators.email]],
      password  : ['', [Validators.required, Validators.minLength(6)]]
    });
  }

}
