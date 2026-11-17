/**
 * DB/Items/ItemRandomOptionTable_zh.js
 *
 * 装备随机词条（RDMOPT 随机附加能力）简体中文显示模板，按词条 ID 索引。
 * 经 LangOverlay.getOptionName 覆盖英文原表 ItemRandomOptionTable.js，
 * 仅 Session.PlayerLang === 'zh' 时生效，未收录 ID 回退英文。
 *
 * 译名基准：台服官方（ROZ/樂園）客户端显示文本逐条简体化
 * （逐条记录来源：幻想廳 rz.fharr.com 附加能力池页），属性缩写
 * （STR/AGI/VIT/INT/DEX/LUK/MHP/MSP/ATK/MATK/DEF/MDEF/HIT/FLEE/CRI/ASPD）
 * 按惯例保留英文。渲染时 %d 被替换为词条数值、%% 替换为 %。
 *
 * ID 86/173/174 上游无官方显示文本（占位常量），本表不收录，回退英文占位。
 */

export default {
	1: 'MHP +%d', // RDMOPT_VAR_MAXHPAMOUNT（台服 MHP +）
	2: 'MSP +%d', // RDMOPT_VAR_MAXSPAMOUNT（台服 MSP +）
	3: 'STR +%d', // RDMOPT_VAR_STRAMOUNT
	4: 'AGI +%d', // RDMOPT_VAR_AGIAMOUNT
	5: 'VIT +%d', // RDMOPT_VAR_VITAMOUNT
	6: 'INT +%d', // RDMOPT_VAR_INTAMOUNT
	7: 'DEX +%d', // RDMOPT_VAR_DEXAMOUNT
	8: 'LUK +%d', // RDMOPT_VAR_LUKAMOUNT
	9: 'MHP +%d%%', // RDMOPT_VAR_MAXHPPERCENT（台服 MHP + %）
	10: 'MSP +%d%%', // RDMOPT_VAR_MAXSPPERCENT
	11: 'HP自然恢复速度增加 %d%%', // RDMOPT_VAR_HPACCELERATION（台服 HP自然恢復速度增加 %）
	12: 'SP自然恢复速度增加 %d%%', // RDMOPT_VAR_SPACCELERATION
	13: 'ATK +%d%%', // RDMOPT_VAR_ATKPERCENT（台服 ATK + %）
	14: 'MATK +%d%%', // RDMOPT_VAR_MAGICATKPERCENT
	15: 'ASPD +%d', // RDMOPT_VAR_PLUSASPD（台服 ASPD +）
	16: '攻击速度增加(攻击后延迟减少 %d%% )', // RDMOPT_VAR_PLUSASPDPERCENT（台服官方句式）
	17: 'ATK +%d', // RDMOPT_VAR_ATTPOWER（台服 ATK +）
	18: 'HIT +%d', // RDMOPT_VAR_HITSUCCESSVALUE
	19: 'MATK +%d', // RDMOPT_VAR_ATTMPOWER
	20: 'DEF +%d', // RDMOPT_VAR_ITEMDEFPOWER（台服 DEF +）
	21: 'MDEF +%d', // RDMOPT_VAR_MDEFPOWER
	22: 'FLEE +%d', // RDMOPT_VAR_AVOIDSUCCESSVALUE
	23: '完全回避 +%d', // RDMOPT_VAR_PLUSAVOIDSUCCESSVALUE
	24: 'CRI +%d', // RDMOPT_VAR_CRITICALSUCCESSVALUE（台服 CRI +）
	25: '无属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_NOTHING
	26: '水属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_WATER
	27: '地属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_GROUND
	28: '火属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_FIRE
	29: '风属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_WIND
	30: '毒属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_POISON
	31: '圣属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_SAINT
	32: '暗属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_DARKNESS
	33: '念属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_TELEKINESIS
	34: '不死属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_UNDEAD
	35: '全属性抗性增加 %d%%', // RDMOPT_ATTR_TOLERACE_ALL
	36: '从无属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_NOTHING_USER（台服 從無屬性敵人受到的物理傷害減少 %）
	37: '对无属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_NOTHING_TARGET（台服 對無屬性敵人造成的物理傷害增加 %）
	38: '从水属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_WATER_USER
	39: '对水属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_WATER_TARGET
	40: '从地属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_GROUND_USER
	41: '对地属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_GROUND_TARGET
	42: '从火属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_FIRE_USER
	43: '对火属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_FIRE_TARGET
	44: '从风属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_WIND_USER
	45: '对风属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_WIND_TARGET
	46: '从毒属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_POISON_USER
	47: '对毒属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_POISON_TARGET
	48: '从圣属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_SAINT_USER
	49: '对圣属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_SAINT_TARGET
	50: '从暗属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_DARKNESS_USER
	51: '对暗属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_DARKNESS_TARGET
	52: '从念属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_TELEKINESIS_USER
	53: '对念属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_TELEKINESIS_TARGET
	54: '从不死属性敌人受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_PROPERTY_UNDEAD_USER
	55: '对不死属性敌人造成的物理伤害增加 %d%%', // RDMOPT_DAMAGE_PROPERTY_UNDEAD_TARGET
	56: '从无属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_NOTHING_USER
	57: '对无属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_NOTHING_TARGET
	58: '从水属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_WATER_USER
	59: '对水属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_WATER_TARGET
	60: '从地属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_GROUND_USER
	61: '对地属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_GROUND_TARGET
	62: '从火属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_FIRE_USER
	63: '对火属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_FIRE_TARGET
	64: '从风属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_WIND_USER
	65: '对风属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_WIND_TARGET
	66: '从毒属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_POISON_USER
	67: '对毒属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_POISON_TARGET
	68: '从圣属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_SAINT_USER
	69: '对圣属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_SAINT_TARGET
	70: '从暗属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_DARKNESS_USER
	71: '对暗属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_DARKNESS_TARGET
	72: '从念属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_TELEKINESIS_USER
	73: '对念属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_TELEKINESIS_TARGET
	74: '从不死属性敌人受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_PROPERTY_UNDEAD_USER
	75: '对不死属性敌人造成的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_PROPERTY_UNDEAD_TARGET
	76: '铠甲属性: 无', // RDMOPT_BODY_ATTR_NOTHING
	77: '铠甲属性: 水', // RDMOPT_BODY_ATTR_WATER
	78: '铠甲属性: 地', // RDMOPT_BODY_ATTR_GROUND
	79: '铠甲属性: 火', // RDMOPT_BODY_ATTR_FIRE
	80: '铠甲属性: 风', // RDMOPT_BODY_ATTR_WIND
	81: '铠甲属性: 毒', // RDMOPT_BODY_ATTR_POISON
	82: '铠甲属性: 圣', // RDMOPT_BODY_ATTR_SAINT
	83: '铠甲属性: 暗', // RDMOPT_BODY_ATTR_DARKNESS
	84: '铠甲属性: 念', // RDMOPT_BODY_ATTR_TELEKINESIS
	85: '铠甲属性: 不死', // RDMOPT_BODY_ATTR_UNDEAD
	87: '对无型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_NOTHING（台服 對無型怪物的抗性增加 %）
	88: '对不死型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_UNDEAD
	89: '对动物型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_ANIMAL
	90: '对植物型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_PLANT
	91: '对昆虫型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_INSECT
	92: '对鱼贝型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_FISHS
	93: '对恶魔型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_DEVIL
	94: '对人类型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_HUMAN（台服 對人類型怪物的抗性增加 %）
	95: '对天使型怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_ANGEL
	96: '对龙族怪物的抗性增加 %d%%', // RDMOPT_RACE_TOLERACE_DRAGON（台服 對龍族怪物的抗性增加 %）
	97: '对无型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_NOTHING（台服 對無型怪物的物理傷害增加 %）
	98: '对不死型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_UNDEAD
	99: '对动物型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_ANIMAL
	100: '对植物型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_PLANT
	101: '对昆虫型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_INSECT
	102: '对鱼贝型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_FISHS
	103: '对恶魔型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_DEVIL
	104: '对人类型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_HUMAN
	105: '对天使型怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_ANGEL
	106: '对龙族怪物的物理伤害增加 %d%%', // RDMOPT_RACE_DAMAGE_DRAGON
	107: '对无型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_NOTHING
	108: '对不死型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_UNDEAD
	109: '对动物型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_ANIMAL
	110: '对植物型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_PLANT
	111: '对昆虫型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_INSECT
	112: '对鱼贝型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_FISHS
	113: '对恶魔型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_DEVIL
	114: '对人类型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_HUMAN
	115: '对天使型怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_ANGEL
	116: '对龙族怪物的魔法伤害增加 %d%%', // RDMOPT_RACE_MDAMAGE_DRAGON
	117: '对无型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_NOTHING
	118: '对不死型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_UNDEAD
	119: '对动物型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_ANIMAL
	120: '对植物型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_PLANT
	121: '对昆虫型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_INSECT
	122: '对鱼贝型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_FISHS
	123: '对恶魔型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_DEVIL
	124: '对人类型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_HUMAN
	125: '对天使型怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_ANGEL
	126: '对龙族怪物的 CRI +%d', // RDMOPT_RACE_CRI_PERCENT_DRAGON
	127: '无视无型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_NOTHING（台服 無視無型怪物的物理防禦力 %）
	128: '无视不死型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_UNDEAD
	129: '无视动物型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_ANIMAL
	130: '无视植物型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_PLANT
	131: '无视昆虫型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_INSECT
	132: '无视鱼贝型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_FISHS
	133: '无视恶魔型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_DEVIL
	134: '无视人类型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_HUMAN（台服 無視人類型怪物的物理防禦力 %）
	135: '无视天使型怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_ANGEL
	136: '无视龙族怪物的物理防御力 %d%%', // RDMOPT_RACE_IGNORE_DEF_PERCENT_DRAGON
	137: '无视无型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_NOTHING（台服 無視天使型怪物的魔法防禦力 % 句式）
	138: '无视不死型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_UNDEAD
	139: '无视动物型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_ANIMAL
	140: '无视植物型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_PLANT
	141: '无视昆虫型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_INSECT
	142: '无视鱼贝型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_FISHS
	143: '无视恶魔型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_DEVIL
	144: '无视人类型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_HUMAN
	145: '无视天使型怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_ANGEL
	146: '无视龙族怪物的魔法防御力 %d%%', // RDMOPT_RACE_IGNORE_MDEF_PERCENT_DRAGON
	147: '对一般敌人造成的物理伤害增加 %d%%', // RDMOPT_CLASS_DAMAGE_NORMAL_TARGET（台服 對一般敵人造成的物理傷害增加 %）
	148: '对BOSS型怪物造成的物理伤害增加 %d%%', // RDMOPT_CLASS_DAMAGE_BOSS_TARGET（台服 對BOSS型怪物造成的物理傷害增加 %）
	149: '从一般敌人受到的物理伤害减少 %d%%', // RDMOPT_CLASS_DAMAGE_NORMAL_USER
	150: '从BOSS型怪物受到的物理伤害减少 %d%%', // RDMOPT_CLASS_DAMAGE_BOSS_USER
	151: '对一般敌人造成的魔法伤害增加 %d%%', // RDMOPT_CLASS_MDAMAGE_NORMAL
	152: '对BOSS型怪物造成的魔法伤害增加 %d%%', // RDMOPT_CLASS_MDAMAGE_BOSS
	153: '无视一般敌人的物理防御力 %d%%', // RDMOPT_CLASS_IGNORE_DEF_PERCENT_NORMAL（台服 無視一般敵人的物理防禦力 %）
	154: '无视BOSS型怪物的物理防御力 %d%%', // RDMOPT_CLASS_IGNORE_DEF_PERCENT_BOSS
	155: '无视一般敌人的魔法防御力 %d%%', // RDMOPT_CLASS_IGNORE_MDEF_PERCENT_NORMAL
	156: '无视BOSS型怪物的魔法防御力 %d%%', // RDMOPT_CLASS_IGNORE_MDEF_PERCENT_BOSS
	157: '对小型怪物的物理伤害增加 %d%%', // RDMOPT_DAMAGE_SIZE_SMALL_TARGET
	158: '对中型怪物的物理伤害增加 %d%%', // RDMOPT_DAMAGE_SIZE_MIDIUM_TARGET
	159: '对大型怪物的物理伤害增加 %d%%', // RDMOPT_DAMAGE_SIZE_LARGE_TARGET
	160: '从小型怪物受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_SIZE_SMALL_USER
	161: '从中型怪物受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_SIZE_MIDIUM_USER
	162: '从大型怪物受到的物理伤害减少 %d%%', // RDMOPT_DAMAGE_SIZE_LARGE_USER
	163: '无视体型伤害惩罚', // RDMOPT_DAMAGE_SIZE_PERFECT
	164: '必杀攻击力伤害增加 %d%%', // RDMOPT_DAMAGE_CRI_TARGET（台服 必殺攻擊力傷害增加 %）
	165: '受到必杀攻击力伤害减少 %d%%', // RDMOPT_DAMAGE_CRI_USER
	166: '远距离物理伤害增加 %d%%', // RDMOPT_RANGE_ATTACK_DAMAGE_TARGET
	167: '受到远距离物理伤害减少 %d%%', // RDMOPT_RANGE_ATTACK_DAMAGE_USER
	168: '治愈量增加 %d%%', // RDMOPT_HEAL_VALUE
	169: '受到治愈量增加 %d%%', // RDMOPT_HEAL_MODIFY_PERCENT（台服 受到治癒量增加 %）
	170: '变动咏唱减少 %d%%', // RDMOPT_DEC_SPELL_CAST_TIME（台服 變動詠唱減少 %）
	171: '技能后延迟减少 %d%%', // RDMOPT_DEC_SPELL_DELAY_TIME
	172: 'SP消耗量减少 %d%%', // RDMOPT_DEC_SP_CONSUMPTION
	175: '武器属性: 无', // RDMOPT_WEAPON_ATTR_NOTHING
	176: '武器属性: 水', // RDMOPT_WEAPON_ATTR_WATER
	177: '武器属性: 地', // RDMOPT_WEAPON_ATTR_GROUND
	178: '武器属性: 火', // RDMOPT_WEAPON_ATTR_FIRE
	179: '武器属性: 风', // RDMOPT_WEAPON_ATTR_WIND
	180: '武器属性: 毒', // RDMOPT_WEAPON_ATTR_POISON
	181: '武器属性: 圣', // RDMOPT_WEAPON_ATTR_SAINT
	182: '武器属性: 暗', // RDMOPT_WEAPON_ATTR_DARKNESS
	183: '武器属性: 念', // RDMOPT_WEAPON_ATTR_TELEKINESIS
	184: '武器属性: 不死', // RDMOPT_WEAPON_ATTR_UNDEAD
	185: '战斗中不会损坏', // RDMOPT_WEAPON_INDESTRUCTIBLE
	186: '战斗中不会损坏', // RDMOPT_BODY_INDESTRUCTIBLE
	187: '对小型怪物的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_SIZE_SMALL_TARGET
	188: '对中型怪物的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_SIZE_MIDIUM_TARGET
	189: '对大型怪物的魔法伤害增加 %d%%', // RDMOPT_MDAMAGE_SIZE_LARGE_TARGET
	190: '从小型怪物受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_SIZE_SMALL_USER
	191: '从中型怪物受到的魔法伤害减少 %d%%', // RDMOPT_MDAMAGE_SIZE_MIDIUM_USER
	192: '从大型怪物受到的魔法伤害减少 %d%%' // RDMOPT_MDAMAGE_SIZE_LARGE_USER
};
