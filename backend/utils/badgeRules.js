/**
 * Rules for awarding badges based on user stats and progress.
 */
const MODULES = ['patents', 'copyrights', 'trademarks', 'trade-secrets'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const BADGE_RULES = [];

const BADGE_NAMES = {
    'patents': ['Patent Apprentice', 'Patent Specialist', 'Patent Grandmaster'],
    'copyrights': ['Copyright Novice', 'Copyright Expert', 'Copyright Legend'],
    'trademarks': ['Brand Scout', 'Brand Guard', 'Brand Visionary'],
    'trade-secrets': ['Secret Seeker', 'Vault Keeper', 'Shadow Guardian']
};

MODULES.forEach(mod => {
    DIFFICULTIES.forEach((diff, idx) => {
        BADGE_RULES.push({
            id: `${mod}_${diff}`,
            name: BADGE_NAMES[mod][idx],
            check: (user) => {
                const completedCount = user.completedLevels.filter(l =>
                    l.moduleId === mod && l.difficulty === diff
                ).length;
                return completedCount >= 3;
            }
        });
    });
});

export const checkNewBadges = (user) => {
    const newlyAwarded = [];

    BADGE_RULES.forEach(rule => {
        const alreadyHas = user.badges.some(b => b.badgeId === rule.id);
        if (!alreadyHas && rule.check(user)) {
            newlyAwarded.push({ badgeId: rule.id });
        }
    });

    return newlyAwarded;
};

export default checkNewBadges;
