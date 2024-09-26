import {IBasket, IOrder, IProduct, OrderForm, PaymentMethod} from "../types";
import { IEvents } from "./base/events";
/*класс для управления товаами, корзиной и заказами*/ 
export class AppData {
    items: IProduct[] = [];
    preview: IProduct = null;
    basket: IBasket = {
        items: [],
        total: 0
    };
    order: IOrder = {
        payment: 'card',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };
    formErrors: Partial<Record<keyof OrderForm, string>> = {};

    constructor(protected events: IEvents) {

    }
    // установка списка товаров
    setItems(items: IProduct[]) {
        this.items = [...items];
        this.events.emit('items:change', this.items);
    }
    // установка товара для превью
    setPreview(item: IProduct) {
        this.preview = { ...item };
        this.events.emit('preview:change', this.preview);
    }
    // проверка, находится ли товар в корзине
    inBasket(item: IProduct): boolean {
        return this.basket.items.some(id => id === item.id);
    }
    // добавление товара в корзину
    addToBasket(item: IProduct) {
        this.basket = { 
            ...this.basket,
            items: [...this.basket.items, item.id],
            total: this.basket.total + item.price
        };
        this.events.emit('bascet:change', this.basket);
    }
    // удаление товара из корзины
    removeFromBasket(item: IProduct) {
        this.basket = {
            ...this.basket,
            items: this.basket.items.filter(id => id !== item.id),
            total: this.basket.total - item.price
        };
        this.events.emit('basket:change', this.basket);
    }
    // очистка корзины
    clearBasket() {
        this.basket = { items:[], total: 0 };
        this.events.emit('basket:change', this.basket);
    }
    // установка метода оплаты
    setPaymentMethod(method: PaymentMethod) {
        this.order = { ...this.order, payment: method };
    }
    // установка поля заказа
    setOrderField(field: keyof OrderForm, value: string) {
        this.order = {
            ...this.order,
            [field]: field === 'payment' ? value as PaymentMethod : value
        };
        if (this.order.payment && this.validateOrder()) {
            this.order = {
                ...this.order,
                total: this.basket.total,
                items: [...this.basket.items]
            };
            this.events.emit('order:ready', this.order);
        }
    }
    // валидация данных заказа
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать емейл';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = { ...errors };
        this.events.emit('formErrors:change', this.formErrors);
        
        return Object.keys(errors).length === 0;
    }
}