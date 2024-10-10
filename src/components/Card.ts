import { Component } from "./base/Component";
import { IProduct } from "../types";
import { bem, ensureElement } from "../utils/utils";
// Интерфейс для описания действий карточки
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
// Тип для модификаторов карточки
type cardModifier = 'compact' | 'full';
// Класс Card, представляющий карточку товара, наследуется от базового компонента
export class Card extends Component<IProduct> {
    private _elements: { [key: string]: HTMLElement | HTMLButtonElement | HTMLImageElement | null };

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._elements = {
            _title: ensureElement<HTMLElement>('.card__title', container),
            _price: ensureElement<HTMLElement>('.card__price', container),
            _category: container.querySelector('.card__category'),
            _button: container.querySelector('.card__button'),
            _image: container.querySelector('.card__image'),
            _description: container.querySelector('.card__description'),
        };

        this._initializeClickHandler(actions);
    }
    // Приватный метод для привязки события клика
    private _initializeClickHandler(actions?: ICardActions): void {
        if (actions?.onClick) {
            const button = this._elements._button as HTMLButtonElement | null;
            if (button) {
                button.addEventListener('click', actions.onClick);
            } else {
                this.container.addEventListener('click', actions.onClick);
            }
        }
    }
    // Метод для переключения класса модификатора карточки
    toggle(modifier: cardModifier): void {
        this.toggleClass(bem('card', undefined, modifier).name);
    }
    // Сеттер и геттер для ID карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    // Сеттер и геттер для заголовка карточки
    set title(value: string) {
        this._setText('_title', value);
    }

    get title(): string {
        return this._elements._title?.textContent || '';
    }
    // Сеттер для цены карточки
    set price(value: number) {
        const priceText = value ? `${value} синапсов` : 'Бесценно';
        this._setText('_price', priceText);

        const button = this._elements._button as HTMLButtonElement | null;
        if (button) {
            button.disabled = !value;
        }
    }
    // Сеттер для категории карточки
    set category(value: string) {
        this._setText('_category', value);
    }
    // Сеттер для изображения карточки
    set image(value: string) {
        const img = this._elements._image as HTMLImageElement | null;
        if (img) {
            img.src = value;
            img.alt = this.title;
        }
    }
    // Сеттер для описания карточки
    set description(value: string) {
        this._setText('_description', value);
    }
    // Сеттер для текста кнопки
    set button(value: string) {
        this._setText('_button', value);
    }
    // Приватный метод для установки текста в элемент
    private _setText(elementKey: string, text: string): void {
        const element = this._elements[elementKey] as HTMLElement | null;
        if (element) {
            element.textContent = text;
        }
    }
}
