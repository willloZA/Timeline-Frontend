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

  private dataStore: { posts: Post[] };

  private connPost;

  constructor(
    private sails: SailsClient,
    private authService: AuthService
  ) {
    this.dataStore = { posts: [] };
    this.postArrSubject = new BehaviorSubject([]) as BehaviorSubject<Post[]>;
  }

  get posts() {
    return this.postArrSubject.asObservable();
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
  }

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
