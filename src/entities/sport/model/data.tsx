import { IoTennisball } from 'react-icons/io5';
import { SiRacket } from 'react-icons/si';
import { FaBasketballBall, FaTableTennis } from 'react-icons/fa';
import { FaFutbol } from 'react-icons/fa6';
import type { Sport } from './types';

export const SPORTS: Sport[] = [
  {
    name: 'Football',
    emoji: '⚽',
    icon: <FaFutbol />,
  },
  {
    name: 'Badminton',
    emoji: '🏸',
    icon: <SiRacket />,
  },
  {
    name: 'Pickleball',
    emoji: '🥍',
    icon: <SiRacket />,
  },
  {
    name: 'Table Tennis',
    emoji: '🏓',
    icon: <FaTableTennis />,
  },
  {
    name: 'Tennis',
    emoji: '🎾',
    icon: <IoTennisball />,
  },
  {
    name: 'Basketball',
    emoji: '🏀',
    icon: <FaBasketballBall />,
  },
];
