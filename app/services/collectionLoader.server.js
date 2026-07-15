import { COLLECTION_QUERY } from "../graphql/queries/collections.graphql";

export async function loadCollections(admin) {
  const collections = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await admin.graphql(COLLECTION_QUERY, {
      variables: { first: 50, after: cursor },
    });
    const data = await response.json();
    const edges = data.data.collections.edges;

    for (const { node } of edges) {
      collections.push({
        id: node.id,
        title: node.title,
        handle: node.handle,
        productCount: node.productsCount.count,
      });
    }
    hasNextPage = data.data.collections.pageInfo.hasNextPage;
    cursor = data.data.collections.pageInfo.endCursor;
  }
  return collections;
}
