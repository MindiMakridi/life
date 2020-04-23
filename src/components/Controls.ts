import Component from './Component';
import EraserCheckbox from './EraserCheckbox';
import TableComponent from './Table';
import Controller from '../Controller';
import Observer from '../Observer';
import ControllerEvent from '../Event';
import Figure from './figures/Figure';
import Glider from './figures/Glider';
import SmallExploder from './figures/SmallExploder';
import Exploder from './figures/Exploder';
import Spaceship from './figures/Spaceship';
import Tumbler from './figures/Tumbler';
import GliderGun from './figures/GliderGun';

class ControlsComponent implements Component, Observer {

    private controls: HTMLElement;
    private startButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;

    constructor(private controller: Controller, private table: TableComponent) {
        this.controls = this.createControls();      
    }

    private createControls(): HTMLElement {
        const controls: HTMLElement = document.createElement('div');
        controls.classList.add('controls');
        controls.appendChild(this.createSizeSection());
        controls.appendChild(this.createSpeedSection());
        controls.appendChild(this.createOptionsSection());
        controls.appendChild(this.createButtonsSection());
        controls.appendChild(this.createFiguresSelect());
        controls.appendChild(this.createFigureContainer());
        return controls;
    }

    private createSizeSection(): HTMLElement{
        const sizesSection: HTMLElement = document.createElement('article');
        sizesSection.appendChild(this.createRowsSelect());
        sizesSection.appendChild(this.createColumnsSelect());
        return sizesSection;
    }

    private createRowsSelect(): HTMLLabelElement {
        const label: HTMLLabelElement = document.createElement("label");
        const span: HTMLSpanElement = document.createElement("span");
        span.innerHTML = "Rows: ";
        const select: HTMLSelectElement = this.createSelect();
        select.onchange = (e: Event) => {
            this.controller.rows = +select.value;
        };
        label.appendChild(span);
        label.appendChild(select);
        return label;
    }

    private createSelect(): HTMLSelectElement {
        const select: HTMLSelectElement = document.createElement('select');
        for(let i = 30; i <= 500; i += 10) {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = i.toString();
            option.innerText = i.toString();
            select.appendChild(option);
        }
        return select;
    }

    private createColumnsSelect(): HTMLLabelElement {
        const label: HTMLLabelElement = document.createElement("label");
        const span: HTMLSpanElement = document.createElement("span");
        span.innerHTML = "Columns: ";
        const select: HTMLSelectElement = this.createSelect();
        select.onchange = (e: Event) => {
            this.controller.columns = +select.value;
        };
        label.appendChild(span);
        label.appendChild(select);
        return label;
    }

    private createSpeedSection(): HTMLElement {
        const speedSection: HTMLElement = document.createElement("article");
        speedSection.innerText = "Speed: ";
        speedSection.appendChild(this.createSpeedUpButton());
        speedSection.appendChild(this.createSpeedDownButton());
        return speedSection;
    }

    private createSpeedUpButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = "↑";
        button.onclick = (e: Event) => {
            this.controller.speedUp();
        }
        return button;
    }

    private createSpeedDownButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = "↓";
        button.onclick = (e: Event) => {
            this.controller.speedDown();
        }
        return button;
    }

    private createOptionsSection(): HTMLElement {
        const optionsSection: HTMLElement = document.createElement('article');
        optionsSection.innerText = "Draw mode: ";
        optionsSection.appendChild(this.createEraserModeCheckbox());
        optionsSection.appendChild(this.createBoundariesCheckbox());
        return optionsSection;
    }

    private createEraserModeCheckbox(): HTMLElement {
        const checkbox: EraserCheckbox = <EraserCheckbox>document.createElement('eraser-checkbox');
        checkbox.onchange = (e: Event) => {
            this.table.toggleMode();
        };
        return checkbox;
    }

    private createButtonsSection(): HTMLElement {
        const buttons: HTMLElement = document.createElement('article');
        this.startButton = this.createStartButton();
        this.pauseButton = this.createPauseButton();
        buttons.appendChild(this.startButton);
        buttons.appendChild(this.pauseButton);
        buttons.appendChild(this.createResetButton());
        return buttons;
    }

    private createStartButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = "Start";
        button.onclick = (e: Event) => {
            this.controller.start();
        }
        return button;
    }

    private createPauseButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = "Pause";
        button.style.display = 'none';
        button.onclick = (e: Event) => {
            this.controller.pause();
        }
        return button;
    }

    private createResetButton(): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.innerText = "Reset";
        button.onclick = (e: Event) => {
            this.controller.reset();
        }
        return button;
    }

    private createBoundariesCheckbox(): HTMLLabelElement {
        const label: HTMLLabelElement = document.createElement('label');
        const checkbox: HTMLInputElement = document.createElement('input');
        label.innerHTML = "<span>Boundaries</span>"
        checkbox.type = 'checkbox';
        checkbox.checked = this.controller.hasBoundaries;
        checkbox.onchange = (e: Event) => {
            this.controller.hasBoundaries = checkbox.checked;
        }
        label.appendChild(checkbox);
        return label;
    }

    private createFiguresSelect(): HTMLLabelElement {
        const label: HTMLLabelElement = document.createElement('label')
        label.innerHTML = '<span>Figure </span>';
        const select: HTMLSelectElement = document.createElement('select');
        select.appendChild(document.createElement('option'));
        Object.keys(this.getFigures()).forEach((figureName: string) => {
            const option: HTMLOptionElement = document.createElement('option');
            option.value = figureName;
            option.innerText = figureName;
            select.appendChild(option);
        });
        select.onchange = (e: Event) => {
            this.controls.querySelector('.figure-container').innerHTML = "";
            if (select.value) {
                this.controls.querySelector('.figure-container').appendChild(this.getFigures()[select.value].getDOMElement());
            }
        };
        label.appendChild(select);
        return label;
    }

    private getFigures(): {[figureName: string]: Figure} {
        return {
            'Glider': new Glider(this.controller),
            'Spaceship': new Spaceship(this.controller),
            'SmallExploder': new SmallExploder(this.controller),
            'Exploder': new Exploder(this.controller),
            'Tumbler': new Tumbler(this.controller),
            'Gosper Glider Gun': new GliderGun(this.controller),
        };
    }

    private createFigureContainer(){
        const figureContainer: HTMLDivElement = document.createElement('div');
        figureContainer.classList.add('figure-container');
        return figureContainer;
    }

    getDOMElement(): HTMLElement {
        return this.controls;
    }

    notify(event: ControllerEvent): void {
        switch(event.type) {
            case 'pause': 
                this.showStartButton();
                break;
            case 'start':
                this.showPauseButton();
                break;
        }
    }

    private showStartButton(): void {
        this.startButton.style.display = 'inline';
        this.pauseButton.style.display = 'none';
    }

    private showPauseButton(): void {
        this.startButton.style.display = 'none';
        this.pauseButton.style.display = 'inline';
    }
}

export default ControlsComponent;