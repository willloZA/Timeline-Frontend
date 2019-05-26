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
  private postArrSubject: BehaviorSubject<Post[]>;

  /* pass to timeline component to display count of deferred posts once post comment is focused
  this is mainly to avoid needing to monitor and calculate scroll position on async post updates
   */
  private defPostsSubject: BehaviorSubject<number>;

  private dataStore: { posts: Post[], defPosts: Post[] };

  private connPost;

  private connDefPost;

  constructor(
    private sails: SailsClient,
    private authService: AuthService
  ) {
    this.dataStore = { posts: [], defPosts: [] };
    this.postArrSubject = new BehaviorSubject([]) as BehaviorSubject<Post[]>;
    this.defPostsSubject = new BehaviorSubject(0) as BehaviorSubject<number>;
  }

  get posts() {
    return this.postArrSubject.asObservable();
  }

  get defPosts() {
    return this.defPostsSubject.asObservable();
  }

  loadAll() {
    // retrieves all posts via socket
    this.sails.get('/api/post')
      .subscribe(resp => {
        // updates dataStore of posts
        this.dataStore.posts = resp.data.reverse();
        // emits updated list of posts as a copy of dataStore via _posts Subject
        this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
      }, (error) => console.log('Could not load posts.', error));
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
            this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
            break;
          case 'addedTo':
            // updates dataStore post comments with new comment
            this.dataStore.posts.map((post) => {
              if (post.id === resp.id) {
                post.comments.unshift(resp.added);
              }
            });
            // emits updated list of posts as a copy of dataStore via _posts Subject
            this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
            break;
          case 'destroyed':
            // check if destroyed post is in posts before comment toggle
            const idx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
            if (idx > -1) {
              // remove from posts if present and update components
              this.dataStore.posts.splice(idx, 1);
              this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
            } else {
              /* if destroyed event reaches client before create then might need to check idx and
              store if not found in defPosts to discard create when and if received */
              // console.log(`destroy event received for post that doesn't exist`);
            }
            break;
          case 'removedFrom':
            // removes comment from datastore post
            const postIdx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
            let commIdx;
            if (postIdx > -1) {
              commIdx = this.dataStore.posts[postIdx].comments.findIndex((c) => c.id === resp.removedId);
              this.dataStore.posts[postIdx].comments.splice(commIdx, 1);
              this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
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
    // unsubscribes from observables to avoid duplicate subscriptions
    this.connPost.unsubscribe();
    if (this.connDefPost) {
      this.connDefPost.unsubscribe();
    }
  }

  // resets deferred posts and reloads posts in datastore
  resetDefPosts() {
    this.unwatchPosts();
    this.dataStore.defPosts = [];
    this.defPostsSubject.next(Object.assign({}, this.dataStore).defPosts.length);
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
    // emits updated list of posts as a copy of dataStore via postArrSubject
    this.postArrSubject.next(Object.assign({}, this.dataStore).posts);

    /* stops timeline async post updates until comments untoggled to prevent need for
    scroll service (avoid scope creep)*/
    // console.log('toggled comment', toggled);
    // if (toggled) {
    //   // unsub from default watch logic
    //   this.unwatchPosts();
    //   // sub to deferred post watch logic
    //   // duplicate code can be refactored
    //   this.connDefPost = this.sails.on('post')
    //     .subscribe(resp => {
    //       // console.log('post event!', resp);
    //       // seperate handler logic based on event verb
    //       switch (resp.verb) {
    //         case 'created':
    //           // updates dataStore of deferred posts with newly created post
    //           this.dataStore.defPosts.push(resp.data);
    //           // emits updated count of deferred posts via _defPosts Subject
    //           this.defPostsSubject.next(Object.assign({}, this.dataStore).defPosts.length);
    //           break;
    //         case 'addedTo':
    //           // updates dataStore post comments with new comment
    //           this.dataStore.posts.map((post) => {
    //             if (post.id === resp.id) {
    //               post.comments.unshift(resp.added);
    //             }
    //           });
    //           // emits updated list of posts as a copy of dataStore via _posts Subject
    //           this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
    //           break;
    //         case 'destroyed':
    //           // check if destroyed post is in posts before comment toggle
    //           let idx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
    //           if (idx > -1) {
    //             // remove from posts if present and update components
    //             this.dataStore.posts.splice(idx, 1);
    //             this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
    //           } else {
    //             // if idx is -1 then post id must be in deferred posts remove update components
    //             idx = this.dataStore.defPosts.findIndex((p) => p.id === resp.id);
    //             /* if destroyed event reaches client before create then might need to check idx and
    //             store if not found in defPosts to discard create when and if received */
    //             this.dataStore.defPosts.splice(idx, 1);
    //             this.defPostsSubject.next(Object.assign({}, this.dataStore).defPosts.length);
    //           }
    //           break;
    //         case 'removedFrom':
    //           let postIdx = this.dataStore.posts.findIndex((p) => p.id === resp.id);
    //           let commIdx;
    //           if (postIdx > -1) {
    //             commIdx = this.dataStore.posts[postIdx].comments.findIndex((c) => c.id === resp.removedId);
    //             this.dataStore.posts[postIdx].comments.splice(commIdx, 1);
    //             this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
    //           } else {
    //             postIdx = this.dataStore.defPosts.findIndex((p) => p.id === resp.id);
    //             /* if destroyed event reaches client before create then might need to check idx and
    //             store if not found in defPosts to discard create event when and if received */
    //             commIdx = this.dataStore.defPosts[postIdx].comments.findIndex((c) => c.id === resp.removedId);
    //             this.dataStore.defPosts[postIdx].comments.splice(commIdx, 1);
    //           }
    //           break;
    //         default:
    //           // unhandled event verb
    //           // console.log('unhandled event verb');
    //       }
    //     });
    // } else {
    //   // check if any other posts have comments shown before updating with deferred posts
    //   if (!this.dataStore.posts.find((post) => post.showComments === true)) {
    //     this.resetDefPosts();
    //   }
    // }

  }

  // create and submit post object
  createPost(postString) {
    const post = {
      message: postString,
      user: this.authService.getUserId()
    };
    // console.log(post);
    return new Observable((observer) => {
      this.sails.post('/api/post', post)
        .subscribe((resp) => {
          // updates dataStore of posts with newly created post
          this.dataStore.posts.unshift(resp.data);
          // emits updated list of posts as a copy of dataStore via _posts Subject
          this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
          observer.next(resp.status);
          observer.complete();
      }, (err) => observer.error(err)); // send appropriate error message for display
    });
  }

  // delete Post
  deletePost(id: string) {
    console.log(id);
    return new Observable((observer) => {
      this.sails.delete('/api/post/' + id)
        .subscribe((resp) => {
          console.log(resp);
          // remove post entry from datastore on success
          this.dataStore.posts.splice(this.dataStore.posts.findIndex((post) => post.id === id), 1);
          this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
          observer.complete();
        }, (err) => observer.error(err)); // send appropriate error message for display
    });
  }
  // complete and submit comment object
  createComment(comment) {
    comment.user = this.authService.getUserId();
    return new Observable((observer) => {
      this.sails.post('/api/comment', comment)
        .subscribe((resp) => {
          // console.log(resp);
          // updates dataStore of post with newly created comment
          this.dataStore.posts.map((post) => {
            if ( post.id === resp.data.post) {
              post.comments.unshift(resp.data);
            }
          });
          // emits updated list of posts as a copy of dataStore via _posts Subject
          this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
          observer.next(resp.status);
          observer.complete();
        }, (err) => observer.error(err)); // send appropriate error message for display
    });
  }

  deleteComment(id: string) {
    return new Observable((observer) => {
      this.sails.delete('/api/comment/' + id)
        .subscribe((resp) => {
          const postIdx = this.dataStore.posts.findIndex((p) => p.id === resp.data.post);
          let commIdx;
          if (postIdx > -1) {
            commIdx = this.dataStore.posts[postIdx].comments.findIndex((c) => c.id === resp.data.comment);
            this.dataStore.posts[postIdx].comments.splice(commIdx, 1);
            this.postArrSubject.next(Object.assign({}, this.dataStore).posts);
            observer.complete();
          }
        }, (err) => observer.error(err)); // send appropriate error message for display
    });
  }
}
