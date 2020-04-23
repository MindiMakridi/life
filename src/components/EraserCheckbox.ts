const css = require('../../style/eraser-checkbox.css').toString();

class EraserCheckboxComponent extends HTMLElement {
    private input: HTMLInputElement;
    constructor(){
        super();
        const shadow: ShadowRoot = this.attachShadow({mode: 'open'});
        const label: HTMLLabelElement = document.createElement('label');
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'checkbox');
        this.input.onchange = (e: Event) => {
            label.classList.toggle('active');
            e = new Event('change');
            this.dispatchEvent(e);
        };
        this.input.checked = this.checked;
        const style: HTMLStyleElement = document.createElement('style');
        style.innerHTML = css;
        label.appendChild(this.input);
        shadow.appendChild(label);
        shadow.appendChild(style);
    }

    get checked(): boolean {
        return this.input.checked;
    }

    set checked(value: boolean) {
        this.input.checked = value;
    }
}

export default EraserCheckboxComponent;