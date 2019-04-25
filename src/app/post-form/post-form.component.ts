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

  post(): void {
    if (this.newPost && this.newPost.trim() !== '') {
      this.posted.emit(this.newPost);
      console.log(`Post: \n"${this.newPost}"`);
      this.newPost = undefined;
    }
  }

}
