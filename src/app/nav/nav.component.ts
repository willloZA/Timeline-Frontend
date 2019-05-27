import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {

  // async logged in status, used for displaying signup/login or logout links in nav
  loggedIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private timelineService: TimelineService
    ) { }

  ngOnInit() {
    this.loggedIn$ = this.authService.loggedIn;
  }

  // logout current user
  onLogout() {
    this.authService.logout()
      .then((resp) => {
        // reload to remove delete options for posts/comments
        // could potentially refactor to use async value to avoid
        this.timelineService.loadAll();
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
