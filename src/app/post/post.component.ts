import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  enabledComments: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleComments(): void {
    this.enabledComments = !this.enabledComments;
  }

}
