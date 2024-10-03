import { View } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends View<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
	
		super(events, container);
		
		this._counter = this._queryElement('.header__basket-counter');
		this._catalog = this._queryElement('.gallery');
		this._wrapper = this._queryElement('.page__wrapper');
		this._basket = this._queryElement('.header__basket');
		
		this._setupBasketClick();
	}
	// метод для поиска элементов
	private _queryElement(selector: string): HTMLElement {
		return ensureElement<HTMLElement>(selector, this.container);
	}
	// метод для установки обработчика события на кнопку корзины
	private _setupBasketClick() {
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}
	// сеттер для счетчика корзины
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}
	// сеттер для каталога товаров
	set catalog(items: HTMLElement[]) {
		this._updateCatalog(items);
	}
	// метод для обновления каталога
	private _updateCatalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}
	// сеттер для блокировки страницы
	set locked(value: boolean) {
		this._togglePageLock(value);
	}
	// метод для блокировки/разблокировки страницы
	private _togglePageLock(isLocked: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', isLocked);
	}
}