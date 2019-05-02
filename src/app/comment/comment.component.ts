import { Component, OnInit, Input } from '@angular/core';
import { TimelineService } from '../timeline.service';
import { AuthService } from '../auth.service';
import { Comment } from '../post-comment';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input () comment: Comment;
  commErr: string;
  owner = false;

  constructor(
    private timelineService: TimelineService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.comment.user.id === this.authService.getUserId()) {
      this.owner = true;
    }
  }

  deleteComment() {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent)
    modalRef.componentInstance.objName = 'comment';
    modalRef.result.then((result) => {
        if (result === 'confirm') {
          this.timelineService.deleteComment(this.comment.id)
            .subscribe(() => {}, (err) => {
              // console.log(err);
              this.commErr = `${err.status}, please try again`;
            });
        }
        return;
      }, (reason) => {
        return;
      });
  }
}
