import { Component } from "../base/Component";

interface IGalleryData {
    cards: HTMLElement[];
}

export class GalleryView extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data?: IGalleryData): HTMLElement {
      super.render(data);

      if (data && data.cards) {
        this.container.replaceChildren(...data.cards);
      }

      return this.container;
    }

    clear() {
        this.container.innerHTML = '';
    }
}