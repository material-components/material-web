import { html, query, observer, property, Adapter, Foundation, customElement } from '@authentic/mwc-base/base-element.js';
import { FormElement } from '@authentic/mwc-base/form-element.js'
import { classMap } from 'lit-html/directives/class-map.js';
import { style } from './mwc-textfield-css.js';
import MDCTextfieldFoundation from '@material/textfield/foundation.js';

export interface TextfieldFoundation extends Foundation {
    setDisabled(value: boolean): void;
    setValue(value: string): void;
}


export declare var TextfieldFoundation: {
    prototype: TextfieldFoundation;
    new(adapter: Adapter): TextfieldFoundation;
}

declare global {
    interface HTMLElementTagNameMap {
        'mwc-textfield': Textfield;
    }
}

@customElement('mwc-textfield' as any)
export class Textfield extends FormElement {

    protected mdcFoundation!: TextfieldFoundation;
    protected readonly mdcFoundationClass: typeof TextfieldFoundation = MDCTextfieldFoundation;

    @query('.mdc-textfield')
    protected mdcRoot!: HTMLElement

    @query('.mdc-textfield')
    protected formElement!: HTMLElement;

    @property({type: String})
    @observer(function(this: Textfield, value: string) {1
        this.mdcFoundation.setValue(value);
    })
    value = '';

    @property({type: String})
    label = '';

    @property({type: String})
    icon = '';

    @property({type: Boolean})
    iconTrailing = false;

    @property({type: Boolean})
    box = false;

    @property({type: Boolean})
    outlined = false;

    @property({type: Boolean})
    @observer(function(this: Textfield, value: boolean) {
        this.mdcFoundation.setDisabled(value);
    })
    disabled = false;

    @property({type: Boolean})
    fullWidth = true;

    @property({type: Boolean})
    required = false;

    @property({type: String})
    helperText = '';

    @property({type: String})
    placeHolder = '';

    @property({type: String})
    type = '';


    createRenderRoot() {
        return this.attachShadow({mode: 'open', delegatesFocus: true});
    }

    renderStyle() {
        return style;
    }

    render() {
        const {value, label, box, outlined, disabled, icon, iconTrailing, fullWidth, required, placeHolder, helperText, type} = this;
        const hostClassInfo = {
            'mdc-text-field--with-leading-icon': icon && !iconTrailing,
            'mdc-text-field--with-trailing-icon': icon && iconTrailing,
            'mdc-text-field--box': !fullWidth && box,
            'mdc-text-field--outlined': !fullWidth && outlined,
            'mdc-text-field--disabled': disabled,
            'mdc-text-field--fullwidth': fullWidth,
        };
        return html`
            ${this.renderStyle()}
            <div class="mdc-text-field mdc-text-field--upgraded ${classMap(hostClassInfo)}">
            ${!fullWidth && icon ? html`<i class="material-icons mdc-text-field__icon" tabindex="0">${icon}</i>` : ''}
            ${this._renderInput({value, required, type, placeHolder, label})}
            ${!fullWidth && label ? html`<label class="mdc-floating-label ${value ? 'mdc-floating-label--float-above' : ''}" for="text-field">${label}</label>` : ''}
            ${!fullWidth && outlined ? html`<div class="mdc-notched-outline">
                <svg><path class="mdc-notched-outline__path"/></svg>
                </div>
                <div class="mdc-notched-outline__idle"></div>` :
        html`<div class="mdc-line-ripple"></div>`}
            </div>
            ${helperText ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>` : ''}
        `;
    }

    _renderInput({value, required, type, placeHolder, label}) {
        return html`<input type="${type}" placeholder="${placeHolder}" ?required="${required}" class="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" .value="${value}" aria-label="${label}">`;
    }

    firstUpdated() {
        super.firstUpdated();
    }

    get valid() {
        // return this._component && this._component.isValid();
        return true;
    }

    set valid(value) {
        // this.componentReady().then((component) => {
        //     component.setValid(value);
        // });
        console.log(value);
    }

    click() {
        // this._input.click();
    }

    focus() {
        // this._input.focus();
    }

    protected createAdapter() {
        return {
            ...super.createAdapter(),
        }
    }

}
