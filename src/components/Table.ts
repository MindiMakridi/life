import Component from './Component';
import Controller from '../Controller';
import Observer from '../Observer';
import Event from '../Event';
import Point from '../Point';

class TableComponent implements Component, Observer {

    private table: HTMLTableElement;
    private toggleModeSetLive: boolean = true; 

    constructor(private controller: Controller) {
        this.table = this.createTable();
        const mouseMoveHandler = this.getMousemoveHandler();
        this.table.onmousedown = e => {
            e.preventDefault();
            document.addEventListener('mousemove', mouseMoveHandler);
            document.onmouseup = () => document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }

    private createTable(): HTMLTableElement {
        const table = document.createElement("table");
        table.classList.add('game-table');
        table.setAttribute('border', "1");
        this.createRows(table);
        return table;
    }

    private createRows(table: HTMLTableElement) {
        table.innerHTML = "";
        for (let y = 0; y < this.controller.rows; y++) {
            let row = document.createElement("tr");
            for (let x = 0; x < this.controller.columns; x++) {
                let column = document.createElement('td');
                column.onclick = () => {
                    this.toggleCell(new Point(x, y));
                };
                row.appendChild(column);
            }
            table.appendChild(row);
        }
    }

    private toggleCell(point: Point): void {
        this.toggleModeSetLive ? this.controller.setLive(point) : this.controller.setEmpty(point);
    }

    getDOMElement(): HTMLElement {
        return this.table;
    }

    notify(event: Event): void {
        switch(event.type) {
            case 'reset':
            case 'setRows':
            case 'setColumns':
                this.createRows(this.table);
                break;
            case 'setLive':
            case 'setEmpty':
                this.updateCell(event.point);
                break;
            case 'turn':
                this.updateTable();
                break;
        }
    }

    private updateCell(point: Point): void {
        const cell = this.table.querySelectorAll("tr")[point.y].querySelectorAll('td')[point.x];
        if (this.controller.getPoint(point)) {
            cell.classList.add('active')
        } else {
            cell.classList.remove('active');
        }
    }

    private updateTable(): void {
        this.table.querySelectorAll('tr').forEach((row: HTMLTableRowElement, y: number) => {
            row.querySelectorAll('td').forEach((cell: HTMLTableDataCellElement, x: number) => {
                this.updateCell(new Point(x, y));
            });
        });
    }

    toggleMode(): void {
        this.toggleModeSetLive = !this.toggleModeSetLive;
        if(this.toggleModeSetLive) {
            this.table.classList.remove('eraser');
        } else {
            this.table.classList.add('eraser');
        }
    }

    private getMousemoveHandler(): (this: Document, e: MouseEvent) => any {
        return function (this: Document, e: MouseEvent) {
            const target: Element = <Element>e.target;
            const elem: Element = target.shadowRoot ? target.shadowRoot.elementFromPoint(e.x, e.y) : null;
            if (elem) {
                elem.dispatchEvent(new Event('click'));
            }
        };
    }
}

export default TableComponent;