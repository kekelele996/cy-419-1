import { useDungeonStore } from '../stores/dungeonStore';
import { usePlayerStore } from '../stores/playerStore';
import { attackBug } from '../utils/combatCalculator';

export function useCombat() {
  const player = usePlayerStore((s) => s.player);
  const bugs = useDungeonStore((s) => s.bugs);
  const updateBug = useDungeonStore((s) => s.updateBug);
  const killBug = useDungeonStore((s) => s.killBug);
  const addExp = usePlayerStore((s) => s.addExp);
  const heal = usePlayerStore((s) => s.heal);

  const attackNearest = () => {
    const bug = bugs.find((item) => item.status === 'alive');
    if (!bug) return 0;

    const result = attackBug(player, bug);

    if (result.bugKilled) {
      killBug(bug.id);
      addExp(result.expGained);
    } else {
      updateBug(bug.id, { hp: result.newBugHp });
    }

    if (result.healAmount > 0) {
      heal(result.healAmount);
    }

    return result.damage;
  };

  return { attackNearest };
}
