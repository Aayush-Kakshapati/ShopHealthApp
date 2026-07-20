import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import { runScan } from "../services/scanPipeline.server";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const scan = await runScan({ admin, shop: session.shop });
  return { scan };
};

// const SCAN_STAGES = [
//   "Connecting to your store…",
//   "Fetching products…",
//   "Fetching collections…",
//   "Running health checks…",
//   "Calculating your score…",
// ];

export default function Scan() {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const isScanning = fetcher.state !== "idle";
  const scan = fetcher.data?.scan;

  useEffect(() => {
    if (scan) {
      navigate("/app");
    }
  }, [scan, navigate]);

  return (
    <s-page heading="Scan your store">
      <s-section>
        <s-stack direction="block" gap="large" alignItems="center">
          {!isScanning ? (
            <s-stack direction="block" gap="base" alignItems="center">
              <s-paragraph tone="subdued">
                Run a full check across your products, collections, and pricing.
                Most scans finish in under 30 seconds.
              </s-paragraph>
              <s-button
                variant="primary"
                onClick={() => fetcher.submit({}, { method: "post" })}
              >
                Run Scan
              </s-button>
            </s-stack>
          ) : (
            <ScanningIndicator />
          )}
        </s-stack>
      </s-section>
    </s-page>
  );
}

function ScanningIndicator() {
  return (
    <s-stack direction="block" gap="base" alignItems="center">
      <s-spinner accessibilityLabel="Scanning your store" size="large" />
      <s-text fontWeight="bold">Scanning your store…</s-text>
      <s-text tone="subdued">This usually takes 15–30 seconds.</s-text>
    </s-stack>
  );
}