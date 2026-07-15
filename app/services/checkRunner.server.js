import { checkRegistry } from "../checks/registery";

export async function runChecks(context) {
  const results = await Promise.all(
    checkRegistry
      .filter((check) => check.enabled !== false)
      .map(async (check) => {
        const issues = await check.run(context);
        return issues.map((issue) => ({
          ...issue,
          checkId: check.id,
          category: check.category,
          severity: check.severity,
        }));
      })
  );

  return results.flat();
}