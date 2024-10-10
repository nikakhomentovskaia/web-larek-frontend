import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, IProduct } from '../types';
// Интерфейс для API WebLarek
export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
    saveBasket: (basketData: { items: string[]; total: number }) => Promise<void>;
}
// Класс WebLarekAPI, реализующий интерфейс IWebLarekAPI
export class WebLarekAPI extends Api implements IWebLarekAPI {
    private readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    // метод для форматирования URL изображения
    private formatImageUrl(imagePath: string): string {
        return `${this.cdn}${imagePath}`;
    }
    // метод для получения продукта по его ID
    async getProductItem(id: string): Promise<IProduct> {
        try {
            const response = await this.get(`/${id}`);
            const data: IProduct = response as IProduct;
            return {
                ...data,
                image: this.formatImageUrl(data.image),
            };
        } catch (error) {
            console.error(`Ошибка при получении продукта с ID ${id}:`, error);
            throw error;
        }
    }
    // метод для получения списка всех продуктов
    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this.get('/product');
            const data: ApiListResponse<IProduct> = response as ApiListResponse<IProduct>;
            return data.items.map(item => ({
                ...item,
                image: this.formatImageUrl(item.image),
            }));
        } catch (error) {
            console.error('Ошибка при получении списка продуктов:', error);
            throw error;
        }
    }
    // метод для оформления заказа
    async orderProducts(order: IOrder): Promise<IOrderResult> {
        try {
            const response = await this.post('/order', order);
            const data: IOrderResult = response as IOrderResult;
            return data;
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            throw error;
        }
    }
    // метод для сохранения состояния корзины
    async saveBasket(basketData: { items: string[]; total: number }): Promise<void> {
        try {
            await this.post('/basket', basketData);
        } catch (error) {
            console.error('Ошибка при сохранении корзины:', error);
            throw error;
        }
    }
    // функция для сохранения состояния корзины в API
    async saveBasketToAPI(appData: { basket: { items: string[]; total: number } }): Promise<void> {
        const basketData = {
            items: appData.basket.items,
            total: appData.basket.total
        };
        // отправляем запрос для сохранения состояния корзины на сервер
        try {
            await this.saveBasket(basketData);
            console.log('Состояние корзины успешно сохранено в API');
        } catch (error) {
            console.error('Ошибка при сохранении корзины в API:', error);
        }
    }
}