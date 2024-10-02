import { Form } from "./common/Form";
import { OrderForm, PaymentMethod } from "../types";
import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<OrderForm> {
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;

    constructor(events: EventEmitter, container: HTMLFormElement) {
        super(events, container);

        this._paymentCard = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
        this._paymentCash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
        
        this._initializePaymentListeners();
    }
    // Инициализация обработчиков событий для способов оплаты
    private _initializePaymentListeners() {
        this._setPaymentListener(this._paymentCard, 'card');
        this._setPaymentListener(this._paymentCash, 'cash');
    }
    // Приватный метод для привязки обработчиков
    private _setPaymentListener(button: HTMLButtonElement, method: PaymentMethod) {
        button.addEventListener('click', () => {
            this.payment = method;
            this.onInputChange('payment', method);
        });
    }
    // Сеттер для установки активного способа оплаты
    set payment(value: PaymentMethod) {
        this._togglePaymentActive(this._paymentCard, value === 'card');
        this._togglePaymentActive(this._paymentCash, value === 'cash');
    }
    // Приватный метод для переключения активного класса
    private _togglePaymentActive(button: HTMLButtonElement, isActive: boolean) {
        button.classList.toggle('button_alt-active', isActive);
    }
    // Сеттер для адреса
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}