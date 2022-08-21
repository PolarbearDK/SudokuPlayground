import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { BoardCell } from '../board/board.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent {
  @Input() cell?: BoardCell;
  @Input() row?: number;
  @Input() col?: number;
  @Input() isCross?: boolean;
  @Output() cellChange = new EventEmitter();
  @Output() navigate = new EventEmitter<{ row: number; col: number }>();

  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  onCellChange() {
    this.cellChange.emit();
  }

  public focus() {
    this.input?.nativeElement.focus();
  }

  onKeyDown($event: KeyboardEvent) {
    console.log($event);

    const { row, col } = this;
    if (row === undefined || col === undefined) return;

    switch ($event.key) {
      case 'ArrowDown':
        this.navigate.next({ row: row + 1, col });
        break;
      case 'ArrowUp':
        this.navigate.next({ row: row - 1, col });
        break;
      case 'ArrowLeft':
        this.navigate.next({ row, col: col - 1 });
        break;
      case 'ArrowRight':
        this.navigate.next({ row, col: col + 1 });
        break;
      default:
        return;
    }
    $event.preventDefault();
  }

  getTitle(cell: BoardCell) {
    const { possibleValues, determinedValue: suggestedValue } = cell;
    if (!possibleValues) return '';
    if (possibleValues.length === 1) return possibleValues[0].toString();

    return possibleValues.join(',') + (!suggestedValue ? '' : ` (${suggestedValue})`);
  }
}
