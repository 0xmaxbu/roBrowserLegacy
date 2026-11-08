/**
 * Plugins/BotAutoHunt/settings/schema.js
 *
 * 自动战斗设置 schema v2 — 结构迁移纯函数（零游戏依赖，可测试）
 *
 * v2 语义（对齐官方 4+4 页签模型）：
 *   - skills 数组固定 8 槽：[0..3] = 攻击组（attack/heal 类型），[4..7] = 辅助组（buff 类型）
 *   - slotDelays 数组 8 项，与 skills 下标对齐，每槽施放延迟（ms，≥0，0=仅引擎默认限速）
 *   - 其余字段原样保留
 *
 * 分类迁移（attack→heal/buff 重分类）依赖游戏数据（HEAL_SKILL_IDS/efst-map），
 * 由 BotAutoHunt._loadSettings 在调用本模块前完成——本模块只做结构迁移。
 *
 * 位于 settings/ 子目录：PluginManager glob 不会误加载（同 SettingsWindow.js）。
 */

export const SCHEMA_VERSION = 2;
export const ATTACK_SLOT_COUNT = 4;
export const SUPPORT_SLOT_COUNT = 4;
export const TOTAL_SLOT_COUNT = ATTACK_SLOT_COUNT + SUPPORT_SLOT_COUNT;

/** 判断技能项是否属于攻击组（attack/heal 双模式） */
function isAttackGroupItem(item) {
	if (!item || !item.id) return false;
	return item.type === 'attack' || item.type === 'heal';
}

/** 判断技能项是否属于辅助组（buff） */
function isSupportGroupItem(item) {
	if (!item || !item.id) return false;
	return item.type === 'buff';
}

/**
 * 结构迁移：任意输入 → 合法的 v2 设置对象
 *
 * @param {*} saved  localStorage 解析结果（可能损坏/缺字段/旧版本）
 * @return {Object}  v2 规范化对象（含 v/skills/slotDelays 及透传字段）
 */
export function migrateSettings(saved) {
	const src = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};

	// ---- 技能槽：按类型分组重排（攻击组 ≤4，辅助组 ≤4，超出丢弃——新模型不可表示）----
	const attackGroup = [];
	const supportGroup = [];
	const srcSkills = Array.isArray(src.skills) ? src.skills : [];
	for (const item of srcSkills) {
		if (!item || !item.id) continue;
		if (isAttackGroupItem(item) && attackGroup.length < ATTACK_SLOT_COUNT) {
			attackGroup.push(item);
		} else if (isSupportGroupItem(item) && supportGroup.length < SUPPORT_SLOT_COUNT) {
			supportGroup.push(item);
		}
	}

	const skills = [];
	for (let i = 0; i < ATTACK_SLOT_COUNT; i++) {
		skills.push(attackGroup[i] || null);
	}
	for (let i = 0; i < SUPPORT_SLOT_COUNT; i++) {
		skills.push(supportGroup[i] || null);
	}

	// ---- 每槽延迟：8 项，与 skills 下标对齐，非法值归 0 ----
	const srcDelays = Array.isArray(src.slotDelays) ? src.slotDelays : [];
	const slotDelays = [];
	for (let i = 0; i < TOTAL_SLOT_COUNT; i++) {
		const d = typeof srcDelays[i] === 'number' && srcDelays[i] >= 0 && isFinite(srcDelays[i])
			? Math.round(srcDelays[i])
			: 0;
		slotDelays.push(d);
	}

	return {
		v: SCHEMA_VERSION,
		hp: typeof src.hp === 'number' ? src.hp : 70,
		sp: typeof src.sp === 'number' ? src.sp : 30,
		skills: skills,
		aux: Array.isArray(src.aux) ? src.aux : [],
		slotDelays: slotDelays,
		follow: !!src.follow,
		followTarget: typeof src.followTarget === 'string' ? src.followTarget : '',
		flyNoMobs: !!src.flyNoMobs,
		flyLowHp: !!src.flyLowHp,
		autoPotion: !!src.autoPotion,
		normalAttack: src.normalAttack !== false // T2: 普通攻击开关（默认开启；旧档无字段=开启）
	};
}

/**
 * 判断某槽位技能当前是否可施放（每槽延迟判定）
 *
 * @param {number} now      当前时间戳（Date.now()）
 * @param {number} lastCast 该槽上次施放时间戳（0=从未施放）
 * @param {number} delay    该槽延迟（ms，0=不限）
 * @return {boolean} true=可施放
 */
export function slotReady(now, lastCast, delay) {
	if (!delay || delay <= 0) return true;
	if (!lastCast || lastCast <= 0) return true; // 从未施放 → 可施放
	return now >= lastCast + delay;
}

export default { SCHEMA_VERSION, migrateSettings, slotReady };
