import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, IProduct } from '../types';

// Интерфейс для API WebLarek
export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

// Класс WebLarekAPI, реализующий интерфейс IWebLarekAPI
export class WebLarekAPI extends Api implements IWebLarekAPI {
    private readonly cdn: string;

    // Конструктор класса
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // Вспомогательный метод для форматирования URL изображения
    private formatImageUrl(imagePath: string): string {
        return `${this.cdn}${imagePath}`;
    }

    // Метод для получения продукта по его ID
    async getProductItem(id: string): Promise<IProduct> {
        try {
            const response = await this.get(`/product/${id}`);
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

    // Метод для получения списка всех продуктов
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

    // Метод для оформления заказа
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
}