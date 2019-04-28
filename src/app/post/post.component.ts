import { Component, OnInit, Input } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { Post, Comment } from '../post-comment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  enabledComments = false;

  commentConn;
  postConn;

  constructor(
    private timelineService: TimelineService
  ) { }

  ngOnInit() {
    // implement pub sub without reinitialising
    // console.log('post initialised: ', this.post);
  }

  toggleComments(): void {
    this.timelineService.toggleComments(this.post.id);
    // this.post.showComments = !this.enabledComments;
    if (this.enabledComments) {
      // get comments to ensure updated or monitor all/comment events from timeline
      //add to service from here
      /* console.log('client getting post details');
      this.sails.get('/post/' + this.post.id)
        .subscribe((resp) => {
          console.log(resp);
          // this.post.comments = resp.data.comments;
        }); */
      // monitor all post events from timeline or only creates?
      /* this.postConn = this.sails.on('post')
        .subscribe((resp) => {
          console.log(resp);
        }); */
      console.log('listening for comments');
      /* this.commentConn = this.sails.on('comment')
        .subscribe((resp) => {
          console.log(resp);
        }); */
    } else {
      console.log('listening for comments');
      // only if monitoring event from comment component
      // this.postConn.unsubscribe();
      // this.commentConn.unsubscribe();
    }
  }

  onComment(content: string): void {
    // console.log(content);
    const comment = {
      message: content,
      post: this.post.id
    };
    /* this.timelineService.createComment(comment)
      .subscribe((resp: Comment) => {
        console.log('successful comment: ', resp);
        this.post.comments.unshift(resp);
      }); */

    /* this.sails.post('/comment', comment)
      .subscribe((resp) => {
        console.log(resp);
        // insert successful comments from this component or emit to timeline
        if (!this.post.comments) {
          // first comment
          this.post.comments = [];
        }
        this.post.comments.unshift(resp.data);
      }); */
  }

}
