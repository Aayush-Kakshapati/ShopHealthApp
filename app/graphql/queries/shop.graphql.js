export const SHOP_QUERY = `#graphql
  query getShop {
    shop {
      name
      email
      currencyCode
    }
  }
`;