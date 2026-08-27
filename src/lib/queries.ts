import { gql } from "@apollo/client";

export const PRODUCT_CARD_FIELDS = gql`
  fragment ProductCardFields on Product {
    uid
    enName
    images { url }
    productAttributes { enLabel values { enName } }
    variants {
      mrpPrice ebsItemCode posItemCode quantity
      discount { amount value type }
    }
  }
`;

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    uid
    enName
    images { url }
    productAttributes { enLabel values { enName } }
    detailedDescriptions { enLabel values { enName } }
    deliveries { enLabel values { enName } }
    serviceAndDeliveries { enLabel values { enName } }
    priceAndStocks { enLabel values { enName } }
    variants {
      mrpPrice ebsItemCode posItemCode quantity
      discount { amount value type }
    }
  }
`;

export const PRODUCTS_QUERY = gql`
  query Products($skip: Int!, $limit: Int!, $isActive: Boolean) {
    getProducts(
      pagination: { skip: $skip, limit: $limit }
      filter: { isActive: $isActive }
    ) {
      message statusCode
      result { count products { ...ProductCardFields } }
    }
  }
  ${PRODUCT_CARD_FIELDS}
`;

export const PRODUCT_QUERY = gql`
  query Product($uid: String!) {
    getProducts(
      pagination: { skip: 0, limit: 1 }
      filter: { uid: $uid }
    ) {
      message statusCode
      result { count products { ...ProductFields } }
    }
  }
  ${PRODUCT_FIELDS}
`;
