import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SailsClient } from 'ngx-sails';
import { AuthService } from './auth.service';
import { Post, Comment } from './post-comment';
import { TestingCompilerImpl } from '@angular/platform-browser-dynamic/testing/src/compiler_factory';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  // BehaviorSubject (instead of Subject) so that on subscribe latest event will be emitted
  private _posts: BehaviorSubject<Post[]>;

  /* pass to timeline component to display count of deferred posts once post comment is focused
  this is mainly to avoid needing to monitor and calculate scroll position on async post updates
   */
  private _defPosts: BehaviorSubject<number>;

  private dataStore: { posts: Post[], defPosts: Post[] };

  private connPost;

  private connComment;

  private connDefPost;

  get posts() {
    return this._posts.asObservable();
  }

  get defPosts() {
    return this._defPosts.asObservable();
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
    if (this.connComment) {
      this.connComment.unsubscribe();
    }
    if (this.connDefPost) {
      this.connDefPost.unsubscribe();
    }
  }

  resetDefPosts() {
    this.unwatchPosts();
    this.dataStore.defPosts = [];
    this._defPosts.next(Object.assign({}, this.dataStore).defPosts.length);
    this.loadAll();
    this.watchPosts();
  }
  // implementing scroll service to maintain view of post on post updates might take more time
  // https://stackblitz.com/edit/angular-scroll-service?file=src%2Fapp%2Fwindow-scroll.service.ts

  toggleComments(id: string) {
    let toggled;
    // toggle showComments boolean of post specified by id
    this.dataStore.posts.forEach((post, idx) => {
      if (post.id === id) {
        // storing comment state for async posts updates (in case scroll service is implemented)
        this.dataStore.posts[idx].showComments = !post.showComments;
        // comment state stored in toggled to implement new on post logic
        toggled = this.dataStore.posts[idx].showComments;
      }
    });
    // emits updated list of posts as a copy of dataStore via _posts Subject
    this._posts.next(Object.assign({}, this.dataStore).posts);

    /* stops timeline async post updates until comments untoggled to prevent need for
    scroll service (avoid too much time spent on trivial features)*/
    console.log('toggled comment', toggled);
    if (toggled) {
      this.unwatchPosts();
      this.connDefPost = this.sails.on('post')
        .subscribe(resp => {
          console.log('post event!', resp);
          // seperate handler logic based on event verb
          switch (resp.verb) {
            case 'created':
              // updates dataStore of deferred posts with newly created post
              this.dataStore.defPosts.push(resp.data);
              // emits updated count of deferred posts via _defPosts Subject
              this._defPosts.next(Object.assign({}, this.dataStore).defPosts.length);
              break;
            default:
              // unhandled event verb
              console.log('unhandled event verb');
          }
        });
    } else {
      this.resetDefPosts();
    }

  }



  constructor(
    private sails: SailsClient,
    private authService: AuthService
  ) {
    this.dataStore = { posts: [], defPosts: [] };
    this._posts = new BehaviorSubject([]) as BehaviorSubject<Post[]>;
    this._defPosts = new BehaviorSubject(0) as BehaviorSubject<number>;
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
  } */

  createPost(postString) {
    const post = {
      message: postString,
      user: this.authService.getUserId()
    };
    return new Observable((observer) => {
      this.sails.post('/post', post)
        .subscribe((resp) => {
        // updates dataStore of posts with newly created post
        this.dataStore.posts.unshift(resp.data);
        // emits updated list of posts as a copy of dataStore via _posts Subject
        this._posts.next(Object.assign({}, this.dataStore).posts);
        observer.next(resp.status);
        observer.complete();
        // interpret error, send appropriate message for display
      }, (err) => observer.error(err));
    });
  }
  // ensure comment create is working correctly, return interpreted error as per above
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
  }
}
