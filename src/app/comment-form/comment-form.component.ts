import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  @Output() commented = new EventEmitter<String>();

  newComment: String;

  constructor() { }

  ngOnInit() {
  }

  comment(): void {
    // check for valid input via form instead of regex
    if (this.newComment && this.newComment.replace(/\s/g, '').length) {
      this.commented.emit(this.newComment);
      // use Post Service comment method to update server and client's data
      console.log(`comment form emitted "${this.newComment}"`)
      this.newComment = undefined;
    }
  }

}
