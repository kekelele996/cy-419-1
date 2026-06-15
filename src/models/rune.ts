import { RuneType } from '../constants/item';

export interface Rune {
  id: string;
  name: string;
  type: RuneType;
  rarity: 'common' | 'rare' | 'epic';
  effect_value: number;
  position?: { x: number; y: number };
  equipped: boolean;
  slot_index?: number;
}
