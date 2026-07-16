export const PRODUCT_DETAIL_QUERY = `#graphql
  query getProductDetail($id: ID!) {
    product(id: $id) {
      id
      title
      vendor
      productType
      status
      descriptionHtml
      seo {
        title
        description
      }
      media(first: 50) {
        nodes {
          id
          alt
          ... on MediaImage {
            image {
              url
            }
          }
        }
      }
      variants(first: 50) {
        nodes {
          id
          title
          sku
          barcode
          price
          inventoryQuantity
      
          inventoryItem {
            measurement {
              weight {
                value
                unit
              }
            }
          }
        }
      }
    }
  }
`;
