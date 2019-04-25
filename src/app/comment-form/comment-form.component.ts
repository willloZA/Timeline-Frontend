import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Output() commented = new EventEmitter<string>();

  newComment: string;

  constructor() { }

  ngOnInit() {
  }

  comment(form: NgForm): void {

    // check for valid input via form instead of regex
    if (this.newComment && this.newComment.trim() !== '') {
      this.commented.emit(this.newComment);
      // use Post Service comment method to update server and client's data
      // console.log(`comment form emitted "${this.newComment}"`);
      form.resetForm();
      // this.newComment = undefined;
    }
  }

}
