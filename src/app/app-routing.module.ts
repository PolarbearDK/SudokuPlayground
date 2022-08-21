import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowseComponent } from './sudoku/browse/browse.component';
import { HomeComponent } from './sudoku/home/home.component';

const routes: Routes = [
  {
    path: 'edit',
    component: HomeComponent,
  },
  {
    path: 'browse',
    component: BrowseComponent,
  },
  { path: '', redirectTo: '/edit', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
