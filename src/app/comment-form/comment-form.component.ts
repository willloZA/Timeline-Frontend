import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { notEmptyValidator } from '../not-empty.validator';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormComponent implements OnInit {

  @Output() commented = new EventEmitter<string>();
  submitted = false;
  newComment = new FormControl('', notEmptyValidator);

  constructor() { }

  ngOnInit() {
  }

  // emit newComment to parent post component
  comment(): void {
    this.submitted = true;
    if (this.newComment.valid) {
      this.commented.emit(this.newComment.value);
      this.submitted = false;
      this.newComment.setValue('');
    } else {
      setTimeout(() => {
        this.submitted = false;
      }, 5000);
    }
  }

}
