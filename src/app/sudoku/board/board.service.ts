import { BoardCell } from './board.model';

interface CellRef {
  row: number;
  col: number;
}

interface SaveFormat {
  boxSize: number;
  board: (Pick<BoardCell, 'value' | 'locked'> | undefined)[][];
}

const saveKey = 'board2';

export class BoardService {
  public boxSize: number;
  public board: BoardCell[][];
  public groups: CellRef[][];

  constructor(boxSize: number) {
    this.boxSize = boxSize;
    this.board = createBoard(getBoardSize(boxSize));
    this.groups = this.createGroups();
  }

  createGroups(): CellRef[][] {
    const { boxSize } = this;
    const boardSize = getBoardSize(boxSize);
    const groups: CellRef[][] = [];

    // Group per row
    for (let row = 0; row < boardSize; row++) {
      const group: CellRef[] = [];
      for (let col = 0; col < boardSize; col++) {
        group.push({
          row,
          col,
        });
      }
      groups.push(group);
    }

    // Group per col
    for (let col = 0; col < boardSize; col++) {
      const group: CellRef[] = [];
      for (let row = 0; row < boardSize; row++) {
        group.push({
          row,
          col,
        });
      }
      groups.push(group);
    }

    // Group per box
    for (let boxRow = 0; boxRow < boxSize; boxRow++) {
      for (let boxCol = 0; boxCol < boxSize; boxCol++) {
        const group: CellRef[] = [];
        for (let offsetRow = 0; offsetRow < boxSize; offsetRow++) {
          for (let offsetCol = 0; offsetCol < boxSize; offsetCol++) {
            group.push({
              row: boxRow * boxSize + offsetRow,
              col: boxCol * boxSize + offsetCol,
            });
          }
        }
        groups.push(group);
      }
    }

    return groups;
  }

  clear() {
    this.board = createBoard(getBoardSize(this.boxSize));
  }

  lock() {
    this.forEachCell(cell => (cell.locked = !!cell.value));
  }

  unLock() {
    this.forEachCell(cell => (cell.locked = false));
  }

  reset() {
    this.forEachCell(cell => {
      if (!cell.locked) cell.value = undefined;
    });
    this.check();
  }

  save() {
    const { boxSize } = this;
    const board: (Pick<BoardCell, 'value' | 'locked'> | undefined)[][] = Array.from({ length: getBoardSize(boxSize) }, () => []);

    this.forEachCell((cell, row, col) => {
      const { value, locked } = cell;
      if (value) board[row][col] = { value, locked };
    });

    const toSave: SaveFormat = {
      boxSize,
      board,
    };
    localStorage.setItem(saveKey, JSON.stringify(toSave));
  }

  load() {
    const str = localStorage.getItem(saveKey);
    if (str) {
      const saveFormat = JSON.parse(str) as SaveFormat;
      if (saveFormat && saveFormat.board && saveFormat.boxSize) {
        const { board, boxSize } = saveFormat;
        this.boxSize = boxSize;
        this.board = createBoard(getBoardSize(boxSize));
        this.forEachCell((cell, row, col) => {
          const savedCell = board[row][col];
          if (savedCell) {
            const { value, locked } = savedCell;
            if (typeof value === 'number') {
              cell.value = value;
              cell.locked = locked;
            }
          }
        });
        this.check();

        return true;
      }
    }
    return false;
  }

  private forEachCellInGroup(group: CellRef[], action: (cell1: BoardCell, cell2: BoardCell) => void) {
    const { board } = this;

    for (const { row, col } of group) {
      const cell1 = board[row][col];
      for (const { row, col } of group) {
        const cell2 = board[row][col];
        if (cell1 != cell2) {
          action(cell1, cell2);
        }
      }
    }
  }

  private getGroupCells(group: CellRef[]) {
    const { board } = this;
    return group.map(ref => {
      const { row, col } = ref;
      const cell = board[row][col];
      return cell;
    });
  }

  check() {
    const boardSize = getBoardSize(this.boxSize);

    this.forEachCell(cell => {
      cell.possibleValues = cell.value ? [cell.value] : Array.from({ length: boardSize }, (_, i) => i + 1);
      cell.suggestedValue = undefined;
    });

    // Eliminate selected values from other members of group
    for (const group of this.groups) {
      this.forEachCellInGroup(group, (cell1, cell2) => {
        if (cell1.value) {
          const idx = cell2.possibleValues?.indexOf(cell1.value);
          if (idx !== undefined && idx !== -1) {
            cell2.possibleValues?.splice(idx, 1);
          }
        }
      });
    }

    // Find single cells in group that has unique value
    for (const group of this.groups) {
      const cells = this.getGroupCells(group);
      const max = getBoardSize(this.boxSize);
      for (let i = 1; i <= max; i++) {
        if (!cells.some(x => x.value == i)) {
          const possibleCells = cells.filter(x => x.possibleValues?.includes(i));
          if (possibleCells.length === 1) {
            if (possibleCells[0].possibleValues?.length !== 1) {
              possibleCells[0].suggestedValue = i;
            }
          }
        }
      }
    }

    this.forEachCell(cell => {
      cell.invalid = (!!cell.value && !cell.possibleValues?.includes(cell.value)) || cell.possibleValues?.length === 0;
    });
  }

  private forEachCell(action: (cell: BoardCell, row: number, col: number) => void) {
    const { board } = this;
    const boardSize = getBoardSize(this.boxSize);

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        action(board[row][col], row, col);
      }
    }
  }
}

export function getBoardSize(boxSize: number) {
  return boxSize * boxSize;
}

function createBoard(size: number): BoardCell[][] {
  const board: BoardCell[][] = [];
  for (let r = 0; r < size; r++) {
    const row: BoardCell[] = [];
    for (let c = 0; c < size; c++) {
      row[c] = {};
    }
    board[r] = row;
  }
  return board;
}
