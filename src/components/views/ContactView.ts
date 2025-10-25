import { ensureElement } from "../../utils/utils";
import { BaseFormView } from "./BaseFormView";
import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class ContactView extends BaseFormView<IBuyer> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.emailInput.addEventListener('input', () =>
            this.handleInput('email', this.emailInput.value.trim())
        );

        this.phoneInput.addEventListener('input', () =>
            this.handleInput('phone', this.phoneInput.value.trim())
        );
    }

    render(state?: IBuyer): HTMLElement {
        if (state) {
            this.emailInput.value = state.email ?? '';
            this.phoneInput.value = state.phone ?? '';
        }
        return super.render(state);
    }
  }

