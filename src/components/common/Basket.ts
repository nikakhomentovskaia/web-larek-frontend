import { View } from "../base/Component";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[]; // Массив элементов для отображения в корзине
    total: number; // Общая сумма товаров в корзине
}

export class Basket extends View<IBasketView> {
    static template = ensureElement<HTMLTemplateElement>('#basket');

    protected _list: HTMLElement; // Список товаров
    protected _total: HTMLElement; // Элемент для отображения суммы
    protected _button: HTMLElement; // Кнопка для оформления заказа

    constructor(events: EventEmitter) {
        super(cloneTemplate(Basket.template), events);

        this._list = this._getElement('.basket__list');
        this._total = this._getElement('.basket__price');
        this._button = this._getElement('.basket__button');

        this._setupButtonClick(events);
        
        // Инициализация корзины
        this.items = []; // Начальное значение для элементов корзины
        this.total = 0; // Начальная сумма
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
            this._updateItemList(items); // Обновляем отображаемый список товаров
            this._button.removeAttribute('disabled'); // Активируем кнопку, если в корзине есть товары
        } else {
            this._displayEmptyMessage(); // Отображаем сообщение о пустой корзине
            this._button.setAttribute('disabled', 'disabled'); // Деактивируем кнопку
        }
    }

    // Метод для обновления списка товаров
    private _updateItemList(items: HTMLElement[]) {
        this._list.replaceChildren(...items); // Обновляем элементы списка товаров
    }

    // Метод для отображения сообщения о пустой корзине
    private _displayEmptyMessage() {
        const emptyMessage = createElement<HTMLElement>('p', {
            textContent: 'Корзина пуста'
        });
        this._list.replaceChildren(emptyMessage); // Показываем сообщение, если корзина пуста
    }

    // Сеттер для общей суммы
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`); // Обновляем текст общей суммы
    }

    // Метод для добавления товара в корзину
    addItem(item: HTMLElement) {
        const currentItems = Array.from(this._list.children) as HTMLElement[]; // Получаем текущие элементы
        currentItems.push(item); // Добавляем новый элемент
        this.items = currentItems; // Обновляем список товаров
        this.total += parseFloat(item.dataset.price); // Обновляем общую сумму (предполагается, что цена хранится в data-атрибуте)
    }

    // Метод для удаления товара из корзины
    removeItem(item: HTMLElement) {
        const currentItems = Array.from(this._list.children) as HTMLElement[]; // Получаем текущие элементы
        const index = currentItems.indexOf(item); // Находим индекс товара
        if (index !== -1) {
            currentItems.splice(index, 1); // Удаляем товар из списка
            this.items = currentItems; // Обновляем список товаров
            this.total -= parseFloat(item.dataset.price); // Обновляем общую сумму
        }
    }
}
