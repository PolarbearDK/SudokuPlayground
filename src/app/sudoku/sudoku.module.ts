import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [BoardComponent, CellComponent, HomeComponent],
  exports: [HomeComponent],
  imports: [SharedModule],
})
export class SudokuModule {}
