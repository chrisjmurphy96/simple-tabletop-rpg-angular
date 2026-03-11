import { PlayerColor } from "./playerColor";

export class PlayerState {
    constructor(public id: string | null = null, public style_left = '', public style_top = '', public color: PlayerColor = 'blue', public name = 'Name here') { }
}