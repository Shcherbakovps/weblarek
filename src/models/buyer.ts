import { IBuyer, TPayment } from "../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  //метод заполнения данных
  setBuyerData(data: IBuyer): void {
    this.payment = data.payment;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
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
  }

  //проверяем заполненность каждого поля 
  validate(): boolean {
    return Boolean(this.payment && this.address && this.phone && this.email);
  }
}
