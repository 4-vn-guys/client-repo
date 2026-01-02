import type { CourtType } from '@/shared/config';

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  isAvailable: boolean;
}
