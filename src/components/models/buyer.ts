import { IEvents } from "../base/Events";
import { IBuyer, TPayment } from "../../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(private events: IEvents) {}

  setBuyerData(data: Partial<IBuyer>): void {
    const changedFields: string[] = [];

    if (data.payment !== undefined) {
      this.payment = data.payment;
      changedFields.push('payment');
    }
    if (data.address !== undefined) {
      this.address = data.address;
      changedFields.push('address');
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      changedFields.push('phone');
    }
    if (data.email !== undefined) {
      this.email = data.email;
      changedFields.push('email');
    }

    if (changedFields.length > 0) {
      this.events.emit('buyer:changed', { fields: changedFields });
      this.validate(changedFields);
    }
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:cleared');
  }

    validate(fields?: string[], step: 'order' | 'contacts' = 'order'): boolean {
    const validation = {
      payment: this.payment !== null,
      address: this.address.trim().length > 0,
      phone: /^\+?\d{10,15}$/.test(this.phone),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email),
    };

    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const required = step === 'order'
    ?['payment', 'address']
    :['phone', 'email'];
    const toCheck = fields || required;

    for (const field of toCheck) {
      if (field === 'payment' && !validation.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
      }
      if (field === 'address' && !validation.address) {
        errors.address = 'Необходимо указать адрес';
      }
      if (field === 'phone' && !validation.phone) {
        errors.phone = 'Введите корректный номер телефона';
      }
      if (field === 'email' && !validation.email) {
        errors.email = 'Введите корректный email';
      }
    }

    const isValid = Object.keys(errors).length === 0;

    this.events.emit('buyer:validated', { valid: isValid, errors, step });
    return isValid;
  }
}

