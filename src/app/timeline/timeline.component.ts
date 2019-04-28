import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineService } from '../timeline.service';
import { Post } from '../post-comment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  posts: Observable<Post[]>;
  defPosts: Observable<number>;

  constructor(
    public timelineService: TimelineService
  ) {}

  reloadTimeline() {
    this.timelineService.resetDefPosts();
  }

  onPosted(message: string) {
    this.timelineService.createPost(message)
      .subscribe((resp) => {
        console.log(resp);
      }, (err) => {
        console.log(err);
      });
  }

  ngOnInit() {
    this.posts = this.timelineService.posts;
    this.defPosts = this.timelineService.defPosts;
    this.timelineService.loadAll();
    this.timelineService.watchPosts();
  }

  ngOnDestroy() {
    this.timelineService.unwatchPosts();
  }

}
