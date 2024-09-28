# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Определение данных:

## `IProduct` 
Представляет собой набор данных, получаемых с сервера, которые содержат информацию о товаре.

## `IBasket` 
Интерфейс, который представляет собой корзину покупок, содержащую список добавленных товаров и итоговую стоимость заказа.

## `IOrder` 
Содержит необходимые данные для оформления корректного и завершённого заказа, включая информацию о покупателе и товарах.

## `IOrderResult` 
Этот интерфейс отображает результаты оформления заказа, включая уникальный идентификатор созданного заказа и сумму списанных средств.

## `OrderForm` 
Тип, предназначенный для проверки и валидации вводимых данных в процессе оформления заказа.

## `PaymentMethod` 
Тип, который описывает доступные методы оплаты, предоставляемые пользователю для выбора при совершении покупки.

## `IWebLarekAPI` 
Интерфейс, определяющий методы взаимодействия с сервером для получения необходимых данных и обработки запросов.

## `IEvents`
Интерфейс, разработанный для управления событиями через брокера событий, что позволяет организовать эффективное взаимодействие между компонентами.

# Определение интерфейсов:

## `IModalData`
Описывает структуру, содержащую контент модального окна, который представлен в виде DOM-элементов.

## `IFormState` 
Содержит поля, необходимые для отслеживания состояния валидности данных, вводимых пользователем в формы.

## `IPage` 
Предоставляет набор данных, включающий:

- counter
    счетчик, отображающий количество товаров в корзине.
- catalog
    каталог товаров, представленный в виде DOM-разметки.
- locked
    флаг, который блокирует возможность прокрутки страницы в определённых условиях.

# Определение классов:

## Класс WebLarekAPI  
    Наследует функционал класса Api и реализует интерфейс IWebLarekAPI. Этот класс предоставляет методы для взаимодействия с веб-API, что позволяет работать с продуктами и заказами на платформе. Конструктор принимает три аргумента: URL-адрес CDN-сервера, базовый URL для API и опции для запроса, которые позволяют гибко настраивать взаимодействие. Внутри конструктора вызывается родительский конструктор Api, передавая в него все параметры. Его методы:

- getProductList — Выполняет запрос для получения списка продуктов с сервера. После получения данных, каждому товару добавляется ссылка на изображение, что улучшает визуальное представление товара.
- getProductItem — Делает запрос на получение данных о конкретном продукте по его уникальному идентификатору. Полученные данные также обрабатываются, чтобы включить ссылку на изображение товара.
- orderProducts — Осуществляет запрос для оформления заказа. Возвращает результат выполнения заказа, который может включать данные о подтверждении и других деталях транзакции.

## Класс Component
    Абстрактный базовый класс, предназначенный для управления пользовательскими компонентами. Этот класс предоставляет основные методы для работы с DOM-элементами и облегчает взаимодействие с HTML-структурой приложения.  Конструктор принимает один аргумент — контейнер типа HTMLElement, в котором компонент будет отображаться и управляться. Его методы:

- toggleClass — Управляет переключением CSS-классов у элемента, что позволяет динамически изменять его состояние или внешний вид.
- setText — Устанавливает текстовое содержимое элемента, что удобно для динамического изменения отображаемого текста.
- setImage — Устанавливает изображение и задаёт альтернативный текст, что полезно для управления медиа-контентом в компонентах.
- render — Главный метод, отвечающий за отрисовку компонента в DOM. Этот метод может принимать необязательный параметр data для обновления состояния компонента.

## Класс View  
    Наследует функциональность класса Component и добавляет поле events типа IEvents, которое предназначено для управления событиями внутри компонента. Конструктор класса принимает два параметра: container, в котором компонент будет отображаться, и events, отвечающий за обработку событий.

## Класс Basket
    Pасширяет функциональность класса `View<IBasket>` и реализует компонент корзины, обеспечивающий отображение списка товаров, общей стоимости заказа и управление состоянием кнопки оформления. Конструктор принимает объект events типа EventEmitter для обработки событий. В процессе инициализации вызывается конструктор родительского класса View, при этом используется клонированный HTML-шаблон для визуализации корзины. Его элементы:

- template — Статическое поле, содержащее HTML-шаблон для отображения корзины.
- _list — Приватное поле, хранящее ссылку на HTML-элемент, представляющий список товаров в корзине.
- _total — Приватное поле для ссылки на элемент, отображающий общую стоимость товаров.
- _button — Приватное поле для ссылки на кнопку оформления заказа.
- items — Метод, отвечающий за обновление списка товаров в корзине. Если список товаров не пустой, элементы обновляются внутри контейнера, в противном случае отображается сообщение "Корзина пуста". Также обновляется состояние кнопки оформления.
- selected — Метод, устанавливающий выбранные товары. Если выбранные позиции присутствуют, кнопка оформления активируется, иначе она блокируется.
- total — Метод для задания общей стоимости товаров в корзине.

## Класс Form
    Класс Form наследует функционал `View<IFormState>` и предоставляет компонент формы, который управляет состоянием валидации и отображением ошибок. Конструктор принимает контейнер формы container типа HTMLFormElement и объект событий events типа EventEmitter. В конструкторе вызывается родительский метод View, передавая контейнер и объект событий. Его элементы:

- onInputChange — Метод, который генерирует событие изменения поля формы, передавая в событие данные о поле и его значении.
- valid — Устанавливает состояние валидации формы.
- errors — Обрабатывает и отображает ошибки в форме.
- render — Метод для обновления состояния формы, принимает объект state, содержащий частичное состояние формы.

## Класс Modal
    Класс Modal, основанный на `View<IModalData>`, представляет собой компонент модального окна с функциями открытия, закрытия и управления содержимым. Конструктор принимает контейнер container типа HTMLElement и объект событий events типа IEvents. Внутри конструктора вызывается родительский метод View с переданными параметрами. Его элементы:

- content — Метод для изменения содержимого модального окна, заменяя существующий контент на новый.
- open — Открывает модальное окно, добавляя ему CSS-класс modal_active, и генерирует событие modal:open.
- close — Закрывает модальное окно, удаляя класс modal_active, сбрасывая контент и генерируя событие modal:close.

## Класс Page
    Класс, расширяющий функционал `View<IPage>`, предназначенный для управления элементами страницы и их состоянием. Конструктор принимает контейнер страницы container типа HTMLElement и объект событий events типа IEvents. Родительский конструктор View вызывается с переданным контейнером и объектом событий. Его элементы:

- counter — Метод для установки значений счётчика товаров.
- catalog — Метод для управления содержимым каталога товаров.
- locked — Управляет блокировкой прокрутки страницы.

## Класс Card
    Расширяет базовый класс `Component<IProduct>` и предоставляет компонент для отображения карточки товара. В карточке отображается информация о продукте, и добавлена возможность выполнения действий по нажатию на кнопку или карточку. Конструктор принимает контейнер карточки container типа HTMLElement и опциональные действия actions типа ICardActions. Внутри конструктора вызывается родительский метод Component. Его элементы:

- id — Устанавливает и возвращает уникальный идентификатор карточки.
- title — Управляет заголовком карточки, устанавливая и возвращая его.
- image — Устанавливает изображение товара на карточке.
- price — Устанавливает и возвращает цену товара. Если цена отсутствует, кнопка карточки блокируется.
- category — Определяет и возвращает категорию товара, а также добавляет соответствующий класс для стилизации.
- description — Задаёт описание товара.
- button — Метод для управления текстом на кнопке карточки.

## Класс Order
    Pасширяет функциональность `Form<OrderForm>` и представляет собой форму заказа с возможностью выбора способа оплаты. Конструктор принимает контейнер формы заказа container типа HTMLFormElement и объект событий events типа EventEmitter. В конструкторе вызывается родительский метод Form. Его элементы:

- address — Метод для задания адреса доставки.
- payment — Устанавливает выбранный способ оплаты и активирует соответствующую кнопку.

## Класс Contacts
    Класс Contacts, основанный на `Form<OrderForm>`, отвечает за управление формой для ввода контактной информации, такой как электронная почта и номер телефона, при оформлении заказа. Конструктор принимает контейнер формы container типа HTMLFormElement и объект событий events типа EventEmitter. Родительский конструктор Form вызывается с переданным контейнером и объектом событий. Его элементы:

- email — Метод для установки значения электронной почты.
- phone — Метод для задания номера телефона.

## Класс Success
    Класс Success наследует `Component<IOrderResult>` и служит для отображения сообщения об успешном оформлении заказа. Конструктор принимает контейнер элемента container типа HTMLFormElement и опциональные действия actions типа ISuccessActions. Внутри вызывается родительский конструктор Component.

## Класс AppData
    Класс, реализующий хранилище данных приложения. Он управляет информацией о продуктах, корзине, предпросмотре товаров, заказах и ошибках форм. Также предоставляет методы для взаимодействия с этими данными и управления событиями. Конструктор принимает объект events. Его методы:

- setItems — Устанавливает список продуктов и генерирует событие об изменении.
- setPreview — Устанавливает предпросмотр выбранного товара и генерирует соответствующее событие.
- inBasket — Проверяет, находится ли товар в корзине.
- addToBasket — Добавляет товар в корзину и генерирует событие изменения корзины.
- removeFromBasket — Удаляет товар из корзины и генерирует событие изменения корзины.
- clearBasket — Очищает корзину и отправляет событие изменения.
- setPaymentMethod — Устанавливает выбранный способ оплаты для заказа.
- setOrderField — Устанавливает значения полей заказа и проверяет их валидность.
- validateOrder — Проверяет корректность заказа и генерирует событие ошибок формы.

## Класс EventEmmiter
    Служит посредником (Presenter) между слоями отображения View и моделью данных Model, реализуя интерфейс IEvents. Класс не принимает параметры в конструкторе. Его элементы:

- events — Переменная, в которой кэшируются зарегистрированные события.
- on() — Метод для установки обработчика на событие.
- off() — Метод для удаления обработчика с события.
- emit() — Метод для инициализации события с передачей данных.
- onAll() — Метод для подписки на все события.
- offAll() — Метод для сброса всех обработчиков событий.
- trigger() — Метод, создающий коллбек-триггер, который вызывает событие при его выполнении.

# Определение событий:

## modal:open
    Событие возникает при открытии модального окна. Внутри обработчика устанавливается свойство locked объекта page в значение true, чтобы заблокировать прокрутку страницы.

## modal:close
    Инициируется при закрытии модального окна. Обработчик изменяет значение свойства locked объекта page на false, чтобы снять блокировку прокрутки страницы.

## card:select
    Активируется при выборе карточки товара. В обработчике вызывается метод setPreview объекта appData с передачей данных о выбранном товаре для отображения его предпросмотра.

## items:change
    Вызывается при обновлении списка товаров. Внутри обработчика каждый товар преобразуется в карточку с использованием шаблона cardCatalogTemplate. Карточкам присваиваются кликабельные события, которые вызывают card:select для передачи данных о выбранном товаре. Полученные карточки сохраняются в свойстве catalog объекта page.

## preview:change
    Событие срабатывает при изменении предварительного просмотра товара. В обработчике создается карточка товара на основе шаблона предпросмотра. Карточке присваивается функциональность для добавления или удаления товара из корзины, а также изменения текста кнопки. После этого карточка рендерится в модальном окне, которое открывается для отображения.

## basket:open  
    Инициируется при открытии корзины. Внутри обработчика происходит рендеринг содержимого корзины, которое передается в модальное окно для отображения, после чего окно открывается.

## basket:change 
    Вызывается при изменении содержимого корзины. Внутри обработчика обновляются счётчик товаров на странице, список товаров в корзине и общая стоимость. Каждый товар в корзине рендерится в виде карточки с кликабельным обработчиком для его удаления.

## order:open
    Срабатывает при начале оформления заказа. В обработчике происходит рендеринг формы заказа с начальными значениями (метод оплаты, адрес доставки, состояние валидации и список ошибок). Модальное окно открывается для отображения формы.

## order.*:change
    Это групповое событие, которое вызывается при изменении любого поля формы заказа. Оно обновляет значение указанного поля в форме.

## contacts.*:change
    Похожее на order.*:change, это событие срабатывает при изменении полей формы контактной информации, обновляя соответствующее поле.

## formErrors:change
    Это событие вызывается при изменении ошибок в форме. В обработчике извлекаются ошибки для полей, таких как адрес, оплата, электронная почта и телефон. Далее обновляется состояние валидации формы заказа и формы контактной информации в зависимости от наличия ошибок.

## order:submit
    Активируется при нажатии кнопки продолжения заказа. В обработчике происходит рендеринг формы контактной информации с начальными данными, такими как номер телефона, электронная почта и состояние формы. Модальное окно открывается для отображения контактной формы.

## contacts:submit 
    Срабатывает при отправке контактной информации. В обработчике данные заказа отправляются на сервер через API. В случае успешного оформления заказа в модальном окне отображается соответствующее сообщение, после чего корзина очищается и её содержимое обновляется. При возникновении ошибок информация выводится в консоль.