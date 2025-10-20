import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";


interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) { //в конструкторе ищем эл-ты разметки и сохраняем их в эти поля
      super(container);
      //ф-ия иншур находится в утилитах стартера и нужна для поиска элементов
      //поиск производится только внутри контейнера класса
      this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
      this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
      //устанавливаем слушатель на кнопку корзины
      this.basketButton.addEventListener('click', () => {
        this.events.emit('basket:open');
      })
    }

    set counter(value: number) {
      this.counterElement.textContent = String (value); //сеттер меняющий отображение текста в строке
    }
}
