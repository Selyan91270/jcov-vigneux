// Horaires et tarifs saison 2026-2027.
// Source : affiche officielle du club. À mettre à jour chaque saison.

export type Session = { day: string; time: string };

export type AgeGroup = {
  id: string;
  /** Tranche d'âge en langage clair — c'est ce que les familles cherchent en premier. */
  ageLabel: string;
  minAge: number;
  maxAge: number;
  /** Nom officiel du groupe (jargon fédéral) — affiché en secondaire seulement. */
  officialName: string;
  /** Renseigné uniquement quand deux groupes se chevauchent sur la même tranche d'âge. */
  experience?: 'debutant' | 'confirme';
  sessions: Session[];
  price: number;
};

export const ageGroups: AgeGroup[] = [
  {
    id: 'eveil',
    ageLabel: '4-5 ans',
    minAge: 4,
    maxAge: 5,
    officialName: 'Éveil Judo',
    sessions: [{ day: 'Mercredi', time: '16h15 – 17h00' }],
    price: 185,
  },
  {
    id: 'debutants',
    ageLabel: '6-7 ans',
    minAge: 6,
    maxAge: 7,
    officialName: '1er groupe · Débutants',
    experience: 'debutant',
    sessions: [
      { day: 'Mardi', time: '18h15 – 19h15' },
      { day: 'Mercredi', time: '13h45 – 14h45' },
      { day: 'Samedi', time: '13h45 – 14h45' },
    ],
    price: 240,
  },
  {
    id: 'confirmes',
    ageLabel: '6-7 ans',
    minAge: 6,
    maxAge: 7,
    officialName: '2e groupe · Confirmés',
    experience: 'confirme',
    sessions: [
      { day: 'Mercredi', time: '15h00 – 16h00' },
      { day: 'Jeudi', time: '18h15 – 19h15' },
      { day: 'Samedi', time: '15h00 – 16h00' },
    ],
    price: 240,
  },
  {
    id: 'poussins',
    ageLabel: '8-9 ans',
    minAge: 8,
    maxAge: 9,
    officialName: '3e groupe · Poussins',
    sessions: [
      { day: 'Mercredi', time: '17h15 – 18h15' },
      { day: 'Jeudi', time: '18h15 – 19h15' },
      { day: 'Samedi', time: '16h15 – 17h15' },
    ],
    price: 240,
  },
  {
    id: 'benjamins-minimes',
    ageLabel: '10-13 ans',
    minAge: 10,
    maxAge: 13,
    officialName: '4e groupe · Benjamins / Minimes',
    sessions: [
      { day: 'Lundi', time: '18h15 – 19h15' },
      { day: 'Mercredi', time: '18h15 – 19h15' },
      { day: 'Vendredi', time: '18h15 – 19h15' },
    ],
    price: 240,
  },
  {
    id: 'ados-adultes',
    ageLabel: '14 ans et plus',
    minAge: 14,
    maxAge: 120,
    officialName: 'Cadets / Juniors / Seniors',
    sessions: [
      { day: 'Lundi', time: '19h30 – 21h00' },
      { day: 'Mercredi', time: '19h30 – 21h00' },
      { day: 'Vendredi', time: '19h30 – 21h00' },
    ],
    price: 240,
  },
];

export const minGroupAge = Math.min(...ageGroups.map((g) => g.minAge));

/** Cours facultatifs, sur inscription séparée — ne dépendent pas de l'âge mais d'un choix. */
export const complementaryCourses = [
  {
    id: 'technique-jujitsu',
    name: 'Cours technique de judo / Ju-jitsu',
    note: 'En complément ou en alternative au cours classique, sur inscription séparée.',
    sessions: [
      { day: 'Mardi', time: '19h30 – 21h00' },
      { day: 'Jeudi', time: '19h30 – 21h00' },
    ],
    price: 240,
  },
  {
    id: 'sport-adapte',
    name: 'Judo Sport Adapté — Adultes',
    note: 'Séances adaptées aux capacités de chacun, favorisant l’épanouissement, la confiance en soi, la motricité et l’inclusion dans la pratique du judo.',
    sessions: [{ day: 'Jeudi', time: '14h30 – 16h00' }],
    price: 240,
  },
] as const;

export const federationFee = 75;

export const pricing = [
  { label: 'Éveil Judo', detail: '1 cours par semaine', price: 185 },
  { label: 'École de Judo', detail: '2 cours par semaine, de 6 à 13 ans', price: 240 },
  { label: 'Judo Adultes', detail: 'à partir de 14 ans', price: 240 },
  { label: 'Cours technique de judo / Ju-jitsu', detail: 'ados et adultes, sur inscription séparée', price: 240 },
] as const;

export const practicalNotes = [
  'Deux cours d’essai gratuits sont proposés avant toute inscription.',
  'Tarif dégressif à partir de trois inscriptions dans une même famille.',
  'Règlement possible en 3 chèques échelonnés.',
] as const;
