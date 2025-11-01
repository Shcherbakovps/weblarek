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
import { Header } from './components/views/Header';

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
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

//Модальное окно
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modalView = new ModalWindowView(modalContainer);

// Хедер
const headerElement = document.querySelector('.header') as HTMLElement;
const headerView = new Header(events, headerElement);

//Корзина
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
// открытие корзины по событию из Header
events.on('basket:open', () => {
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

let currentPreview: CardPreviewView | null = null;

//запрос продуктов с сервера
shopAPI.getProducts()
  .then((data) => catalog.setProducts(data.items))
  .catch((err) => console.error('Ошибка загрузки:', err));

//СОБЫТИЯ
//Каталог изменен
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

  headerView.counter = items.length;

  if (currentPreview) {
    const id = currentPreview.id;
    currentPreview.goodInCart = cart.hasItem(id);
  } 
});

//Обновление данных покупателя - только сохранение данных
events.on('buyer:update', (data: Partial<IBuyer>) => {
  const current = buyer.getBuyerData();
  const merged: IBuyer = {
    payment: data.payment !== undefined ? data.payment : current.payment,
    address: data.address !== undefined ? data.address : current.address,
    phone: data.phone !== undefined ? data.phone : current.phone,
    email: data.email !== undefined ? data.email : current.email,
  };
  buyer.setBuyerData(merged);
});

//изменение данных покупателя
events.on('buyer:changed', (state: IBuyer) => {
  orderView.render(state);
  contactView.render(state);

  // Определяем шаг валидации по наличию данных
  const hasContactFields = (state.phone && state.phone.trim()) || (state.email && state.email.trim());
  let step: 'order' | 'contacts' = hasContactFields ? 'contacts' : 'order';

  const errors: Partial<Record<keyof IBuyer, string>> = {};
  
  if (step === 'order') {
    if (!state.payment) errors.payment = 'Необходимо выбрать способ оплаты';
    if (!state.address?.trim()) errors.address = 'Необходимо указать адрес';
  } else {
    // Для контактов проверяем только заполненные поля (чтобы не показывать ошибки для пустых полей)
    if (state.email && state.email.trim()) {
      const emailValue = state.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errors.email = 'Введите корректный email';
      }
    }
    if (state.phone && state.phone.trim()) {
      const phoneValue = state.phone.trim();
      if (!/^\+?\d{10,15}$/.test(phoneValue.replace(/\s/g, ''))) {
        errors.phone = 'Введите корректный номер телефона';
      }
    }
  }

  // Для кнопки сабмита проверяем все поля шага
  let isValidForSubmit = false;
  if (step === 'order') {
    isValidForSubmit = Boolean(state.payment && state.address?.trim());
  } else {
    const emailValid = state.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim());
    const phoneValid = state.phone?.trim() && /^\+?\d{10,15}$/.test(state.phone.trim().replace(/\s/g, ''));
    isValidForSubmit = Boolean(emailValid && phoneValid);
  }

  // Кнопки включаются/выключаются в зависимости от валидности всех полей шага
  orderView.setSubmitDisabled(!(step === 'order' && isValidForSubmit));
  contactView.setSubmitDisabled(!(step === 'contacts' && isValidForSubmit));

  // Сообщаем об ошибках
  events.emit('buyer:validated', { valid: Object.keys(errors).length === 0, errors, step });
});

//Сабмит форм
events.on('order:submit', () => {
  const data = buyer.getBuyerData();
  const errors: Partial<Record<keyof IBuyer, string>> = {};
  if (!data.payment) errors.payment = 'Необходимо выбрать способ оплаты';
  if (!data.address?.trim()) errors.address = 'Необходимо указать адрес';
  const ok = Object.keys(errors).length === 0;
  if (ok) {
    modalView.open(contactView.render());
  } else {
    events.emit('buyer:validated', { valid: false, errors, step: 'order' });
    modalView.open(orderView.render());
  }
});

events.on('contacts:submit', () => {
  const data = buyer.getBuyerData();
  const errors: Partial<Record<keyof IBuyer, string>> = {};
  const emailValid = data.email?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const phoneValid = data.phone?.trim() && /^\+?\d{10,15}$/.test(data.phone.trim().replace(/\s/g, ''));
  
  if (!emailValid) {
    errors.email = !data.email?.trim() ? 'Введите email' : 'Введите корректный email';
  }
  if (!phoneValid) {
    errors.phone = !data.phone?.trim() ? 'Введите номер телефона' : 'Введите корректный номер телефона';
  }
  
  const ok = emailValid && phoneValid;
  if (ok) {
    const orderData = {
      payment: buyer.getBuyerData().payment,
      address: buyer.getBuyerData().address,
      email: buyer.getBuyerData().email,
      phone: buyer.getBuyerData().phone,
      total: cart.getTotalPrice(),
      items: cart.getItems().map(item => item.id)
    };
       shopAPI.postOrder(orderData)
      .then((response) => {
        console.log('Заказ успешно отправлен:', response);
        const total = cart.getTotalPrice();
        cart.clear();
        buyer.clear();
        modalView.open(successView.render());
        successView.setTransactionValue(total);
        successView.onClose(() => {
          modalView.close();
        });
      })
      .catch((error) => {
        console.error('Ошибка при отправке заказа:', error);
        contactView.setError('Не удалось отправить заказ');
      });
  } else {
    events.emit('buyer:validated', { valid: false, errors, step: 'contacts' });
    modalView.open(contactView.render());
  }
});

//Ошибки форм
events.on('buyer:validated', (data: { valid: boolean; errors?: Record<string, string>, step?: string }) => {
  const { valid, errors, step } = data;
  if (!valid && errors) {
    if (step === 'order') {
      orderView.setError(errors.address || errors.payment || '');
      contactView.clearError();
    } else if (step === 'contacts') {
      // Показываем ошибку только для того поля, которое действительно имеет ошибку
      const errorMessage = errors.email || errors.phone || '';
      contactView.setError(errorMessage);
      orderView.clearError();
    }
  } else {
    orderView.clearError();
    contactView.clearError();
  }
});

//Товар выбран
events.on('product:selected', (product: IProduct) => {
  const previewNode = cloneTemplate(previewTemplate);
  const preview = new CardPreviewView(previewNode, events);

  preview.id = product.id;
  preview.title = product.title;
  preview.description = product.description || '';
  preview.price = product.price;
  preview.image = product.image;
  preview.category = product.category;

  const isInCart = cart.hasItem(product.id);
  preview.goodInCart = isInCart;
  currentPreview = preview; 
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

events.on('basket:order', () => {
  modalView.open(orderView.render());
});

// Очистка после завершения заказа
events.on('order:complete', () => {
  cart.clear();
  buyer.clear();
  modalView.close();
});



