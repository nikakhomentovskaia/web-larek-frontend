import { IEvents } from "./events";
// Компонент, отвечающий за работу с базовым HTML элементом
export class Component<T> {
    constructor(protected readonly container: HTMLElement) {

    }
    // Метод для переключения класса у контейнера
    toggleClass(className: string) {
        this.container.classList.toggle(className);
    }
    // Защищенный метод для установки текста в элемент
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }
    // Защищенный метод для установки изображения в элемент
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }
    // Метод для рендеринга компонента и установки данных
    render(data?: T): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
// Класс View, наследующий от компонента
export class View<T> extends Component<T> {
    constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);
	}
}