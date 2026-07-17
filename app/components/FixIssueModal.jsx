/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

const STATUS_OPTIONS = ["ACTIVE", "DRAFT", "ARCHIVED"];

const STATUS_TONE = {
  ACTIVE: "success",
  DRAFT: "info",
  ARCHIVED: "subdued",
};

export default function FixIssueModal({ issue, modalRef }) {
  const detailFetcher = useFetcher();
  const saveFetcher = useFetcher();

  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(null);

  const productId = issue?.resourceId?.split("/").pop();

  useEffect(() => {
    if (issue?.resourceType !== "product" || !productId) {
      return;
    }

    setForm(null);
    setOriginal(null);

    detailFetcher.load(`/app/api/products/${productId}`);
  }, [issue?.id]);

  useEffect(() => {
    const product = detailFetcher.data?.product;

    if (!product) {
      return;
    }

    setOriginal(structuredClone(product));

    setForm(structuredClone(product));
  }, [detailFetcher.data]);



  useEffect(() => {
    if (saveFetcher.data?.success) {
      modalRef.current?.hideOverlay();

      setForm(null);
      setOriginal(null);
    }
  }, [saveFetcher.data]);

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const updateVariant = (index, field, value) => {
    const variants = [...form.variants];

    variants[index] = {
      ...variants[index],
      [field]: value,
    };

    setForm({
      ...form,
      variants,
    });
  };

  const updateMedia = (index, field, value) => {
    const media = [...form.media];

    media[index] = {
      ...media[index],
      [field]: value,
    };

    setForm({
      ...form,
      media,
    });
  };

  const removeMedia = (id) => {
    setForm({
      ...form,
      media: form.media.filter((item) => item.id !== id),
    });
  };


  const hasChanges = JSON.stringify(original) !== JSON.stringify(form);

  const save = () => {
    saveFetcher.submit(
      {
        payload: JSON.stringify({
          original,
          updated: form,
        }),
      },
      {
        method: "post",
        action: `/app/api/products/${productId}`,
      },
    );
    shopify.toast.show('Product Details Updated');
  };

  const loading = detailFetcher.state !== "idle";

  const saving = saveFetcher.state !== "idle";

  return (
    <s-modal
      id="fix-issue-modal"
      ref={modalRef}
      heading={issue?.title ?? "Fix Product"}
      size="large"
    >
      {loading && (
        <s-stack direction="inline" gap="small-300">
          <s-spinner size="small" />

          <s-text>Loading product...</s-text>
        </s-stack>
      )}

      {form && (
        <s-stack direction="block" gap="large">
          <s-stack direction="inline" justifyContent="space-between">
            <s-heading>{form.title || "Untitled Product"}</s-heading>

            <s-badge tone={STATUS_TONE[form.status]}>{form.status}</s-badge>
          </s-stack>

          <s-divider />

          <s-section heading="Product">
            <s-stack direction="block" gap="base">
              <s-text-field
                label="Title"

                value={form.title}

                onChange={(e) => updateField("title", e.target.value)}
              />

              <s-text-area
                label="Description"

                rows={6}

                value={form.description}

                onChange={(e) => updateField("description", e.target.value)}
              />

              <s-text-field
                label="Vendor"

                value={form.vendor}

                onChange={(e) => updateField("vendor", e.target.value)}
              />

              <s-text-field
                label="Product Type"

                value={form.productType}

                onChange={(e) => updateField("productType", e.target.value)}
              />

              <s-select
                label="Status"

                value={form.status}

                onChange={(e) => updateField("status", e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <s-option key={status} value={status}>
                    {status}
                  </s-option>
                ))}
              </s-select>
            </s-stack>
          </s-section>

          <s-section heading="Media">
            <s-stack direction="block" gap="base">
              {form.media.length > 0 ? (
                <s-grid
                  gridTemplateColumns="repeat(auto-fill,minmax(220px,1fr))"
                  gap="base"
                >
                  {form.media.map((image, index) => (
                    <s-stack key={image.id} direction="block" gap="small-300">
                      <s-thumbnail
                        src={image.url}

                        alt={image.alt}

                        size="large"
                      />

                      <s-text-field
                        label="Alt text"

                        value={image.alt}

                        onChange={(e) =>
                          updateMedia(index, "alt", e.target.value)
                        }
                      />

                      <s-button
                        tone="critical"

                        onClick={() => removeMedia(image.id)}
                      >
                        Remove
                      </s-button>
                      <s-button onClick={(e) => updateMedia(index, "image", e.target.value)}>Upload Images</s-button>
                    </s-stack>
                  ))}
                </s-grid>
              ) : (
                <s-text tone="subdued">No images</s-text>
              )}

            </s-stack>
          </s-section>

          <s-section heading="Variants">
            <s-table>
              <s-table-header-row>
                <s-table-header>Variant</s-table-header>

                <s-table-header>SKU</s-table-header>

                <s-table-header>Price</s-table-header>
              </s-table-header-row>

              <s-table-body>
                {form.variants.map((variant, index) => (
                  <s-table-row key={variant.id}>
                    <s-table-cell>{variant.title}</s-table-cell>

                    <s-table-cell>
                      <s-text-field
                        label="SKU"

                        value={variant.sku}

                        onChange={(e) =>
                          updateVariant(index, "sku", e.target.value)
                        }
                      />
                    </s-table-cell>

                    <s-table-cell>
                      <s-text-field
                        label="Price"

                        type="number"

                        value={variant.price}

                        onChange={(e) =>
                          updateVariant(index, "price", e.target.value)
                        }
                      />
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>
          </s-section>

          <s-section heading="SEO">
            <s-stack direction="block">
              <s-text-field
                label="SEO title"

                value={form.seoTitle}

                onChange={(e) => updateField("seoTitle", e.target.value)}
              />

              <s-text-area
                label="SEO description"

                rows={4}

                value={form.seoDescription}

                onChange={(e) => updateField("seoDescription", e.target.value)}
              />
            </s-stack>
          </s-section>
        </s-stack>
      )}

      <s-button
        slot="primary-action"

        variant="primary"

        loading={saving || undefined}

        disabled={!hasChanges}

        onClick={save}
      >
        Save Changes
      </s-button>
    </s-modal>
  );
}
