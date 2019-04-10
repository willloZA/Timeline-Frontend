import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { 
    this.createForm()
  }

  createForm() {
    this.signupForm = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName  : ['', Validators.required],
      email     : ['', Validators.required],
      password  : ['', Validators.required]
    })
  }

  onSignupSubmit() {
    this.authService.registerUser(this.signupForm.value)
      .subscribe((data) => {
        console.log(data);
      });
    console.log(this.signupForm.value);
    this.signupForm.reset();
  }

  ngOnInit() {
  }

}
