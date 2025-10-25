import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CardBaseView } from "./CardBaseView";


export class CardBasketView extends CardBaseView {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('cart:remove-item', { id });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}
