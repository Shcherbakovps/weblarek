import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class SuccessView extends Component<{}> {
  private closeButton: HTMLButtonElement;
  private descriptionElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
  }

  setDescription(text: string) {
    this.descriptionElement.textContent = text;
  }
  
  setTransactionValue(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }

  onClose(handler: () => void) {
    this.closeButton.addEventListener('click', handler);
  }

  render(): HTMLElement {
    return this.container;
  }
}
