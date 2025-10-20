import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { CDN_URL } from "../../utils/constants";

export class CardPreviewView extends Component<IProduct> {
    private imageElement: HTMLImageElement;
    private titleElement: HTMLElement;
    private textElement: HTMLElement;
    private priceElement: HTMLElement;
    private addButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
      super(container);
      this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
      this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
      this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
      this.addButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);  

      //вешаем слушатель на кнопку
      this.addButtonElement.addEventListener('click', () => {
        if (this.container.dataset.id) {
            this.events.emit('card:add-to-cart', {id: this.container.dataset.id});
        }
      });
    }
    
    set id(value: string) {
        this.container.dataset.id = value;
    }

    set image(value: string) {
      if (value.startsWith('http')) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || '');
        return;
      }

      const cleanPath = value.replace(/^\/+/, '').replace(/^weblarek\//, '');
      const src = `${CDN_URL}/${cleanPath}`;

      console.log('preview image cleaned:', value, '->', src);
      this.setImage(this.imageElement, src, this.titleElement.textContent || '');
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно'
    }

    render(): HTMLElement {
        return this.container;
    }
}