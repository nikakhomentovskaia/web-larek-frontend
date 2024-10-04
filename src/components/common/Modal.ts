import { View } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
// Описываем интерфейс для данных модального окна
interface IModalData {
    content: HTMLElement;
}
// Класс модального окна, расширяющий функционал View
export class Modal extends View<IModalData> {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container, events);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._attachEventListeners();
    }
    // Метод для привязки обработчиков событий
    private _attachEventListeners(): void {
        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', () => this.close());
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }
    // Сеттер для содержимого моадльного окна
    set content(newContent: HTMLElement) {
        this._content.replaceChildren(newContent);
    }
    // Открытие модального окна
    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }
    // Закрытие
    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }
    // Рендерит данные в модальное окно и открыает
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.content = data.content;
        this.open();
        return this.container;
    }
}