import { Component, OnInit, Input } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { AuthService } from '../auth.service';
import { Comment } from '../post-comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input () comment: Comment;
  owner = false;

  constructor(
    private timelineService: TimelineService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.comment.user.id === this.authService.getUserId()) {
      this.owner = true;
    }
  }

  deleteComment() {
    this.timelineService.deleteComment(this.comment.id)
    .subscribe(() => {}, (err) => {
      console.log(err);
    });
  }
}
