import type { Dungeon } from '../models/dungeon';
import type { Bug } from '../models/bug';
import type { Rune } from '../models/rune';
import { BugType, BUG_TYPE_HP } from '../constants/bug';
import { RuneType, RUNE_EFFECTS } from '../constants/item';
import { DUNGEON_CONFIG } from '../constants/dungeon';
import { logGame } from './gameLogger';

export function makeDungeon(level = 1): Dungeon {
  logGame('DUNGEON_GENERATE', { level });
  const tiles = Array.from({ length: DUNGEON_CONFIG.height }, (_, y) =>
    Array.from({ length: DUNGEON_CONFIG.width }, (_, x) =>
      x === 0 || y === 0 || x === DUNGEON_CONFIG.width - 1 || y === DUNGEON_CONFIG.height - 1
        ? 'wall'
        : 'floor'
    )
  );
  return {
    id: 'd-' + level,
    level,
    width: DUNGEON_CONFIG.width,
    height: DUNGEON_CONFIG.height,
    tiles,
    fog_map: tiles.map((row) => row.map(() => true)),
  };
}

export function makeBugs(): Bug[] {
  return Object.values(BugType).map((type, i) => ({
    id: 'bug-' + i,
    type,
    hp: BUG_TYPE_HP[type],
    attack: 5 + i,
    defense: 1 + (i % 3),
    position: { x: 4 + i * 2, y: 3 + (i % 5) },
    status: 'alive',
  }));
}

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

function getRandomRarity(): 'common' | 'rare' | 'epic' {
  const rand = Math.random();
  if (rand < 0.6) return 'common';
  if (rand < 0.9) return 'rare';
  return 'epic';
}

function getRandomRuneType(): RuneType {
  const types = Object.values(RuneType);
  return types[Math.floor(Math.random() * types.length)];
}

export function makeGroundRunes(): Rune[] {
  const runeCount = 3 + Math.floor(Math.random() * 3);
  const runes: Rune[] = [];

  const usedPositions = new Set<string>();

  for (let i = 0; i < runeCount; i++) {
    const type = getRandomRuneType();
    const rarity = getRandomRarity();
    const baseEffect = RUNE_EFFECTS[type].value;
    const effectValue = applyRarityMultiplier(baseEffect, rarity);

    let x: number, y: number;
    let attempts = 0;
    do {
      x = 2 + Math.floor(Math.random() * (DUNGEON_CONFIG.width - 4));
      y = 2 + Math.floor(Math.random() * (DUNGEON_CONFIG.height - 4));
      attempts++;
    } while (usedPositions.has(`${x},${y}`) && attempts < 20);

    usedPositions.add(`${x},${y}`);

    runes.push({
      id: 'rune-ground-' + i + '-' + Date.now(),
      name: getRuneName(type),
      type,
      rarity,
      effect_value: effectValue,
      position: { x, y },
      equipped: false,
    });
  }

  logGame('GROUND_RUNES_GENERATED', { count: runes.length });
  return runes;
}
