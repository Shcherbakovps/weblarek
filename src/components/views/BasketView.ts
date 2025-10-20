import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { CardBasketView } from "./CardBasketView";

export class BasketView extends Component<{}> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    }

    //Отрисовка карточек, лежащих в корзине из массива КардБаскетВью
    renderCards(cards: CardBasketView[]) {
        const elements = cards.map(element => element.render());
        this.listElement.replaceChildren(...elements);
    }

    setTotalPrice(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    onOrder(handler: () => void) {
        this.orderButton.addEventListener('click', handler);
    }

    render(): HTMLElement {
        return this.container;
    }
}