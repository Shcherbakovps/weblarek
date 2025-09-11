import './scss/styles.scss';

// импорт классов и массив товаров
import { Catalog } from './models/catalog';
import { Cart } from './models/cart';
import { Buyer } from './models/buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ShopAPI } from '../src/components/ShopAPI';

// создаём экз.классов
const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

// проверка каталога (тестовые данные)
catalog.setProducts(apiProducts.items);                                        
console.log('массив товаров из каталога:', catalog.getProducts());             
const productId = apiProducts.items[0].id;                                     
console.log(`Товар с id=${productId}:`, catalog.getProductById(productId));    

catalog.setSelectedProduct(apiProducts.items[1]);                              
console.log('Выбранный товар:', catalog.getSelectedProduct());                 

// проверка корзины
cart.addItem(apiProducts.items[0]);                                            
cart.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления:', cart.getItems());

console.log('Есть ли товар с id=1 в корзине?', cart.hasItem('1'));             
console.log('Общая стоимость корзины:', cart.getTotalPrice());                 
console.log('Количество товаров в корзине:', cart.getItemCount());             

cart.removeItem('1');                                                          
console.log('Корзина после удаления товара с id=1:', cart.getItems());

cart.clear();                                                                  
console.log('Корзина после очистки:', cart.getItems());

// проверка покупателя
buyer.setBuyerData({                                                           
  payment: 'card',
  address: 'Самара, Калужская 11',
  phone: '+79277290469',
  email: 'pavelsherbakoff@mail.ru',
});

console.log('Данные покупателя:', buyer.getBuyerData());                       
console.log('Данные покупателя валидны?', buyer.validate());                   

buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getBuyerData());         
console.log('Данные покупателя валидны после очистки?', buyer.validate());

// ==== Работа с API ====

// создаём экземпляр API
const api = new Api(import.meta.env.VITE_API_ORIGIN);

// создаём экземпляр ShopAPI
const shopApi = new ShopAPI(api);

// получаем товары с сервера и сохраняем в модель
shopApi.getProducts()
  .then(products => {
    console.log('Товары с сервера:', products);

    catalog.setProducts(products);
    console.log('Каталог из модели после загрузки с сервера:', catalog.getProducts());
  })
  .catch(err => {
    console.error('Ошибка при загрузке товаров:', err);
  });
