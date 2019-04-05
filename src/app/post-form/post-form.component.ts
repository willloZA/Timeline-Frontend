import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  newPost: String;

  constructor() { }

  ngOnInit() {
  }

  post(): void {
    if (this.newPost && this.newPost.replace(/\s/g, '').length) {
      // use Post Service post method to update server and client's data
      console.log(`Post: \n"${this.newPost}"`)
      this.newPost = undefined;
    }
  }

}
