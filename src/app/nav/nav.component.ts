import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  // async logged in status, used for displaying signup/login or logout links in nav

  constructor(
    public authService: AuthService,
    private timelineService: TimelineService
    ) { }

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
