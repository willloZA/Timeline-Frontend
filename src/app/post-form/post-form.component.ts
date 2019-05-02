import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent {

  @Output() posted = new EventEmitter<string>();
  newPost: string;

  constructor() { }

  // emit newPost to parent timeline component
  post(): void {
    // test for empty post entry
    if (this.newPost && this.newPost.trim() !== '') {
      this.posted.emit(this.newPost);
      // console.log(`Post: \n"${this.newPost}"`);
      this.newPost = undefined;
    }
  }

}
