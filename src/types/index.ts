export interface Order {
    orderId: String;
    orderName: String;
    customer: any;
    /** An array containing the items purchased in this order */
    items?: Array<OrderItem>;
    /** An array containing the groups of items purchased in this order */
    itemGroup?: Array<OrderItemGroup>;
    total?: number;
    statusId?: String;
    identifications?: Array<any>;
}
export interface OrderItem {
    orderItemGroupId?: String;
    orderItemId?: String;
    productId?: String;
    quantity?: number;
    price?: number;
    amount?: number;
    statusId?: String;
}
export interface OrderItemGroup {
    orderItemGroupId?: String;
    shippingAddress?: any;
    billingAddress?: any;
    shippingMethod?: any;
    carrier?: any;
    identifications?: Array<any>;
}
export interface Product {
    productId?: String;
    productName?: String;
    description?: String;
    brand?: String;
    price?: number;
    sku?: String;
    identifications?: Array<any>;
    specialPrice?: number;
    /** An array containing assets like images and videos */
    assets?: Array<any>;
    mainImage?: String;
    parentProductId?: String;
    type?: String;
    category?: Array<any>;
    feature?: Array<any>;
    variants?: Array<any>;
}