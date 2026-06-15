import { BugType } from '../constants/bug';
import { ItemType, RuneType, RUNE_EFFECTS } from '../constants/item';

export const bugTypeText: Record<BugType, string> = {
  null_pointer: '空指针',
  stack_overflow: '栈溢出',
  type_error: '类型错误',
  memory_leak: '内存泄漏',
  syntax_error: '语法错误',
};

export const itemTypeText: Record<ItemType, string> = {
  potion: '药水',
  syntax_fragment: '语法碎片',
  debugger: '调试器',
  refactor_scroll: '重构卷轴',
};

export const runeTypeText: Record<RuneType, string> = {
  vitality: '生命符文',
  fury: '狂怒符文',
  ironskin: '铁壁符文',
  leech: '吸血符文',
  haste: '迅捷符文',
  fortune: '幸运符文',
};

export const runeDescriptionText: Record<RuneType, string> = {
  vitality: '增加最大生命值',
  fury: '增加攻击力',
  ironskin: '增加防御力',
  leech: '攻击吸血',
  haste: '攻击速度提升',
  fortune: '经验获取提升',
};

export const rarityText: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
};

export const rarityColor: Record<string, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
};

export const floorText = (level: number) =>
  ['Sandbox', 'Staging', 'Production'][level - 1] || 'Unknown';

export const numberText = (value: number) => Math.round(value).toString();
