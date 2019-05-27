import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { notEmptyValidator } from '../not-empty.validator';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent {

  @Output() posted = new EventEmitter<string>();
  submitted = false;
  newPost = new FormControl('', notEmptyValidator);

  constructor() { }

  // emit newPost to parent timeline component
  post(): void {
    this.submitted = true;
    if (this.newPost.valid) {
      this.posted.emit(this.newPost.value);
      this.submitted = false;
      this.newPost.setValue('');
    } else {
      setTimeout(() => {
        this.submitted = false;
      }, 5000);
    }
  }

}
