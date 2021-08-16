import { NgModule } from '@angular/core'; 
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'create-post',
    loadChildren: () => import('./create-post/create-post.module').then(m => m.CreatePostPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./create-post/create-post.module').then(m => m.CreatePostPageModule)
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./home/view-post/view-post.module').then(m => m.ViewPostPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
