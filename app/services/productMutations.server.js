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

const STAGED_UPLOADS_CREATE = `#graphql
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters { name value }
      }
      userErrors { field message }
    }
  }
`;

const PRODUCT_CREATE_MEDIA = `#graphql
  mutation productCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { alt mediaContentType }
      mediaUserErrors { field message }
    }
  }
`;

export async function createStagedUpload(admin, { filename, mimeType, fileSize }) {
  const response = await admin.graphql(STAGED_UPLOADS_CREATE, {
    variables: {
      input: [
        {
          resource: "IMAGE",
          filename,
          mimeType,
          fileSize: String(fileSize),
          httpMethod: "POST",
        },
      ],
    },
  });
  const data = await response.json();
  throwErrors(data.data.stagedUploadsCreate.userErrors);
  return data.data.stagedUploadsCreate.stagedTargets[0]; // { url, resourceUrl, parameters }
}

export async function attachProductImage(admin, productId, resourceUrl, alt) {
  const response = await admin.graphql(PRODUCT_CREATE_MEDIA, {
    variables: {
      productId,
      media: [{ originalSource: resourceUrl, mediaContentType: "IMAGE", alt: alt ?? "" }],
    },
  });
  const data = await response.json();
  throwErrors(data.data.productCreateMedia.mediaUserErrors);
}