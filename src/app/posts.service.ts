import { Injectable } from "@angular/core";
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private _posts = new BehaviorSubject<Post[]>([]);
    checkPost: Post;
    postId: string;

    savePostId(id: string) {
        this.postId = id;
    }

    constructor(private http: HttpClient, private router: Router) { }

    get posts() {
        return this._posts.asObservable();
    }

    getPostDetail(id: string): Observable<Post> {
        return this.http.get<{ message: string, post: any }>(`http://localhost:3000/api/posts/${id}`)
            .pipe(map(responseData => {
                return new Post(
                    responseData.post._id,
                    responseData.post.title,
                    responseData.post.content,
                    responseData.post.imagePath
                );
            }));
    }

    editPost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof image === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = { id: id, title: title, content: content, imagePath: image };
        }
        this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
            .subscribe((res) => {
                this.fetchPosts().pipe(take(1)).subscribe(posts => {
                    this._posts.next(posts);
                });
                this.router.navigateByUrl('/home');
            });
    }

    fetchPosts() {
        return this.http.get<{ message: string, posts: any }>("http://localhost:3000/api/posts")
            .pipe(map(postData => {
                return postData.posts.map(post => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath: post.imagePath
                    };
                });
            }), tap((posts: Post[]) => {
                this._posts.next(posts);
            }));
    }

    addPost(title: string, content: string, image: File) {
        // const newPost: Post = { id: null, title: title, content: content, image: null }
        const newPost = new FormData();
        newPost.append('title', title);
        newPost.append('content', content);
        newPost.append('image', image, title);
        return this.http.post<{ message: string, post: Post }>("http://localhost:3000/api/posts", newPost)
            .pipe(switchMap(responseData => {
                this.checkPost = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                };
                // newPost.id = responseData.postId;
                return this.posts;
            }), take(1), tap((posts: Post[]) => {
                this._posts.next(posts.concat(this.checkPost));
            }));
    }

    deletePost(postId: string) {
        return this.http.delete(`http://localhost:3000/api/posts/${postId}`)
            .pipe(map((data: { message: string }) => {
                console.log(data.message);
                const updatedPosts = this._posts.value.filter(post => post.id !== postId);
                this._posts.next(updatedPosts);
                return updatedPosts;
            }),take(1));
    }
}