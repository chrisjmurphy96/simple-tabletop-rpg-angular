import { PlayerColor } from "./playerColor";

export interface PlayerState {
    id: string | null;
    style_left: string;
    style_top: string;
    color: PlayerColor;
    name: string;
}

export function stateHasChanged(lastState: PlayerState, currentState: PlayerState): boolean {
    return lastState.style_left !== currentState.style_left ||
        lastState.style_top !== currentState.style_top ||
        lastState.color !== currentState.color ||
        lastState.name !== currentState.name;
}