import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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

  comment(): void {
    // check for valid input via form instead of regex
    if (this.newComment && this.newComment.trim() !== '') {
      this.commented.emit(this.newComment);
      this.newComment = undefined;
    }
  }

}
