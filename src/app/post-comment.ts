//refactor with users.ts
export interface User {
    firstName   : string;
    lastName    : string;
    id          : string;
}

export interface Comment {
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