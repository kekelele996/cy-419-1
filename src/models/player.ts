import type { Item } from './item';
import type { Rune } from './rune';

export interface Player {
  id: string;
  name: string;
  hp: number;
  max_hp: number;
  mp: number;
  max_mp: number;
  level: number;
  exp: number;
  attack: number;
  defense: number;
  position: { x: number; y: number };
  inventory: Item[];
  runes: Rune[];
  rune_slots: (Rune | null)[];
}
