import { IBuyer, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class OrderView extends Component<{}> {
  private formElement: HTMLFormElement;
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement;

  private payment: TPayment | null = null;

  constructor(container: HTMLElement) {
    super(container);
    
    if (this.container instanceof HTMLFormElement && this.container.getAttribute('name') === 'order') {
      this.formElement = this.container as HTMLFormElement;
      } else {
       this.formElement = ensureElement<HTMLFormElement>('form[name="order"]', this.container);
    }
    
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

    // выбор способа оплаты
    this.cardButton.addEventListener('click', () => this.selectPayment('card'));
    this.cashButton.addEventListener('click', () => this.selectPayment('cash'));

    // отправка формы
    this.formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      if (this.validate()) {
        const data: IBuyer = {
          payment: this.payment as TPayment, // здесь безопасно: validate() гарантирует что payment не null
          address: this.addressInput.value,
          phone: '',
          email: ''
        };
        this.onSubmitCallback?.(data);
      }
    });

    this.updateSubmitState();
  }

  private onSubmitCallback?: (data: IBuyer) => void;

  onSubmit(handler: (data: IBuyer) => void) {
    this.onSubmitCallback = handler;
  }

  private selectPayment(type: TPayment) {
    this.payment = type;
    this.cardButton.classList.toggle('button_alt-active', type === 'card');
    this.cashButton.classList.toggle('button_alt-active', type === 'cash');
    this.updateSubmitState();
  }

  private updateSubmitState() {
    this.submitButton.disabled = !this.payment || !this.addressInput.value.trim();
  }

  // добавлена реализация validate, ранее отсутствовала — это и была одна из ошибок
  private validate(): boolean {
    this.errorElement.textContent = '';

    if (!this.payment) {
      this.errorElement.textContent = 'Выберите способ оплаты';
      return false;
    }

    if (!this.addressInput.value.trim()) {
      this.errorElement.textContent = 'Укажите адрес доставки';
      return false;
    }

    return true;
  }

  fill(data: Partial<IBuyer>) {
    if (data.address) this.addressInput.value = data.address;
    if (data.payment) this.selectPayment(data.payment);
    this.updateSubmitState();
  }

  setErrors(text: string) {
    this.errorElement.textContent = text;
  }

  render(): HTMLElement {
    return this.container;
  }
}
