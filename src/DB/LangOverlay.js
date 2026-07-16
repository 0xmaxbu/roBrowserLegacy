import Session from 'Engine/SessionStorage.js';
import { LANG_OVERLAY_DATA } from 'DB/LangOverlayData.js';

class LangOverlay {
    // 内部：按当前语言取子表，未命中返回 null
    static _get(category, id) {
        if (Session.PlayerLang !== 'zh') { return null; } // 仅 zh 有覆盖
        const table = LANG_OVERLAY_DATA.zh && LANG_OVERLAY_DATA.zh[category];
        if (!table) { return null; }
        return (id in table) ? table[id] : null;
    }
    static getItemName(id, fallback) { return this._get('itemName', id) ?? fallback; }
    static getSkillName(id, fallback) { return this._get('skillName', id) ?? fallback; }
    static getSkillDescription(id, fallback) { return this._get('skillDescription', id) ?? fallback; }
    static getMonsterName(id, fallback) { return this._get('monsterName', id) ?? fallback; }
    static getMessage(id, fallback) { return this._get('message', id) ?? fallback; }

    // 物品数量单位（全局，非 per-ID，不入 LANG_OVERLAY_DATA）
    static getItemUnit(fallback = ' ea') {
        return (Session.PlayerLang === 'zh') ? '个' : fallback;
    }
}
export default LangOverlay;
