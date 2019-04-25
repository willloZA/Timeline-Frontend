import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { SailsClient } from 'ngx-sails';
import { TimelineService } from '../timeline.service';
import { Post } from '../post-comment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  posts: Observable<Post[]>;

  constructor(
    public timelineService: TimelineService
  ) {
      /* this.timelineService.getPosts()
        .subscribe((resp: Post[]) => {
          this.posts = resp;
        });
      console.log('timeline constructed', this.posts); */
  }

  /* onPosted(post: string) {
    console.log('posted');
    this.timelineService.createPost(post)
      .subscribe((resp: Post) => {
        console.log('successful post: ', resp);
        this.posts.unshift(resp);
      });
  } */

  ngOnInit() {
    this.posts = this.timelineService.posts;
    this.timelineService.loadAll();
    this.timelineService.watchPosts();
  }

  ngOnDestroy() {
    this.timelineService.unwatchPosts();
  }

}
