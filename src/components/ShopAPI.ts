import { Api } from '../components/base/Api';
import type { IProduct, IOrderRequest, IOrderResponse } from '../types';

export class ShopAPI {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IProduct[]>('/product');
    }

    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}
