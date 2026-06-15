import { usePlayerStore } from '../../stores/playerStore';
import { useGameStore } from '../../stores/gameStore';
import { numberText, rarityColor, rarityText } from '../../utils/formatters';
import { RUNE_SLOT_COUNT } from '../../constants/item';
import { getPlayerEffectiveMaxHp, getPlayerEffectiveAttack, getPlayerEffectiveDefense } from '../../utils/combatCalculator';

export function StatusBar() {
  const p = usePlayerStore((s) => s.player);
  const score = useGameStore((s) => s.score);
  const runeSlots = usePlayerStore((s) => s.player.rune_slots);
  const totalRunes = usePlayerStore((s) => s.player.runes.length);
  const equippedCount = runeSlots.filter((r) => r !== null).length;

  const effectiveMaxHp = getPlayerEffectiveMaxHp(p);
  const effectiveAttack = getPlayerEffectiveAttack(p);
  const effectiveDefense = getPlayerEffectiveDefense(p);

  const hpBonus = effectiveMaxHp - p.max_hp;
  const attackBonus = effectiveAttack - p.attack;
  const defenseBonus = effectiveDefense - p.defense;

  return (
    <div className="panel flex flex-wrap gap-4 items-center">
      <span>{p.name}</span>
      <span>
        HP {p.hp}/{effectiveMaxHp}
        {hpBonus > 0 && <span className="text-green-400 text-xs ml-1">+{hpBonus}</span>}
      </span>
      <span>MP {p.mp}/{p.max_mp}</span>
      <span>
        ATK {effectiveAttack}
        {attackBonus > 0 && <span className="text-red-400 text-xs ml-1">+{attackBonus}</span>}
      </span>
      <span>
        DEF {effectiveDefense}
        {defenseBonus > 0 && <span className="text-blue-400 text-xs ml-1">+{defenseBonus}</span>}
      </span>
      <span>Lv {p.level}</span>
      <span>Score {numberText(score)}</span>

      <div className="flex items-center gap-1 ml-2">
        <span className="text-gray-400 text-sm">符文:</span>
        <div className="flex gap-1">
          {runeSlots.map((rune, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded border flex items-center justify-center text-xs ${
                rune ? 'border-gray-600 bg-gray-800' : 'border-gray-700 bg-gray-900 border-dashed'
              }`}
              title={
                rune
                  ? `${rune.name} (${rarityText[rune.rarity]}) - 已装备`
                  : `符文槽 ${index + 1} - 未装备`
              }
            >
              {rune ? (
                <span style={{ color: rarityColor[rune.rarity] }}>✦</span>
              ) : (
                <span className="text-gray-600 text-[10px]">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
        <span className="text-gray-500 text-xs ml-1">
          {equippedCount}/{RUNE_SLOT_COUNT} 装备 · {totalRunes} 拥有
        </span>
      </div>
    </div>
  );
}
