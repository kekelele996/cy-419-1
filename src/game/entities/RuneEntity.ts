import Phaser from 'phaser';
import { RuneType } from '../../constants/item';
import type { Rune } from '../../models/rune';

export class RuneEntity extends Phaser.GameObjects.Container {
  runeData: Rune;
  runeType: RuneType;
  rarity: 'common' | 'rare' | 'epic';

  constructor(scene: Phaser.Scene, x: number, y: number, rune: Rune) {
    super(scene, x, y);
    this.runeData = rune;
    this.runeType = rune.type;
    this.rarity = rune.rarity;

    const rarityColors: Record<string, number> = {
      common: 0x9ca3af,
      rare: 0x3b82f6,
      epic: 0xa855f7,
    };

    const color = rarityColors[rune.rarity] || 0x9ca3af;

    const bg = scene.add.circle(0, 0, 12, color);
    bg.setStrokeStyle(2, 0xfbbf24);

    const innerGlow = scene.add.circle(0, 0, 8, color);
    innerGlow.setAlpha(0.6);

    const symbol = scene.add.text(0, 0, '✦', {
      fontSize: '14px',
      color: '#ffffff',
    });
    symbol.setOrigin(0.5);

    this.add([bg, innerGlow, symbol]);

    scene.add.existing(this);
    this.setSize(24, 24);

    scene.tweens.add({
      targets: this,
      y: y - 3,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
