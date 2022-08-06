import { Component, OnInit } from '@angular/core';

import { BoardService, getBoardSize } from '../board/board.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private boardService = new BoardService(3);
  locked = false;

  get board() {
    return this.boardService.board;
  }

  get boardSize() {
    return getBoardSize(this.boardService.boxSize);
  }

  ngOnInit(): void {
    this.locked = this.boardService.load();
  }

  onNew() {
    this.boardService.clear();
    this.locked = false;
  }

  onReset() {
    this.boardService.reset();
  }

  onLock() {
    this.boardService.lock();
    this.locked = true;
  }

  onLoad() {
    if (this.boardService.load()) {
      this.locked = true;
    }
  }

  onSave() {
    this.boardService.save();
  }

  onCheck() {
    this.boardService.check();
  }
}
