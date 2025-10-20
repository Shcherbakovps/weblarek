import { Api } from '../components/base/Api';
import type { IProduct, IOrderRequest, IOrderResponse } from '../types';

export type ProductsResponse = {
    total: number;
    items: IProduct[];
}

export class ShopAPI {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    getProducts(): Promise<ProductsResponse> {
        return this.api.get<ProductsResponse>('/product');
    }

    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}
