import { ensureElement } from "../../utils/utils";
import { IBuyer } from "../../types";
import { BaseFormView } from "./BaseFormView";
import { IEvents } from "../base/Events";

export class OrderView extends BaseFormView<IBuyer> {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

        this.cardButton.addEventListener('click', () =>
            this.handleInput('payment', 'card')
        );

        this.cashButton.addEventListener('click', () =>
            this.handleInput('payment', 'cash')
        );

        this.addressInput.addEventListener('input', () =>
            this.handleInput('address', this.addressInput.value.trim())
        );
    }

    render(state?: IBuyer): HTMLElement {
        if (state) {
            this.addressInput.value = state.address ?? '';
            this.cardButton.classList.toggle('button_alt-active', state.payment === 'card');
            this.cashButton.classList.toggle('button_alt-active', state.payment === 'cash');
        }
        return super.render(state);
    }
}