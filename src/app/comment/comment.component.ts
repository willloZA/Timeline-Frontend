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
    // determine whether client is owner of post, used to display delete button for owners
    if (this.comment.user.id === this.authService.getUserId()) {
      this.owner = true;
    }
  }

  // display confirmation modal and proceed with delete depending on result
  deleteComment() {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
    // set objName in modal for context
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
