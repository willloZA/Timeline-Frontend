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
    this.timelineService.createComment(comment)
      .subscribe((resp) => {
        console.log(resp);
      }, (err) => {
        console.log(err);
      });
  }

  deletePost() {
    console.log('delete');
    this.timelineService.deletePost(this.post.id)
    .subscribe(() => {}, (err) => {
      console.log(err);
    });
  }

}
