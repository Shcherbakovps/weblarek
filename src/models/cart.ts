import { IEvents } from "../components/base/Events";
import { IProduct } from "../types";

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}
  
  //узнаем, что лежит в корзине
  getItems(): IProduct[] {
    return this.items;
  }

  //кладем товар в корзину
  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:changed', this.items);
  }

  //удаляем товар
  removeItem(id: string): void {
    this.items = this.items.filter(function(item) {
      return item.id !== id;
    });
    this.events.emit('cart:changed', this.items);
  }

  //чистим массив внутри корзины
  clear(): void {
    this.items = [];
    this.events.emit('cart:cleared');
  }

  //cумма товаров в корзине
  getTotalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
        const product = this.items[i];
        const price = product.price ?? 0;
        total = total + price;
    }
    return total;
  }
  
  //узнаем количество товаров в корзине
  getItemCount(): number {
    return this.items.length;
  }

  //есть ли в корзине данный товар
  hasItem(id: string): boolean {
    return this.items.some(function(item) {
      return item.id === id;
    });
  }
}
