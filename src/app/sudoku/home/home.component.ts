import { Component, OnInit } from '@angular/core';

import { BoardDimensions } from '../board/board.model';
import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public boardService: BoardService;
  public newDimensions: BoardDimensions;
  public saveKey: string;

  locked = false;

  constructor() {
    this.boardService = new BoardService();
    this.saveKey = this.boardService.getLastSaveKey();
    this.newDimensions = { ...this.boardService.dimensions };
  }
  get board() {
    return this.boardService.board;
  }

  get dimensions(): BoardDimensions {
    return this.boardService.dimensions;
  }

  get solved(): boolean {
    return this.boardService.solved;
  }

  ngOnInit(): void {
    this.onLoad();
  }

  onNew() {
    this.boardService.clear(this.newDimensions);
    this.locked = false;
  }

  onReset() {
    this.boardService.reset();
  }

  onEdit() {
    this.boardService.unLock();
    this.locked = false;
  }

  onLock() {
    this.boardService.lock();
    this.locked = true;
  }

  onLoad() {
    if (this.boardService.load(this.saveKey)) {
      this.locked = this.boardService.isLocked();
      this.newDimensions = { ...this.boardService.dimensions };
    }
  }

  onSave() {
    this.boardService.save(this.saveKey);
  }

  onCheck() {
    this.boardService.check();
  }
}
