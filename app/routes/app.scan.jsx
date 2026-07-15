import { authenticate } from "../shopify.server";
import { runScan } from "../services/scanPipeline.server";
import { useFetcher } from "react-router";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const scan = await runScan({
    admin,
    shop: session.shop,
  });

  return { scan };
};

export default function Scan() {
  const fetcher = useFetcher();

  const isScanning = fetcher.state !== "idle";
  const scan = fetcher.data?.scan;

  return (
    <s-page heading="Scan your store">
      <s-box padding="base" border="base" borderRadius="base">
        <fetcher.Form method="post">
          <s-button type="submit" disabled={isScanning}>
            {isScanning ? "Scanning..." : "Run Scan"}
          </s-button>
        </fetcher.Form>

        {scan && (
          <s-box paddingBlockStart="base">
            <s-paragraph>
              Scan complete — score: {scan.score} (took {scan.duration}ms)
            </s-paragraph>
          </s-box>
        )}
      </s-box>
    </s-page>
  );
}
