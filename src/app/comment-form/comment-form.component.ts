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
    // form input would probably be easier though form styling is taking a while for such simple input
    if (this.newComment && this.newComment.replace(/\s/g, '').length) {
      this.commented.emit(this.newComment);
      // use Post Service comment method to update server and client's data
      console.log(`comment form emitted $(this.newComment)`)
    }
  }

}
