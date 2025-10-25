import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from "../../utils/constants";
import { CardBaseView } from "./CardBaseView";

export class CardCatalogView extends CardBaseView {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.container.addEventListener('click', () => {
            this.events.emit('card:select', {id: this.container.dataset.id});
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set image(value: string) {
    // Если уже абсолютный URL — оставляем как есть
      if (value.startsWith('http')) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || '');
        return;
      }

    // Убираем возможный ведущий слэш и повтор "weblarek/"
    const cleanPath = value.replace(/^\/+/, '').replace(/^weblarek\//, '');
    const src = `${CDN_URL}/${cleanPath}`;
    this.setImage(this.imageElement, src, this.titleElement.textContent || '');
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        // Удаляем все старые модификаторы card__category_*
        this.categoryElement.className = 'card__category';

        // Находим суффикс из константы категори.мап в утилях
        const modifier = categoryMap[value.toLowerCase()];

        // Если нашли — добавляем модификатор
        if (modifier) {
            this.categoryElement.classList.add(`card__category_${modifier}`);
        }
    }
}