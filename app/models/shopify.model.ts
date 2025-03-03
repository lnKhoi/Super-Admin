export type DiscountCode = {
    id: number;
    value_type: string;
    value: string;
    customer_selection: string;
    target_type: string;
    target_selection: string;
    allocation_method: string;
    allocation_limit: number | null;
    once_per_customer: boolean;
    usage_limit: number | null;
    starts_at: string;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    entitled_product_ids: number[];
    entitled_variant_ids: number[];
    entitled_collection_ids: number[];
    entitled_country_ids: number[];
    prerequisite_product_ids: number[];
    prerequisite_variant_ids: number[];
    prerequisite_collection_ids: number[];
    customer_segment_prerequisite_ids: number[];
    prerequisite_customer_ids: number[];
    prerequisite_subtotal_range: number | null;
    prerequisite_quantity_range: number | null;
    prerequisite_shipping_price_range: number | null;
    prerequisite_to_entitlement_quantity_ratio: {
        prerequisite_quantity: number | null;
        entitled_quantity: number | null;
    };
    prerequisite_to_entitlement_purchase: {
        prerequisite_amount: number | null;
    };
    title: string;
    admin_graphql_api_id: string;
}

export type Shopify = {
    brandId: string,
    id: string,
    platform: string,
    shopUrl: string,
    shopName: string
}


export type Product = {
    id: number;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    created_at: string;
    updated_at: string;
    published_at: string;
    variants: Variant[];
    images: ProductImage[];
    thumbnail: ProductImage;
}

export type Variant = {
    id: number;
    product_id: number;
    title: string;
    price: string;
    position: number;
    inventory_policy: string;
    compare_at_price: string | null;
    option1: string;
    option2: string | null;
    option3: string | null;
    created_at: string;
    updated_at: string;
    taxable: boolean;
    barcode: string;
    fulfillment_service: string;
    grams: number;
    inventory_management: string;
    requires_shipping: boolean;
    sku: string;
    weight: number;
    weight_unit: string;
    inventory_item_id: number;
    inventory_quantity: number;
    old_inventory_quantity: number;
    admin_graphql_api_id: string;
    image_id: string | null;
}

export type ProductImage = {
    id: number;
    alt: string | null;
    position: number;
    product_id: number;
    created_at: string;
    updated_at: string;
    admin_graphql_api_id: string;
    width: number;
    height: number;
    src: string;
    variant_ids: any[];
}

export type Order = {
    campaignId: string;
    creatorId: string;
    productId: string;
    productImage:string,
    productPrice:number
    avatar:string
    shippingFee:number
    orderId: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    shopifyLink: string;
    status: string;
    giftCardId: string;
    giftCardCode: string;
    productName: string;
    campaignName: string;
    creatorName: string;
}