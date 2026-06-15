import type { Player } from '../models/player';
import type { Bug } from '../models/bug';
import { RuneType } from '../constants/item';
import { logGame } from './gameLogger';

function getRuneBonus(player: Player, type: RuneType): number {
  const equipped = player.rune_slots.filter((r): r is NonNullable<typeof r> => r !== null && r.type === type);
  return equipped.reduce((sum, r) => sum + r.effect_value, 0);
}

export function getPlayerEffectiveAttack(player: Player): number {
  const furyBonus = getRuneBonus(player, RuneType.FURY);
  return player.attack + furyBonus;
}

export function getPlayerEffectiveDefense(player: Player): number {
  const ironskinBonus = getRuneBonus(player, RuneType.IRONSKIN);
  return player.defense + ironskinBonus;
}

export function getPlayerEffectiveMaxHp(player: Player): number {
  const vitalityBonus = getRuneBonus(player, RuneType.VITALITY);
  return player.max_hp + vitalityBonus;
}

export function damage(attacker: number, defense: number) {
  const value = Math.max(1, attacker - defense);
  logGame('COMBAT_DAMAGE', { value });
  return value;
}

export interface AttackResult {
  damage: number;
  bugKilled: boolean;
  expGained: number;
  healAmount: number;
  newBugHp: number;
}

export function attackBug(player: Player, bug: Bug): AttackResult {
  const effectiveAttack = getPlayerEffectiveAttack(player);
  const damageValue = damage(effectiveAttack, bug.defense);

  const newBugHp = bug.hp - damageValue;
  const bugKilled = newBugHp <= 0;

  let healAmount = 0;
  const leechPercent = getRuneBonus(player, RuneType.LEECH);
  if (leechPercent > 0) {
    healAmount = Math.floor(damageValue * (leechPercent / 100));
    if (healAmount > 0) {
      logGame('RUNE_LEECH', { amount: healAmount });
    }
  }

  let expGained = 0;
  if (bugKilled) {
    const fortuneBonus = getRuneBonus(player, RuneType.FORTUNE);
    const baseExp = 12;
    expGained = Math.floor(baseExp * (1 + fortuneBonus / 100));
    logGame('BUG_DEAD', { type: bug.type, exp: expGained });
  }

  return {
    damage: damageValue,
    bugKilled,
    expGained,
    healAmount,
    newBugHp: Math.max(0, newBugHp),
  };
}

export function getRuneSummary(player: Player) {
  return {
    maxHpBonus: getRuneBonus(player, RuneType.VITALITY),
    attackBonus: getRuneBonus(player, RuneType.FURY),
    defenseBonus: getRuneBonus(player, RuneType.IRONSKIN),
    leechPercent: getRuneBonus(player, RuneType.LEECH),
    hastePercent: getRuneBonus(player, RuneType.HASTE),
    fortunePercent: getRuneBonus(player, RuneType.FORTUNE),
  };
}
