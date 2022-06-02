export interface Product {
    productId: string;
    productName?: string;
    description?: string;
    brand?: string;
    price?: number;
    sku?: string;
    identifications?: Array<any>;
    specialPrice?: number;
    /** An array containing assets like images and videos */
    assets?: Array<any>;
    mainImage?: string;
    parentProductId?: string;
    type?: string;
    category?: Array<any>;
    feature?: Array<any>;
    variants?: Array<Product>;
}