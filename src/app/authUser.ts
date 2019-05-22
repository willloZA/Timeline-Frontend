import { Post } from './post-comment';

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    posts: Post[];
}
