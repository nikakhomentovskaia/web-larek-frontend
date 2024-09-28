import { View } from "../base/Component";
import { EventEmitter } from "../base/events";
import { ensureElement } from "../../utils/utils";
// Описываем интерфейс состояния формы с полями valid и errors
interface IFormState {
    valid: boolean;
    errors: string[];
}
// Класс Form, представляющий форму и наследующий от View
export class Form<T> extends View<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(events: EventEmitter, protected container: HTMLFormElement) {
        super(events, container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = <HTMLInputElement>e.target;
            const { name, value } = target;
            this.onInputChange(name as keyof T, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }
    // Метод для обработки изменения значения поля формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
                field,
                value
        });
    }
    // Сеттер для изменения состояния валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }
    // Сеттер для отображения ошибок формы
    set errors(value: string) {
        this.setText(this._errors, value);
    }
    // Рендер формы с обновлением состояния
    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        if (Object.keys(inputs).length) {
            Object.assign(this, inputs);
        }
        return this.container;
    }        
}