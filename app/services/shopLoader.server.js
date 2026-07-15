import { SHOP_QUERY } from "../graphql/queries/shop.graphql";

export async function loadShop(admin) {
  const response = await admin.graphql(SHOP_QUERY);
  const data = await response.json();
  return data.data.shop;
}