import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

import "./HeroDemo.css";

const EXAMPLE_MISSION = "Quiero terminar la carrera sin perder la cabeza";

type DemoPhase = "typing" | "editing" | "generating" | "ready";

type PlanAction = {
  cadence: string;
  description: string;
  title: string;
};

const STUDY_PLAN: PlanAction[] = [
  {
    cadence: "Hoy · 10 min",
    title: "Define qué significa terminar bien",
    description:
      "Escribe el resultado que buscas y el límite que no quieres cruzar para conseguirlo.",
  },
  {
    cadence: "Mañana · 25 min",
    title: "Elige el siguiente entregable",
    description:
      "Abre una asignatura y completa una parte pequeña que puedas dar por cerrada.",
  },
  {
    cadence: "3 días por semana",
    title: "Reserva dos bloques sostenibles",
    description:
      "Haz dos bloques de 25 minutos y deja espacio real entre ellos para recuperar.",
  },
  {
    cadence: "Domingo · 10 min",
    title: "Revisa avance y energía",
    description:
      "Conserva lo que funcionó y reduce el plan si la semana te está sobrepasando.",
  },
];

const MOVEMENT_PLAN: PlanAction[] = [
  {
    cadence: "Hoy · 10 min",
    title: "Pon una meta que puedas medir",
    description:
      "Define qué quieres mejorar y cómo reconocerás un avance dentro de cuatro semanas.",
  },
  {
    cadence: "Mañana · 20 min",
    title: "Haz una sesión de referencia",
    description:
      "Empieza suave y anota cómo llegas de energía, sin intentar demostrar nada todavía.",
  },
  {
    cadence: "2 días por semana",
    title: "Protege la repetición mínima",
    description:
      "Reserva dos sesiones breves que puedas mantener también en una semana difícil.",
  },
  {
    cadence: "Fin de semana",
    title: "Ajusta carga y recuperación",
    description:
      "Revisa esfuerzo, descanso y molestias antes de decidir el siguiente incremento.",
  },
];

const WELLBEING_PLAN: PlanAction[] = [
  {
    cadence: "Ahora · 5 min",
    title: "Nombra lo que necesitas",
    description:
      "Describe con una frase qué te está pesando y qué sería un poco de alivio hoy.",
  },
  {
    cadence: "Hoy · 15 min",
    title: "Elige un gesto de cuidado",
    description:
      "Haz una acción pequeña y concreta que reduzca ruido, presión o cansancio.",
  },
  {
    cadence: "Cada mañana",
    title: "Comprueba tu energía",
    description:
      "Decide el tamaño de tu siguiente paso según cómo llegas, no según el plan ideal.",
  },
  {
    cadence: "En 7 días",
    title: "Busca el patrón, sin juzgar",
    description:
      "Revisa qué momentos ayudaron y cuáles piden un plan más amable o más simple.",
  },
];

function buildPlan(mission: string): PlanAction[] {
  const normalized = mission
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");

  if (
    /(carrera|estudi|examen|tesis|universidad|oposici|curso|asignatura)/.test(
      normalized,
    )
  ) {
    return STUDY_PLAN;
  }

  if (
    /(entren|correr|gimnas|fuerza|deporte|fisic|maraton|movilidad)/.test(
      normalized,
    )
  ) {
    return MOVEMENT_PLAN;
  }

  if (/(calma|dormir|descans|estres|agob|cuidar|bienestar|ansied)/.test(normalized)) {
    return WELLBEING_PLAN;
  }

  const shortMission = mission.length > 72 ? `${mission.slice(0, 69)}…` : mission;

  return [
    {
      cadence: "Hoy · 10 min",
      title: "Define el primer avance visible",
      description: `Convierte «${shortMission}» en un resultado pequeño que puedas comprobar.`,
    },
    {
      cadence: "Mañana · 25 min",
      title: "Haz una versión mínima",
      description:
        "Completa una parte útil antes de intentar resolver el objetivo entero de una vez.",
    },
    {
      cadence: "3 días por semana",
      title: "Protege el momento de actuar",
      description:
        "Reserva un bloque breve, con una hora de inicio clara y sin añadir más tareas.",
    },
    {
      cadence: "En 7 días",
      title: "Revisa y adapta el plan",
      description:
        "Mira qué completaste, qué evitaste y cómo llegaste de energía antes de ajustar.",
    },
  ];
}

export default function HeroDemo() {
  const hintId = "mission-hint";
  const planTitleId = "mission-plan-title";
  const introInterval = useRef<number | null>(null);
  const introRevealTimer = useRef<number | null>(null);
  const generationTimer = useRef<number | null>(null);

  const [mission, setMission] = useState("");
  const [planMission, setPlanMission] = useState(EXAMPLE_MISSION);
  const [plan, setPlan] = useState<PlanAction[] | null>(null);
  const [phase, setPhase] = useState<DemoPhase>("typing");
  const [status, setStatus] = useState("Preparando un ejemplo de misión…");
  const [planVersion, setPlanVersion] = useState(0);

  useEffect(() => {
    const readyTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event("virtus:demo-ready"));
    }, 0);

    return () => window.clearTimeout(readyTimer);
  }, []);

  const clearIntro = useCallback(() => {
    if (introInterval.current !== null) {
      window.clearInterval(introInterval.current);
      introInterval.current = null;
    }

    if (introRevealTimer.current !== null) {
      window.clearTimeout(introRevealTimer.current);
      introRevealTimer.current = null;
    }
  }, []);

  const revealPlan = useCallback((nextMission: string) => {
    setPlanMission(nextMission);
    setPlan(buildPlan(nextMission));
    setPlanVersion((version) => version + 1);
    setPhase("ready");
    setStatus("Plan listo: cuatro acciones propuestas.");
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setMission(EXAMPLE_MISSION);
      revealPlan(EXAMPLE_MISSION);
      return clearIntro;
    }

    let characterIndex = 0;
    setStatus("Escribiendo un ejemplo de misión…");
    introInterval.current = window.setInterval(() => {
      characterIndex += 1;
      setMission(EXAMPLE_MISSION.slice(0, characterIndex));

      if (characterIndex >= EXAMPLE_MISSION.length) {
        if (introInterval.current !== null) {
          window.clearInterval(introInterval.current);
          introInterval.current = null;
        }

        introRevealTimer.current = window.setTimeout(() => {
          revealPlan(EXAMPLE_MISSION);
          introRevealTimer.current = null;
        }, 500);
      }
    }, 40);

    return clearIntro;
  }, [clearIntro, revealPlan]);

  useEffect(
    () => () => {
      if (generationTimer.current !== null) {
        window.clearTimeout(generationTimer.current);
      }
    },
    [],
  );

  const finishIntroForEditing = () => {
    if (phase !== "typing") return;

    clearIntro();
    setMission(EXAMPLE_MISSION);
    revealPlan(EXAMPLE_MISSION);
  };

  const handleMissionChange = (value: string) => {
    if (phase === "typing") clearIntro();
    setMission(value.slice(0, 180));

    if (phase !== "generating") {
      setPhase("editing");
      setStatus("Misión editada. Crea el plan cuando esté lista.");
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextMission = mission.trim();

    if (!nextMission || phase === "generating") return;

    clearIntro();
    if (generationTimer.current !== null) {
      window.clearTimeout(generationTimer.current);
    }

    setPhase("generating");
    setStatus("Creando tu plan localmente…");

    generationTimer.current = window.setTimeout(() => {
      revealPlan(nextMission);
      window.dispatchEvent(
        new CustomEvent("virtus:analytics", {
          detail: {
            name: "mission_demo_completed",
            properties: { source: "custom_mission" },
            timestamp: new Date().toISOString(),
          },
        }),
      );
      generationTimer.current = null;
    }, 320);
  };

  const phaseLabel =
    phase === "typing"
      ? "Ejemplo en curso"
      : phase === "generating"
        ? "Creando plan"
        : phase === "editing"
          ? "Misión editada"
          : "Plan listo";

  return (
    <section
      className={`hero-demo hero-demo--${phase}`}
      id="prueba-tu-mision"
      aria-label="Demostración de misión a plan"
    >
      <div className="hero-demo__topbar">
        <div className="hero-demo__product">
          <svg
            className="hero-demo__compass"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.25" />
            <path d="m14.9 9.1-1.6 4.2-4.2 1.6 1.6-4.2 4.2-1.6Z" />
          </svg>
          <span>Virtus · plan de misión</span>
        </div>
        <span className="hero-demo__phase" aria-hidden="true">
          <span className="hero-demo__phase-dot" />
          {phaseLabel}
        </span>
      </div>

      <div className="hero-demo__body">
        <div className="hero-demo__intro">
          <p className="hero-demo__eyebrow">Pruébalo sin registro</p>
          <h2 className="hero-demo__heading">Una misión. Un plan que puedes empezar hoy.</h2>
        </div>

        <form className="hero-demo__form" onSubmit={handleSubmit}>
          <label className="hero-demo__label" htmlFor="mission-input">
            Escribe tu misión en tus palabras
          </label>
          <div className="hero-demo__input-shell">
            <textarea
              id="mission-input"
              className="hero-demo__input"
              value={mission}
              rows={2}
              aria-describedby={hintId}
              onChange={(event) => handleMissionChange(event.target.value)}
              onFocus={finishIntroForEditing}
            />
            <span className="hero-demo__character-count" aria-hidden="true">
              {mission.length}/180
            </span>
          </div>
          <div className="hero-demo__form-footer">
            <p className="hero-demo__hint" id={hintId}>
              Parte del ejemplo o sustitúyelo por el tuyo.
            </p>
            <button
              className="hero-demo__button"
              type="submit"
              disabled={!mission.trim() || phase === "generating"}
              data-track="mission_demo_started"
              data-track-location="hero_demo"
            >
              <span>{phase === "generating" ? "Creando…" : "Crear mi plan"}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11m-4-4 4 4-4 4" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <section
        className="hero-demo__plan"
        aria-labelledby={planTitleId}
        aria-busy={phase === "generating"}
      >
        <div className="hero-demo__plan-header">
          <div>
            <p className="hero-demo__plan-kicker">Tu norte, convertido en movimiento</p>
            <h3 className="hero-demo__plan-title" id={planTitleId}>
              Plan propuesto
            </h3>
          </div>
          <span className="hero-demo__action-count">4 acciones</span>
        </div>

        {plan ? (
          <>
            <p className="hero-demo__plan-mission">“{planMission}”</p>
            <ol className="hero-demo__actions" key={planVersion}>
              {plan.map((action, index) => (
                <li className="hero-demo__action" key={`${action.title}-${index}`}>
                  <span className="hero-demo__action-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="hero-demo__sr-only">Acción {index + 1}: </span>
                    <p className="hero-demo__cadence">{action.cadence}</p>
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <div className="hero-demo__waiting" aria-hidden="true">
            <p>Dando forma a los próximos pasos…</p>
            {[0, 1, 2, 3].map((item) => (
              <span key={item} />
            ))}
          </div>
        )}
      </section>

      <p className="hero-demo__sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
