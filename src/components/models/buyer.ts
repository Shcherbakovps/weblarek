import { IEvents } from "../base/Events";
import { IBuyer, TPayment } from "../../types";

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private phone: string = '';
  private email: string = '';

  constructor(private events: IEvents) {}

  setBuyerData(data: IBuyer): void {
    this.payment = data.payment;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
    this.events.emit('buyer:changed', this.getBuyerData());
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
  validate(): boolean {
    return Boolean(this.payment && this.address && this.phone && this.email);
  }
}

