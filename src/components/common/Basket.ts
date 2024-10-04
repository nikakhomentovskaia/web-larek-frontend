import { View } from "../base/Component";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends View<IBasketView> {
    static template = ensureElement<HTMLTemplateElement>('#basket');

    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(events: EventEmitter) {
        
        super(cloneTemplate(Basket.template), events);

        this._list = this._getElement('.basket__list');
        this._total = this._getElement('.basket__price');
        this._button = this._getElement('.basket__button');

        this._setupButtonClick(events);

        this.items = [];
    }
    // Метод для поиска элементов
    private _getElement(selector: string): HTMLElement {
        return ensureElement<HTMLElement>(selector, this.container);
    }
    // Метод для привязки события клика по кнопке
    private _setupButtonClick(events: EventEmitter) {
        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
    }
    // Сеттер для списка товаров
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._updateItemList(items);
            this._button.removeAttribute('disabled');
        } else {
            this._displayEmptyMessage();
            this._button.setAttribute('disabled', 'disabled');
        }
    }
    // Метод для обновления списка товаров
    private _updateItemList(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }
    // Метод для отображения сообщения о пустой корзине
    private _displayEmptyMessage() {
        const emptyMessage = createElement<HTMLElement>('p', {
            textContent: 'Корзина пуста'
        });
        this._list.replaceChildren(emptyMessage);
    }
    // Сеттер для общей суммы
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}
