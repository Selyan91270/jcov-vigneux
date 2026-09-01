import heroJudo from '../assets/images/hero-judo.jpg';
import judophoto from '../assets/images/judophoto.png';
import photodegroupe from '../assets/images/photodegroupe.png';
import groupeSanguinet from '../assets/images/groupe-sanguinet.jpg';
import logo from '../assets/images/logo-jcov.png';

export const images = {
  heroJudo,
  judophoto,
  photodegroupe,
  groupeSanguinet,
  logo,
} as const;

export type ImageKey = keyof typeof images;
