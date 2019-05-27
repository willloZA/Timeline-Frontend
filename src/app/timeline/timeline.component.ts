import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TimelineService } from '../timeline.service';
import { Post } from '../post-comment';
import { AuthService } from '../auth.service';
import { SubmitModalComponent } from '../submit-modal/submit-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  posts: Observable<Post[]>;
  postErr: string;    // errors on post create

  constructor(
    public timelineService: TimelineService,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  // either create post or present submit modal depending on client loggedIn status
  onPosted(message: string) {
    const authConn = this.authService.loggedIn
      .pipe(take(1))
      .subscribe((authResp) => {
        if (!authResp) {
          this.modalService.open(SubmitModalComponent)
            .result.then((result) => {
              // redirect based on modal selection
              if (result === 'Sign Up') {
                this.router.navigate(['/signup']);
              } else {
                this.router.navigate(['/login']);
              }
            }, (reason) => {
              // console.log(`Dismissed ${reason}`);
            });
        } else if (authResp) {
          // create post if logged in
          this.timelineService.createPost(message)
            .subscribe((resp) => {
              // console.log(resp);
            }, (err) => {
              // console.log(err);
              // populate error to display alert
              this.postErr = `${err.status}, please try again`;
            });
        }
      });
    authConn.unsubscribe();
  }

  ngOnInit() {
    this.posts = this.timelineService.posts;
    this.timelineService.loadAll();
    this.timelineService.watchPosts();
  }

  ngOnDestroy() {
    // unsub from any subscriptions on destroy
    this.timelineService.unwatchPosts();
  }

}
