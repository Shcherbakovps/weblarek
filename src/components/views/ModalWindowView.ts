import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class ModalWindowView extends Component<{}> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        //закрыть модалку по клику на кнопку
        this.closeButton.addEventListener('click', () => this.close());
        //закрыть по клику на фон
        this.container.addEventListener('click', (evt) => {
            if(evt.target === this.container)  {
                this.close();
            }
        }); 
    }

    open(content: HTMLElement | string) {
        if (typeof content === 'string') {
            this.contentElement.innerHTML = content;
        } else {
            this.contentElement.replaceChildren(content);
        }

        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
    }
}