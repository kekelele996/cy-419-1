export enum ItemType { POTION='potion', SYNTAX_FRAGMENT='syntax_fragment', DEBUGGER='debugger', REFACTOR_SCROLL='refactor_scroll' }
export const ITEM_EFFECTS: Record<ItemType, number> = { [ItemType.POTION]:20, [ItemType.SYNTAX_FRAGMENT]:15, [ItemType.DEBUGGER]:30, [ItemType.REFACTOR_SCROLL]:25 };

export enum RuneType {
  VITALITY = 'vitality',
  FURY = 'fury',
  IRONSKIN = 'ironskin',
  LEECH = 'leech',
  HASTE = 'haste',
  FORTUNE = 'fortune'
}

export const RUNE_EFFECTS: Record<RuneType, { value: number; description: string }> = {
  [RuneType.VITALITY]: { value: 20, description: '增加最大生命值' },
  [RuneType.FURY]: { value: 5, description: '增加攻击力' },
  [RuneType.IRONSKIN]: { value: 3, description: '增加防御力' },
  [RuneType.LEECH]: { value: 15, description: '攻击吸血百分比' },
  [RuneType.HASTE]: { value: 10, description: '攻击速度提升' },
  [RuneType.FORTUNE]: { value: 20, description: '经验获取提升' }
};

export const RUNE_SLOT_COUNT = 3;

