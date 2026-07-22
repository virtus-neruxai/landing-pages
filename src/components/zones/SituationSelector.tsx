import { useEffect, useId, useState } from "react";

import "./ZoneInteractive.css";
import {
  ZONE_CONTENT,
  ZONE_SITUATION_EVENT,
  getDefaultSituation,
  getSituation,
  getSituationFromCampaign,
  getSituationStorageKey,
  type ZoneProfile,
  type ZoneSituation,
} from "./zoneContent";
import { emitZoneAnalytics } from "./zoneAnalytics";

type SituationSelectorProps = {
  profile: ZoneProfile;
  label?: string;
  ctaLabel?: string;
  microcopy?: string;
};

export type ZoneSituationEventDetail = {
  profile: ZoneProfile;
  selected_situation: string;
  demo_variant: string;
};

type ZoneWindow = Window & {
  __virtusZoneSelections?: Partial<Record<ZoneProfile, string>>;
};

function safelyReadStoredSituation(profile: ZoneProfile) {
  try {
    return getSituation(profile, window.sessionStorage.getItem(getSituationStorageKey(profile)));
  } catch {
    return undefined;
  }
}

function safelyReadStoredCampaignContent() {
  try {
    const stored = window.sessionStorage.getItem("virtus:campaign");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Record<string, unknown>;
    return typeof parsed.content === "string" ? parsed.content : null;
  } catch {
    return null;
  }
}

function resolveInitialSituation(profile: ZoneProfile) {
  const params = new URLSearchParams(window.location.search);
  return (
    getSituationFromCampaign(profile, params.get("utm_content")) ??
    safelyReadStoredSituation(profile) ??
    getSituationFromCampaign(profile, safelyReadStoredCampaignContent()) ??
    getDefaultSituation(profile)
  );
}

function persistSituation(profile: ZoneProfile, situation: ZoneSituation) {
  try {
    window.sessionStorage.setItem(getSituationStorageKey(profile), situation.id);
  } catch {
    // The selector remains usable when storage is unavailable.
  }
}

function broadcastSituation(profile: ZoneProfile, situation: ZoneSituation) {
  const zoneWindow = window as ZoneWindow;
  zoneWindow.__virtusZoneSelections ??= {};
  zoneWindow.__virtusZoneSelections[profile] = situation.id;

  const detail: ZoneSituationEventDetail = {
    profile,
    selected_situation: situation.id,
    demo_variant: situation.demoVariant,
  };
  window.dispatchEvent(new CustomEvent(ZONE_SITUATION_EVENT, { detail }));
}

function scrollToDemo() {
  const demo = document.querySelector<HTMLElement>("#zone-demo");
  if (!demo) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  demo.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  demo.focus({ preventScroll: true });
}

export default function SituationSelector({
  profile,
  label,
  ctaLabel,
  microcopy,
}: SituationSelectorProps) {
  const content = ZONE_CONTENT[profile];
  const labelId = useId();
  const [selectedId, setSelectedId] = useState(getDefaultSituation(profile).id);
  const [hasTrackedSelection, setHasTrackedSelection] = useState(false);

  useEffect(() => {
    const initialSituation = resolveInitialSituation(profile);
    setSelectedId(initialSituation.id);
    persistSituation(profile, initialSituation);
    broadcastSituation(profile, initialSituation);
  }, [profile]);

  const chooseSituation = (situation: ZoneSituation, trackSelection = true) => {
    setSelectedId(situation.id);
    persistSituation(profile, situation);
    broadcastSituation(profile, situation);

    if (trackSelection) {
      setHasTrackedSelection(true);
      emitZoneAnalytics("profile_situation_selected", {
        profile,
        selected_situation: situation.id,
        demo_variant: situation.demoVariant,
      });
    }

    window.requestAnimationFrame(scrollToDemo);
  };

  const selectedSituation = getSituation(profile, selectedId) ?? getDefaultSituation(profile);

  return (
    <div className={`zone-selector zone-selector--${profile}`}>
      <p className="zone-selector__label" id={labelId}>
        {label ?? content.selectorLabel}
      </p>

      <div className="zone-selector__chips" role="group" aria-labelledby={labelId}>
        {content.situations.map((situation) => {
          const isSelected = situation.id === selectedSituation.id;
          return (
            <button
              className="zone-selector__chip"
              type="button"
              key={situation.id}
              aria-pressed={isSelected}
              onClick={() => chooseSituation(situation)}
            >
              <span aria-hidden="true" className="zone-selector__chip-mark" />
              {situation.label}
            </button>
          );
        })}
      </div>

      <button
        className="zone-selector__cta"
        type="button"
        onClick={() => chooseSituation(selectedSituation, !hasTrackedSelection)}
      >
        <span>{ctaLabel ?? content.selectorCta}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 10h11m-4-4 4 4-4 4" />
        </svg>
      </button>

      <p className="zone-selector__microcopy">{microcopy ?? content.selectorMicrocopy}</p>
    </div>
  );
}
