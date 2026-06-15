import { create } from 'zustand';
import type { Player } from '../models/player';
import type { Rune } from '../models/rune';
import { RUNE_SLOT_COUNT, RuneType, RUNE_EFFECTS } from '../constants/item';
import { logGame } from '../utils/gameLogger';
import { getPlayerEffectiveMaxHp } from '../utils/combatCalculator';
import { useDungeonStore } from './dungeonStore';

const initial: Player = {
  id: 'p1',
  name: 'Bug Hunter',
  hp: 80,
  max_hp: 80,
  mp: 30,
  max_mp: 30,
  level: 1,
  exp: 0,
  attack: 12,
  defense: 3,
  position: { x: 2, y: 2 },
  inventory: [],
  runes: [],
  rune_slots: Array(RUNE_SLOT_COUNT).fill(null),
};

function getRuneName(type: RuneType): string {
  const names: Record<RuneType, string> = {
    [RuneType.VITALITY]: '生命符文',
    [RuneType.FURY]: '狂怒符文',
    [RuneType.IRONSKIN]: '铁壁符文',
    [RuneType.LEECH]: '吸血符文',
    [RuneType.HASTE]: '迅捷符文',
    [RuneType.FORTUNE]: '幸运符文',
  };
  return names[type];
}

function applyRarityMultiplier(baseValue: number, rarity: string): number {
  const multipliers: Record<string, number> = {
    common: 1,
    rare: 1.5,
    epic: 2,
  };
  return Math.floor(baseValue * (multipliers[rarity] || 1));
}

export const usePlayerStore = create<{
  player: Player;
  setName: (name: string) => void;
  move: (dx: number, dy: number) => void;
  heal: (v: number) => void;
  addExp: (v: number) => void;
  takeDamage: (v: number) => void;
  addRune: (type: RuneType, rarity: 'common' | 'rare' | 'epic') => void;
  equipRune: (runeId: string, slotIndex: number) => void;
  unequipRune: (slotIndex: number) => void;
  getEquippedRunes: () => Rune[];
  getTotalRuneBonus: (type: RuneType) => number;
  reset: () => void;
}>((set, get) => ({
  player: initial,

  setName: (name) => set((s) => ({ player: { ...s.player, name } })),

  move: (dx, dy) => {
    const dungeonState = useDungeonStore.getState();
    const groundRunes = dungeonState.groundRunes;
    const pickupRune = dungeonState.pickupRune;

    set((s) => {
      const newX = Math.max(1, Math.min(16, s.player.position.x + dx));
      const newY = Math.max(1, Math.min(10, s.player.position.y + dy));
      const p = {
        ...s.player,
        position: { x: newX, y: newY },
      };

      const runeAtPosition = groundRunes.find(
        (r) => r.position && r.position.x === newX && r.position.y === newY
      );

      if (runeAtPosition) {
        const pickedRune = pickupRune(runeAtPosition.id);
        if (pickedRune) {
          const runeToAdd: Rune = {
            ...pickedRune,
            position: undefined,
            equipped: false,
            slot_index: undefined,
          };
          logGame('RUNE_PICKUP', { id: runeToAdd.id, type: runeToAdd.type, rarity: runeToAdd.rarity });
          return {
            player: {
              ...p,
              runes: [...s.player.runes, runeToAdd],
            },
          };
        }
      }

      logGame('PLAYER_MOVE', { id: p.id, x: p.position.x, y: p.position.y });
      return { player: p };
    });
  },

  heal: (v) => set((s) => ({
    player: { ...s.player, hp: Math.min(getPlayerEffectiveMaxHp(s.player), s.player.hp + v) },
  })),

  addExp: (v) => set((s) => {
    const newExp = s.player.exp + v;
    let newLevel = s.player.level;
    let expForNextLevel = s.player.level * 100;
    let remainingExp = newExp;

    while (remainingExp >= expForNextLevel) {
      remainingExp -= expForNextLevel;
      newLevel++;
      expForNextLevel = newLevel * 100;
    }

    const leveledUp = newLevel > s.player.level;

    return {
      player: {
        ...s.player,
        exp: remainingExp,
        level: newLevel,
        max_hp: leveledUp ? s.player.max_hp + 10 : s.player.max_hp,
        max_mp: leveledUp ? s.player.max_mp + 5 : s.player.max_mp,
        attack: leveledUp ? s.player.attack + 2 : s.player.attack,
        defense: leveledUp ? s.player.defense + 1 : s.player.defense,
        hp: leveledUp ? Math.min(getPlayerEffectiveMaxHp({ ...s.player, level: newLevel, max_hp: s.player.max_hp + 10 }), s.player.hp + 20) : s.player.hp,
      },
    };
  }),

  takeDamage: (v) => set((s) => ({
    player: { ...s.player, hp: Math.max(0, s.player.hp - v) },
  })),

  addRune: (type, rarity) => set((s) => {
    const baseEffect = RUNE_EFFECTS[type].value;
    const effectValue = applyRarityMultiplier(baseEffect, rarity);
    const newRune: Rune = {
      id: 'rune-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: getRuneName(type),
      type,
      rarity,
      effect_value: effectValue,
      equipped: false,
    };
    logGame('RUNE_PICKUP', { id: newRune.id, type, rarity });
    return {
      player: {
        ...s.player,
        runes: [...s.player.runes, newRune],
      },
    };
  }),

  equipRune: (runeId, slotIndex) => set((s) => {
    const rune = s.player.runes.find((r) => r.id === runeId);
    if (!rune || slotIndex < 0 || slotIndex >= RUNE_SLOT_COUNT) return s;

    const currentRuneInSlot = s.player.rune_slots[slotIndex];
    let updatedRunes = s.player.runes.map((r) => {
      if (r.id === runeId) {
        return { ...r, equipped: true, slot_index: slotIndex };
      }
      if (currentRuneInSlot && r.id === currentRuneInSlot.id) {
        return { ...r, equipped: false, slot_index: undefined };
      }
      return r;
    });

    const newSlots = [...s.player.rune_slots];
    newSlots[slotIndex] = { ...rune, equipped: true, slot_index: slotIndex };

    logGame('RUNE_EQUIP', { runeId, slotIndex });
    return {
      player: {
        ...s.player,
        runes: updatedRunes,
        rune_slots: newSlots,
      },
    };
  }),

  unequipRune: (slotIndex) => set((s) => {
    const rune = s.player.rune_slots[slotIndex];
    if (!rune) return s;

    const updatedRunes = s.player.runes.map((r) => {
      if (r.id === rune.id) {
        return { ...r, equipped: false, slot_index: undefined };
      }
      return r;
    });

    const newSlots = [...s.player.rune_slots];
    newSlots[slotIndex] = null;

    logGame('RUNE_UNEQUIP', { slotIndex });
    return {
      player: {
        ...s.player,
        runes: updatedRunes,
        rune_slots: newSlots,
      },
    };
  }),

  getEquippedRunes: () => {
    return get().player.rune_slots.filter((r): r is Rune => r !== null);
  },

  getTotalRuneBonus: (type) => {
    const equipped = get().player.rune_slots.filter((r): r is Rune => r !== null && r.type === type);
    return equipped.reduce((sum, r) => sum + r.effect_value, 0);
  },

  reset: () => set({ player: { ...initial, rune_slots: Array(RUNE_SLOT_COUNT).fill(null) } }),
}));
