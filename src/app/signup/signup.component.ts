import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.createForm()
  }

  createForm(): void {
    this.signupForm = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName  : ['', Validators.required],
      email     : ['', Validators.required],
      password  : ['', Validators.required]
    })
  }

  onSignupSubmit(): void {
    console.log(this.signupForm);
  }

  ngOnInit() {
  }

}
