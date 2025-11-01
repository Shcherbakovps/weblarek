import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface BasketViewState {
    items: HTMLElement[]; 
    total: number;
    isDisabled: boolean;
}

export class BasketView extends Component<BasketViewState> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        
        this.orderButton.addEventListener('click', () => {
            events.emit('basket:order');
        });
    }

    set items(elements: HTMLElement[]) {
        this.listElement.replaceChildren(...elements);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set isDisabled(value: boolean) {
        this.orderButton.disabled = value;
    }
}
