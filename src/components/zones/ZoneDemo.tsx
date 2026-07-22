import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type SyntheticEvent,
} from "react";

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
import type { ZoneSituationEventDetail } from "./SituationSelector";
import { emitZoneAnalytics } from "./zoneAnalytics";

type ZoneDemoProps = {
  profile: ZoneProfile;
  appUrl: string;
};

type DemoPhase = "editing" | "generating" | "ready";

type ZoneWindow = Window & {
  __virtusZoneSelections?: Partial<Record<ZoneProfile, string>>;
};

const CAMPAIGN_PARAMS = [
  ["utm_source", "source"],
  ["utm_medium", "medium"],
  ["utm_campaign", "campaign"],
  ["utm_content", "content"],
  ["utm_term", "term"],
  ["influencer_id", "influencer_id"],
] as const;

function analyticsProperties(profile: ZoneProfile, situation: ZoneSituation) {
  return {
    profile,
    selected_situation: situation.id,
    demo_variant: situation.demoVariant,
  };
}

function readStoredSituation(profile: ZoneProfile) {
  try {
    return getSituation(profile, window.sessionStorage.getItem(getSituationStorageKey(profile)));
  } catch {
    return undefined;
  }
}

function readStoredCampaignContent() {
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
  const currentPageSelection = (window as ZoneWindow).__virtusZoneSelections?.[profile];
  return (
    getSituation(profile, currentPageSelection) ??
    getSituationFromCampaign(profile, params.get("utm_content")) ??
    readStoredSituation(profile) ??
    getSituationFromCampaign(profile, readStoredCampaignContent()) ??
    getDefaultSituation(profile)
  );
}

function appendCampaignParams(target: URL) {
  const currentParams = new URLSearchParams(window.location.search);

  for (const [queryName] of CAMPAIGN_PARAMS) {
    const value = currentParams.get(queryName);
    if (value && !target.searchParams.has(queryName)) target.searchParams.set(queryName, value);
  }

  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const storageKey = window.sessionStorage.key(index);
      if (!storageKey || !/(utm|campaign|attribution)/i.test(storageKey)) continue;

      const storedValue = window.sessionStorage.getItem(storageKey);
      if (!storedValue) continue;

      let storedParams: Record<string, unknown> = {};
      try {
        const parsed = JSON.parse(storedValue) as unknown;
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          storedParams = parsed as Record<string, unknown>;
        }
      } catch {
        storedParams = Object.fromEntries(new URLSearchParams(storedValue));
      }

      for (const [queryName, storageName] of CAMPAIGN_PARAMS) {
        const value = storedParams[queryName] ?? storedParams[storageName];
        if (typeof value === "string" && value && !target.searchParams.has(queryName)) {
          target.searchParams.set(queryName, value);
        }
      }
    }
  } catch {
    // Navigation still works if browser storage is unavailable.
  }
}

function buildAppHref(baseHref: string, profile: ZoneProfile, situation: ZoneSituation) {
  const target = new URL(baseHref, window.location.origin);
  appendCampaignParams(target);
  target.searchParams.set("profile", profile);
  target.searchParams.set("selected_situation", situation.id);
  return target.toString();
}

export default function ZoneDemo({ profile, appUrl }: ZoneDemoProps) {
  const content = ZONE_CONTENT[profile];
  const inputId = useId();
  const hintId = useId();
  const resultTitleId = useId();
  const generationTimer = useRef<number | null>(null);
  const initialSituation = getDefaultSituation(profile);
  const situationRef = useRef(initialSituation);

  const [situation, setSituation] = useState(initialSituation);
  const [input, setInput] = useState(initialSituation.exampleInput);
  const [phase, setPhase] = useState<DemoPhase>("editing");
  const [generatedInput, setGeneratedInput] = useState("");
  const [resultVersion, setResultVersion] = useState(0);
  const [ctaHref, setCtaHref] = useState(appUrl);
  const [status, setStatus] = useState("Ejemplo preparado. Puedes editarlo antes de continuar.");

  useEffect(() => {
    const resolved = resolveInitialSituation(profile);
    situationRef.current = resolved;
    setSituation(resolved);
    setInput(resolved.exampleInput);
    setCtaHref(buildAppHref(appUrl, profile, resolved));

    const handleSituation = (event: Event) => {
      const detail = (event as CustomEvent<ZoneSituationEventDetail>).detail;
      if (!detail || detail.profile !== profile) return;

      const nextSituation = getSituation(profile, detail.selected_situation);
      if (!nextSituation) return;
      if (situationRef.current.id === nextSituation.id) return;

      if (generationTimer.current !== null) {
        window.clearTimeout(generationTimer.current);
        generationTimer.current = null;
      }
      situationRef.current = nextSituation;
      setSituation(nextSituation);
      setInput(nextSituation.exampleInput);
      setGeneratedInput("");
      setPhase("editing");
      setStatus(`Ejemplo actualizado para «${nextSituation.label}».`);
      setCtaHref(buildAppHref(appUrl, profile, nextSituation));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.sessionStorage) return;
      if (event.key !== getSituationStorageKey(profile)) return;

      const nextSituation = getSituation(profile, event.newValue);
      if (!nextSituation) return;
      handleSituation(
        new CustomEvent<ZoneSituationEventDetail>(ZONE_SITUATION_EVENT, {
          detail: {
            profile,
            selected_situation: nextSituation.id,
            demo_variant: nextSituation.demoVariant,
          },
        }),
      );
    };

    window.addEventListener(ZONE_SITUATION_EVENT, handleSituation);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(ZONE_SITUATION_EVENT, handleSituation);
      window.removeEventListener("storage", handleStorage);
    };
  }, [appUrl, profile]);

  useEffect(
    () => () => {
      if (generationTimer.current !== null) window.clearTimeout(generationTimer.current);
    },
    [],
  );

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || phase === "generating") return;

    if (generationTimer.current !== null) window.clearTimeout(generationTimer.current);
    setPhase("generating");
    setStatus(content.generatingLabel);
    emitZoneAnalytics("profile_demo_started", analyticsProperties(profile, situation));

    generationTimer.current = window.setTimeout(() => {
      setGeneratedInput(trimmedInput);
      setPhase("ready");
      setResultVersion((version) => version + 1);
      setStatus(`${content.resultTitle}. Resultado listo antes del registro.`);
      setCtaHref(buildAppHref(appUrl, profile, situation));
      emitZoneAnalytics("profile_demo_completed", analyticsProperties(profile, situation));
      emitZoneAnalytics("profile_plan_generated", analyticsProperties(profile, situation));
      generationTimer.current = null;
    }, 460);
  };

  const handleSaveClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    const nextHref = buildAppHref(event.currentTarget.href || appUrl, profile, situation);
    event.currentTarget.href = nextHref;
    setCtaHref(nextHref);
    emitZoneAnalytics("profile_plan_save_clicked", {
      ...analyticsProperties(profile, situation),
      location: `${profile}_zone_demo`,
    });
  };

  return (
    <div className={`zone-demo zone-demo--${profile} zone-demo--${phase}`}>
      <div className="zone-demo__topbar">
        <span className="zone-demo__product">Virtus · mentor de dirección</span>
        <span className="zone-demo__phase" aria-hidden="true">
          <span className="zone-demo__phase-mark" />
          {phase === "generating" ? "Preparando respuesta" : phase === "ready" ? "Resultado listo" : "Tu situación"}
        </span>
      </div>

      <form className="zone-demo__form" onSubmit={handleSubmit}>
        <label className="zone-demo__label" htmlFor={inputId}>
          {content.demoLabel}
        </label>
        <div className="zone-demo__input-shell">
          <textarea
            className="zone-demo__input"
            id={inputId}
            value={input}
            maxLength={500}
            rows={5}
            aria-describedby={hintId}
            disabled={phase === "generating"}
            onChange={(event) => {
              setInput(event.target.value);
              if (phase === "ready") {
                setPhase("editing");
                setStatus("Situación editada. Genera de nuevo para actualizar el resultado.");
              }
            }}
          />
          <span className="zone-demo__count" aria-hidden="true">
            {input.length}/500
          </span>
        </div>
        <div className="zone-demo__form-footer">
          <p className="zone-demo__hint" id={hintId}>
            {content.demoHint}
          </p>
          <button
            className="zone-demo__generate"
            type="submit"
            disabled={!input.trim() || phase === "generating"}
          >
            <span>{phase === "generating" ? "Preparando…" : content.demoButton}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 10h11m-4-4 4 4-4 4" />
            </svg>
          </button>
        </div>
      </form>

      <section
        className="zone-demo__result"
        aria-labelledby={phase === "ready" ? resultTitleId : undefined}
        aria-label={phase === "ready" ? undefined : "Resultado de la demostración"}
        aria-busy={phase === "generating"}
      >
        {phase === "generating" ? (
          <div className="zone-demo__loading" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        ) : phase === "ready" ? (
          <div className="zone-demo__result-content" key={resultVersion}>
            <p className="zone-demo__result-eyebrow">{content.resultEyebrow}</p>
            <h3 className="zone-demo__result-title" id={resultTitleId}>
              {content.resultTitle}
            </h3>
            <p className="zone-demo__echo">“{generatedInput}”</p>

            <div className="zone-demo__blocks">
              {situation.result.map((block, index) => (
                <article className="zone-demo__block" key={block.title}>
                  <span className="zone-demo__block-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h4>{block.title}</h4>
                  <p>{block.summary}</p>
                  <ul>
                    {block.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="zone-demo__save-row">
              <p>Tu resultado se muestra completo antes de crear una cuenta.</p>
              <a
                className="zone-demo__save"
                href={ctaHref}
                data-app-link
                onClick={handleSaveClick}
              >
                <span>{content.saveCta}</span>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 10h11m-4-4 4 4-4 4" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="zone-demo__preview">
            <p className="zone-demo__preview-kicker">La respuesta no será una frase motivacional</p>
            <p>
              {profile === "student"
                ? "Verás qué mantener, qué explorar y qué observar durante 7 días para obtener evidencia real."
                : "Verás qué proteger, qué cuestionar y qué experimentar durante 14 días para recuperar criterio."}
            </p>
          </div>
        )}
      </section>

      <p className="zone-demo__sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </div>
  );
}
