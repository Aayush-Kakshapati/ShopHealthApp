export const COLLECTION_QUERY = `#graphql
    query getCollection($first: Int!, $after: String){
        collections(first: $first, after: $after){
            edges{
                node{
                    id
                    title
                    handle
                    productsCount {
                        count
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
