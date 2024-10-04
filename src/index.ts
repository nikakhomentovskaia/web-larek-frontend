import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IProduct, OrderForm } from './types';
import { WebLarekAPI } from './components/WebLarekApi';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';

import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { Basket } from './components/common/Basket';
import { Success } from './components/common/Success';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';
import { Page } from './components/Page';
// Инициализация API для взаимодействия с сервером
const api = new WebLarekAPI(CDN_URL, API_URL);
// Шаблоны для карточек каталога, корзины и предпросмотра
const templates = {
    catalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    preview: ensureElement<HTMLTemplateElement>('#card-preview'),
    basket: ensureElement<HTMLTemplateElement>('#card-basket')
};
// Инициализация EventEmitter для управления событиями и состоянием приложения
const events = new EventEmitter();
const appData = new AppData(events);
// Инициализация модальных окон, страницы и компонентов корзины, заказа и контактов
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const page = new Page(document.body, events);
const basket = new Basket(events);
const orderForm = new Order(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#order')));
const contactsForm = new Contacts(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')));
// Обработчик отправки формы контактов
const handleContactsSubmit = () => {
    api.orderProducts(appData.order) 
        .then(result => {
            const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
                onClick: () => {
                    modal.close();
                    appData.clearBasket(); 
                }
            });
            // Отображение сообщения об успехе
            modal.render({ content: success.render(result) }); 
        })
        .catch(console.error);
};
// Обработчик открытия формы заказа
const handleOrderOpen = () => {
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: []
        })
    });
};
// Обработчик отправки формы заказа
const handleOrderSubmit = () => {
    modal.render({
        content: contactsForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
};
// Обработчик готовности заказа
const handleOrderReady = (order: IOrder) => {
    contactsForm.valid = true; 
};
// Обработчик изменения данных в форме заказа
const handleOrderChange = (data: { field: keyof OrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
};
// Обработчик изменения данных в форме контактов
const handleContactsChange = (data: { field: keyof OrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
};
// Обработчик изменения ошибок формы
const handleFormErrorsChange = (errors: Partial<OrderForm>) => {
    const { payment, address, email, phone } = errors;
    // Проверка на наличие ошибок в формах заказа и контактов
    orderForm.valid = !payment && !address;
    orderForm.errors = [payment, address].filter(Boolean).join('; ');
    contactsForm.errors = [email, phone].filter(Boolean).join('; ');
};
// Обработчик открытия корзины
const handleBasketOpen = () => {
    modal.render({ content: basket.render() });
};
// Обработчик блокировки страницы при открытии модального окна
const handleModalOpen = () => {
    page.locked = true;
};
// Обработчик разблокировки страницы при закрытии модального окна
const handleModalClose = () => {
    page.locked = false;
};
// Обработчик выбора карточки товара
const handleCardSelect = (item: IProduct) => {
    appData.setPreview(item);
};
// Обработчик изменения списка товаров
const handleItemChange = (items: IProduct[]) => {
    // Генерация карточек товаров
    page.catalog = items.map(item => {
        const card = new Card(cloneTemplate(templates.catalog), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
};
// Обработчик изменения корзины
const handleBasketChange = () => {
    page.counter = appData.basket.items.length;
    // Обновление списка товаров в корзине
    basket.items = appData.basket.items.map(id => {
        const item = appData.items.find(product => product.id === id);
        const card = new Card(cloneTemplate(templates.basket), {
            onClick: () => appData.removeFromBasket(item!)
        });
        return card.render(item);
    });
    // Обновление общей стоимости корзины
    basket.total = appData.basket.total;
};
// Обработчик изменения предпросмотра товара
const handlePreviewChange = (item: IProduct) => {
    if (item) {
        const card = new Card(cloneTemplate(templates.preview), {
            onClick: () => {
                if (appData.inBasket(item)) {
                    appData.removeFromBasket(item);
                    card.button = 'В корзину';
                } else {
                    appData.addToBasket(item);
                    card.button = 'Удалить из корзины';
                }
            }
        });

        card.button = appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину';

        modal.render({ content: card.render(item) });
    } else {
        modal.close();
    }
};
// Подписка на события
events.on('contacts:submit', handleContactsSubmit);
events.on('order:open', handleOrderOpen);
events.on('order:submit', handleOrderSubmit);
events.on('order:ready', handleOrderReady);
events.on(/^order\..*:change/, handleOrderChange);
events.on(/^contacts\..*:change/, handleContactsChange);
events.on('formErrors:change', handleFormErrorsChange);
events.on('basket:open', handleBasketOpen);
events.on('modal:open', handleModalOpen);
events.on('modal:close', handleModalClose);
events.on('card:select', handleCardSelect);
events.on('item:change', handleItemChange);
events.on('basket:change', handleBasketChange);
events.on('preview:change', handlePreviewChange);
// Получение данных о продуктах из API
api.getProductList()
    .then(appData.setItems.bind(appData))
    .catch(console.error);