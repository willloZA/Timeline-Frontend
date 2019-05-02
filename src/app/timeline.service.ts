import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SailsClient } from 'ngx-sails';
import { AuthService } from './auth.service';
import { Post } from './post-comment';

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

  constructor(
    private sails: SailsClient,
    private authService: AuthService
  ) {
    this.dataStore = { posts: [], defPosts: [] };
    this._posts = new BehaviorSubject([]) as BehaviorSubject<Post[]>;
    this._defPosts = new BehaviorSubject(0) as BehaviorSubject<number>;
  }

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
        // console.log('post event!', resp);
        // seperate handler logic based on event verb
        switch (resp.verb) {
          case 'created':
            // updates dataStore of posts with newly created post
            this.dataStore.posts.unshift(resp.data);
            // emits updated list of posts as a copy of dataStore via _posts Subject
            this._posts.next(Object.assign({}, this.dataStore).posts);
            break;
          case 'addedTo':
            // updates dataStore post comments with new comment
            this.dataStore.posts.map((post) => {
              if (post.id === resp.id) {
                post.comments.unshift(resp.added);
              }
            });
            // emits updated list of posts as a copy of dataStore via _posts Subject
            this._posts.next(Object.assign({}, this.dataStore).posts);
            break;
          case 'destroyed':
            // check if destroyed post is in posts before comment toggle
            const idx = this.dataStore.posts.findIndex((p) => p.id === p.id);
            if (idx > -1) {
              // remove from posts if present and update components
              this.dataStore.posts.splice(idx, 1);
              this._posts.next(Object.assign({}, this.dataStore).posts);
            } else {
              /* if destroyed event reaches client before create then might need to check idx and
              store if not found in defPosts to discard create when and if received */
              // console.log(`destroy event received for post that doesn't exist`);
            }
            break;
          case 'removedFrom':
            let postIdx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
            let commIdx;
            if (postIdx > -1) {
              commIdx = this.dataStore.posts[postIdx].comments.findIndex((c) => c.id === resp.removedId);
              this.dataStore.posts[postIdx].comments.splice(commIdx, 1);
              this._posts.next(Object.assign({}, this.dataStore).posts);
            } else {
              /* if destroyed event reaches client before create then might need to check idx and
              store if not found in defPosts to discard create event when and if received */
              // console.log(`removedFrom event received for post that doesn't exist`);
            }
            break;
          default:
            // unhandled event verb
            // console.log('unhandled event verb');
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
    // console.log('toggled comment', toggled);
    if (toggled) {
      this.unwatchPosts();
      this.connDefPost = this.sails.on('post')
        .subscribe(resp => {
          // console.log('post event!', resp);
          // seperate handler logic based on event verb
          switch (resp.verb) {
            case 'created':
              // updates dataStore of deferred posts with newly created post
              this.dataStore.defPosts.push(resp.data);
              // emits updated count of deferred posts via _defPosts Subject
              this._defPosts.next(Object.assign({}, this.dataStore).defPosts.length);
              break;
            case 'addedTo':
              // updates dataStore post comments with new comment
              this.dataStore.posts.map((post) => {
                if (post.id === resp.id) {
                  post.comments.unshift(resp.added);
                }
              });
              // emits updated list of posts as a copy of dataStore via _posts Subject
              this._posts.next(Object.assign({}, this.dataStore).posts);
              break;
            case 'destroyed':
              // check if destroyed post is in posts before comment toggle
              let idx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
              if (idx > -1) {
                // remove from posts if present and update components
                this.dataStore.posts.splice(idx, 1);
                this._posts.next(Object.assign({}, this.dataStore).posts);
              } else {
                // if idx is -1 then post id must be in deferred posts remove update components
                idx = this.dataStore.defPosts.findIndex((p) => p.id === resp.id);
                /* if destroyed event reaches client before create then might need to check idx and
                store if not found in defPosts to discard create when and if received */
                this.dataStore.defPosts.splice(idx, 1);
                this._defPosts.next(Object.assign({}, this.dataStore).defPosts.length);
              }
              break;
            case 'removedFrom':
              let postIdx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
              let commIdx;
              if (postIdx > -1) {
                commIdx = this.dataStore.posts[postIdx].comments.findIndex((c) => c.id === resp.removedId);
                this.dataStore.posts[postIdx].comments.splice(commIdx, 1);
                this._posts.next(Object.assign({}, this.dataStore).posts);
              } else {
                postIdx = this.dataStore.defPosts.findIndex((p) => p.id === resp.id);
                /* if destroyed event reaches client before create then might need to check idx and
                store if not found in defPosts to discard create event when and if received */
                commIdx = this.dataStore.defPosts[postIdx].comments.findIndex((c) => c.id === resp.removedId);
                this.dataStore.defPosts[postIdx].comments.splice(commIdx, 1);
              }
              break;
            default:
              // unhandled event verb
              // console.log('unhandled event verb');
          }
        });
    } else {
      // check if any other posts have comments shown before updating with deferred posts
      if (!this.dataStore.posts.find((post) => post.showComments === true)) {
        this.resetDefPosts();
      }
    }

  }

  createPost(postString) {
    const post = {
      message: postString,
      user: this.authService.getUserId()
    };
    // console.log(post);
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

  deletePost(id: string) {
    return new Observable((observer) => {
      this.sails.delete('/post/' + id)
        .subscribe((resp) => {
          this.dataStore.posts.splice(this.dataStore.posts.findIndex((post) => post.id === id), 1);
          this._posts.next(Object.assign({}, this.dataStore).posts);
          observer.complete();
        }, (err) => observer.error(err));
    });
  }
  // ensure comment create is working correctly, return interpreted error as per above
  createComment(comment) {
    comment.user = this.authService.getUserId();
    return new Observable((observer) => {
      this.sails.post('/comment', comment)
        .subscribe((resp) => {
          // console.log(resp);
          // updates dataStore of post with newly created comment
          this.dataStore.posts.map((post) => {
            if ( post.id === resp.data.post) {
              post.comments.unshift(resp.data);
            }
          });
          // emits updated list of posts as a copy of dataStore via _posts Subject
          this._posts.next(Object.assign({}, this.dataStore).posts);
          observer.next(resp.status);
          observer.complete();
        }, (err) => observer.error(err));
    });
  }

  deleteComment(id: string) {
    return new Observable((observer) => {
      this.sails.delete('/comment/' + id)
        .subscribe((resp) => {
          const postIdx = this.dataStore.posts.findIndex((p) => p.id === resp.data.post);
          let commIdx;
          if (postIdx > -1) {
            commIdx = this.dataStore.posts[postIdx].comments.findIndex((c) => c.id === resp.data.comment);
            this.dataStore.posts[postIdx].comments.splice(commIdx, 1);
            this._posts.next(Object.assign({}, this.dataStore).posts);
            observer.complete();
          }
        }, (err) => {
          // console.log('err received');
          observer.error(err);
        });
    });
  }
}
