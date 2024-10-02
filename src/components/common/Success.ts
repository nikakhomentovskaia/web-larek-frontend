import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        this._initializeCloseAction(actions);
    }
    // Метод для установки обработчика на кнопку закрытия
    private _initializeCloseAction(actions: ISuccessActions) {
        if (actions?.onClick) {
            this._setCloseListener(actions.onClick);
        }
    }
    // Метод для привязки обработчика клика
    private _setCloseListener(onClick: () => void) {
        this._close.addEventListener('click', onClick);
    }
    // Сеттер для значения total
    set total(value: number) {
        this._updateTotalText(value);
    }
    // Метод для обновления текста с количеством списанных синапсов
    private _updateTotalText(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}