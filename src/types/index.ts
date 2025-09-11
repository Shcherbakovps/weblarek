export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Товар
export interface IProduct {
  id: string;            //ID-номер товара
  description: string;   //Описание товара
  image: string;         //Ссылка на изображение
  title: string;         //Название
  category: string;      //Категория товара
  price: number | null;  //Цена товара
}

//Покупатель
export interface IBuyer {
  payment: TPayment;     //тип оплаты
  email: string;         //адрес эл.почты
  phone: string;         //телефон
  address: string;       //адрес доставки
}

//Тип оплаты 
export type TPayment = 'card' | 'cash' | null;

//Ответ сервера при получении списка товаров 
export interface IProductsResponse {
    items: IProduct[];
}

//Запрос на оформление заказа
export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    items: string[];
}

//Ответ от сервера на заказ
export interface IOrderResponse {
    id: string;
    total: number;
    items: IProduct[];
}