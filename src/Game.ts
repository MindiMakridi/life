import Point from './Point';

class Game {
    private _currentGen: Array<Array<boolean>>;
    private _nextGen: Array<Array<boolean>>;
    private _hasBoundaries: boolean;
    

    constructor(rows = 30, columns = 30){
        this.initialize(rows, columns);
        this._hasBoundaries = false;
    }

    initialize(rows = 30, columns = 30): void {
        this._currentGen = Array(rows);
        this._nextGen = Array(rows);
        for (let i = 0; i < rows; i++) {
            this._currentGen[i] = Array(columns).fill(false);
            this._nextGen[i] = Array(columns).fill(false);
        }
    }

    turn(): Array<Point> {
        const updatedPoints: Array<Point> = [];
        this._nextGen.forEach((values: boolean[], y: number) => {
            values.forEach((value: boolean, x: number) => {
                this._nextGen[y][x] = this.isAlive(new Point(x, y));
                if (this._nextGen[y][x] != this._currentGen[y][x]){
                    updatedPoints.push(new Point(x, y));
                }
            });
        });
        this._nextGen.forEach((values: boolean[], y: number) => {
            this._currentGen[y] = values.slice();
        });
        return updatedPoints;
    }

    getPoint(point: Point): boolean {
        let x: number = point.x;
        let y: number = point.y;
        if (this.hasBoundaries && (x < 0 || x >= this.columns || y < 0 || y >= this.rows)) {
            return false;
        }
        x = x < 0 ? (this.columns + x) : x;
        x = x >= this.columns ? (x - this.columns) : x;
        y = y < 0 ? (this.rows + y) : y;
        y = y >= this.rows ? (y - this.rows) : y;
        return this._currentGen[y][x];
    }

    setLive(point: Point): void {
        this._currentGen[point.y][point.x] = true;
    }

    setEmpty(point: Point): void {
        this._currentGen[point.y][point.x] = false;
    }

    get currentGen(): Array<Array<boolean>> {
        return this._currentGen;
    }

    get nextGen(): Array<Array<boolean>> {
        return this._nextGen;
    }

    get rows(): number {
        return this.currentGen.length;
    }

    get columns(): number {
        return this.currentGen[0].length;
    }

    get hasBoundaries(): boolean {
        return this._hasBoundaries;
    }

    set hasBoundaries(value: boolean) {
        this._hasBoundaries = value;
    }

    private isAlive(point: Point): boolean {
        let current: boolean = this.getPoint(point);
        let aliveNeighboursCount: number = this.getNeighbours(point).filter((value: boolean): boolean => value).length;

        return current ? [2,3].includes(aliveNeighboursCount) : aliveNeighboursCount==3;
    }

    private getNeighbours(point: Point): Array<boolean> {
        let neighbours: Array<boolean> = [];
        neighbours.push(this.getPoint(new Point(point.x-1, point.y+1)));
        neighbours.push(this.getPoint(new Point(point.x, point.y+1)));
        neighbours.push(this.getPoint(new Point(point.x+1, point.y+1)));
        neighbours.push(this.getPoint(new Point(point.x+1, point.y)));
        neighbours.push(this.getPoint(new Point(point.x+1, point.y-1)));
        neighbours.push(this.getPoint(new Point(point.x, point.y-1)));
        neighbours.push(this.getPoint(new Point(point.x-1, point.y-1))); 
        neighbours.push(this.getPoint(new Point(point.x-1, point.y)));
        return neighbours;
    }
}

export default Game;