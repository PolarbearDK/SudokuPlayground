import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SudokuModule } from './sudoku/sudoku.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SudokuModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
