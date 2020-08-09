import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/post.model';
import { Subscription } from 'rxjs';
import { PostsService } from 'src/app/posts.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.page.html',
  styleUrls: ['./view-post.page.scss'],
})
export class ViewPostPage implements OnInit {

  isLoading = false;
  postData: Post;
  subs: Subscription;

  constructor(
    private postsServ: PostsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/home');
        return;
      }
      this.isLoading = true;
      this.subs = this.postsServ.getPostDetail(paramMap.get('id')).subscribe(post => {
        this.postData = post;
        this.isLoading = false;
      }, err => {
        this.alertCtrl.create({
          header: "An error Occurred",
          message: "Could not load the Page.",
          buttons: [
            {
              text: 'Okay', handler: () => {
                this.navCtrl.navigateBack('/home');
              }
            }]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }


}
