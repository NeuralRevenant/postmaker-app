import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { imgType } from './img-type.validator';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  private mode = 'create';
  form: FormGroup;
  imgPrv: string;
  isLoading = false;
  postId: string;
  post: Post;
  constructor(
    private postsServ: PostsService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.postsServ.getPostDetail(this.postId).pipe(take(1)).subscribe(post => {
          this.post = { ...post };

          this.form = new FormGroup({
            title: new FormControl(post.title, {
              updateOn: 'change',
              validators: [Validators.required, Validators.maxLength(50)]
            }),
            content: new FormControl(post.content, {
              updateOn: 'change',
              validators: [Validators.required, Validators.minLength(5)]
            }),
            image: new FormControl(post.imagePath, {
              validators: [Validators.required],
              asyncValidators: [imgType]
            })
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.isLoading = false;
      }
    });

    if (!this.post) {
      this.form = new FormGroup({
        title: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(50)]
        }),
        content: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.minLength(5)]
        }),
        image: new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [imgType]
        })
      });
    }
  }

  onImgPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPrv = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  savePost() {
    if (!this.form.valid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsServ.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      ).subscribe(() => {
        console.log(this.form);
        this.form.reset();
        this.navCtrl.navigateBack("/home");
      });
    } else {
      this.postsServ.editPost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
  }

}
