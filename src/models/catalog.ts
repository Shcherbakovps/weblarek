import { IEvents } from "../components/base/Events";
import { IProduct } from "../types";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  constructor(private events: IEvents) {};

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed', this.products);
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product.id === id) {
        return product;
      }
    }
    return undefined;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:selected', this.selectedProduct);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
