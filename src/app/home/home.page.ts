import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isLoading = false;
  subs: Subscription;
  fetchSub: Subscription;

  constructor(private postsServ: PostsService, private router: Router) { }

  ngOnInit() {
    this.subs = this.postsServ.posts.subscribe(posts => {
      this.loadedPosts = posts;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.fetchSub = this.postsServ.fetchPosts().subscribe(() => {
      this.isLoading = false;
    });
  }

  delete(id: string) {
    this.postsServ.deletePost(id);
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    if (this.fetchSub) {
      this.fetchSub.unsubscribe();
    }
  }

}
