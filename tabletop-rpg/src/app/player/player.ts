import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';

type PlayerColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'orange';

/**
 * Adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
 * Yes, there is Angular CDK Draggable (https://angular.dev/guide/drag-drop).
 * I wanted to try making it myself. Yes, there is no reason to do this in
 * an actual project, but this one is mine.
 * 
 * State requirements:
 *  - position
 *  - color
 *  - name
 *  - owner?
 * 
 * Stretch goals:
 * - allow this to snap to the grid.
 * - the input field styling is wonky. Would be nice to fix, but possibly time consuming
 * - the color dropdown works, but the styling could use some work. Seems like native HTML
 *   select/option might not play nice with borders.
 * - probably not very intuitive to double click to change player color. What other options would be nice?
 */
@Component({
  selector: 'app-player',
  imports: [NgClass, TitleCasePipe],
  templateUrl: './player.html',
  styleUrl: './player.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Player {
  public color = signal<PlayerColor>('blue');
  public colorDropdownOptions: PlayerColor[] = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
  public showColorDropdown = signal(false);
  public style = signal('');
  public name = model('Name here');
  private _currentX = 0;
  private _currentY = 0;
  private _topLevelDiv?: HTMLDivElement;

  public toggleColorSelect(): void {
    this.showColorDropdown.set(!this.showColorDropdown());
  }

  public updateColor(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.color.set(element.value as PlayerColor);
  }

  /**
   * Originally this was able to just take input directly passed in, but when it came time to implement the
   * color dropdown, that wasn't an option since it's in an 'if' block. Maybe should consolidate this logic.
   */
  public startDrag(event: MouseEvent, topLevelDiv: HTMLDivElement, input: HTMLInputElement): void {
    if (event.target === input || (event.target as HTMLElement)?.tagName === 'SELECT') {
      return;
    }
    event.preventDefault();
    this._topLevelDiv = topLevelDiv;
    this._currentX = event.clientX;
    this._currentY = event.clientY;
    this._topLevelDiv.addEventListener('mousemove', this.positionUpdater);
  }

  public endDrag(event: MouseEvent, topLevelDiv: HTMLDivElement): void {
    event.preventDefault();
    topLevelDiv.removeEventListener('mousemove', this.positionUpdater);
  }

  private positionUpdater = ((event: MouseEvent) => {
    event.preventDefault();
    const deltaX = this._currentX - event.clientX;
    const deltaY = this._currentY - event.clientY;
    this._currentX = event.clientX;
    this._currentY = event.clientY;
    if (!this._topLevelDiv) {
      throw 'no top level div found';
    }
    const left = `${(this._topLevelDiv.offsetLeft - deltaX)}px;`;
    const top = `${(this._topLevelDiv.offsetTop - deltaY)}px;`;
    this.style.set(`left: ${left} top: ${top}`);
  }).bind(this);
}
