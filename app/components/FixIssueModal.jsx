/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { getAdminResourceUrl } from "../lib/adminLinks";

const STATUS_OPTIONS = ["ACTIVE", "DRAFT", "ARCHIVED"];

export default function FixIssueModal({ issue, shop, modalRef }) {
  const detailFetcher = useFetcher();
  const saveFetcher = useFetcher();
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(null);

  const numericId = issue?.resourceId?.split("/").pop();
  const adminUrl = issue ? getAdminResourceUrl(shop, issue.resourceType, issue.resourceId) : null;
  const product = detailFetcher.data?.product;
  const saveError = saveFetcher.data?.success === false ? saveFetcher.data.error : null;

  useEffect(() => {
    if (issue?.resourceType === "product" && numericId) {
      setOriginal(null);
      setForm(null);
      detailFetcher.load(`/app/api/products/${numericId}`);
    }
  }, [issue?.id]);

  useEffect(() => {
    if (product && !form) {
      setOriginal(product);
      // Deep clone so editing `form` never mutates `original` by reference —
      // saveProductChanges needs both to genuinely differ to diff correctly.
      setForm(JSON.parse(JSON.stringify(product)));
    }
  }, [product]);

  useEffect(() => {
    if (saveFetcher.data?.success) {
      modalRef.current?.hideOverlay();
      setForm(null);
      setOriginal(null);
    }
  }, [saveFetcher.data]);

  const handleSave = () => {
    saveFetcher.submit(
      { payload: JSON.stringify({ original, updated: form }) },
      { method: "post", action: `/app/api/products/${numericId}` }
    );
  };

  const updateVariant = (index, field, value) => {
    const updated = [...form.variants];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, variants: updated });
  };

  const isLoading = detailFetcher.state !== "idle";
  const isSaving = saveFetcher.state !== "idle";

  return (
    <s-modal id="fix-issue-modal" ref={modalRef} heading={issue?.title ?? "Fix Issue"} size="large">
      {issue?.resourceType !== "product" && (
        <s-paragraph>This type of issue can&apos;t be edited here yet.</s-paragraph>
      )}

      {issue?.resourceType === "product" && (
        <s-stack direction="block" gap="large">
          {saveError && (
            <s-banner tone="critical" heading="Couldn't save changes">
              <s-paragraph>{saveError}</s-paragraph>
            </s-banner>
          )}

          {isLoading && (
            <s-stack direction="inline" gap="base" alignItems="center">
              <s-spinner accessibilityLabel="Loading product" size="small" />
              <s-text tone="subdued">Loading product details…</s-text>
            </s-stack>
          )}

          {form && (
            <>
              <s-section heading="Basic information">
                <s-stack direction="block" gap="base">
                  <s-text-field
                    label="Title"
                    value={form.title}
                    disabled={isSaving || undefined}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                  <s-text-area
                    label="Description"
                    value={form.description}
                    disabled={isSaving || undefined}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <s-stack direction="inline" gap="base">
                    <s-text-field
                      label="Vendor"
                      value={form.vendor}
                      disabled={isSaving || undefined}
                      onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                    />
                    <s-text-field
                      label="Product type"
                      value={form.productType}
                      disabled={isSaving || undefined}
                      onChange={(e) => setForm({ ...form, productType: e.target.value })}
                    />
                  </s-stack>
                  <s-select
                    label="Status"
                    value={form.status}
                    disabled={isSaving || undefined}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <s-option key={s} value={s}>{s}</s-option>
                    ))}
                  </s-select>
                </s-stack>
              </s-section>

              <s-section heading="Media">
                {form.media.length > 0 ? (
                  <s-stack direction="inline" gap="base">
                    {form.media.map((m) => (
                      <s-thumbnail key={m.id} src={m.url} alt={m.alt || form.title} size="large" />
                    ))}
                  </s-stack>
                ) : (
                  <s-paragraph tone="subdued">No images. Upload images from the full product page in Shopify.</s-paragraph>
                )}
              </s-section>

              <s-section heading="Pricing & variants">
                <s-table>
                  <s-table-header-row>
                    <s-table-header>Variant</s-table-header>
                    <s-table-header>SKU</s-table-header>
                    <s-table-header>Barcode</s-table-header>
                    <s-table-header>Price</s-table-header>
                    <s-table-header>Inventory</s-table-header>
                  </s-table-header-row>
                  <s-table-body>
                    {form.variants.map((variant, i) => (
                      <s-table-row key={variant.id}>
                        <s-table-cell>{variant.title}</s-table-cell>
                        <s-table-cell>
                          <s-text-field
                            value={variant.sku}
                            disabled={isSaving || undefined}
                            onChange={(e) => updateVariant(i, "sku", e.target.value)}
                          />
                        </s-table-cell>
                        <s-table-cell>
                          <s-text-field
                            value={variant.barcode}
                            disabled={isSaving || undefined}
                            onChange={(e) => updateVariant(i, "barcode", e.target.value)}
                          />
                        </s-table-cell>
                        <s-table-cell>
                          <s-text-field
                            type="number"
                            value={variant.price}
                            disabled={isSaving || undefined}
                            onChange={(e) => updateVariant(i, "price", e.target.value)}
                          />
                        </s-table-cell>
                        <s-table-cell>
                          <s-text tone="subdued">{variant.inventoryQuantity} in stock</s-text>
                        </s-table-cell>
                      </s-table-row>
                    ))}
                  </s-table-body>
                </s-table>
              </s-section>

              <s-section heading="Search engine listing">
                <s-stack direction="block" gap="base">
                  <s-text-field
                    label="Page title"
                    value={form.seoTitle}
                    disabled={isSaving || undefined}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  />
                  <s-text-area
                    label="Meta description"
                    value={form.seoDescription}
                    disabled={isSaving || undefined}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  />
                </s-stack>
              </s-section>
            </>
          )}
        </s-stack>
      )}

      <s-stack slot="primary-action" direction="inline" gap="base">
        {adminUrl && (
          <s-button href={adminUrl} target="_blank" disabled={isSaving || undefined}>
            Open full page in Shopify
          </s-button>
        )}
        <s-button
          variant="primary"
          onClick={handleSave}
          loading={isSaving || undefined}
          disabled={!form || isSaving}
        >
          Save Changes
        </s-button>
      </s-stack>
    </s-modal>
  );
}