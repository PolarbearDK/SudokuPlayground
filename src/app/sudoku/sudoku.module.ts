import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { HomeComponent } from './home/home.component';
import { BrowseComponent } from './browse/browse.component';

@NgModule({
  declarations: [BoardComponent, CellComponent, HomeComponent, BrowseComponent],
  exports: [HomeComponent],
  imports: [SharedModule],
})
export class SudokuModule {}
