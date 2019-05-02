import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  alert: { type: string, message: string };
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { 
    this.createForm();
  }

  createForm() {
    this.signupForm = this.formBuilder.group({
      firstName : ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      lastName  : ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      email     : ['', [Validators.required, Validators.email]],
      password  : ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get firstName() { return this.signupForm.get('firstName'); }

  get lastName() { return this.signupForm.get('lastName'); }

  get email() { return this.signupForm.get('email'); }

  get password() { return this.signupForm.get('password'); }

  onSignupSubmit() {
    // display validation errors if any
    this.submitted = true;
    // return if invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      this.authService.registerUser(this.signupForm.value, (resp) => {
        // console.log(resp);
        if (resp === 'Signup successful') {
          // prevent validation errors on form reset on successful signup
          this.submitted = false;
          this.signupForm.reset();
          this.alert = { type: 'success', message: 'Successful Signup' };
          setTimeout(() => {
            this.alert = undefined;
            this.router.navigate(['/timeline']);
          }, 1000);
        } else {
          // alert for either invalid email/password or http error
          if (resp.error) {
            this.alert = { type: 'danger', message: resp.error.details };
          } else {
            this.alert = { type: 'danger', message: `${resp.status}, please try again` };
          }
          // remove alert after 5 seconds
          setTimeout(() => this.alert = undefined, 5000);
        }
      });
    }
  }

  ngOnInit() {
  }

}