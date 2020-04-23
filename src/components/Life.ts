import TableComponent from './Table';
import ControlsComponent from './Controls';
import Controller from '../Controller';
const css = require('../../style/style.css').toString();

class LifeComponent extends HTMLElement{

    private controller: Controller;

    constructor(){
        super();
        this.controller = new Controller(+this.getAttribute('rows'), +this.getAttribute('columns'), +this.getAttribute('speed'));
        let shadow: ShadowRoot = this.attachShadow({mode: 'open'});
        let table = new TableComponent(this.controller);
        let controls = new ControlsComponent(this.controller, table);
        shadow.appendChild(controls.getDOMElement());
        shadow.appendChild(table.getDOMElement());
        shadow.appendChild(this.getStyle());
        this.controller.subscribe(table);
        this.controller.subscribe(controls);
    }

    private getStyle(): HTMLStyleElement {
        let style: HTMLStyleElement = document.createElement("style");
        style.innerHTML = css;
        return style;
    }
}

export default LifeComponent;