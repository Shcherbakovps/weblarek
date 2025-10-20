import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


export class ContactView extends Component<{}> {
    private formElement: HTMLFormElement;
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private errorElement: HTMLElement;

    private onSubmitCallback?: (data: Partial<IBuyer>) => void;

    constructor(container: HTMLElement) {
      super(container);
      
      if (this.container instanceof HTMLFormElement && this.container.getAttribute('name') === 'contacts') {
         this.formElement = this.container as HTMLFormElement;
         } else {
         this.formElement = ensureElement<HTMLFormElement>('form[name="contacts"]', this.container);
      }

      this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
      this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
      this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
      this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);

      this.formElement.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const data = {
          email: this.emailInput.value.trim(),
          phone: this.phoneInput.value.trim()
        };
      
        if (this.validate(data)) {
          this.onSubmitCallback?.(data);
        }
      });

      // простая валидация на ввод (включаем кнопку, если заполнено что-то)
      this.emailInput.addEventListener('input', () => this.updateSubmitState());
      this.phoneInput.addEventListener('input', () => this.updateSubmitState());

      this.updateSubmitState(); 
    }

    onSubmit(handler: (data: Partial<IBuyer>) => void) {
    this.onSubmitCallback = handler;
  }

  private validate(data: { email: string; phone: string }): boolean {
    this.errorElement.textContent = '';
    if (!data.email && !data.phone) {
      this.errorElement.textContent = 'Заполните Email или Телефон';
      return false;
    }
    return true;
  }

  private updateSubmitState() {
    this.submitButton.disabled = !(this.emailInput.value.trim() || this.phoneInput.value.trim());
  }

  render(): HTMLElement {
    return this.container;
  }
}

