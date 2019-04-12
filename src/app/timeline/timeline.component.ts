import { Component, OnInit } from '@angular/core';
import { SailsClient } from 'ngx-sails';
import { Post } from '../post-comment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  /* //template of posts data to be retrieved by service
  posts: Post[] = [
    {name:    'John Smith',
    contents:'This is the first template post',
    date:    new Date('2019-04-01T14:20+02:00'),
    id:      'a',
    comments: [
      {name:    'Jane Smith',
      contents: 'This is the first template comment',
      date:     new Date('2019-04-01T14:20+02:00'),
      id:       'a'},
      {name:    'John Smith',
      contents: 'This is the second template comment',
      date:     new Date('2019-04-01T14:20+02:00'),
      id:       'b'},
     ]},
    {name:    'Jane Smith',
     contents:'This is the second template post',
     date:    new Date('2019-04-01T14:20+02:00'),
     id:      'b',
     comments: []},
    {name:    'John Smith',
     contents:'This is the third template post',
     date:    new Date('2019-04-01T14:20+02:00'),
     id:      'c',
     comments: []},
    {name:    'Jane Smith',
     contents:'This is the fourth template post',
     date:    new Date('2019-04-01T14:20+02:00'),
     id:      'd',
     comments: []}    
  ]; */

  constructor(private sails: SailsClient) { } // posts fetch service to populate timeline

  ngOnInit() {

    this.sails.on('post').subscribe(resp => {
      console.log('post event!', resp);
      // this.messages.push(resp.data.message);
    });

    this.sails.get('/post').subscribe(data => {
      console.log('get chat', data);
      // data.data.map((obj) => this.messages.push(obj.message));
    });
  }

}
