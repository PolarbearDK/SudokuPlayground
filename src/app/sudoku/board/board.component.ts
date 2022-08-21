import { Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

import { CellComponent } from '../cell/cell.component';
import { BoardCell, BoardDimensions, getBoardSize } from './board.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnChanges {
  @Input() board?: BoardCell[][];
  @Input() dimensions?: BoardDimensions;
  @Input() isCross?: boolean;
  @Output() boardChange = new EventEmitter();

  @ViewChildren(CellComponent) cells?: QueryList<CellComponent>;
  size = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if ('dimensions' in changes) {
      this.size = this.dimensions ? getBoardSize(this.dimensions).width : 0;
    }
  }

  onBoardChange() {
    this.boardChange.emit();
  }

  onNavigate($event: { row: number; col: number }) {
    const { cells, dimensions } = this;
    let { row, col } = $event;

    if (cells && dimensions) {
      const { width, height } = getBoardSize(dimensions);

      if (row < 0) row = height - 1;
      if (row >= height) row = 0;
      if (col < 0) col = width - 1;
      if (col >= width) col = 0;

      const cell = cells.toArray()[row * width + col];
      cell.focus();
    }
  }
}
