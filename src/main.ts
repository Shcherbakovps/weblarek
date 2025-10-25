import './scss/styles.scss';
//Модели
import { Catalog } from './components/models/catalog';
import { Cart } from './components/models/cart';
import { Buyer } from './components/models/buyer';

//Базовые файлы, типы, утиля
import { EventEmitter } from './components/base/Events';
import { cloneTemplate } from './utils/utils';
import { Api } from './components/base/Api';
import { ShopAPI } from './components/ShopAPI';
import { IBuyer, IProduct } from './types';
import { API_URL } from './utils/constants';

//Компоненты представления
import { CardCatalogView } from './components/views/CardCatalogView';
import { GalleryView } from './components/views/GalleryView';
import { CardBasketView } from './components/views/CardBasketView';
import { BasketView } from './components/views/BasketView';
import { OrderView } from './components/views/OrderView';
import { ContactView } from './components/views/ContactView';
import { ModalWindowView } from './components/views/ModalWindowView';
import { CardPreviewView } from './components/views/CardPreviewView';
import { SuccessView } from './components/views/SuccessView';

//ПЕРЕМЕННЫЕ
//Глобальный эмиттер событий
const events = new EventEmitter();

//Модели данных
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

//API
const api = new Api(API_URL);
const shopAPI = new ShopAPI(api);

//Элементы представления
//Основная страница(каталог)
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const galleryView = new GalleryView(galleryElement);
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

//Модальное окно
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modalView = new ModalWindowView(modalContainer);

//Корзина
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketView = new BasketView(cloneTemplate(basketTemplate));
const basketButton = document.querySelector('.header__basket') as HTMLElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

basketButton.addEventListener('click', () => {
  modalView.open(basketView.render());
});

//Формы
//оплата и адрес
const contactTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactNode = cloneTemplate(contactTemplate) as HTMLElement;
const contactView = new ContactView(contactNode, events);
//контактные данные
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderNode = cloneTemplate(orderTemplate) as HTMLElement;
const orderView = new OrderView(orderNode, events);

//Форма успеха
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successView = new SuccessView(cloneTemplate(successTemplate));

//запрос продуктов с сервера
shopAPI.getProducts()
  .then((data) => catalog.setProducts(data.items))
  .catch((err) => console.error('Ошибка загрузки:', err));

//СОБЫТИЯ
//Каталог изменен (отрисовка карточек)
events.on('catalog:changed', () => {
  const products = catalog.getProducts();
  const cards = products.map((product) => {
    const card = new CardCatalogView(cloneTemplate(cardTemplate), events);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.image = product.image;
    card.category = product.category;

    return card.render();
  });

  galleryView.render({ cards });
});

//Корзина изменена 
events.on('cart:changed', () => {
  const items = cart.getItems();
  const basketCards = items.map((item, index) => {
    const card = new CardBasketView(cloneTemplate(basketCardTemplate), events);
    card.id = item.id;
    card.index = index + 1;
    card.title = item.title;
    card.price = item.price;
    return card.render();
  });

  basketView.render({
    items: basketCards,
    total: cart.getTotalPrice(),
    isDisabled: basketCards.length === 0
  });

  modalView.open(basketView.render());
  basketCounter.textContent = String(items.length);
});



//Обновление данных покупателя
events.on('buyer:update', (data: Partial<IBuyer>) => {
  buyer.setBuyerData(data);

  // Валидация без эмита
  const valid = buyer.validate();

  // Кнопки включаются/выключаются в зависимости от валидности
  orderView.setSubmitDisabled(!valid);
  contactView.setSubmitDisabled(!valid);
});

//Сабмит форм
events.on('order:submit', () => {
  const ok = buyer.validate();
  if (ok) {
    modalView.open(contactView.render());
  } else {
    modalView.open(orderView.render());
  }
});

events.on('contacts:submit', () => {
  const ok = buyer.validate();
  if (ok) {
    modalView.open(successView.render());
    successView.setTransactionValue(cart.getTotalPrice());

    successView.onClose(() => {
      modalView.close();
      events.emit('order:complete');
    });
  } else {
    modalView.open(contactView.render());
  }
});

//Ошибки форм
events.on('buyer:validated', (data: { valid: boolean; errors?: Record<string, string> }) => {
  const { valid, errors } = data;

  if (!valid && errors) {
    orderView.setError(errors.address || errors.payment || '');
    contactView.setError(errors.phone || errors.email || '');
  } else {
    orderView.clearError();
    contactView.clearError();
  }
});

//Просмотр товара в модальном окне
events.on('product:selected', (product: IProduct) => {
  const previewNode = cloneTemplate(document.querySelector('#card-preview') as HTMLTemplateElement);
  const preview = new CardPreviewView(previewNode, events);

  preview.id = product.id;
  preview.title = product.title;
  preview.description = product.description || '';
  preview.price = product.price;
  preview.image = product.image;

  modalView.open(preview.render());
});

//Карточки товара
events.on('card:select', ({ id }: { id: string }) => {
  const product = catalog.getProductById(id);
  if (product) catalog.setSelectedProduct(product);
});

events.on('card:add-to-cart', ({ id }: { id: string }) => {
  const product = catalog.getProductById(id);
  if (product) cart.addItem(product);
});

events.on('cart:remove-item', ({ id }: { id: string }) => cart.removeItem(id));

basketView.onOrder(() => modalView.open(orderView.render()));

// Очистка после завершения заказа
events.on('order:complete', () => {
  cart.clear();
  buyer.clear();
  modalView.close();
});



