import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePostPageRoutingModule } from './create-post-routing.module';

import { CreatePostPage } from './create-post.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CreatePostPageRoutingModule
  ],
  declarations: [CreatePostPage]
})
export class CreatePostPageModule {}
