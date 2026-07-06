// Feature flag helper for Community Hub and other experimental features
export function isCommunityHubEnabled(): boolean {
  if (typeof window !== "undefined") {
    // Client-side override for testing/QA via localStorage
    const override = localStorage.getItem("feature_community_hub");
    if (override === "true") return true;
    if (override === "false") return false;
  }
  // Environment check
  return (
    process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_HUB === "true" ||
    process.env.NEXT_PUBLIC_FEATURE_COMMUNITY_HUB === "1"
  );
}
