import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { CardBaseView } from "./CardBaseView";


export class CardPreviewView extends CardBaseView {
    private imageElement: HTMLImageElement;
    private textElement: HTMLElement;
    private addButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
      super(container);
      this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
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

    set description(value: string) {
        this.textElement.textContent = value;
    }

    render(): HTMLElement {
        return this.container;
    }
}