import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}
  
  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:changed', this.items);
  }

  removeItem(id: string): void {
    this.items = this.items.filter(function(item) {
      return item.id !== id;
    });
    this.events.emit('cart:changed', this.items);
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed', this.items);
  }

  getTotalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
        const product = this.items[i];
        const price = product.price ?? 0;
        total = total + price;
    }
    return total;
  }
  
  getItemCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(function(item) {
      return item.id === id;
    });
  }
}
