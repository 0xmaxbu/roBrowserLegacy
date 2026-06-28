// Phase 14 覆盖层示例翻译数据（按 ID 索引；非全量，框架验证用）
export const LANG_OVERLAY_DATA = {
    zh: {
        // 物品名（key=物品ID）
        itemName: { 501: '红色药水', 502: '橙色药水', 503: '黄色药水' },
        // 技能名（key=技能ID）
        skillName: { 1: '基本技能', 2: '剑术修炼', 3: '双手剑攻击力增加' },
        // 技能描述（key=技能ID，独立于 message 表的 msgstringtable ID 空间）
        skillDescription: {
            1: '可以操作角色的基本动作。使用聊天窗、坐、捡道具等基本操作。',
            2: '增加使用单手剑时的攻击力。',
            3: '增加使用双手剑时的攻击力。'
        },
        // 怪物名（key=job/怪物ID，ID 取自 rAthena db/re/mob_db.yml）
        monsterName: { 1002: '波利', 1010: '老树精', 1113: '波波' },
        // UI 消息（key=msgstringtable ID）
        message: { 187: '未知地图', 756: '未知' }
    }
    // en: {} —— 英文为默认，无需覆盖（命中即原值）
};

export default LANG_OVERLAY_DATA;
