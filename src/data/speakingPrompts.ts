
export interface SpeakingPrompt {
  id: number;
  title: string;
  text: string;
}

export const speakingPrompts: SpeakingPrompt[] = [
  {
    id: 1,
    title: "Personal Introduction",
    text: "Bonjour! Je m'appelle [votre nom]. Je suis [votre profession] et j'habite à [votre ville].",
  },
  {
    id: 2,
    title: "Daily Routine",
    text: "Décrivez votre routine quotidienne en français.",
  },
  {
    id: 3,
    title: "Future Plans",
    text: "Parlez de vos projets pour l'avenir et de vos objectifs professionnels.",
  },
  {
    id: 4,
    title: "Hobby Description",
    text: "Décrivez votre passe-temps préféré et expliquez pourquoi vous l'aimez.",
  },
  {
    id: 5,
    title: "Weekend Activities",
    text: "Que faites-vous généralement pendant le week-end?",
  }
];
