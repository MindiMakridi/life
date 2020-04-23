import Game from './Game';
import Point from './Point';

interface Event {
    type: string;
    game: Game;
    intervalId: number;
    speed: number;
    rows: number;
    columns: number;
    hasBoundaries: boolean;
    point?: Point;
    [propName: string]: any;
}

export default Event;