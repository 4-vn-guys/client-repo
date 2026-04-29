import { IoTennisball } from 'react-icons/io5';
import { SiRacket } from 'react-icons/si';
import { FaBasketballBall, FaTableTennis } from 'react-icons/fa';
import { FaFutbol } from 'react-icons/fa6';
import type { Sport } from './types';

export const SPORTS: Sport[] = [
  {
    name: 'Football',
    translationKey: 'football',
    emoji: '⚽',
    icon: <FaFutbol />,
  },
  {
    name: 'Badminton',
    translationKey: 'badminton',
    emoji: '🏸',
    icon: <SiRacket />,
  },
  {
    name: 'Pickleball',
    translationKey: 'pickleball',
    emoji: '🥍',
    icon: <SiRacket />,
  },
  {
    name: 'Table Tennis',
    translationKey: 'tableTennis',
    emoji: '🏓',
    icon: <FaTableTennis />,
  },
  {
    name: 'Tennis',
    translationKey: 'tennis',
    emoji: '🎾',
    icon: <IoTennisball />,
  },
  {
    name: 'Basketball',
    translationKey: 'basketball',
    emoji: '🏀',
    icon: <FaBasketballBall />,
  },
];
