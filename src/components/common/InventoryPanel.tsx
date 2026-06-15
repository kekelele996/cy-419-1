import { useState } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { itemTypeText, runeTypeText, rarityText, rarityColor, runeDescriptionText } from '../../utils/formatters';
import { RUNE_SLOT_COUNT } from '../../constants/item';
import type { Rune } from '../../models/rune';

export function InventoryPanel() {
  const items = usePlayerStore((s) => s.player.inventory);
  const runes = usePlayerStore((s) => s.player.runes);
  const runeSlots = usePlayerStore((s) => s.player.rune_slots);
  const equipRune = usePlayerStore((s) => s.equipRune);
  const unequipRune = usePlayerStore((s) => s.unequipRune);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const unequippedRunes = runes.filter((r) => !r.equipped);

  const handleRuneClick = (rune: Rune) => {
    if (selectedSlot !== null) {
      equipRune(rune.id, selectedSlot);
      setSelectedSlot(null);
    }
  };

  const handleSlotClick = (index: number) => {
    if (runeSlots[index]) {
      unequipRune(index);
    } else {
      setSelectedSlot(selectedSlot === index ? null : index);
    }
  };

  return (
    <div className="panel">
      <strong>背包</strong>

      <div className="mt-3">
        <p className="text-sm text-gray-400 mb-2">符文槽（点击装备/卸下）</p>
        <div className="flex gap-2 mb-3">
          {runeSlots.map((rune, index) => (
            <div
              key={index}
              onClick={() => handleSlotClick(index)}
              className={`w-12 h-12 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                selectedSlot === index
                  ? 'border-yellow-400 bg-yellow-400/20'
                  : rune
                  ? 'border-gray-600 bg-gray-800'
                  : 'border-gray-700 bg-gray-900 border-dashed'
              }`}
              title={rune ? `${rune.name} (点击卸下)` : `符文槽 ${index + 1}（点击选择符文）`}
            >
              {rune ? (
                <div className="text-center">
                  <div
                    className="text-lg"
                    style={{ color: rarityColor[rune.rarity] }}
                  >
                    ✦
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {rarityText[rune.rarity]}
                  </div>
                </div>
              ) : (
                <span className="text-gray-600 text-xs">槽{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedSlot !== null && unequippedRunes.length > 0 && (
        <p className="text-xs text-yellow-400 mb-2">请选择一个符文装备到槽 {selectedSlot + 1}</p>
      )}

      <div className="mt-2">
        <p className="text-sm text-gray-400 mb-2">符文 ({runes.length})</p>
        {runes.length > 0 ? (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {runes.map((rune) => (
              <div
                key={rune.id}
                onClick={() => handleRuneClick(rune)}
                className={`p-2 rounded text-sm cursor-pointer transition-all ${
                  rune.equipped
                    ? 'bg-green-900/30 border border-green-700'
                    : selectedSlot !== null
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span style={{ color: rarityColor[rune.rarity] }}>
                    ✦ {rune.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {rarityText[rune.rarity]}
                    {rune.equipped && rune.slot_index !== undefined && ` · 槽${rune.slot_index + 1}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {runeDescriptionText[rune.type]} +{rune.effect_value}
                  {rune.type === 'leech' || rune.type === 'haste' || rune.type === 'fortune' ? '%' : ''}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">暂无符文</p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">道具</p>
        {items.length ? (
          items.map((i) => <p key={i.id}>{itemTypeText[i.type]}</p>)
        ) : (
          <p className="text-gray-500 text-sm">暂无道具</p>
        )}
      </div>
    </div>
  );
}
