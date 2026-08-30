import heroJudo from '../assets/images/hero-judo.jpg';
import judophoto from '../assets/images/judophoto.png';
import aboutJudoka from '../assets/images/about-judoka.jpg';
import photodegroupe from '../assets/images/photodegroupe.png';
import gallery1 from '../assets/images/gallery-1.jpg';
import gallery2 from '../assets/images/gallery-2.jpg';
import gallery3 from '../assets/images/gallery-3.jpg';
import logo from '../assets/images/logo-jcov.png';

export const images = {
  heroJudo,
  judophoto,
  aboutJudoka,
  photodegroupe,
  gallery1,
  gallery2,
  gallery3,
  logo,
} as const;

export type ImageKey = keyof typeof images;
