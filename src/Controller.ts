import Game from './Game';
import Observer from './Observer';
import Event from './Event';
import Point from './Point';

class Controller {
    private game: Game;
    private intervalId: number;
    private observers: Array<Observer>;

    constructor(rows = 10, columns = 10, private speed = 1) {
        rows = rows ? rows : 10;
        columns = columns ? columns : 10;
        this.speed = this.speed ? this.speed : 1;
        this.observers = [];
        this.game = new Game(rows, columns);
    }

    subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    unsubscribe(observer: Observer): void {
        this.observers.filter((obs: Observer): boolean => obs != observer);
    }

    updated(params: {type: string}): void {
        let event: Event = {
            game: this.game,
            intervalId: this.intervalId,
            speed: this.speed,
            rows: this.game.rows,
            columns: this.game.columns,
            hasBoundaries: this.game.hasBoundaries,
            ... params
        };
        this.observers.forEach((observer: Observer) => {
            observer.notify(event);
        });
    }

    speedUp(): void {
        this.pause();
        this.speed++;
        this.start();
        this.updated({type: 'speedUp'});
    }

    speedDown(): void {
        this.pause();
        if (this.speed <= 1) {
            this.speed/=2; 
        } else {
            this.speed-=1;
        }
        this.start();
        this.updated({type: 'speedDown'});
    }

    pause(): void {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.updated({type: 'pause'});
    }

    start(): void {
        this.intervalId = window.setInterval(() => {
            this.game.turn();
            this.updated({type: 'turn'});
        }, 1000/this.speed);
        this.updated({type: 'start'});
    }

    reset(): void {
        this.pause();
        this.game.initialize(this.game.rows, this.game.columns);
        this.updated({type: 'reset'});
    }

    setLive(point: Point): void {
        this.pause();
        this.game.setLive(point);
        this.updated(<any>{type: 'setLive', point});
    }

    setEmpty(point: Point): void {
        this.pause();
        this.game.setEmpty(point);
        let obj  = {type: 'setEmpty', point};
        this.updated(<any>{type: 'setEmpty', point});
    }

    getPoint(point: Point): boolean {
        return this.game.getPoint(point);
    }

    isOn(): boolean {
        return this.intervalId != null;
    }

    get rows(): number {
        return this.game.rows;
    }

    get columns(): number {
        return this.game.columns;
    }

    set rows(rows: number) {
        this.pause();
        this.game.initialize(rows, this.game.columns);
        this.updated({type: 'setRows'});
    }

    set columns(columns: number) {
        this.pause();
        this.game.initialize(this.game.rows, columns);
        this.updated({type: 'setColumns'});
    }

    get hasBoundaries(): boolean {
        return this.game.hasBoundaries;
    }

    set hasBoundaries(value: boolean) {
        this.game.hasBoundaries = value;
    }
}

export default Controller;