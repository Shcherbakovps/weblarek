import { Component } from "../base/Component";
import { CardCatalogView } from "./CardCatalogView";

interface IGalleryData {
    cards: CardCatalogView[];
}

export class GalleryView extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data?: IGalleryData): HTMLElement {
      super.render(data);

      if (data && data.cards) {
        const elements = data.cards.map(card => card.render());
        this.container.replaceChildren(...elements);
      }

      return this.container;
    }

    clear() {
        this.container.innerHTML = '';
    }
}