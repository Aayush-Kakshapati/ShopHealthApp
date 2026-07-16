const UPDATE_PRODUCT = `#graphql
mutation updateProduct($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;

const UPDATE_VARIANTS = `#graphql
mutation updateVariants(
  $productId: ID!
  $variants: [ProductVariantsBulkInput!]!
) {
  productVariantsBulkUpdate(
    productId: $productId
    variants: $variants
  ) {
    productVariants {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`;


function throwErrors(errors = []) {
  if (errors.length) {
    throw new Error(
      errors.map((error) => error.message).join(", ")
    );
  }
}


export async function saveProductChanges(
  admin,
  {
    original,
    updated,
  }
) {


  const productChanged =
    original.title !== updated.title ||
    original.description !== updated.description ||
    original.vendor !== updated.vendor ||
    original.productType !== updated.productType ||
    original.status !== updated.status ||
    original.seoTitle !== updated.seoTitle ||
    original.seoDescription !== updated.seoDescription;


  if (productChanged) {

    const response = await admin.graphql(
      UPDATE_PRODUCT,
      {
        variables: {
          input: {
            id: updated.id,

            title:
              original.title !== updated.title
                ? updated.title
                : undefined,

            descriptionHtml:
              original.description !== updated.description
                ? updated.description
                : undefined,

            vendor:
              original.vendor !== updated.vendor
                ? updated.vendor
                : undefined,

            productType:
              original.productType !== updated.productType
                ? updated.productType
                : undefined,

            status:
              original.status !== updated.status
                ? updated.status
                : undefined,


            seo:
              original.seoTitle !== updated.seoTitle ||
              original.seoDescription !== updated.seoDescription
                ? {
                    title: updated.seoTitle,
                    description: updated.seoDescription,
                  }
                : undefined,
          },
        },
      }
    );


    const data = await response.json();

    throwErrors(
      data.data.productUpdate.userErrors
    );
  }



  const changedVariants =
    updated.variants.filter((variant, index) => {

      const old = original.variants[index];

      return (
        variant.sku !== old.sku ||
        variant.price !== old.price ||
        variant.barcode !== old.barcode
      );

    });


  if (changedVariants.length) {

    const response =
      await admin.graphql(
        UPDATE_VARIANTS,
        {
          variables: {
            productId: updated.id,

            variants:
              changedVariants.map((variant) => ({
                id: variant.id,

                sku: variant.sku,

                barcode: variant.barcode,

                price: String(
                  variant.price
                ),
              })),
          },
        }
      );


    const data = await response.json();


    throwErrors(
      data.data
        .productVariantsBulkUpdate
        .userErrors
    );
  }


  return true;
}