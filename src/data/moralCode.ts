export const moralCodeContent = {
  label: 'Le Code Moral du Judo',
  titleBefore: 'Le Code ',
  titleHighlight: 'Moral',
  titleAfter: ' du Judo',
  subtitle: 'Les valeurs qui accompagnent chaque judoka sur le tatami et dans la vie.',
  quote:
    'Le judo est bien plus qu\u2019un sport : c\u2019est une école de vie fondée sur le respect, la maîtrise de soi et le progrès.',
} as const;

export type MoralIcon =
  | 'bow'
  | 'mountain'
  | 'enso'
  | 'torii'
  | 'bamboo'
  | 'hands'
  | 'meditation'
  | 'handshake';

export const moralValues = [
  {
    kanji: '礼',
    title: 'Politesse',
    japanese: 'Reigi',
    description: 'Respecter les autres et faire preuve de courtoisie en toutes circonstances.',
    icon: 'bow' as MoralIcon,
  },
  {
    kanji: '勇',
    title: 'Courage',
    japanese: 'Yuki',
    description: 'Faire ce qui est juste même lorsque cela demande des efforts.',
    icon: 'mountain' as MoralIcon,
  },
  {
    kanji: '誠',
    title: 'Sincérité',
    japanese: 'Makoto',
    description: 'Exprimer ses pensées avec honnêteté et authenticité.',
    icon: 'enso' as MoralIcon,
  },
  {
    kanji: '誉',
    title: 'Honneur',
    japanese: 'Meiyo',
    description: 'Être fidèle à sa parole et assumer ses responsabilités.',
    icon: 'torii' as MoralIcon,
  },
  {
    kanji: '謙',
    title: 'Modestie',
    japanese: 'Kenkyo',
    description: 'Rester humble dans la victoire comme dans l\u2019apprentissage.',
    icon: 'bamboo' as MoralIcon,
  },
  {
    kanji: '敬',
    title: 'Respect',
    japanese: 'Sonkei',
    description: 'Reconnaître la valeur et la dignité de chacun.',
    icon: 'hands' as MoralIcon,
  },
  {
    kanji: '制',
    title: 'Contrôle de soi',
    japanese: 'Jisei',
    description: 'Maîtriser ses émotions et garder son calme en toutes situations.',
    icon: 'meditation' as MoralIcon,
  },
  {
    kanji: '友',
    title: 'Amitié',
    japanese: 'Yujo',
    description: 'Créer des liens durables fondés sur la confiance et le partage.',
    icon: 'handshake' as MoralIcon,
  },
] as const;
