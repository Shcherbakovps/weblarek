import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export abstract class BaseFormView<TState> extends Component<TState> {
    protected form: HTMLFormElement;
    protected errorElement: HTMLElement;
    protected submitButton?: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        if (container instanceof HTMLFormElement) {
            this.form = container;
        } else {
            this.form = ensureElement<HTMLFormElement>('form', container);
        }

        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.emitSubmit();
        });
    }

    protected emitSubmit() {
        this.events.emit(`${this.form.name}:submit`);
    }

    protected handleInput(field: string, value: string) {
        this.events.emit('buyer:update', { [field]: value });
    }

    onSubmit(handler: () => void) {
        this.events.on(`${this.form.name}:submit`, handler);
    }
    
    setSubmitDisabled(value: boolean) {
        if (this.submitButton) this.submitButton.disabled = value;
    }

    setError(message: string) {
        this.errorElement.textContent = message;
    }

    clearError() {
        this.errorElement.textContent = '';
    }

    render(state?: TState): HTMLElement {
        return this.container;
    }
}
