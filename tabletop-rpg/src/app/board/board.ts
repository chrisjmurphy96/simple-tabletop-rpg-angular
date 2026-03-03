import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { Player } from '../player/player';

@Component({
  selector: 'app-board',
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Board {
  /** 
   * First index is x, second index is y.
   * Might make a proper coordinate class if this ends up being confusing/clunky to use.
   */
  public gridCells = Board.generateGridCells();

  private static get _rowCount() {
    return 10;
  }
  private static get _columnCount() {
    return 10;
  }

  public constructor(private _viewContainerRef: ViewContainerRef) { }

  /**
   * Nicer way to implement this is to make a wrapper component that lets me place
   * this exactly where I want it.
   * https://angular.dev/guide/components/programmatic-rendering#using-viewcontainerref
   */
  public addPlayer(): void {
    this._viewContainerRef.createComponent(Player);
  }

  private static generateGridCells(): any[][] {
    const grid = new Array(Board._rowCount);
    for (let i = 0; i < Board._columnCount; i++) {
      grid[i] = new Array(Board._rowCount);
    }
    return grid;
  }
}