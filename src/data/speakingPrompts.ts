
interface SpeakingPrompt {
  id: string;
  title: string;
  text: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category: "personal" | "professional" | "academic";
}

export const speakingPrompts: SpeakingPrompt[] = [
  {
    id: "1",
    title: "Personal Introduction",
    text: "Présentez-vous et parlez de vos loisirs et de vos intérêts. Expliquez pourquoi vous apprenez le français.",
    level: "A1",
    category: "personal",
  },
  {
    id: "2",
    title: "Daily Routine",
    text: "Décrivez votre journée typique, en incluant vos activités du matin jusqu'au soir.",
    level: "A1",
    category: "personal",
  },
  {
    id: "3",
    title: "Career Goals",
    text: "Parlez de vos objectifs professionnels et expliquez pourquoi vous souhaitez travailler au Canada.",
    level: "B1",
    category: "professional",
  },
  {
    id: "4",
    title: "Current Events",
    text: "Choisissez un événement d'actualité récent et donnez votre opinion à ce sujet.",
    level: "B2",
    category: "academic",
  },
  {
    id: "5",
    title: "Cultural Differences",
    text: "Comparez la culture de votre pays d'origine avec la culture canadienne. Quelles sont les principales différences?",
    level: "B2",
    category: "personal",
  }
];
