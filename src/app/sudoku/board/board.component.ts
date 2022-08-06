import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

import { CellComponent } from '../cell/cell.component';
import { BoardCell } from './board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board?: BoardCell[][];
  @Input() boardSize?: number;
  @Output() boardChange = new EventEmitter();

  @ViewChildren(CellComponent) cells?: QueryList<CellComponent>;

  onBoardChange() {
    this.boardChange.emit();
  }

  onNavigate($event: { row: number; col: number }) {
    const { cells, boardSize } = this;
    let { row, col } = $event;

    if (cells && boardSize) {
      if (row < 0) row = boardSize - 1;
      if (row >= boardSize) row = 0;
      if (col < 0) col = boardSize - 1;
      if (col >= boardSize) col = 0;

      const cell = cells.toArray()[row * 9 + col];
      cell.focus();
    }
  }
}
