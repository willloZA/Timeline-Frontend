import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { 
    this.createForm()
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email     : ['', Validators.required],
      password  : ['', Validators.required]
    })
  }

  onLoginSubmit() {
    this.authService.login(this.loginForm.value)
      .subscribe((data) => {
        console.log(data);
      });
    console.log(this.loginForm.value);
    this.loginForm.reset();
  }
  ngOnInit() {
  }

}
