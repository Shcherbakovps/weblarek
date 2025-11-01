import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { CardBaseView } from "./CardBaseView";
import { categoryMap } from "../../utils/constants";


export class CardPreviewView extends CardBaseView {
    private imageElement: HTMLImageElement;
    private textElement: HTMLElement;
    private addButtonElement: HTMLButtonElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
      super(container);
      this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
      this.addButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container); 
      this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container) 

      
      this.addButtonElement.addEventListener('click', () => {
        const id = this.container.dataset.id;
        if (!id) return;

        if (this.addButtonElement.textContent === 'В корзину') {
          this.events.emit('card:add-to-cart', { id });
        } else {
          this.events.emit('cart:remove-item', { id });
        }
      });
    }
    
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
      return this.container.dataset.id || '';
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

    set category(value: string) {
        this.categoryElement.textContent = value;    
        this.categoryElement.className = 'card__category';           
        const modifier = categoryMap[value.toLowerCase()];
                
        if (modifier) {
          this.categoryElement.classList.add(`card__category_${modifier}`);
        }
    }

    set price(value: number | null) {
      super.price = value;

      if (value === null) {
        this.addButtonElement.textContent = 'Недоступно';
        this.addButtonElement.disabled = true;
      } else {
        this.addButtonElement.textContent = 'В корзину';
        this.addButtonElement.disabled = false;
      }
    }

    set goodInCart(value: boolean) {
      if (this.addButtonElement.disabled) {
        return;
      }

      if(value) {
        this.addButtonElement.textContent = 'Удалить из корзины';
      } else {
        this.addButtonElement.textContent = 'В корзину';
      }
    } 

    render(): HTMLElement {
        return this.container;
    }
}