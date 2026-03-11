import { NgClass, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { PlayerColor } from './playerColor';
import { PlayerState, stateHasChanged } from './playerState';

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
  imports: [NgClass, FormsModule, TitleCasePipe],
  templateUrl: './player.html',
  styleUrl: './player.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Player implements OnInit {
  public static get initialStateBinding() {
    return 'initialState';
  };

  public readonly initialState = input<PlayerState>({
    id: null,
    style_left: '',
    style_top: '',
    color: 'blue',
    name: 'Name here'
  });

  // it's possible I've overcomplicated the output logic,
  // however I am not familiar enough with the new Signal logic to tell for sure.
  // I do see hints this may be all we've got though...
  // https://github.com/angular/angular/issues/57208
  // maybe can use model()? Would need to rewrite an awful lot. 
  // Not sure I'd like the new implementation either.
  // public stateUpdate = output<PlayerState>();
  private _lastState?: PlayerState;
  private readonly _currentState = linkedSignal<PlayerState>(() => {
    if (this.color() === 'purple'){
      console.log(this.name());
    }
    return {
      id: this._id(),
      style_left: this._styleLeft(),
      style_top: this._styleTop(),
      color: this.color(),
      name: this.name()
    };
  });

  public readonly color = signal<PlayerColor>('blue');
  public colorDropdownOptions: PlayerColor[] = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
  public readonly showColorDropdown = signal(false);
  public readonly style = computed(() => `left: ${this._styleLeft()}; top: ${this._styleTop()};`);
  public readonly name = model('Name here');
  private _id = signal<string | null>(null);
  // half the length - box width - both borders' width
  private readonly _styleLeft = signal('calc(50vw - 4.9em)');
  private readonly _styleTop = signal('calc(50vh - 4.9em)');
  private _currentMouseX = 0;
  private _currentMouseY = 0;
  private _topLevelDiv?: HTMLDivElement;

  public constructor(private _httpClient: HttpClient) { }

  /**
   * trying to write state on an interval in *each* object is
   * probably a terrible idea, would not scale at all.
   * Instead, we should snapshot *all* of the objects' states every second or something?
   * 
   * stretch goal: determine if state has actually changed. Then we don't have to write
   * if nothing has.
   */
  public ngOnInit(): void {
    this._lastState = this.initialState();
    if (this.initialState().id !== null) {
      this._id.set(this.initialState().id);
      this._styleLeft.set(this.initialState().style_left);
      this._styleTop.set(this.initialState().style_top);
      this.color.set(this.initialState().color);
      this.name.set(this.initialState().name);
    }
    // this kind of logic might be prime for moving out to a web worker
    const oneSecondInMilliseconds = 1000;
    interval(oneSecondInMilliseconds)
      .subscribe(() => {
        if (stateHasChanged(this._lastState!, this._currentState())) {
          this._lastState = this._currentState();
          this.updatePlayerState();
        }
      });
  }

  private updatePlayerState(): void {
    this._httpClient
      .post('/players/update', { player: this._currentState() }, {
        responseType: 'text'
      })
      // TODO: This will trigger updating the id for _currentState, which is great,
      // but I'd like to avoid triggering a redraw from angular.
      // Not sure what the current options for this are.
      .subscribe({
        next: (id?: string) => {
          if (id && id !== this._id()) {
            this._id.set(id);
          }
        }
      });
  }

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
    this._currentMouseX = event.clientX;
    this._currentMouseY = event.clientY;
    this._topLevelDiv.addEventListener('mousemove', this.positionUpdater);
  }

  public endDrag(event: MouseEvent, topLevelDiv: HTMLDivElement): void {
    event.preventDefault();
    topLevelDiv.removeEventListener('mousemove', this.positionUpdater);
  }

  private positionUpdater = ((event: MouseEvent) => {
    event.preventDefault();
    const deltaX = this._currentMouseX - event.clientX;
    const deltaY = this._currentMouseY - event.clientY;
    this._currentMouseX = event.clientX;
    this._currentMouseY = event.clientY;
    if (!this._topLevelDiv) {
      throw 'no top level div found';
    }
    this._styleLeft.set(`${this._topLevelDiv.offsetLeft - deltaX}px`);
    this._styleTop.set(`${this._topLevelDiv.offsetTop - deltaY}px`);
  }).bind(this);
}
