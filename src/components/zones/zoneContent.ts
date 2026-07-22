export type ZoneProfile = "student" | "performance";

export type ZoneResultBlock = {
  title: string;
  summary: string;
  actions: string[];
};

export type ZoneSituation = {
  id: string;
  label: string;
  demoVariant: string;
  campaignAliases: string[];
  exampleInput: string;
  result: ZoneResultBlock[];
};

export type ZoneProfileContent = {
  selectorLabel: string;
  selectorCta: string;
  selectorMicrocopy: string;
  demoLabel: string;
  demoHint: string;
  demoButton: string;
  generatingLabel: string;
  resultEyebrow: string;
  resultTitle: string;
  saveCta: string;
  situations: ZoneSituation[];
};

const studentSituations: ZoneSituation[] = [
  {
    id: "elegi-bien",
    label: "Dudo de si elegí bien",
    demoVariant: "student_choice_doubt",
    campaignAliases: [
      "no sé si elegí bien",
      "no se si elegi bien",
      "dudo de si elegí bien",
      "dudo de si elegi bien",
    ],
    exampleInput:
      "Estoy en tercero. Apruebo, pero cada semestre me cuesta más encontrar un motivo para seguir y no sé si es cansancio o si elegí una carrera que ya no encaja conmigo.",
    result: [
      {
        title: "Mantén",
        summary:
          "Durante 7 días protege solo el mínimo académico que evita decidir bajo presión.",
        actions: [
          "Elige una entrega prioritaria y pausa cualquier compromiso académico opcional.",
        ],
      },
      {
        title: "Explora",
        summary:
          "Contrasta la duda con experiencias pequeñas y reversibles, no solo con más pensamientos.",
        actions: [
          "Anota tres momentos de la carrera que sí despertaron curiosidad y qué tenían en común.",
          "Habla 20 minutos con alguien que trabaje en una salida que todavía te intrigue.",
          "Prueba una tarea real de esa salida durante 30 minutos y registra cómo te implicaste.",
        ],
      },
      {
        title: "Observa",
        summary:
          "Al final de la semana compara energía, interés y rechazo antes y después de cada prueba.",
        actions: [
          "Busca evidencias repetidas: qué parte del camino rechazas y cuál todavía quieres conservar.",
        ],
      },
    ],
  },
  {
    id: "voy-por-inercia",
    label: "Voy por inercia",
    demoVariant: "student_inertia",
    campaignAliases: ["estudio por inercia", "voy por inercia"],
    exampleInput:
      "Cumplo con clases y exámenes porque es lo que toca, pero llevo meses avanzando en automático. No sé qué parte de lo que estudio elegiría si hoy pudiera empezar de nuevo.",
    result: [
      {
        title: "Mantén",
        summary:
          "Sostén tus dos compromisos académicos esenciales y devuelve espacio al resto de la semana.",
        actions: ["Define qué significa cumplir esta semana sin intentar destacar en todo."],
      },
      {
        title: "Explora",
        summary: "Introduce contraste para descubrir qué eliges cuando no manda la costumbre.",
        actions: [
          "Marca una asignatura que harías aunque no contara para nota y explica por qué.",
          "Reserva 30 minutos para investigar una alternativa que siempre descartas por inercia.",
          "Cambia una tarde de estudio mecánico por una conversación o experiencia de campo.",
        ],
      },
      {
        title: "Observa",
        summary:
          "Registra qué actividad te dejó con más preguntas propias, no solo con más tareas terminadas.",
        actions: ["Distingue alivio por escapar de interés por acercarte a algo nuevo."],
      },
    ],
  },
  {
    id: "termino-sin-rumbo",
    label: "Termino y no sé qué sigue",
    demoVariant: "student_next_stage",
    campaignAliases: [
      "termino y estoy perdido",
      "termino y no sé qué sigue",
      "termino y no se que sigue",
    ],
    exampleInput:
      "Estoy a punto de terminar y todas las opciones parecen demasiado grandes: trabajar, hacer un máster o parar. Me bloqueo porque siento que la siguiente decisión tiene que ser definitiva.",
    result: [
      {
        title: "Mantén",
        summary:
          "Cierra la etapa actual con un mínimo claro sin exigir que el futuro esté resuelto hoy.",
        actions: ["Separa en el calendario el cierre académico de la exploración profesional."],
      },
      {
        title: "Explora",
        summary: "Convierte tres futuros abstractos en pruebas que puedas comparar.",
        actions: [
          "Pide a una persona junior que te describa una semana real en el trabajo que consideras.",
          "Revisa un programa de máster y prueba gratis una actividad representativa de su contenido.",
          "Diseña cómo usarías un mes de pausa con un objetivo y un límite concretos.",
        ],
      },
      {
        title: "Observa",
        summary:
          "Compara curiosidad, coste y reversibilidad; no preguntes todavía cuál opción será para siempre.",
        actions: ["Elige la prueba que más información nueva pueda darte durante los próximos 7 días."],
      },
    ],
  },
  {
    id: "oposicion-desgasta",
    label: "La oposición me desgasta",
    demoVariant: "student_exam_burnout",
    campaignAliases: [
      "quemado con la oposición",
      "quemado con la oposicion",
      "la oposición me desgasta",
      "la oposicion me desgasta",
    ],
    exampleInput:
      "Llevo mucho tiempo preparando la oposición. Ya no sé si quiero la plaza o si continúo porque abandonar ahora haría que todo el esfuerzo pareciera perdido.",
    result: [
      {
        title: "Mantén",
        summary:
          "Reduce durante una semana la carga al mínimo sostenible antes de evaluar una decisión grande.",
        actions: ["Protege sueño, pausas y un bloque de estudio prioritario; elimina horas de presencia vacía."],
      },
      {
        title: "Explora",
        summary: "Separa el deseo de la plaza del peso del esfuerzo ya invertido.",
        actions: [
          "Escribe qué elegirías hoy si los meses ya estudiados no contaran a favor ni en contra.",
          "Habla con alguien que ejerza el puesto y pregunta por su realidad cotidiana.",
          "Define una fecha de revisión y dos criterios observables para continuar o cambiar el plan.",
        ],
      },
      {
        title: "Observa",
        summary:
          "Anota si la menor carga recupera interés o solo reduce agotamiento; son señales distintas.",
        actions: ["No conviertas una semana difícil en diagnóstico ni una inversión pasada en obligación futura."],
      },
    ],
  },
  {
    id: "cambiar-sin-direccion",
    label: "Quiero cambiar pero no sé hacia dónde",
    demoVariant: "student_change_direction",
    campaignAliases: [
      "no tengo vocación",
      "no tengo vocacion",
      "quiero cambiar pero no sé hacia dónde",
      "quiero cambiar pero no se hacia donde",
    ],
    exampleInput:
      "Sé que quiero cambiar algo, pero no aparece una vocación clara. Cada opción me interesa un poco y me asusta moverme sin tener una respuesta completa.",
    result: [
      {
        title: "Mantén",
        summary:
          "Conserva la estabilidad que te permite explorar sin convertir cada prueba en un salto al vacío.",
        actions: ["Reserva dos bloques de 30 minutos y no añadas todavía decisiones irreversibles."],
      },
      {
        title: "Explora",
        summary: "Busca señales de dirección en acciones concretas, no una vocación perfecta.",
        actions: [
          "Elige dos temas a los que vuelves sin obligación y formula una pregunta práctica sobre cada uno.",
          "Haz una microprueba de cada tema: una tarea, una conversación o una colaboración breve.",
          "Pregunta a alguien de confianza cuándo te ha visto más implicado y contrasta su respuesta.",
        ],
      },
      {
        title: "Observa",
        summary:
          "Registra dónde apareció curiosidad sostenida, incluso cuando la actividad dejó de ser nueva.",
        actions: ["Al día 7 elige qué merece otra semana de exploración, no qué define toda tu vida."],
      },
    ],
  },
];

const performanceSituations: ZoneSituation[] = [
  {
    id: "ocupado-sin-avanzar",
    label: "Ocupado pero sin avanzar",
    demoVariant: "performance_busy_no_progress",
    campaignAliases: [
      "ocupado pero no avanzo",
      "ocupado pero sin avanzar",
      "ocupado sin avanzar",
    ],
    exampleInput:
      "La agenda está llena y cierro muchas tareas, pero las decisiones estratégicas pasan de una semana a otra. Estoy trabajando mucho sin sentir que la etapa importante avance.",
    result: [
      {
        title: "Proteger",
        summary: "Conserva la estabilidad del equipo y los compromisos que solo tú puedes sostener.",
        actions: ["Mantén un bloque diario para operación crítica y un límite explícito de disponibilidad."],
      },
      {
        title: "Cuestionar",
        summary: "Revisa si la actividad está evitando una decisión con más impacto y más incertidumbre.",
        actions: [
          "¿Qué decisión estratégica sigue pendiente pese a todas las tareas completadas?",
          "¿Qué trabajo haces por costumbre, aunque otra persona podría asumirlo?",
          "¿Qué frente cerrarías primero si el progreso importara más que parecer ocupado?",
        ],
      },
      {
        title: "Experimento de 14 días",
        summary: "Protege dirección antes de que la urgencia vuelva a ocuparla.",
        actions: [
          "Bloquea 45 minutos estratégicos al inicio de cuatro jornadas.",
          "Delega, cancela o aplaza una tarea operativa por cada bloque protegido.",
          "Cierra una decisión pendiente con un siguiente responsable y una fecha.",
          "Compara al día 14 actividad completada frente a decisiones que cambiaron el rumbo.",
        ],
      },
    ],
  },
  {
    id: "logro-sin-sentido",
    label: "Lo conseguí y no me llena",
    demoVariant: "performance_success_no_meaning",
    campaignAliases: [
      "lo conseguí y sigo vacío",
      "lo consegui y sigo vacio",
      "lo conseguí y no me llena",
      "no me llena",
    ],
    exampleInput:
      "Alcancé el objetivo por el que trabajé durante años. Desde fuera debería estar satisfecho, pero noto más vacío que alegría y ya estoy buscando otra meta para no detenerme.",
    result: [
      {
        title: "Proteger",
        summary: "Conserva relaciones, descanso y capacidad de ejecución mientras das espacio al cierre.",
        actions: ["No conviertas el siguiente objetivo en una respuesta automática al silencio posterior al logro."],
      },
      {
        title: "Cuestionar",
        summary: "Distingue lo que querías construir de la validación que esperabas recibir.",
        actions: [
          "¿Qué cambió realmente en tu vida al conseguirlo?",
          "¿Qué coste aceptaste que ya no quieres repetir?",
          "¿Qué parte del proceso sí tuvo sentido aunque la llegada no lo tenga?",
        ],
      },
      {
        title: "Experimento de 14 días",
        summary: "Ensaya una etapa guiada por significado antes que por otra métrica externa.",
        actions: [
          "Deja 48 horas sin definir un nuevo gran objetivo.",
          "Recupera dos actividades valiosas que el hito desplazó.",
          "Mantén tres conversaciones sin presentar resultados ni próximos planes.",
          "Escribe al día 14 qué quieres conservar incluso si nadie lo reconoce.",
        ],
      },
    ],
  },
  {
    id: "etapa-nueva",
    label: "Entrando en una etapa nueva",
    demoVariant: "performance_new_stage",
    campaignAliases: [
      "el ascenso no me hizo feliz",
      "etapa nueva",
      "entrando en una etapa nueva",
    ],
    exampleInput:
      "He entrado en una etapa con más responsabilidad y reconocimiento, pero no tengo claro si el nuevo alcance encaja conmigo o si lo acepté porque era el siguiente paso esperado.",
    result: [
      {
        title: "Proteger",
        summary: "Conserva tus relaciones clave y la capacidad que te trajo hasta aquí sin sobreactuar el nuevo rol.",
        actions: ["Define dos responsabilidades esenciales y un ritmo que puedas sostener durante el aprendizaje."],
      },
      {
        title: "Cuestionar",
        summary: "Separa crecimiento elegido de progresión automática.",
        actions: [
          "¿Qué parte del nuevo alcance sí querías ejercer?",
          "¿Qué expectativa externa estás confundiendo con una dirección propia?",
          "¿Qué tendría que cambiar para que esta etapa fuera sostenible dentro de seis meses?",
        ],
      },
      {
        title: "Experimento de 14 días",
        summary: "Recoge evidencia del rol real antes de convertir una primera impresión en sentencia.",
        actions: [
          "Registra durante cinco jornadas qué tareas amplían o drenan tu capacidad.",
          "Pide claridad sobre una expectativa que hoy está implícita.",
          "Negocia un límite pequeño de alcance y observa su efecto.",
          "Revisa al día 14 qué condiciones quieres mantener, cambiar o rechazar.",
        ],
      },
    ],
  },
  {
    id: "demasiados-frentes",
    label: "Demasiados frentes abiertos",
    demoVariant: "performance_too_many_fronts",
    campaignAliases: ["demasiados proyectos", "demasiados frentes", "demasiados frentes abiertos"],
    exampleInput:
      "Tengo varios proyectos prometedores y capacidad para moverlos, pero repartir la atención entre todos impide que alguno llegue a una decisión importante. Todo parece demasiado valioso para soltarlo.",
    result: [
      {
        title: "Proteger",
        summary: "Mantén ingresos, compromisos explícitos y el proyecto que mejor representa tu etapa elegida.",
        actions: ["Haz visible qué frente sostiene estabilidad y cuál construye dirección."],
      },
      {
        title: "Cuestionar",
        summary: "Revisa qué proteges por potencial, identidad o miedo a renunciar.",
        actions: [
          "¿Qué proyecto seguiría importando si no pudieras contarlo durante un año?",
          "¿Cuál conserva atención por el esfuerzo ya invertido?",
          "¿Qué coste de oportunidad estás ocultando al mantenerlos todos abiertos?",
        ],
      },
      {
        title: "Experimento de 14 días",
        summary: "Prueba la renuncia temporal antes de cerrar nada de forma definitiva.",
        actions: [
          "Ordena los frentes por dirección, estabilidad y reversibilidad.",
          "Pausa dos proyectos con una fecha explícita de revisión.",
          "Concentra el 70 % del tiempo discrecional en el primer frente.",
          "Mide avance real y alivio mental al final de las dos semanas.",
        ],
      },
    ],
  },
  {
    id: "sistemas-sin-direccion",
    label: "Probé todos los sistemas y sigo sin dirección",
    demoVariant: "performance_systems_no_direction",
    campaignAliases: [
      "probé todos los métodos",
      "probe todos los metodos",
      "probé todos los sistemas",
      "sin dirección",
      "sin direccion",
    ],
    exampleInput:
      "Sé organizar objetivos, hábitos y semanas. He probado varios métodos y funcionan para ejecutar, pero sigo optimizando una agenda que no responde qué merece realmente mi energía.",
    result: [
      {
        title: "Proteger",
        summary: "Conserva el sistema mínimo que da estabilidad y deja de rediseñar herramientas durante 14 días.",
        actions: ["Usa una sola lista operativa y reserva fuera de ella las decisiones de dirección."],
      },
      {
        title: "Cuestionar",
        summary: "Evalúa el criterio anterior a cualquier método.",
        actions: [
          "¿Qué prioridad declaras y qué prioridad demuestra tu calendario?",
          "¿Qué objetivo mantienes porque es medible, no porque siga siendo valioso?",
          "¿Qué conversación estás reemplazando con otra optimización del sistema?",
        ],
      },
      {
        title: "Experimento de 14 días",
        summary: "Usa tu capacidad de ejecución para contrastar una prioridad, no para añadir otra rutina.",
        actions: [
          "Elige una intención para esta etapa y una evidencia observable de coherencia.",
          "Elimina una revisión, métrica o rutina que no cambie decisiones.",
          "Protege tres bloques para la prioridad elegida.",
          "Revisa si tus acciones se acercaron a la intención sin cambiar de método.",
        ],
      },
    ],
  },
];

export const ZONE_CONTENT: Record<ZoneProfile, ZoneProfileContent> = {
  student: {
    selectorLabel: "¿En qué punto estás?",
    selectorCta: "Aclarar mi siguiente paso",
    selectorMicrocopy: "No necesitas saber todavía qué quieres hacer con tu vida.",
    demoLabel: "Describe qué te está pasando",
    demoHint: "Puedes partir del ejemplo o contarlo con tus palabras.",
    demoButton: "Convertirlo en un experimento",
    generatingLabel: "Ordenando la duda y preparando una prueba pequeña…",
    resultEyebrow: "Tu experimento de claridad",
    resultTitle: "Un plan de 7 días para obtener evidencia",
    saveCta: "Guardar mi plan y continuar",
    situations: studentSituations,
  },
  performance: {
    selectorLabel: "¿Qué describe tu momento?",
    selectorCta: "Definir mi siguiente etapa",
    selectorMicrocopy: "No necesitas empezar de cero. Necesitas decidir qué merece continuar.",
    demoLabel: "Describe la decisión o tensión que tienes delante",
    demoHint: "Máximo 500 caracteres. Parte del ejemplo o hazlo tuyo.",
    demoButton: "Crear mi auditoría",
    generatingLabel: "Separando estabilidad, dirección y siguiente movimiento…",
    resultEyebrow: "Tu auditoría de dirección",
    resultTitle: "Una decisión que puedes contrastar durante 14 días",
    saveCta: "Guardar mi auditoría y continuar",
    situations: performanceSituations,
  },
};

export const ZONE_SITUATION_EVENT = "virtus:zone-situation";

export function getSituationStorageKey(profile: ZoneProfile) {
  return `virtus:zone-situation:${profile}`;
}

export function normalizeCampaignValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getSituation(profile: ZoneProfile, situationId: string | null | undefined) {
  if (!situationId) return undefined;
  return ZONE_CONTENT[profile].situations.find((situation) => situation.id === situationId);
}

export function getDefaultSituation(profile: ZoneProfile) {
  return ZONE_CONTENT[profile].situations[0];
}

export function getSituationFromCampaign(profile: ZoneProfile, utmContent: string | null) {
  if (!utmContent) return undefined;

  const normalizedContent = normalizeCampaignValue(utmContent);
  return ZONE_CONTENT[profile].situations.find((situation) => {
    const candidates = [situation.id, situation.label, ...situation.campaignAliases];
    return candidates.some((candidate) => normalizeCampaignValue(candidate) === normalizedContent);
  });
}
