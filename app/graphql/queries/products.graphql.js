export const PRODUCTS_QUERY = `#graphql
    query getProducts($first: Int!, $after: String){
        products(first: $first, after: $after){
            edges{
                node{
                    id
                    title
                    vendor
                    productType
                    status
                    seo{
                        title
                        description                
                    }
                    images(first: 10){
                        edges{
                            node{
                                id
                                altText
                                url
                            }
                        }
                    }
                    variants(first: 50){
                        edges{
                            node{
                                id
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
            }
            pageInfo{
                hasNextPage
                endCursor
            }
        }
    }

`;
