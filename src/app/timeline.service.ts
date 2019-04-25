import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SailsClient } from 'ngx-sails';
import { AuthService } from './auth.service';
import { Post, Comment } from './post-comment';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  // BehaviorSubject (instead of Subject) so that on subscribe latest event will be emitted
  private _posts: BehaviorSubject<Post[]>;

  private dataStore: { posts: Post[] };

  private connPost;

  get posts() {
    return this._posts.asObservable();
  }

  loadAll() {
    // retrieves all posts via socket
    this.sails.get('/post')
      .subscribe(resp => {
        // updates dataStore of posts
        this.dataStore.posts = resp.data.reverse();
        // emits updated list of posts as a copy of dataStore via _posts Subject
        this._posts.next(Object.assign({}, this.dataStore).posts);
      }, (error) => console.log('Could not load todos.', error));
  }

  watchPosts() {
    // watches for pub sub events from sails regarding posts
    this.connPost = this.sails.on('post')
      .subscribe(resp => {
        console.log('post event!', resp);
        // seperate handler logic based on event verb
        switch (resp.verb) {
          case 'created':
            // updates dataStore of posts with newly created post
            this.dataStore.posts.unshift(resp.data);
            // emits updated list of posts as a copy of dataStore via _posts Subject
            this._posts.next(Object.assign({}, this.dataStore).posts);
            break;
          default:
            // unhandled event verb
            console.log('unhandled event verb');
        }
      });
  }

  unwatchPosts() {
    this.connPost.unsubscribe();
  }
  // implement scroll service to maintain view of post on post updates
  // https://stackblitz.com/edit/angular-scroll-service?file=src%2Fapp%2Fwindow-scroll.service.ts

  toggleComments(id: string) {
    // toggle showComments boolean of post specified by id
    this.dataStore.posts.forEach((post, idx) => {
      if (post.id === id) {
        this.dataStore.posts[idx].showComments = !post.showComments;
      }
    });
    // emits updated list of posts as a copy of dataStore via _posts Subject
    this._posts.next(Object.assign({}, this.dataStore).posts);
  }

  constructor(
    private sails: SailsClient,
    private authService: AuthService
    ) {
      this.dataStore = { posts: [] };
      this._posts = new BehaviorSubject([]) as BehaviorSubject<Post[]>;
    }

  /* watchPosts() {
    return new Observable((observer) => {
      this.sails.on('post')
        .subscribe(resp => {
          console.log('post event!', resp);
          // convert to observable so timeline doesn't reinitialise on post updates/creates
          if (resp.verb === 'created') {
            // this.updatePosts();
            this.dataStore.posts.unshift(resp.added);
            observer.next(resp);
            return {}
          }
        });
    });
  }

  getPosts() {
    return new Observable((observer) => {
      this.sails.get('/post')
        .subscribe(resp => {
          console.log('get chat', resp);
          observer.next(resp.data.reverse());
          observer.complete();
        }, (err) => observer.error(err));
      });
  }

  createPost(postString) {
    const post = {
      message: postString,
      user: this.authService.getUserId()
    };
    return new Observable((observer) => {
      this.sails.post('/post', post)
        .subscribe((resp) => {
        console.log(resp);
        this.timeline.unshift(resp.data);
        observer.next(resp.data);
        observer.complete();
      }, (err) => observer.error(err));
    });
  }

  createComment(comment) {
    comment.user = this.authService.getUserId();
    return new Observable((observer) => {
      this.sails.post('/comment', comment)
        .subscribe((resp) => {
          console.log(resp);
          // service logic
          observer.next(resp.data);
          observer.complete();
        }, (err) => observer.error(err));
    });
  } */
}
