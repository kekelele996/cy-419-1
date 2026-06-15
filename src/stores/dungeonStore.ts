import { create } from 'zustand';
import type { Dungeon } from '../models/dungeon';
import type { Bug } from '../models/bug';
import type { Rune } from '../models/rune';
import { makeBugs, makeDungeon, makeGroundRunes } from '../utils/randomDungeon';

export const useDungeonStore = create<{
  dungeon: Dungeon;
  bugs: Bug[];
  groundRunes: Rune[];
  reset: () => void;
  updateBug: (bugId: string, updates: Partial<Bug>) => void;
  killBug: (bugId: string) => void;
  pickupRune: (runeId: string) => Rune | null;
}>((set) => ({
  dungeon: makeDungeon(1),
  bugs: makeBugs(),
  groundRunes: makeGroundRunes(),
  reset: () =>
    set({
      dungeon: makeDungeon(1),
      bugs: makeBugs(),
      groundRunes: makeGroundRunes(),
    }),
  updateBug: (bugId, updates) =>
    set((s) => ({
      bugs: s.bugs.map((b) => (b.id === bugId ? { ...b, ...updates } : b)),
    })),
  killBug: (bugId) =>
    set((s) => ({
      bugs: s.bugs.map((b) =>
        b.id === bugId ? { ...b, status: 'dead' as const, hp: 0 } : b
      ),
    })),
  pickupRune: (runeId) => {
    let pickedRune: Rune | null = null;
    set((s) => {
      const rune = s.groundRunes.find((r) => r.id === runeId);
      if (rune) {
        pickedRune = { ...rune };
        return {
          groundRunes: s.groundRunes.filter((r) => r.id !== runeId),
        };
      }
      return s;
    });
    return pickedRune;
  },
}));
