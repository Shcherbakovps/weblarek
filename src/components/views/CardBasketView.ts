import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class CardBasketView extends Component<IProduct> {
    private indexElement: HTMLElement;
    private titleElement: HTMLElement;
    private priceElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        console.log('Ищу кнопку удаления в контейнере:', this.container);

        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        console.log('Нашёл кнопку:', this.deleteButton);

        // Обработчик удаления
        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                console.log('Удаляем товар из корзины:', id);
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

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
    }

    render(): HTMLElement {
        return this.container;
    }
}
