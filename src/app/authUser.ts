import { Post } from './post-comment';

export class User {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    posts: Post[];
}