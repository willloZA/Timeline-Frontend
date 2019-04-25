//refactor with users.ts
export class User {
    firstName   : string;
    lastName    : string;
    id          : string;
}

export class Comment {
    user        : User;
    message     : string;
    createdAt   : Date;      //add date calculation method to display "minutes/hours ago" instead of full date for recent posts
    updatedAt   : Date;
    id          : string;
}

export class Post {
    user        : User;
    message     : string;
    createdAt   : Date;      //add date calculation method to display "minutes/hours ago" instead of full date for recent posts
    updatedAt   : Date;
    id          : string;
    comments    : Comment[] = [];
    showComments: boolean   = false;
}