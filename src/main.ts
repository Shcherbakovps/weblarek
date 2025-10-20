import './scss/styles.scss';
//импортируем модели данных
import { Catalog } from './models/catalog';
import { Cart } from './models/cart';
import { Buyer } from './models/buyer';

//импортируем базовые файлы
import { EventEmitter } from './components/base/Events';
import { cloneTemplate } from './utils/utils';
import { Api } from './components/base/Api';
import { ShopAPI } from './components/ShopAPI';

//импортируем комспоненты представления
import { CardCatalogView } from './components/views/CardCatalogView';
import { GalleryView } from './components/views/GalleryView';
import { CardBasketView } from './components/views/CardBasketView';
import { BasketView } from './components/views/BasketView';
import { OrderView } from './components/views/OrderView';
import { ContactView } from './components/views/ContactView';
import { IProduct } from './types';
import { ModalWindowView } from './components/views/ModalWindowView';
import { CardPreviewView } from './components/views/CardPreviewView';
import { SuccessView } from './components/views/SuccessView';

//создаем эмиттер для всех событий
const events = new EventEmitter();

//создаем модели данных
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

//создаем api-классы
const api = new Api(import.meta.env.VITE_API_ORIGIN);
const shopAPI = new ShopAPI(api);

//создаем элементы представления
//каталог 
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const galleryView = new GalleryView(galleryElement);
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

//инстанс модалки
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modalView = new ModalWindowView(modalContainer);

//корзинка
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketView = new BasketView(cloneTemplate(basketTemplate));
// Кнопка/иконка корзины на странице
const basketButton = document.querySelector('.header__basket') as HTMLElement;

basketButton.addEventListener('click', () => {
  modalView.open(basketView.render());
});

const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

//формы
const orderView = new OrderView(cloneTemplate(document.querySelector('#order')! as HTMLTemplateElement));
const contactView = new ContactView(cloneTemplate(document.querySelector('#contacts')! as HTMLTemplateElement));
orderView.onSubmit(() => {
    modalView.open(contactView.render());
})

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successView = new SuccessView(cloneTemplate(successTemplate));
contactView.onSubmit(() => {
    modalView.open(successView.render());
    successView.onClose(() => modalView.close());
})

//счетчик на корзине 
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

//запрашиваем товары с сервера
shopAPI.getProducts() 
  .then((data) => {
    catalog.setProducts(data.items);
  })
  .catch((err) => console.error('Ошибка загрузки:', err)); 

//обработчики событий у моделей
// каталог товаров обновился,  создаем карточки товаров, отображаем карточки в галерее
events.on('catalog:changed', ()=> {
    console.log('catalog:changed - событие получено');
    const products = catalog.getProducts();
    console.log('products for cards:', products);
    const cards = products.map((product) => {
        const card = new CardCatalogView(cloneTemplate(cardTemplate), events);
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.image = product.image;
        card.category = product.category;
        return card;
    })
    galleryView.render({cards});
})

//корзина изменилась, создаем карточки корзины, обновляем ее
events.on('cart:changed', ()=> {
    const items =cart.getItems();
    const basketCards = items.map((item, index) => {
        const card = new CardBasketView(cloneTemplate(basketCardTemplate), events);
        card.id = item.id;
        card.index = index + 1;
        card.title = item.title;
        card.price = item.price;
        return card;
    })
    
    basketView.renderCards(basketCards);
    basketView.setTotalPrice(cart.getTotalPrice());
    modalView.open(basketView.render());
    
    basketCounter.textContent = String(cart.getItems().length);
})

//корзина очищена: очистка отображения, ставим 0 в сумме
events.on('cart:cleared', ()=> {
    basketView.renderCards([]);
    basketView.setTotalPrice(0);
    basketCounter.textContent = '0';
})

//изменились данные покупателя
events.on('buyer:changed', ()=> {
    console.log('Данные покупателя изменились:', buyer.getBuyerData());
})

//слушатель события модалки - товар выбран
events.on('product:selected', (product: IProduct) => {
    // клонируем шаблон
    const previewNode = cloneTemplate(document.querySelector('#card-preview') as HTMLTemplateElement);
    const preview = new CardPreviewView(previewNode, events);

    // заполняем данные
    preview.id = product.id;
    preview.title = product.title;
    preview.description = product.description || '';
    preview.price = product.price;
    preview.image = product.image;

    // открываем модалку
    modalView.open(preview.render());
});

//обработка событий от пользователя.
//кликнули карточку - выбрали товар
events.on('card:select', ({ id }: { id: string }) => {
  const product = catalog.getProductById(id);
  if (product) {
    catalog.setSelectedProduct(product);
  }
  
});

// Добавление товара в корзину
events.on('card:add-to-cart', ({ id }: { id: string }) => {
  const product = catalog.getProductById(id);
  if (product) {
    cart.addItem(product);
  } 
});


// Удаление товара из корзины
events.on('cart:remove-item', ({ id }: { id: string }) => {
  cart.removeItem(id);
});

// Нажатие на кнопку "Оформить заказ"
basketView.onOrder(() => {
  console.log('Переход к оформлению заказа');
  modalView.open(orderView.render());
});

// После завершения заказа очищаем всё
events.on('order:complete', () => {
  cart.clear();
  buyer.clear();
  console.log('Заказ оформлен. Корзина и данные покупателя очищены.');
});


