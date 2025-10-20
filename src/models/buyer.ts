import { IEvents } from "../components/base/Events";
import { IBuyer, TPayment } from "../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(private events: IEvents) {}

  //метод заполнения данных
  setBuyerData(data: IBuyer): void {
    this.payment = data.payment;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
    this.events.emit('buyer:changed', this.getBuyerData());
  }

  //Получаем объект с данными покупателя
  getBuyerData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  //сбрасываем значения всех полей
  clear(): void {
    this.payment = null;
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:cleared');
  }

  //проверяем заполненность каждого поля 
  validate(): boolean {
    const isValid = Boolean(this.payment && this.address && this.phone && this.email);
    this.events.emit('buyer:validated', { valid: isValid }); 
    return isValid;
  }
}
