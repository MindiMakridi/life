import Component from '../Component';
import Point from '../../Point';
import Controller from '../../Controller';

abstract class Figure implements Component {

    private coordinates: Array<Array<boolean>>;
    private table: HTMLTableElement;

    constructor(private controller: Controller){
        this.coordinates = this.getCoordinates();
        this.table = this.createTable();
        this.table.onmousedown = e => {
            e.preventDefault();
            const table: HTMLTableElement = this.createCloneTable();
            const mouseMoveHandler: (event: MouseEvent) => any = this.getMouseMoveHandler(table);
            const self = this;
            function mouseUpHandler (event: MouseEvent): any {
                self.getMouseUpHandler(table)(event);
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };
    }

    abstract getCoordinates(): Array<Array<boolean>>;

    getDOMElement(): HTMLTableElement {
        return this.table;
    }

    private createTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.setAttribute('border', "1");
        table.classList.add('figure');
        this.coordinates.forEach((values: boolean[], y: number) => {
            const row = document.createElement('tr');
            values.forEach((value: boolean, x: number) => {
                const cell = document.createElement('td');
                if (value) {
                    cell.classList.add('active');
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        return table;
    }

    private createCloneTable(): HTMLTableElement {
        const table: HTMLTableElement = <HTMLTableElement>this.table.cloneNode(true);
        table.style.position = 'absolute';
        table.style.top = this.table.getBoundingClientRect().top + 'px';
        table.style.left = this.table.getBoundingClientRect().left + 'px';
        table.classList.add('figure', 'draggable');
        this.table.getRootNode().appendChild(table);
        return table;
    }

    private getMouseUpHandler(table: HTMLTableElement): (event: MouseEvent) => any {
        return (event: MouseEvent): any => {
            const root: ShadowRoot = <ShadowRoot>this.table.getRootNode();
            const elements: Element[] = root.elementsFromPoint(table.getBoundingClientRect().left + 1, table.getBoundingClientRect().top + 1);
            elements.forEach((element: Element) => {
                const gameTable = element.closest('.game-table')
                if (gameTable && element != gameTable && this.fitsInside(table)) {
                    this.applyFigure(this.getCellPoint(<HTMLTableDataCellElement>element, <HTMLTableElement>gameTable));
                }
            });
            table.remove();
        };
    }

    private getCellPoint(cell: HTMLTableDataCellElement, table: HTMLTableElement): Point {
        let point: Point;
        table.querySelectorAll('tr').forEach((row: HTMLTableRowElement, y: number) => {
            row.querySelectorAll('td').forEach((td: HTMLTableDataCellElement, x: number) => {
                if (td == cell) {
                    point = new Point(x, y);
                    return;
                }
            });
        });
        return point;
    }
    
    private getMouseMoveHandler(table: HTMLTableElement): (event: MouseEvent) => any {
        let deltaX: number;
        let deltaY: number;
        return (event: MouseEvent): any => {
            if (!deltaX) {
                deltaX = event.x - table.getBoundingClientRect().x;
                deltaY = event.y - table.getBoundingClientRect().y;
            }
            table.style.top = event.y - deltaY + window.scrollY + 'px';
            table.style.left = event.x - deltaX + 'px';
            if (this.fitsInside(table)) {
                table.classList.add('fit');
            } else {
                table.classList.remove('fit');
            }
        };
    }

    private fitsInside(table: HTMLTableElement): boolean {
        let result: boolean = false;
        const tableRect: DOMRect = table.getBoundingClientRect();
        const tables: NodeListOf<Element> = (<ShadowRoot>this.table.getRootNode()).querySelectorAll('.game-table');
        tables.forEach((gameTable: HTMLTableElement) => {
            if (result) return;
            const gameTableRect: DOMRect = gameTable.getBoundingClientRect();
            const overflowLeft: boolean = gameTableRect.left > tableRect.left;
            const overflowRight: boolean = gameTableRect.right < tableRect.right;
            const overflowTop: boolean = gameTableRect.top > tableRect.top;
            const overflowBottom: boolean = gameTableRect.bottom < tableRect.bottom;
            result = !overflowLeft && !overflowRight && !overflowTop && !overflowBottom; 
        });
        return result;
    }

    private applyFigure(coordinatesAdjustment: Point): void {
        this.coordinates.forEach((values: boolean[], y: number) => {
            values.forEach((value: boolean, x: number) => {
                if (value) {
                    this.controller.setLive(new Point(x + coordinatesAdjustment.x, y + coordinatesAdjustment.y));
                }
            });
        });
    }
}

export default Figure;