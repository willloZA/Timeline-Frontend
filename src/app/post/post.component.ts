import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { TimelineService } from '../timeline.service';
import { AuthService } from '../auth.service';
import { Post } from '../post-comment';
import { SubmitModalComponent } from '../submit-modal/submit-modal.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  postErr: string;  // errors on post delete
  commErr: string;  // errors on comment create
  owner = false;
  enabledComments = false;

  constructor(
    private router: Router,
    private timelineService: TimelineService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    // console.log('post initialised: ', this.post);
    if (this.post.user.id === this.authService.getUserId()) {
      this.owner = true;
    }
  }

  toggleComments(): void {
    this.timelineService.toggleComments(this.post.id);
  }

  onComment(content: string): void {
    const authConn = this.authService.loggedIn
      .pipe(take(1))
      .subscribe((resp) => {
        if (!resp) {
          this.modalService.open(SubmitModalComponent)
            .result.then((result) => {
              if (result === 'Sign Up') {
                this.router.navigate(['/signup']);
              } else {
                this.router.navigate(['/login']);
              }
            }, (reason) => {
              // console.log(`Dismissed ${reason}`);
            });
        } else if (resp) {
          // console.log(content);
          const comment = {
            message: content,
            post: this.post.id
          };
          this.timelineService.createComment(comment)
            .subscribe((createResp) => {
              // console.log(createResp);
            }, (err) => {
              // console.log(err);
              this.commErr = `${err.status}, please try again`;
            });
        }
      });
    authConn.unsubscribe();
  }

  deletePost() {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent)
    modalRef.componentInstance.objName = 'post';
    modalRef.result.then((result) => {
        if (result === 'confirm') {
          this.timelineService.deletePost(this.post.id)
            .subscribe(() => {}, (err) => {
              // console.log(err);
              this.postErr = `${err.status}, please try again`;
            });
        }
        return;
      }, (reason) => {
        return;
      });
  }

}
