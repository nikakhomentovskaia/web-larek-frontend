export type PaymentMethod = 'cash' | 'card';
/*описание товара*/
export interface IProduct {
    id: string;
    name:string;
    price: number | null;
    description: string;
    category: string;
    image: string;
}
/*описание корзины*/
export interface IBasket {
    items: string[];
    total: number;
}
/*описание заказа*/
export interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
/*работа с формами*/
export type OrderForm = Omit<IOrder, 'total'|'items'>;
/*описание результата заказа*/
export interface IOrderResult {
    id: string;
    total: number;
}