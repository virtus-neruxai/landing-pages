const CAMPAIGN_QUERY_KEYS = [
  ["utm_source", "source"],
  ["utm_medium", "medium"],
  ["utm_campaign", "campaign"],
  ["utm_content", "content"],
  ["influencer_id", "influencer_id"],
] as const;

type CampaignProperty = (typeof CAMPAIGN_QUERY_KEYS)[number][1];
type CampaignProperties = Partial<Record<CampaignProperty, string>>;

function readCampaignProperties(): CampaignProperties {
  let campaign: CampaignProperties = {};

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem("virtus:campaign") ?? "{}") as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [, propertyKey] of CAMPAIGN_QUERY_KEYS) {
        const value = (parsed as Record<string, unknown>)[propertyKey];
        if (typeof value === "string" && value) campaign[propertyKey] = value;
      }
    }
  } catch {
    // Query parameters still enrich events if storage is unavailable.
  }

  const query = new URLSearchParams(window.location.search);
  for (const [queryKey, propertyKey] of CAMPAIGN_QUERY_KEYS) {
    const value = query.get(queryKey)?.trim();
    if (value) campaign[propertyKey] = value;
  }

  return campaign;
}

export function emitZoneAnalytics(name: string, properties: Record<string, string>) {
  window.dispatchEvent(
    new CustomEvent("virtus:analytics", {
      detail: {
        name,
        properties: { ...readCampaignProperties(), ...properties },
        timestamp: new Date().toISOString(),
      },
    }),
  );
}
