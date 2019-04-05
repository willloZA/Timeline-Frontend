export class Comment {
    name:    String;
    contents:String;
    date:    Date;      //add date calculation method to display "minutes/hours ago" instead of full date for recent posts
    id:      String;
}

export class Post {
    name:    String;
    contents:String;
    date:    Date;      //add date calculation method to display "minutes/hours ago" instead of full date for recent posts
    id:      String;
    comments: Comment[];
}