import { BoardCell, BoardDimensions, getBoardSize, getSetSize } from './board.model';

interface CellRef {
  row: number;
  col: number;
}

interface SaveFormat {
  boxSize?: number;
  dimensions?: BoardDimensions;
  board: (Pick<BoardCell, 'value' | 'locked'> | undefined)[][];
}

const saveKey = 'board23';

export class BoardService {
  public dimensions: BoardDimensions;
  public board: BoardCell[][];
  public groups: CellRef[][];
  public solved = false;

  constructor() {
    this.dimensions = {
      boxWidth: 3,
      boxHeight: 2,
      boxesX: 2,
      boxesY: 3,
    };
    this.board = createBoard(this.dimensions);
    this.groups = this.createGroups();
    this.solved = false;
  }

  createGroups(): CellRef[][] {
    const { dimensions } = this;
    const { width, height } = getBoardSize(dimensions);
    const groups: CellRef[][] = [];

    // Group per row
    for (let row = 0; row < height; row++) {
      const group: CellRef[] = [];
      for (let col = 0; col < width; col++) {
        group.push({
          row,
          col,
        });
      }
      groups.push(group);
    }

    // Group per col
    for (let col = 0; col < width; col++) {
      const group: CellRef[] = [];
      for (let row = 0; row < width; row++) {
        group.push({
          row,
          col,
        });
      }
      groups.push(group);
    }

    // Group per box
    for (let boxY = 0; boxY < dimensions.boxesY; boxY++) {
      for (let boxX = 0; boxX < dimensions.boxesX; boxX++) {
        const group: CellRef[] = [];
        for (let offsetRow = 0; offsetRow < dimensions.boxHeight; offsetRow++) {
          for (let offsetCol = 0; offsetCol < dimensions.boxWidth; offsetCol++) {
            group.push({
              row: boxY * dimensions.boxHeight + offsetRow,
              col: boxX * dimensions.boxWidth + offsetCol,
            });
          }
        }
        groups.push(group);
      }
    }

    return groups;
  }

  clear(dimensions: BoardDimensions) {
    this.dimensions = { ...dimensions };
    this.board = createBoard(this.dimensions);
    this.groups = this.createGroups();
    this.solved = false;
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
    const { dimensions } = this;
    const board: (Pick<BoardCell, 'value' | 'locked'> | undefined)[][] = Array.from({ length: getBoardSize(dimensions).height }, () => []);

    this.forEachCell((cell, row, col) => {
      const { value, locked } = cell;
      if (value) board[row][col] = { value, locked };
    });

    const toSave: SaveFormat = {
      dimensions,
      board,
    };
    localStorage.setItem(saveKey, JSON.stringify(toSave));
  }

  load() {
    const str = localStorage.getItem(saveKey);
    if (str) {
      const saveFormat = JSON.parse(str) as SaveFormat;
      if (saveFormat && saveFormat.board) {
        const { board, boxSize = 3, dimensions } = saveFormat;
        this.dimensions = dimensions ?? {
          boxWidth: boxSize,
          boxHeight: boxSize,
          boxesX: boxSize,
          boxesY: boxSize,
        };

        this.board = createBoard(this.dimensions);
        this.createGroups();
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
    const setSize = getSetSize(this.dimensions);

    this.forEachCell(cell => {
      cell.possibleValues = cell.value ? [cell.value] : Array.from({ length: setSize }, (_, i) => i + 1);
      cell.determinedValue = undefined;
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
      for (let i = 1; i <= setSize; i++) {
        if (!cells.some(x => x.value == i)) {
          const possibleCells = cells.filter(x => x.possibleValues?.includes(i));
          if (possibleCells.length === 1) {
            if (possibleCells[0].possibleValues?.length !== 1) {
              possibleCells[0].determinedValue = i;
            }
          }
        }
      }
    }

    let solved = true;
    this.forEachCell(cell => {
      cell.invalid = (!!cell.value && (cell.value > setSize || !cell.possibleValues?.includes(cell.value))) || cell.possibleValues?.length === 0;
      if (!cell.value || cell.invalid) {
        solved = false;
      }
    });
    this.solved = solved;
  }

  private forEachCell(action: (cell: BoardCell, row: number, col: number) => void) {
    const { board } = this;
    const { width, height } = getBoardSize(this.dimensions);

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        action(board[row][col], row, col);
      }
    }
  }
}

function createBoard(dimensions: BoardDimensions): BoardCell[][] {
  const board: BoardCell[][] = [];
  const { width, height } = getBoardSize(dimensions);
  for (let r = 0; r < height; r++) {
    const row: BoardCell[] = [];
    for (let c = 0; c < width; c++) {
      row[c] = {};
    }
    board[r] = row;
  }
  return board;
}
