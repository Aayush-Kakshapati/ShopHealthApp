import { authenticate } from "../shopify.server";
import { loadProductDetail } from "../services/productDetailLoader.server";
import { saveProductChanges } from "../services/productMutations.server";

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const gid = `gid://shopify/Product/${params.id}`;
  const product = await loadProductDetail(admin, gid);
  return { product };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const payload = JSON.parse(formData.get("payload"));

  try {
    await saveProductChanges(admin, {
      original: payload.original,
      updated: payload.updated,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};