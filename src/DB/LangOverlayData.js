// Phase 14 覆盖层示例翻译数据（按 ID 索引；非全量，框架验证用）
export const LANG_OVERLAY_DATA = {
    zh: {
        // 物品名（key=物品ID）
        itemName: { 501: '红色药水', 502: '橙色药水', 503: '黄色药水' },
        // 技能名（key=技能ID）
        skillName: { 1: '基本技能', 2: '剑术修炼', 3: '双手剑攻击力增加' },
        // 怪物名（key=job/怪物ID）
        monsterName: { 1002: '小鸡', 1010: '蛋', 1113: '波利' },
        // UI 消息（key=msgstringtable ID）
        message: { 187: '未知地图', 756: '未知' }
    }
    // en: {} —— 英文为默认，无需覆盖（命中即原值）
};

export default LANG_OVERLAY_DATA;
