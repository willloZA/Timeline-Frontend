export class Comment {
    name:    String;
    contents:String;
    date:    Date;
    id:      String;
}

export class Post {
    name:    String;
    contents:String;
    date:    Date;
    id:      String;
    comments: Comment[];
}