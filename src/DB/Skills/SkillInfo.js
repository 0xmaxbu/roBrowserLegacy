/**
 * DB/Skills/SkillInfo.js
 *
 * Manage skills
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import SK from './SkillConst.js';
import JobId from 'DB/Jobs/JobConst.js';

const SkillInfo = {};

SkillInfo[SK.SN_WINDWALK] = {
	Name: 'SN_WINDWALK',
	SkillName: '风之步',
	MaxLv: 10,
	SpAmount: [46, 52, 58, 64, 70, 76, 82, 88, 94, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AC_CONCENTRATION, 9]]
};
SkillInfo[SK.AB_VITUPERATUM] = {
	Name: 'AB_VITUPERATUM',
	SkillName: 'Vituperatum',
	MaxLv: 5,
	SpAmount: [144, 120, 106, 92, 78],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 5, 5],
	_NeedSkillList: [
		[SK.AB_EXPIATIO, 1],
		[SK.AB_EPICLESIS, 1]
	]
};
SkillInfo[SK.AB_CONVENIO] = {
	Name: 'AB_CONVENIO',
	SkillName: 'Convenio',
	MaxLv: 1,
	SpAmount: [70],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.AB_ANCILLA, 1],
		[SK.AB_ORATIO, 5]
	]
};
SkillInfo[SK.AL_RUWACH] = {
	Name: 'AL_RUWACH',
	SkillName: '光猎',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [10]
};
SkillInfo[SK.WS_MELTDOWN] = {
	Name: 'WS_MELTDOWN',
	SkillName: '野蛮凶砍',
	MaxLv: 10,
	SpAmount: [50, 50, 60, 60, 70, 70, 80, 80, 90, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BS_SKINTEMPER, 3],
		[SK.BS_HILTBINDING, 1],
		[SK.BS_WEAPONRESEARCH, 5],
		[SK.BS_OVERTHRUST, 3]
	]
};
SkillInfo[SK.WS_CREATECOIN] = {
	Name: 'WS_CREATECOIN',
	SkillName: '金钱铸造',
	MaxLv: 3,
	SpAmount: [10, 20, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.MER_MAGNIFICAT] = {
	Name: 'MER_MAGNIFICAT',
	SkillName: '莫纳的祝福',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.WS_CREATENUGGET] = {
	Name: 'WS_CREATENUGGET',
	SkillName: '金属块制造',
	MaxLv: 3,
	SpAmount: [10, 20, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.WS_CARTBOOST] = {
	Name: 'WS_CARTBOOST',
	SkillName: '手推车加速',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.MC_PUSHCART, 5], [SK.BS_HILTBINDING, 1], [SK.MC_CARTREVOLUTION], [SK.MC_CHANGECART]]
};
SkillInfo[SK.WS_SYSTEMCREATE] = {
	Name: 'WS_SYSTEMCREATE',
	SkillName: '攻击塔制作',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ST_CHASEWALK] = {
	Name: 'ST_CHASEWALK',
	SkillName: '暗影追踪',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TF_HIDING, 5],
		[SK.RG_TUNNELDRIVE, 3]
	]
};
SkillInfo[SK.ST_REJECTSWORD] = {
	Name: 'ST_REJECTSWORD',
	SkillName: '霸王魂',
	MaxLv: 5,
	SpAmount: [10, 15, 20, 25, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.ST_STEALBACKPACK] = {
	Name: 'ST_STEALBACKPACK',
	SkillName: '背包偷窃',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_HEATER] = {
	Name: 'EL_HEATER',
	SkillName: '急速升温',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CR_ALCHEMY] = {
	Name: 'CR_ALCHEMY',
	SkillName: '融合试验',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.CR_SYNTHESISPOTION] = {
	Name: 'CR_SYNTHESISPOTION',
	SkillName: '药剂试验',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.CG_ARROWVULCAN] = {
	Name: 'CG_ARROWVULCAN',
	SkillName: '奥义箭乱舞',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_DOUBLE, 5],
			[SK.AC_SHOWER, 5],
			[SK.BA_MUSICALSTRIKE, 1]
		],
		[JobId.DANCER_H]: [
			[SK.AC_DOUBLE, 5],
			[SK.AC_SHOWER, 5],
			[SK.DC_THROWARROW, 1]
		]
	}
};
SkillInfo[SK.CG_MOONLIT] = {
	Name: 'CG_MOONLIT',
	SkillName: '落花伴着月光下的水车小屋',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 5],
			[SK.BA_MUSICALLESSON, 7]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 5],
			[SK.DC_DANCINGLESSON, 7]
		]
	}
};
SkillInfo[SK.CG_MARIONETTE] = {
	Name: 'CG_MARIONETTE',
	SkillName: '傀儡师的把戏',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [7],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.BA_MUSICALLESSON, 5]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.DC_DANCINGLESSON, 5]
		]
	}
};
SkillInfo[SK.LK_SPIRALPIERCE] = {
	Name: 'LK_SPIRALPIERCE',
	SkillName: '螺旋击刺',
	MaxLv: 5,
	SpAmount: [18, 21, 24, 27, 30],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.KN_SPEARMASTERY, 5],
		[SK.KN_PIERCE, 5],
		[SK.KN_RIDING, 1],
		[SK.KN_SPEARSTAB, 5]
	]
};
SkillInfo[SK.LK_HEADCRUSH] = {
	Name: 'LK_HEADCRUSH',
	SkillName: '伤害增压',
	MaxLv: 5,
	SpAmount: [23, 23, 23, 23, 23],
	bSeperateLv: false,
	AttackRange: [4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.KN_SPEARMASTERY, 9],
		[SK.KN_RIDING, 1]
	]
};
SkillInfo[SK.LK_JOINTBEAT] = {
	Name: 'LK_JOINTBEAT',
	SkillName: '巧打',
	MaxLv: 10,
	SpAmount: [12, 12, 14, 14, 16, 16, 18, 18, 20, 20],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.KN_CAVALIERMASTERY, 3],
		[SK.LK_HEADCRUSH, 3]
	]
};
SkillInfo[SK.AL_PNEUMA] = {
	Name: 'AL_PNEUMA',
	SkillName: '光之障壁',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.AL_WARP, 4]]
};
SkillInfo[SK.HW_NAPALMVULCAN] = {
	Name: 'HW_NAPALMVULCAN',
	SkillName: '念力连击',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_NAPALMBEAT, 5]]
};
SkillInfo[SK.CH_SOULCOLLECT] = {
	Name: 'CH_SOULCOLLECT',
	SkillName: '狂蓄气',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.MO_EXPLOSIONSPIRITS, 5]]
};
SkillInfo[SK.PF_MINDBREAKER] = {
	Name: 'PF_MINDBREAKER',
	SkillName: '精神撼动',
	MaxLv: 5,
	SpAmount: [12, 15, 18, 21, 24],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 3],
		[SK.PF_SOULBURN, 2]
	]
};
SkillInfo[SK.PF_MEMORIZE] = {
	Name: 'PF_MEMORIZE',
	SkillName: '速读术',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SA_ADVANCEDBOOK, 5],
		[SK.SA_FREECAST, 5],
		[SK.SA_AUTOSPELL, 1]
	]
};
SkillInfo[SK.PF_FOGWALL] = {
	Name: 'PF_FOGWALL',
	SkillName: '薄雾墙',
	MaxLv: 1,
	SpAmount: [25],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [
		[SK.SA_VIOLENTGALE, 2],
		[SK.SA_DELUGE, 2]
	]
};
SkillInfo[SK.PF_SPIDERWEB] = {
	Name: 'PF_SPIDERWEB',
	SkillName: '易燃之网',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.SA_DRAGONOLOGY, 4]]
};
SkillInfo[SK.ASC_METEORASSAULT] = {
	Name: 'ASC_METEORASSAULT',
	SkillName: '黑暗瞬间',
	MaxLv: 10,
	SpAmount: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AS_KATAR, 5],
		[SK.AS_RIGHT, 3],
		[SK.AS_SONICBLOW, 5],
		[SK.ASC_BREAKER, 1]
	]
};
SkillInfo[SK.ASC_CDP] = {
	Name: 'ASC_CDP',
	SkillName: '毒液制作',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.TF_POISON, 10],
		[SK.TF_DETOXIFY, 1],
		[SK.AS_ENCHANTPOISON, 5]
	]
};
SkillInfo[SK.WE_BABY] = {
	Name: 'WE_BABY',
	SkillName: '爸妈我爱您',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.WE_CALLPARENT] = {
	Name: 'WE_CALLPARENT',
	SkillName: '爸妈我想念您',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WE_CALLBABY] = {
	Name: 'WE_CALLBABY',
	SkillName: '宝贝请来这里',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TK_RUN] = {
	Name: 'TK_RUN',
	SkillName: '跑步',
	MaxLv: 10,
	SpAmount: [100, 90, 80, 70, 60, 50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_READYSTORM] = {
	Name: 'TK_READYSTORM',
	SkillName: '回旋准备',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_STORMKICK, 1]]
};
SkillInfo[SK.TK_STORMKICK] = {
	Name: 'TK_STORMKICK',
	SkillName: '回旋踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_READYDOWN] = {
	Name: 'TK_READYDOWN',
	SkillName: '砸踢准备',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_DOWNKICK, 1]]
};
SkillInfo[SK.TK_DOWNKICK] = {
	Name: 'TK_DOWNKICK',
	SkillName: '砸踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AL_TELEPORT] = {
	Name: 'AL_TELEPORT',
	SkillName: '瞬间移动',
	MaxLv: 2,
	SpAmount: [10, 9],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.AL_RUWACH, 1]]
};
SkillInfo[SK.TK_READYTURN] = {
	Name: 'TK_READYTURN',
	SkillName: '踢准备',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_TURNKICK, 1]]
};
SkillInfo[SK.TK_TURNKICK] = {
	Name: 'TK_TURNKICK',
	SkillName: '转身踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_READYCOUNTER] = {
	Name: 'TK_READYCOUNTER',
	SkillName: '还击准备',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_COUNTER, 1]]
};
SkillInfo[SK.TK_COUNTER] = {
	Name: 'TK_COUNTER',
	SkillName: '还击踢',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_DODGE] = {
	Name: 'TK_DODGE',
	SkillName: '落法',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_JUMPKICK, 7]]
};
SkillInfo[SK.TK_JUMPKICK] = {
	Name: 'TK_JUMPKICK',
	SkillName: '飞脚踢',
	MaxLv: 7,
	SpAmount: [70, 60, 50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.TK_HPTIME] = {
	Name: 'TK_HPTIME',
	SkillName: '平安的休息',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_SPTIME] = {
	Name: 'TK_SPTIME',
	SkillName: '快乐的休息',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_POWER] = {
	Name: 'TK_POWER',
	SkillName: '加油',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.TK_SEVENWIND] = {
	Name: 'TK_SEVENWIND',
	SkillName: '温暖的风',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TK_HPTIME, 5],
		[SK.TK_SPTIME, 5],
		[SK.TK_POWER, 5]
	]
};
SkillInfo[SK.TK_HIGHJUMP] = {
	Name: 'TK_HIGHJUMP',
	SkillName: '跳高',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [2, 4, 6, 8, 10]
};
SkillInfo[SK.SG_FEEL] = {
	Name: 'SG_FEEL',
	SkillName: '太阳和月亮和星星的感觉',
	MaxLv: 3,
	SpAmount: [100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.SG_SUN_WARM] = {
	Name: 'SG_SUN_WARM',
	SkillName: '太阳的温暖',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 1]]
};
SkillInfo[SK.SG_MOON_WARM] = {
	Name: 'SG_MOON_WARM',
	SkillName: '月亮的温暖',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 2]]
};
SkillInfo[SK.SG_STAR_WARM] = {
	Name: 'SG_STAR_WARM',
	SkillName: '星星的温暖',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 3]]
};
SkillInfo[SK.SG_SUN_COMFORT] = {
	Name: 'SG_SUN_COMFORT',
	SkillName: '太阳的平安感',
	MaxLv: 4,
	SpAmount: [70, 60, 50, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 1]]
};
SkillInfo[SK.AL_WARP] = {
	Name: 'AL_WARP',
	SkillName: '传送之阵',
	MaxLv: 4,
	SpAmount: [35, 32, 29, 26],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_TELEPORT, 2]]
};
SkillInfo[SK.SG_MOON_COMFORT] = {
	Name: 'SG_MOON_COMFORT',
	SkillName: '月亮的平安感',
	MaxLv: 4,
	SpAmount: [70, 60, 50, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 2]]
};
SkillInfo[SK.SG_STAR_COMFORT] = {
	Name: 'SG_STAR_COMFORT',
	SkillName: '星星的平安感',
	MaxLv: 4,
	SpAmount: [70, 60, 50, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SG_FEEL, 3]]
};
SkillInfo[SK.SG_HATE] = {
	Name: 'SG_HATE',
	SkillName: '太阳和月亮和星星的憎恶',
	MaxLv: 3,
	SpAmount: [100, 100, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9]
};
SkillInfo[SK.SG_SUN_ANGER] = {
	Name: 'SG_SUN_ANGER',
	SkillName: '太阳的愤怒',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_HATE, 1]]
};
SkillInfo[SK.SG_MOON_ANGER] = {
	Name: 'SG_MOON_ANGER',
	SkillName: '月亮的愤怒',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_HATE, 2]]
};
SkillInfo[SK.SG_STAR_ANGER] = {
	Name: 'SG_STAR_ANGER',
	SkillName: '星星的愤怒',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SG_HATE, 3]]
};
SkillInfo[SK.SG_SUN_BLESS] = {
	Name: 'SG_SUN_BLESS',
	SkillName: '太阳的祝福',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 1],
		[SK.SG_HATE, 1]
	]
};
SkillInfo[SK.SG_MOON_BLESS] = {
	Name: 'SG_MOON_BLESS',
	SkillName: '月亮的祝福',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 2],
		[SK.SG_HATE, 2]
	]
};
SkillInfo[SK.SG_STAR_BLESS] = {
	Name: 'SG_STAR_BLESS',
	SkillName: '星星的祝福',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 3],
		[SK.SG_HATE, 3]
	]
};
SkillInfo[SK.SG_DEVIL] = {
	Name: 'SG_DEVIL',
	SkillName: '太阳和月亮和星星的恶魔',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_DEVELOPMENT] = {
	Name: 'GD_DEVELOPMENT',
	SkillName: '永久的发展',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SG_FRIEND] = {
	Name: 'SG_FRIEND',
	SkillName: '太阳和月亮和星星的朋友',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.SG_KNOWLEDGE] = {
	Name: 'SG_KNOWLEDGE',
	SkillName: '太阳和月亮和星星的知识',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SG_FUSION] = {
	Name: 'SG_FUSION',
	SkillName: '太阳和月亮和星星的融合',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SG_KNOWLEDGE, 9]]
};
SkillInfo[SK.SL_ALCHEMIST] = {
	Name: 'SL_ALCHEMIST',
	SkillName: '炼金术师的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.AM_BERSERKPITCHER] = {
	Name: 'AM_BERSERKPITCHER',
	SkillName: '菠色克投掷',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SL_MONK] = {
	Name: 'SL_MONK',
	SkillName: '武道家的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.AL_HEAL] = {
	Name: 'AL_HEAL',
	SkillName: '治愈术',
	MaxLv: 10,
	SpAmount: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.CRUSADER]: [
			[SK.CR_TRUST, 10],
			[SK.AL_DEMONBANE, 5]
		]
	}
};
SkillInfo[SK.SL_STAR] = {
	Name: 'SL_STAR',
	SkillName: '拳圣的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_SAGE] = {
	Name: 'SL_SAGE',
	SkillName: '贤者的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_QUICKEN] = {
	Name: 'MER_QUICKEN',
	SkillName: '加速武器',
	MaxLv: 10,
	SpAmount: [14, 18, 22, 26, 30, 34, 38, 42, 46, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SL_CRUSADER] = {
	Name: 'SL_CRUSADER',
	SkillName: '十字军的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_SUPERNOVICE] = {
	Name: 'SL_SUPERNOVICE',
	SkillName: '超级初学者的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_STAR, 1]]
};
SkillInfo[SK.SL_KNIGHT] = {
	Name: 'SL_KNIGHT',
	SkillName: '骑士的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_CRUSADER, 1]]
};
SkillInfo[SK.SL_WIZARD] = {
	Name: 'SL_WIZARD',
	SkillName: '巫师的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_SAGE, 1]]
};
SkillInfo[SK.SL_PRIEST] = {
	Name: 'SL_PRIEST',
	SkillName: '祭司的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_MONK, 1]]
};
SkillInfo[SK.SL_BARDDANCER] = {
	Name: 'SL_BARDDANCER',
	SkillName: '吟游诗人和舞娘的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.EL_TROPIC] = {
	Name: 'EL_TROPIC',
	SkillName: '灼热地带',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SL_ROGUE] = {
	Name: 'SL_ROGUE',
	SkillName: '流氓的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_ASSASIN, 1]]
};
SkillInfo[SK.SL_ASSASIN] = {
	Name: 'SL_ASSASIN',
	SkillName: '刺客的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_BLACKSMITH] = {
	Name: 'SL_BLACKSMITH',
	SkillName: '铁匠的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_ALCHEMIST, 1]]
};
SkillInfo[SK.BS_ADRENALINE2] = {
	Name: 'BS_ADRENALINE2',
	SkillName: '所有速度激发',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [64],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BS_ADRENALINE, 5]]
};
SkillInfo[SK.SL_HUNTER] = {
	Name: 'SL_HUNTER',
	SkillName: '猎人的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_BARDDANCER, 1]]
};
SkillInfo[SK.SL_SOULLINKER] = {
	Name: 'SL_SOULLINKER',
	SkillName: '悟灵士的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_STAR, 1]]
};
SkillInfo[SK.SL_KAIZEL] = {
	Name: 'SL_KAIZEL',
	SkillName: '凯易哲',
	MaxLv: 7,
	SpAmount: [120, 110, 100, 90, 80, 70, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_PRIEST, 1]]
};
SkillInfo[SK.SL_KAAHI] = {
	Name: 'SL_KAAHI',
	SkillName: '凯阿希',
	MaxLv: 7,
	SpAmount: [30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SL_CRUSADER, 1],
		[SK.SL_MONK, 1],
		[SK.SL_PRIEST, 1]
	]
};
SkillInfo[SK.AL_INCAGI] = {
	Name: 'AL_INCAGI',
	SkillName: '加速术',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_HEAL, 3]]
};
SkillInfo[SK.SL_KAUPE] = {
	Name: 'SL_KAUPE',
	SkillName: '凯诬仆',
	MaxLv: 3,
	SpAmount: [20, 30, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [
		[SK.SL_ASSASIN, 1],
		[SK.SL_ROGUE, 1]
	]
};
SkillInfo[SK.SL_KAITE] = {
	Name: 'SL_KAITE',
	SkillName: '凯易特',
	MaxLv: 7,
	SpAmount: [70, 70, 70, 70, 70, 70, 70],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SL_SAGE, 1],
		[SK.SL_WIZARD, 1]
	]
};
SkillInfo[SK.SL_KAINA] = {
	Name: 'SL_KAINA',
	SkillName: '凯易娜',
	MaxLv: 7,
	SpAmount: [0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TK_SPTIME, 1]]
};
SkillInfo[SK.SL_STIN] = {
	Name: 'SL_STIN',
	SkillName: '艾斯提',
	MaxLv: 7,
	SpAmount: [18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_WIZARD, 1]]
};
SkillInfo[SK.SL_STUN] = {
	Name: 'SL_STUN',
	SkillName: '艾斯敦',
	MaxLv: 7,
	SpAmount: [18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_WIZARD, 1]]
};
SkillInfo[SK.SL_SMA] = {
	Name: 'SL_SMA',
	SkillName: '艾斯麻',
	MaxLv: 10,
	SpAmount: [8, 16, 24, 32, 40, 48, 56, 64, 72, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SL_STIN, 7],
		[SK.SL_STUN, 7]
	]
};
SkillInfo[SK.SL_SWOO] = {
	Name: 'SL_SWOO',
	SkillName: '艾斯诬',
	MaxLv: 7,
	SpAmount: [75, 65, 55, 45, 35, 25, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_PRIEST, 1]]
};
SkillInfo[SK.SL_SKE] = {
	Name: 'SL_SKE',
	SkillName: '艾斯克',
	MaxLv: 3,
	SpAmount: [45, 30, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SL_KNIGHT, 1]]
};
SkillInfo[SK.SL_SKA] = {
	Name: 'SL_SKA',
	SkillName: '艾斯卡',
	MaxLv: 3,
	SpAmount: [100, 80, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SL_MONK, 1]]
};
SkillInfo[SK.ST_PRESERVE] = {
	Name: 'ST_PRESERVE',
	SkillName: '自由保护',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_PLAGIARISM, 10]]
};
SkillInfo[SK.ST_FULLSTRIP] = {
	Name: 'ST_FULLSTRIP',
	SkillName: '所有卸除',
	MaxLv: 5,
	SpAmount: [22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPWEAPON, 5]]
};
SkillInfo[SK.WS_WEAPONREFINE] = {
	Name: 'WS_WEAPONREFINE',
	SkillName: '武器精练',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_WEAPONRESEARCH, 10]]
};
SkillInfo[SK.CR_SLIMPITCHER] = {
	Name: 'CR_SLIMPITCHER',
	SkillName: '纤细药水投掷',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_POTIONPITCHER, 5]]
};
SkillInfo[SK.CR_FULLPROTECTION] = {
	Name: 'CR_FULLPROTECTION',
	SkillName: '所有化学武器保护',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AM_CP_WEAPON, 5],
		[SK.AM_CP_ARMOR, 5],
		[SK.AM_CP_SHIELD, 5],
		[SK.AM_CP_HELM, 5]
	]
};
SkillInfo[SK.AL_DECAGI] = {
	Name: 'AL_DECAGI',
	SkillName: '缓速术',
	MaxLv: 10,
	SpAmount: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_INCAGI, 1]]
};
SkillInfo[SK.PA_SHIELDCHAIN] = {
	Name: 'PA_SHIELDCHAIN',
	SkillName: '连续盾击',
	MaxLv: 5,
	SpAmount: [28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [7, 7, 9, 9, 11],
	_NeedSkillList: [[SK.CR_SHIELDBOOMERANG, 5]]
};
SkillInfo[SK.HP_MANARECHARGE] = {
	Name: 'HP_MANARECHARGE',
	SkillName: '魔力减免',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.PR_MACEMASTERY, 10],
		[SK.AL_DEMONBANE, 10]
	]
};
SkillInfo[SK.PF_DOUBLECASTING] = {
	Name: 'PF_DOUBLECASTING',
	SkillName: '双倍投掷',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_AUTOSPELL, 1]]
};
SkillInfo[SK.HW_GANBANTEIN] = {
	Name: 'HW_GANBANTEIN',
	SkillName: '咖般塔音',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [18],
	_NeedSkillList: [
		[SK.WZ_ESTIMATION, 1],
		[SK.WZ_ICEWALL, 1]
	]
};
SkillInfo[SK.HW_GRAVITATION] = {
	Name: 'HW_GRAVITATION',
	SkillName: '重力原野',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [18, 18, 18, 18, 18],
	_NeedSkillList: [
		[SK.WZ_QUAGMIRE, 1],
		[SK.HW_MAGICCRASHER, 1],
		[SK.HW_MAGICPOWER, 10]
	]
};
SkillInfo[SK.WS_CARTTERMINATION] = {
	Name: 'WS_CARTTERMINATION',
	SkillName: '手推车终结技',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MC_MAMMONITE, 10],
		[SK.BS_HAMMERFALL, 5],
		[SK.WS_CARTBOOST, 1]
	]
};
SkillInfo[SK.WS_OVERTHRUSTMAX] = {
	Name: 'WS_OVERTHRUSTMAX',
	SkillName: '凶砍最大值',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_OVERTHRUST, 5]]
};
SkillInfo[SK.CG_LONGINGFREEDOM] = {
	Name: 'CG_LONGINGFREEDOM',
	SkillName: '不要拘束我',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.BA_DISSONANCE, 3],
			[SK.BA_MUSICALLESSON, 10]
		],
		[JobId.DANCER_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.DC_UGLYDANCE, 3],
			[SK.DC_DANCINGLESSON, 10]
		]
	}
};
SkillInfo[SK.CG_HERMODE] = {
	Name: 'CG_HERMODE',
	SkillName: "Hermode's Rod",
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.BA_MUSICALLESSON, 10]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.DC_DANCINGLESSON, 10]
		]
	}
};
SkillInfo[SK.CG_TAROTCARD] = {
	Name: 'CG_TAROTCARD',
	SkillName: '命运的塔罗牌',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.BA_DISSONANCE, 3]
		],
		[JobId.DANCER_H]: [
			[SK.AC_CONCENTRATION, 10],
			[SK.DC_UGLYDANCE, 3]
		]
	}
};
SkillInfo[SK.CR_ACIDDEMONSTRATION] = {
	Name: 'CR_ACIDDEMONSTRATION',
	SkillName: '强酸火烟瓶投掷',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AM_DEMONSTRATION, 5],
		[SK.AM_ACIDTERROR, 5]
	]
};
SkillInfo[SK.CR_CULTIVATION] = {
	Name: 'CR_CULTIVATION',
	SkillName: '植物栽培',
	MaxLv: 2,
	SpAmount: [10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1]
};
SkillInfo[SK.TK_MISSION] = {
	Name: 'TK_MISSION',
	SkillName: '太拳任务',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TK_POWER, 5]]
};
SkillInfo[SK.SL_HIGH] = {
	Name: 'SL_HIGH',
	SkillName: '一转上等职业的灵魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SL_SUPERNOVICE, 5]]
};
SkillInfo[SK.KN_ONEHAND] = {
	Name: 'KN_ONEHAND',
	SkillName: '单手剑攻击速度增加',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_TWOHANDQUICKEN, 10]]
};
SkillInfo[SK.AL_HOLYWATER] = {
	Name: 'AL_HOLYWATER',
	SkillName: '天使之泪',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_TWILIGHT1] = {
	Name: 'AM_TWILIGHT1',
	SkillName: '宽广配药',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_PHARMACY, 10]]
};
SkillInfo[SK.AM_TWILIGHT2] = {
	Name: 'AM_TWILIGHT2',
	SkillName: '宽广配药',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_PHARMACY, 10]]
};
SkillInfo[SK.AM_TWILIGHT3] = {
	Name: 'AM_TWILIGHT3',
	SkillName: '宽广配药',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_PHARMACY, 10]]
};
SkillInfo[SK.HT_POWER] = {
	Name: 'HT_POWER',
	SkillName: '动物猛击',
	MaxLv: 1,
	Type: 'Soul',
	SpAmount: [12],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.AC_DOUBLE, 10]]
};
SkillInfo[SK.GS_GLITTERING] = {
	Name: 'GS_GLITTERING',
	SkillName: '装满硬币',
	MaxLv: 5,
	SpAmount: [2, 2, 2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_ENCHANTBLADE] = {
	Name: 'RK_ENCHANTBLADE',
	SkillName: '魔力剑',
	MaxLv: 10,
	SpAmount: [34, 38, 42, 46, 50, 54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_RUNEMASTERY, 2]]
};
SkillInfo[SK.GS_FLING] = {
	Name: 'GS_FLING',
	SkillName: '投掷硬币',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RK_WINDCUTTER] = {
	Name: 'RK_WINDCUTTER',
	SkillName: '风压飞刃',
	MaxLv: 5,
	SpAmount: [23, 26, 29, 32, 35],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_ENCHANTBLADE, 5]]
};
SkillInfo[SK.GS_TRIPLEACTION] = {
	Name: 'GS_TRIPLEACTION',
	SkillName: '三连攻击',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RK_DRAGONHOWLING] = {
	Name: 'RK_DRAGONHOWLING',
	SkillName: '龙之咆哮',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_DRAGONTRAINING, 2]]
};
SkillInfo[SK.GS_BULLSEYE] = {
	Name: 'GS_BULLSEYE',
	SkillName: "Bull's Eye",
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 5]]
};
SkillInfo[SK.RK_REFRESH] = {
	Name: 'RK_REFRESH',
	SkillName: '恢复',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GS_MADNESSCANCEL] = {
	Name: 'GS_MADNESSCANCEL',
	SkillName: '疯狂凯斯乐',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 4]]
};
SkillInfo[SK.RK_STORMBLAST] = {
	Name: 'RK_STORMBLAST',
	SkillName: '风暴冲击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GS_ADJUSTMENT] = {
	Name: 'GS_ADJUSTMENT',
	SkillName: "Gunslinger's Panic",
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 4]]
};
SkillInfo[SK.GC_VENOMIMPRESS] = {
	Name: 'GC_VENOMIMPRESS',
	SkillName: '毒耐性弱化',
	MaxLv: 5,
	SpAmount: [12, 16, 20, 24, 28],
	bSeperateLv: true,
	AttackRange: [10, 10, 10, 10, 10],
	_NeedSkillList: [[SK.AS_ENCHANTPOISON, 3]]
};
SkillInfo[SK.GS_INCREASING] = {
	Name: 'GS_INCREASING',
	SkillName: '命中率递增',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 2]]
};
SkillInfo[SK.GC_CREATENEWPOISON] = {
	Name: 'GC_CREATENEWPOISON',
	SkillName: '新毒制作',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GC_RESEARCHNEWPOISON, 1]]
};
SkillInfo[SK.GS_MAGICALBULLET] = {
	Name: 'GS_MAGICALBULLET',
	SkillName: '魔术弹',
	MaxLv: 1,
	SpAmount: [7],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.GC_COUNTERSLASH] = {
	Name: 'GC_COUNTERSLASH',
	SkillName: '反击斩',
	MaxLv: 10,
	SpAmount: [5, 8, 11, 14, 17, 19, 21, 23, 25, 27],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_WEAPONBLOCKING, 1]]
};
SkillInfo[SK.GS_CRACKER] = {
	Name: 'GS_CRACKER',
	SkillName: '轰然巨响',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.GC_CLOAKINGEXCEED] = {
	Name: 'GC_CLOAKINGEXCEED',
	SkillName: '伪装强化',
	MaxLv: 5,
	SpAmount: [45, 45, 45, 45, 45],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_CLOAKING, 3]]
};
SkillInfo[SK.GS_SINGLEACTION] = {
	Name: 'GS_SINGLEACTION',
	SkillName: '单枪射击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GC_CROSSRIPPERSLASHER] = {
	Name: 'GC_CROSSRIPPERSLASHER',
	SkillName: '回旋十字斩',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [9, 10, 11, 12, 13],
	_NeedSkillList: [[SK.GC_ROLLINGCUTTER, 1]]
};
SkillInfo[SK.GS_SNAKEEYE] = {
	Name: 'GS_SNAKEEYE',
	SkillName: '瞄准之眼',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AB_CLEMENTIA] = {
	Name: 'AB_CLEMENTIA',
	SkillName: '慈悲术',
	MaxLv: 3,
	SpAmount: [280, 320, 360],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.AL_BLESSING, 1]]
};
SkillInfo[SK.SM_SWORD] = {
	Name: 'SM_SWORD',
	SkillName: '单手剑使用熟练度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AL_CRUCIS] = {
	Name: 'AL_CRUCIS',
	SkillName: '天使之光',
	MaxLv: 10,
	SpAmount: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AL_DEMONBANE, 3]]
};
SkillInfo[SK.GS_TRACKING] = {
	Name: 'GS_TRACKING',
	SkillName: '百步穿杨',
	MaxLv: 10,
	SpAmount: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 5]]
};
SkillInfo[SK.GS_DISARM] = {
	Name: 'GS_DISARM',
	SkillName: '抛戈卸甲',
	MaxLv: 5,
	SpAmount: [15, 20, 25, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_TRACKING, 7]]
};
SkillInfo[SK.GS_PIERCINGSHOT] = {
	Name: 'GS_PIERCINGSHOT',
	SkillName: '霹雳弹',
	MaxLv: 5,
	SpAmount: [11, 12, 13, 14, 15],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_TRACKING, 5]]
};
SkillInfo[SK.GS_RAPIDSHOWER] = {
	Name: 'GS_RAPIDSHOWER',
	SkillName: '五连击',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_CHAINACTION, 3]]
};
SkillInfo[SK.GS_DESPERADO] = {
	Name: 'GS_DESPERADO',
	SkillName: '亡命之徒',
	MaxLv: 10,
	SpAmount: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GS_RAPIDSHOWER, 5]]
};
SkillInfo[SK.GS_GATLINGFEVER] = {
	Name: 'GS_GATLINGFEVER',
	SkillName: '格林狂热',
	MaxLv: 10,
	SpAmount: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.GS_RAPIDSHOWER, 7],
		[SK.GS_DESPERADO, 5]
	]
};
SkillInfo[SK.GS_DUST] = {
	Name: 'GS_DUST',
	SkillName: '弹片四射',
	MaxLv: 10,
	SpAmount: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 5]]
};
SkillInfo[SK.GS_FULLBUSTER] = {
	Name: 'GS_FULLBUSTER',
	SkillName: '全面破坏',
	MaxLv: 10,
	SpAmount: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_DUST, 3]]
};
SkillInfo[SK.GS_SPREADATTACK] = {
	Name: 'GS_SPREADATTACK',
	SkillName: '火力全开',
	MaxLv: 10,
	SpAmount: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 5]]
};
SkillInfo[SK.GS_GROUNDDRIFT] = {
	Name: 'GS_GROUNDDRIFT',
	SkillName: '四面埋伏',
	MaxLv: 10,
	SpAmount: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GS_SPREADATTACK, 7]]
};
SkillInfo[SK.NJ_TOBIDOUGU] = {
	Name: 'NJ_TOBIDOUGU',
	SkillName: '飞刀修练',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NJ_SYURIKEN] = {
	Name: 'NJ_SYURIKEN',
	SkillName: '投掷飞镖',
	MaxLv: 10,
	SpAmount: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_TOBIDOUGU, 1]]
};
SkillInfo[SK.NJ_KUNAI] = {
	Name: 'NJ_KUNAI',
	SkillName: '投掷飞刀',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_SYURIKEN, 5]]
};
SkillInfo[SK.NJ_HUUMA] = {
	Name: 'NJ_HUUMA',
	SkillName: '投掷风魔飞镖',
	MaxLv: 5,
	SpAmount: [15, 20, 25, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.NJ_TOBIDOUGU, 5],
		[SK.NJ_KUNAI, 5]
	]
};
SkillInfo[SK.NJ_ZENYNAGE] = {
	Name: 'NJ_ZENYNAGE',
	SkillName: '投掷金钱',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.NJ_TOBIDOUGU, 10],
		[SK.NJ_HUUMA, 5]
	]
};
SkillInfo[SK.AL_ANGELUS] = {
	Name: 'AL_ANGELUS',
	SkillName: '天使之障壁',
	MaxLv: 10,
	SpAmount: [23, 26, 29, 32, 35, 38, 41, 44, 47, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AL_DP, 3]]
};
SkillInfo[SK.NJ_KASUMIKIRI] = {
	Name: 'NJ_KASUMIKIRI',
	SkillName: '雾里砍劈',
	MaxLv: 10,
	SpAmount: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_SHADOWJUMP, 1]]
};
SkillInfo[SK.NJ_SHADOWJUMP] = {
	Name: 'NJ_SHADOWJUMP',
	SkillName: '影子跳跃',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [6, 8, 10, 12, 14],
	_NeedSkillList: [[SK.NJ_TATAMIGAESHI, 1]]
};
SkillInfo[SK.NJ_KIRIKAGE] = {
	Name: 'NJ_KIRIKAGE',
	SkillName: '隐身攻击',
	MaxLv: 5,
	SpAmount: [10, 11, 12, 13, 14],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_KASUMIKIRI, 5]]
};
SkillInfo[SK.NJ_UTSUSEMI] = {
	Name: 'NJ_UTSUSEMI',
	SkillName: '金蝉脱壳',
	MaxLv: 5,
	SpAmount: [12, 15, 18, 21, 24],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_SHADOWJUMP, 5]]
};
SkillInfo[SK.NJ_BUNSINJYUTSU] = {
	Name: 'NJ_BUNSINJYUTSU',
	SkillName: '幻影分身',
	MaxLv: 10,
	SpAmount: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.NJ_NEN, 1],
		[SK.NJ_UTSUSEMI, 4],
		[SK.NJ_KIRIKAGE, 3]
	]
};
SkillInfo[SK.NJ_NINPOU] = {
	Name: 'NJ_NINPOU',
	SkillName: '忍术修练',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NJ_KOUENKA] = {
	Name: 'NJ_KOUENKA',
	SkillName: '火炎花',
	MaxLv: 10,
	SpAmount: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_NINPOU, 1]]
};
SkillInfo[SK.NJ_KAENSIN] = {
	Name: 'NJ_KAENSIN',
	SkillName: '火炎阵',
	MaxLv: 10,
	SpAmount: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_KOUENKA, 5]]
};
SkillInfo[SK.NJ_BAKUENRYU] = {
	Name: 'NJ_BAKUENRYU',
	SkillName: '爆炎龙',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.NJ_NINPOU, 10],
		[SK.NJ_KAENSIN, 7]
	]
};
SkillInfo[SK.NJ_HYOUSENSOU] = {
	Name: 'NJ_HYOUSENSOU',
	SkillName: '冰闪枪',
	MaxLv: 10,
	SpAmount: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_NINPOU, 1]]
};
SkillInfo[SK.NJ_SUITON] = {
	Name: 'NJ_SUITON',
	SkillName: '水钝',
	MaxLv: 10,
	SpAmount: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_HYOUSENSOU, 5]]
};
SkillInfo[SK.NJ_HYOUSYOURAKU] = {
	Name: 'NJ_HYOUSYOURAKU',
	SkillName: '冰晶落',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.NJ_NINPOU, 10],
		[SK.NJ_SUITON, 7]
	]
};
SkillInfo[SK.NJ_HUUJIN] = {
	Name: 'NJ_HUUJIN',
	SkillName: '风刃',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_NINPOU, 1]]
};
SkillInfo[SK.NJ_RAIGEKISAI] = {
	Name: 'NJ_RAIGEKISAI',
	SkillName: '雷击碎',
	MaxLv: 5,
	SpAmount: [16, 20, 24, 28, 32],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.NJ_HUUJIN, 5]]
};
SkillInfo[SK.NJ_KAMAITACHI] = {
	Name: 'NJ_KAMAITACHI',
	SkillName: '朔风',
	MaxLv: 5,
	SpAmount: [24, 28, 32, 36, 40],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [
		[SK.NJ_NINPOU, 10],
		[SK.NJ_RAIGEKISAI, 5]
	]
};
SkillInfo[SK.AL_BLESSING] = {
	Name: 'AL_BLESSING',
	SkillName: '天使之赐福',
	MaxLv: 10,
	SpAmount: [28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_DP, 5]]
};
SkillInfo[SK.NJ_ISSEN] = {
	Name: 'NJ_ISSEN',
	SkillName: '一闪击',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [
		[SK.NJ_TOBIDOUGU, 7],
		[SK.NJ_NEN, 1],
		[SK.NJ_KIRIKAGE, 5]
	]
};
SkillInfo[SK.MB_FIGHTING] = {
	Name: 'MB_FIGHTING',
	SkillName: '僵尸战斗',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_NEUTRAL] = {
	Name: 'MB_NEUTRAL',
	SkillName: '妖道中立',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_TAIMING_PUTI] = {
	Name: 'MB_TAIMING_PUTI',
	SkillName: '宠物驯化',
	MaxLv: 7,
	SpAmount: [0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_WHITEPOTION] = {
	Name: 'MB_WHITEPOTION',
	SkillName: '药水控制',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_MENTAL] = {
	Name: 'MB_MENTAL',
	SkillName: '精神控制',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_CARDPITCHER] = {
	Name: 'MB_CARDPITCHER',
	SkillName: '卡片投掷',
	MaxLv: 10,
	SpAmount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_PETPITCHER] = {
	Name: 'MB_PETPITCHER',
	SkillName: '宠物投掷',
	MaxLv: 10,
	SpAmount: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_BODYSTUDY] = {
	Name: 'MB_BODYSTUDY',
	SkillName: '身体研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_BODYALTER] = {
	Name: 'MB_BODYALTER',
	SkillName: '身体改造',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_PETMEMORY] = {
	Name: 'MB_PETMEMORY',
	SkillName: '宠物记忆',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MB_M_TELEPORT] = {
	Name: 'MB_M_TELEPORT',
	SkillName: '僵尸传送',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_B_GAIN] = {
	Name: 'MB_B_GAIN',
	SkillName: '妖道获得经验',
	MaxLv: 7,
	SpAmount: [12, 15, 18, 21, 24, 27, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_M_GAIN] = {
	Name: 'MB_M_GAIN',
	SkillName: '僵尸获得经验',
	MaxLv: 7,
	SpAmount: [1, 1, 1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_MISSION] = {
	Name: 'MB_MISSION',
	SkillName: '认养宠物任务',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AL_CURE] = {
	Name: 'AL_CURE',
	SkillName: '治疗术',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.AL_HEAL, 2]],
	NeedSkillList: { [JobId.CRUSADER]: [[SK.CR_TRUST, 5]] }
};
SkillInfo[SK.MB_MUNAKBALL] = {
	Name: 'MB_MUNAKBALL',
	SkillName: '僵尸球',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_SCROLL] = {
	Name: 'MB_SCROLL',
	SkillName: '妖道球',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_GATHERING] = {
	Name: 'MB_B_GATHERING',
	SkillName: '妖道聚集',
	MaxLv: 7,
	SpAmount: [17, 15, 13, 11, 9, 7, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_GATHERING] = {
	Name: 'MB_M_GATHERING',
	SkillName: '僵尸聚集',
	MaxLv: 7,
	SpAmount: [32, 30, 28, 26, 24, 22, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_EXCLUDE] = {
	Name: 'MB_B_EXCLUDE',
	SkillName: '妖道排斥',
	MaxLv: 5,
	SpAmount: [180, 160, 140, 120, 100],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MB_B_DRIFT] = {
	Name: 'MB_B_DRIFT',
	SkillName: '妖道漂流',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_WALLRUSH] = {
	Name: 'MB_B_WALLRUSH',
	SkillName: '妖道墙扫荡',
	MaxLv: 7,
	SpAmount: [9, 10, 11, 12, 13, 14, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_WALLRUSH] = {
	Name: 'MB_M_WALLRUSH',
	SkillName: '僵尸墙扫荡',
	MaxLv: 7,
	SpAmount: [9, 10, 11, 12, 13, 14, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_WALLSHIFT] = {
	Name: 'MB_B_WALLSHIFT',
	SkillName: '妖道墙变形',
	MaxLv: 5,
	SpAmount: [13, 11, 9, 7, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_WALLCRASH] = {
	Name: 'MB_M_WALLCRASH',
	SkillName: '僵尸墙冲撞',
	MaxLv: 7,
	SpAmount: [27, 25, 23, 21, 19, 17, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_M_REINCARNATION] = {
	Name: 'MB_M_REINCARNATION',
	SkillName: '僵尸重生',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MB_B_EQUIP] = {
	Name: 'MB_B_EQUIP',
	SkillName: '妖道装备',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SL_DEATHKNIGHT] = {
	Name: 'SL_DEATHKNIGHT',
	SkillName: '死亡骑士之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_COLLECTOR] = {
	Name: 'SL_COLLECTOR',
	SkillName: "Soul Collector's Spirit",
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SL_NINJA] = {
	Name: 'SL_NINJA',
	SkillName: '忍者之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MC_INCCARRY] = {
	Name: 'MC_INCCARRY',
	SkillName: '负重量上升',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_TWILIGHT4] = {
	Name: 'AM_TWILIGHT4',
	SkillName: '宽广配药',
	MaxLv: 1,
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_BERSERKAIZER] = {
	Name: 'DE_BERSERKAIZER',
	SkillName: '狂暴化',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_DARKPOWER] = {
	Name: 'DA_DARKPOWER',
	SkillName: '黑暗灵魂之力',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DE_PASSIVE] = {
	Name: 'DE_PASSIVE',
	SkillName: 'Death 被动',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_PATTACK] = {
	Name: 'DE_PATTACK',
	SkillName: 'Death 袭击被动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PSPEED] = {
	Name: 'DE_PSPEED',
	SkillName: 'Death 加速被动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PDEFENSE] = {
	Name: 'DE_PDEFENSE',
	SkillName: 'Death 防御被动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PCRITICAL] = {
	Name: 'DE_PCRITICAL',
	SkillName: 'Death 暴击被动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PHP] = {
	Name: 'DE_PHP',
	SkillName: 'Death 恢复被动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PSP] = {
	Name: 'DE_PSP',
	SkillName: 'Death 魔力被动',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_RESET] = {
	Name: 'DE_RESET',
	SkillName: 'Death 强化',
	MaxLv: 1,
	SpAmount: [280],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_RANKING] = {
	Name: 'DE_RANKING',
	SkillName: 'Death 排列被动',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_PTRIPLE] = {
	Name: 'DE_PTRIPLE',
	SkillName: 'Death 三倍被动',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_ENERGY] = {
	Name: 'DE_ENERGY',
	SkillName: '<死亡骑士>能量',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MC_DISCOUNT] = {
	Name: 'MC_DISCOUNT',
	SkillName: '低价买进',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_INCCARRY, 3]]
};
SkillInfo[SK.DE_SLASH] = {
	Name: 'DE_SLASH',
	SkillName: '<死亡骑士>挥砍',
	MaxLv: 5,
	SpAmount: [10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_COIL] = {
	Name: 'DE_COIL',
	SkillName: '<死亡骑士>缠绕',
	MaxLv: 7,
	SpAmount: [8, 10, 12, 14, 16, 18, 20],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_WAVE] = {
	Name: 'DE_WAVE',
	SkillName: '<死亡骑士>冲击波',
	MaxLv: 7,
	SpAmount: [55, 50, 45, 40, 35, 30, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_REBIRTH] = {
	Name: 'DE_REBIRTH',
	SkillName: '<死亡骑士>能量重生',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_AURA] = {
	Name: 'DE_AURA',
	SkillName: '<死亡骑士>灵气',
	MaxLv: 7,
	SpAmount: [80, 75, 70, 65, 60, 55, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_FREEZER] = {
	Name: 'DE_FREEZER',
	SkillName: '<死亡骑士>冻结',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_CHANGEATTACK] = {
	Name: 'DE_CHANGEATTACK',
	SkillName: '<死亡骑士>转换攻击',
	MaxLv: 7,
	SpAmount: [80, 70, 60, 50, 40, 30, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_PUNISH] = {
	Name: 'DE_PUNISH',
	SkillName: '<死亡骑士>惩罚',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_POISON] = {
	Name: 'DE_POISON',
	SkillName: '<死亡骑士>剧毒刀刃',
	MaxLv: 7,
	SpAmount: [14, 12, 10, 8, 6, 4, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_INSTANT] = {
	Name: 'DE_INSTANT',
	SkillName: '<死亡骑士>紧急屏障',
	MaxLv: 7,
	SpAmount: [50, 100, 150, 200, 250, 300, 350],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_WARNING] = {
	Name: 'DE_WARNING',
	SkillName: '<死亡骑士>警告',
	MaxLv: 7,
	SpAmount: [50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_RANKEDKNIFE] = {
	Name: 'DE_RANKEDKNIFE',
	SkillName: '<死亡骑士>排刀',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.DE_RANKEDGRADIUS] = {
	Name: 'DE_RANKEDGRADIUS',
	SkillName: '<死亡骑士>排射',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_GAUGE] = {
	Name: 'DE_GAUGE',
	SkillName: '<死亡骑士>领域',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DE_GTIME] = {
	Name: 'DE_GTIME',
	SkillName: '<死亡骑士>时间冲击',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MC_OVERCHARGE] = {
	Name: 'MC_OVERCHARGE',
	SkillName: '高价卖出',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_DISCOUNT, 3]]
};
SkillInfo[SK.DE_GSKILL] = {
	Name: 'DE_GSKILL',
	SkillName: '<死亡骑士>技能冲击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_GKILL] = {
	Name: 'DE_GKILL',
	SkillName: '<死亡骑士>死亡冲击',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_ACCEL] = {
	Name: 'DE_ACCEL',
	SkillName: '<死亡骑士>加速',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_BLOCKDOUBLE] = {
	Name: 'DE_BLOCKDOUBLE',
	SkillName: '<死亡骑士>双重防御',
	MaxLv: 3,
	SpAmount: [40, 30, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_BLOCKMELEE] = {
	Name: 'DE_BLOCKMELEE',
	SkillName: '<死亡骑士>近身防御',
	MaxLv: 3,
	SpAmount: [40, 30, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_BLOCKFAR] = {
	Name: 'DE_BLOCKFAR',
	SkillName: '<死亡骑士>远程防御',
	MaxLv: 3,
	SpAmount: [100, 75, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DE_FRONTATTACK] = {
	Name: 'DE_FRONTATTACK',
	SkillName: '<死亡骑士>前方攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_DANGERATTACK] = {
	Name: 'DE_DANGERATTACK',
	SkillName: '<死亡骑士>威胁攻击',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_TWINATTACK] = {
	Name: 'DE_TWINATTACK',
	SkillName: '<死亡骑士>危险攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_WINDATTACK] = {
	Name: 'DE_WINDATTACK',
	SkillName: '<死亡骑士>暴风攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DE_WATERATTACK] = {
	Name: 'DE_WATERATTACK',
	SkillName: '<死亡骑士>水攻击',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_ENERGY] = {
	Name: 'DA_ENERGY',
	SkillName: '<黑暗搜集者>能量',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_CLOUD] = {
	Name: 'DA_CLOUD',
	SkillName: '<黑暗搜集者>暗云',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_FIRSTSLOT] = {
	Name: 'DA_FIRSTSLOT',
	SkillName: '<黑暗搜集者>最初幻想',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_HEADDEF] = {
	Name: 'DA_HEADDEF',
	SkillName: '<黑暗搜集者>头部防御',
	MaxLv: 4,
	SpAmount: [60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9]
};
SkillInfo[SK.MC_PUSHCART] = {
	Name: 'MC_PUSHCART',
	SkillName: '手推车使用',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_INCCARRY, 5]]
};
SkillInfo[SK.DA_TRANSFORM] = {
	Name: 'DA_TRANSFORM',
	SkillName: '<黑暗搜集者>变形',
	MaxLv: 5,
	SpAmount: [180, 150, 120, 90, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_EXPLOSION] = {
	Name: 'DA_EXPLOSION',
	SkillName: '<黑暗搜集者>变形',
	MaxLv: 5,
	SpAmount: [140, 120, 100, 80, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_REWARD] = {
	Name: 'DA_REWARD',
	SkillName: '<黑暗搜集者>奖励',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_CRUSH] = {
	Name: 'DA_CRUSH',
	SkillName: '<黑暗搜集者>冲撞',
	MaxLv: 5,
	SpAmount: [130, 110, 90, 70, 50],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_ITEMREBUILD] = {
	Name: 'DA_ITEMREBUILD',
	SkillName: '<黑暗搜集者>物品重组',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_ILLUSION] = {
	Name: 'DA_ILLUSION',
	SkillName: '<黑暗搜集者>幻觉',
	MaxLv: 5,
	SpAmount: [120, 100, 80, 60, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_NUETRALIZE] = {
	Name: 'DA_NUETRALIZE',
	SkillName: '<黑暗搜集者>中和',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_RUNNER] = {
	Name: 'DA_RUNNER',
	SkillName: '<黑暗搜集者>奔跑',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.DA_TRANSFER] = {
	Name: 'DA_TRANSFER',
	SkillName: '<黑暗搜集者>转移',
	MaxLv: 5,
	SpAmount: [70, 60, 50, 40, 30],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.DA_WALL] = {
	Name: 'DA_WALL',
	SkillName: '<黑暗搜集者>墙',
	MaxLv: 5,
	SpAmount: [10, 20, 30, 40, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.RETURN_TO_ELDICASTES] = {
	Name: 'RETURN_TO_ELDICASTES',
	SkillName: '返回艾尔迪卡斯特',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_REVENGE] = {
	Name: 'DA_REVENGE',
	SkillName: '<黑暗搜集者>复仇',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_EARPLUG] = {
	Name: 'DA_EARPLUG',
	SkillName: '<黑暗搜集者>耳塞',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_CONTRACT] = {
	Name: 'DA_CONTRACT',
	SkillName: '<黑暗搜集者>宝石契约',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_BLACK] = {
	Name: 'DA_BLACK',
	SkillName: '<黑暗搜集者>宝石魔法',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MC_IDENTIFY] = {
	Name: 'MC_IDENTIFY',
	SkillName: '物品鉴定',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_MAGICCART] = {
	Name: 'DA_MAGICCART',
	SkillName: '<黑暗搜集者>魔法手推车',
	MaxLv: 5,
	SpAmount: [50, 40, 30, 20, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_COPY] = {
	Name: 'DA_COPY',
	SkillName: '<黑暗搜集者>复制',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_CRYSTAL] = {
	Name: 'DA_CRYSTAL',
	SkillName: '<黑暗搜集者>暴击',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_EXP] = {
	Name: 'DA_EXP',
	SkillName: '<黑暗搜集者>经验值',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_CARTSWING] = {
	Name: 'DA_CARTSWING',
	SkillName: '<黑暗搜集者>魔法手推车冲撞',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_REBUILD] = {
	Name: 'DA_REBUILD',
	SkillName: '<黑暗搜集者>人体重建',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DA_JOBCHANGE] = {
	Name: 'DA_JOBCHANGE',
	SkillName: '<黑暗搜集者>新手更换职业',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_EDARKNESS] = {
	Name: 'DA_EDARKNESS',
	SkillName: '<黑暗搜集者>华丽金属黑暗',
	MaxLv: 5,
	SpAmount: [1100, 900, 700, 500, 300],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.DA_EGUARDIAN] = {
	Name: 'DA_EGUARDIAN',
	SkillName: '<黑暗搜集者>华丽金属守卫',
	MaxLv: 5,
	SpAmount: [1300, 1100, 900, 700, 500],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_TIMEOUT] = {
	Name: 'DA_TIMEOUT',
	SkillName: 'Time Out',
	MaxLv: 3,
	SpAmount: [500, 300, 100],
	bSeperateLv: false,
	AttackRange: [9, 9, 9]
};
SkillInfo[SK.ALL_TIMEIN] = {
	Name: 'ALL_TIMEIN',
	SkillName: '准时',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_ZENYRANK] = {
	Name: 'DA_ZENYRANK',
	SkillName: '<黑暗搜集者>排列',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DA_ACCESSORYMIX] = {
	Name: 'DA_ACCESSORYMIX',
	SkillName: '<黑暗搜集者>组装',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.NPC_EARTHQUAKE] = {
	Name: 'NPC_EARTHQUAKE',
	SkillName: '地震连系',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27],
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27]
	]
};
SkillInfo[SK.NPC_EARTHQUAKE_K] = {
	Name: 'NPC_EARTHQUAKE_K',
	SkillName: 'Earthquake',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27],
		[11, 11],
		[15, 15],
		[19, 19],
		[23, 23],
		[27, 27]
	]
};
SkillInfo[SK.EL_CIRCLE_OF_FIRE] = {
	Name: 'EL_CIRCLE_OF_FIRE',
	SkillName: '烈焰之环',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MC_VENDING] = {
	Name: 'MC_VENDING',
	SkillName: '露天商店',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MC_PUSHCART, 3]]
};
SkillInfo[SK.EL_TIDAL_WEAPON] = {
	Name: 'EL_TIDAL_WEAPON',
	SkillName: '海啸武器',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.NPC_DRAGONFEAR] = {
	Name: 'NPC_DRAGONFEAR',
	SkillName: '天龙恐惧',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [6, 6, 6, 6, 6],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_PULSESTRIKE2] = {
	Name: 'NPC_PULSESTRIKE2',
	SkillName: 'Pulse Strike',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[11, 11]]
};
SkillInfo[SK.NPC_PULSESTRIKE] = {
	Name: 'NPC_PULSESTRIKE',
	SkillName: '脉震冲撞',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[15, 15],
		[15, 15],
		[15, 15],
		[15, 15],
		[15, 15]
	]
};
SkillInfo[SK.NPC_HELLJUDGEMENT] = {
	Name: 'NPC_HELLJUDGEMENT',
	SkillName: "Hell's Judgement",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESILENCE] = {
	Name: 'NPC_WIDESILENCE',
	SkillName: '广范围沉默',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEFREEZE] = {
	Name: 'NPC_WIDEFREEZE',
	SkillName: '广范围冰冻',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEBLEEDING] = {
	Name: 'NPC_WIDEBLEEDING',
	SkillName: '广范围出血',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTONE] = {
	Name: 'NPC_WIDESTONE',
	SkillName: "Medusa's Stare",
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECONFUSE] = {
	Name: 'NPC_WIDECONFUSE',
	SkillName: '广范围混乱',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESLEEP] = {
	Name: 'NPC_WIDESLEEP',
	SkillName: '广范围睡眠',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_EVILLAND] = {
	Name: 'NPC_EVILLAND',
	SkillName: '邪降',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[29, 29]
	]
};
SkillInfo[SK.MC_MAMMONITE] = {
	Name: 'MC_MAMMONITE',
	SkillName: '金钱攻击',
	MaxLv: 10,
	SpAmount: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_SLOWCAST] = {
	Name: 'NPC_SLOWCAST',
	SkillName: '减缓咏唱',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_CRITICALWOUND] = {
	Name: 'NPC_CRITICALWOUND',
	SkillName: '致命伤口',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7]
};
SkillInfo[SK.NPC_STONESKIN] = {
	Name: 'NPC_STONESKIN',
	SkillName: '钢筋铁骨',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_ANTIMAGIC] = {
	Name: 'NPC_ANTIMAGIC',
	SkillName: '反魔法',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_WIDECURSE] = {
	Name: 'NPC_WIDECURSE',
	SkillName: '广范围诅咒',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTUN] = {
	Name: 'NPC_WIDESTUN',
	SkillName: '广范围晕眩',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_VAMPIRE_GIFT] = {
	Name: 'NPC_VAMPIRE_GIFT',
	SkillName: "Vampire's Gift",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_WIDESOULDRAIN] = {
	Name: 'NPC_WIDESOULDRAIN',
	SkillName: '法力燃烧',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ALL_INCCARRY] = {
	Name: 'ALL_INCCARRY',
	SkillName: '负重量上升R',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_HELLPOWER] = {
	Name: 'NPC_HELLPOWER',
	SkillName: "Hell's Power",
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.AC_OWL] = {
	Name: 'AC_OWL',
	SkillName: "Owl's Eye",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GM_SANDMAN] = {
	Name: 'GM_SANDMAN',
	SkillName: '摇篮曲',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.ALL_CATCRY] = {
	Name: 'ALL_CATCRY',
	SkillName: "Monster's Cry",
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_PARTYFLEE] = {
	Name: 'ALL_PARTYFLEE',
	SkillName: '吹吧! 花风!!',
	MaxLv: 10,
	SpAmount: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ALL_ANGEL_PROTECT] = {
	Name: 'ALL_ANGEL_PROTECT',
	SkillName: '感谢您!',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.ALL_DREAM_SUMMERNIGHT] = {
	Name: 'ALL_DREAM_SUMMERNIGHT',
	SkillName: '仲夏夜之梦',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_REVERSEORCISH] = {
	Name: 'ALL_REVERSEORCISH',
	SkillName: '变成兽人面孔',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_WEWISH] = {
	Name: 'ALL_WEWISH',
	SkillName: "Sing along with the Singing Crystal's tune:",
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AC_VULTURE] = {
	Name: 'AC_VULTURE',
	SkillName: "Vulture's Eye",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AC_OWL, 3]],
	NeedSkillList: { [JobId.ROGUE]: [] }
};
SkillInfo[SK.AC_CONCENTRATION] = {
	Name: 'AC_CONCENTRATION',
	SkillName: '心神凝聚',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AC_VULTURE, 1]]
};
SkillInfo[SK.AC_DOUBLE] = {
	Name: 'AC_DOUBLE',
	SkillName: '二连矢',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	NeedSkillList: { [JobId.ROGUE]: [[SK.AC_VULTURE, 10]] }
};
SkillInfo[SK.HLIF_HEAL] = {
	Name: 'HLIF_HEAL',
	SkillName: '治愈之手',
	MaxLv: 5,
	SpAmount: [13, 16, 19, 22, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HFLI_MOON] = {
	Name: 'HFLI_MOON',
	SkillName: '月光',
	MaxLv: 5,
	SpAmount: [4, 8, 12, 16, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_XENO_SLASHER] = {
	Name: 'MH_XENO_SLASHER',
	SkillName: '血腥魔刀',
	MaxLv: 10,
	SpAmount: [85, 90, 95, 100, 105, 110, 115, 120, 125, 130],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.MH_STEINWAND] = {
	Name: 'MH_STEINWAND',
	SkillName: '岩壁',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_LAVA_SLIDE] = {
	Name: 'MH_LAVA_SLIDE',
	SkillName: '熔岩滑动',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.AC_SHOWER] = {
	Name: 'AC_SHOWER',
	SkillName: '箭雨',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AC_DOUBLE, 5]]
};
SkillInfo[SK.GD_KAFRACONTRACT] = {
	Name: 'GD_KAFRACONTRACT',
	SkillName: '和卡普拉订契约',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SM_TWOHAND] = {
	Name: 'SM_TWOHAND',
	SkillName: '双手剑使用熟练度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_SWORD, 1]]
};
SkillInfo[SK.TF_DOUBLE] = {
	Name: 'TF_DOUBLE',
	SkillName: '二刀连击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MA_LANDMINE] = {
	Name: 'MA_LANDMINE',
	SkillName: '地雷陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MER_REGAIN] = {
	Name: 'MER_REGAIN',
	SkillName: '恢复',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_FIRE_CLOAK] = {
	Name: 'EL_FIRE_CLOAK',
	SkillName: '火焰斗篷',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TF_MISS] = {
	Name: 'TF_MISS',
	SkillName: '残影',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_WIND_SLASH] = {
	Name: 'EL_WIND_SLASH',
	SkillName: '风之刃',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.TF_STEAL] = {
	Name: 'TF_STEAL',
	SkillName: '偷窃',
	MaxLv: 10,
	SpAmount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.TF_HIDING] = {
	Name: 'TF_HIDING',
	SkillName: '隐匿',
	MaxLv: 10,
	SpAmount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_STEAL, 5]]
};
SkillInfo[SK.TF_POISON] = {
	Name: 'TF_POISON',
	SkillName: '施毒',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.TF_DETOXIFY] = {
	Name: 'TF_DETOXIFY',
	SkillName: '解毒',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.TF_POISON, 3]]
};
SkillInfo[SK.ALL_RESURRECTION] = {
	Name: 'ALL_RESURRECTION',
	SkillName: '复活术',
	MaxLv: 4,
	SpAmount: [60, 60, 60, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 4],
		[SK.PR_STRECOVERY, 1]
	]
};
SkillInfo[SK.KN_SPEARMASTERY] = {
	Name: 'KN_SPEARMASTERY',
	SkillName: '长矛使用熟练度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_GUARDRESEARCH] = {
	Name: 'GD_GUARDRESEARCH',
	SkillName: '研究监护人',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KN_PIERCE] = {
	Name: 'KN_PIERCE',
	SkillName: '连刺攻击',
	MaxLv: 10,
	SpAmount: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 1]]
};
SkillInfo[SK.MA_SANDMAN] = {
	Name: 'MA_SANDMAN',
	SkillName: '睡魔陷阱',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MER_TENDER] = {
	Name: 'MER_TENDER',
	SkillName: '补给',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_FIRE_MANTLE] = {
	Name: 'EL_FIRE_MANTLE',
	SkillName: '火焰披风',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KN_BRANDISHSPEAR] = {
	Name: 'KN_BRANDISHSPEAR',
	SkillName: '骑乘攻击',
	MaxLv: 10,
	SpAmount: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.KN_RIDING, 1],
		[SK.KN_SPEARSTAB, 3]
	]
};
SkillInfo[SK.EL_HURRICANE] = {
	Name: 'EL_HURRICANE',
	SkillName: '飓风肆虐',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.KN_SPEARSTAB] = {
	Name: 'KN_SPEARSTAB',
	SkillName: '长矛刺击',
	MaxLv: 10,
	SpAmount: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	_NeedSkillList: [[SK.KN_PIERCE, 5]]
};
SkillInfo[SK.KN_SPEARBOOMERANG] = {
	Name: 'KN_SPEARBOOMERANG',
	SkillName: '投掷长矛攻击',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 5, 7, 9, 11],
	_NeedSkillList: [[SK.KN_PIERCE, 3]]
};
SkillInfo[SK.KN_TWOHANDQUICKEN] = {
	Name: 'KN_TWOHANDQUICKEN',
	SkillName: '双手剑攻击速度增加',
	MaxLv: 10,
	SpAmount: [14, 18, 22, 26, 30, 34, 38, 42, 46, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_TWOHAND, 1]]
};
SkillInfo[SK.KN_AUTOCOUNTER] = {
	Name: 'KN_AUTOCOUNTER',
	SkillName: '反击',
	MaxLv: 5,
	SpAmount: [3, 3, 3, 3, 3],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_TWOHAND, 1]]
};
SkillInfo[SK.KN_BOWLINGBASH] = {
	Name: 'KN_BOWLINGBASH',
	SkillName: '怪物互击',
	MaxLv: 10,
	SpAmount: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SM_BASH, 10],
		[SK.SM_MAGNUM, 3],
		[SK.SM_TWOHAND, 5],
		[SK.KN_TWOHANDQUICKEN, 10],
		[SK.KN_AUTOCOUNTER, 5]
	],
	NeedSkillList: { [JobId.SUPERNOVICE2]: [[SK.KN_AUTOCOUNTER, 5]] }
};
SkillInfo[SK.KN_CHARGEATK] = {
	Name: 'KN_CHARGEATK',
	SkillName: '冲锋攻击',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [14]
};
SkillInfo[SK.CR_SHRINK] = {
	Name: 'CR_SHRINK',
	SkillName: '退缩',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AS_SONICACCEL] = {
	Name: 'AS_SONICACCEL',
	SkillName: '超音速投掷',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AS_VENOMKNIFE] = {
	Name: 'AS_VENOMKNIFE',
	SkillName: '毒刃',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [35],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.RG_CLOSECONFINE] = {
	Name: 'RG_CLOSECONFINE',
	SkillName: '紧密的约束',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [2]
};
SkillInfo[SK.WZ_SIGHTBLASTER] = {
	Name: 'WZ_SIGHTBLASTER',
	SkillName: '火狩芽',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KN_RIDING] = {
	Name: 'KN_RIDING',
	SkillName: '骑乘术',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SM_ENDURE, 1]]
};
SkillInfo[SK.SA_ELEMENTWATER] = {
	Name: 'SA_ELEMENTWATER',
	SkillName: '元素更换(水)',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.HT_PHANTASMIC] = {
	Name: 'HT_PHANTASMIC',
	SkillName: '幻影箭',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BA_PANGVOICE] = {
	Name: 'BA_PANGVOICE',
	SkillName: '阵痛之声',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.DC_WINKCHARM] = {
	Name: 'DC_WINKCHARM',
	SkillName: '眨眼之诱',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BS_UNFAIRLYTRICK] = {
	Name: 'BS_UNFAIRLYTRICK',
	SkillName: '诡计的商术',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_GREED] = {
	Name: 'BS_GREED',
	SkillName: '贪婪',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PR_REDEMPTIO] = {
	Name: 'PR_REDEMPTIO',
	SkillName: '舍身取义',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [800],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MO_KITRANSLATION] = {
	Name: 'MO_KITRANSLATION',
	SkillName: '振气注入',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MO_BALKYOUNG] = {
	Name: 'MO_BALKYOUNG',
	SkillName: '发劲',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SA_ELEMENTGROUND] = {
	Name: 'SA_ELEMENTGROUND',
	SkillName: '元素更换(地)',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SA_ELEMENTFIRE] = {
	Name: 'SA_ELEMENTFIRE',
	SkillName: '元素更换(火)',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SA_ELEMENTWIND] = {
	Name: 'SA_ELEMENTWIND',
	SkillName: '元素更换(风)',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SM_RECOVERY] = {
	Name: 'SM_RECOVERY',
	SkillName: '快速回复',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.KN_CAVALIERMASTERY] = {
	Name: 'KN_CAVALIERMASTERY',
	SkillName: '骑兵修练',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_RIDING, 1]]
};
SkillInfo[SK.AB_HIGHNESSHEAL] = {
	Name: 'AB_HIGHNESSHEAL',
	SkillName: '高阶治愈术',
	MaxLv: 5,
	SpAmount: [70, 100, 130, 160, 190],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_RENOVATIO, 1]]
};
SkillInfo[SK.AB_DUPLELIGHT_MELEE] = {
	Name: 'AB_DUPLELIGHT_MELEE',
	SkillName: '二道圣光',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11]
};
SkillInfo[SK.MER_BENEDICTION] = {
	Name: 'MER_BENEDICTION',
	SkillName: '祝福',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.PR_MACEMASTERY] = {
	Name: 'PR_MACEMASTERY',
	SkillName: '令牌使用熟练度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_WATER_SCREEN] = {
	Name: 'EL_WATER_SCREEN',
	SkillName: '水之守护',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PR_IMPOSITIO] = {
	Name: 'PR_IMPOSITIO',
	SkillName: '神威祈福',
	MaxLv: 5,
	SpAmount: [59, 62, 65, 68, 71],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_HURRICANE_ATK] = {
	Name: 'EL_HURRICANE_ATK',
	SkillName: '飓风肆虐',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.PR_SUFFRAGIUM] = {
	Name: 'PR_SUFFRAGIUM',
	SkillName: '牺牲祈福',
	MaxLv: 3,
	SpAmount: [8, 8, 8],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.PR_IMPOSITIO, 2]]
};
SkillInfo[SK.PR_ASPERSIO] = {
	Name: 'PR_ASPERSIO',
	SkillName: '撒水祈福',
	MaxLv: 5,
	SpAmount: [14, 18, 22, 26, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AL_HOLYWATER, 1],
		[SK.PR_IMPOSITIO, 3]
	]
};
SkillInfo[SK.PR_BENEDICTIO] = {
	Name: 'PR_BENEDICTIO',
	SkillName: '圣之祈福',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.PR_ASPERSIO, 5],
		[SK.PR_GLORIA, 3]
	]
};
SkillInfo[SK.WL_SIENNAEXECRATE] = {
	Name: 'WL_SIENNAEXECRATE',
	SkillName: '石化诅咒',
	MaxLv: 5,
	SpAmount: [32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.WL_SUMMONSTONE, 1]]
};
SkillInfo[SK.WL_CRIMSONROCK] = {
	Name: 'WL_CRIMSONROCK',
	SkillName: '碧血陨石',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SUMMONFB, 1]]
};
SkillInfo[SK.WL_SUMMONBL] = {
	Name: 'WL_SUMMONBL',
	SkillName: '召唤雷电球',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_VERMILION, 1]]
};
SkillInfo[SK.WL_READING_SB] = {
	Name: 'WL_READING_SB',
	SkillName: '阅读魔法书',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WL_READING_SB_READING] = {
	Name: 'WL_READING_SB_READING',
	SkillName: 'Reading Spell Book',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.PR_SANCTUARY] = {
	Name: 'PR_SANCTUARY',
	SkillName: '光耀之堂',
	MaxLv: 10,
	SpAmount: [15, 18, 21, 24, 27, 30, 33, 36, 39, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_HEAL, 1]]
};
SkillInfo[SK.RA_CLUSTERBOMB] = {
	Name: 'RA_CLUSTERBOMB',
	SkillName: '榴霰弹',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 3]]
};
SkillInfo[SK.RA_WUGSTRIKE] = {
	Name: 'RA_WUGSTRIKE',
	SkillName: '狼突击',
	MaxLv: 5,
	SpAmount: [20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_TOOTHOFWUG, 1]]
};
SkillInfo[SK.RA_CAMOUFLAGE] = {
	Name: 'RA_CAMOUFLAGE',
	SkillName: '伪装战术',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_RANGERMAIN, 1]]
};
SkillInfo[SK.RA_MAIZETRAP] = {
	Name: 'RA_MAIZETRAP',
	SkillName: '浅黄陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.NC_MADOLICENCE] = {
	Name: 'NC_MADOLICENCE',
	SkillName: '魔导机甲执照',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.NC_FLAMELAUNCHER] = {
	Name: 'NC_FLAMELAUNCHER',
	SkillName: '火焰属性附加',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: true,
	AttackRange: [5, 5, 5],
	_NeedSkillList: [[SK.NC_VULCANARM, 1]]
};
SkillInfo[SK.NC_HOVERING] = {
	Name: 'NC_HOVERING',
	SkillName: '悬停',
	MaxLv: 1,
	SpAmount: [25],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_ACCELERATION, 1]]
};
SkillInfo[SK.PR_SLOWPOISON] = {
	Name: 'PR_SLOWPOISON',
	SkillName: '缓毒术',
	MaxLv: 4,
	SpAmount: [6, 8, 10, 12],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9]
};
SkillInfo[SK.NC_ANALYZE] = {
	Name: 'NC_ANALYZE',
	SkillName: '解析',
	MaxLv: 3,
	SpAmount: [30, 30, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.NC_INFRAREDSCAN, 1]]
};
SkillInfo[SK.NC_REPAIR] = {
	Name: 'NC_REPAIR',
	SkillName: '修复',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 2]]
};
SkillInfo[SK.NC_POWERSWING] = {
	Name: 'NC_POWERSWING',
	SkillName: '挥斧重击',
	MaxLv: 10,
	SpAmount: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.NC_AXEBOOMERANG, 3]]
};
SkillInfo[SK.NC_DISJOINT] = {
	Name: 'NC_DISJOINT',
	SkillName: 'FAW解体',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [5],
	_NeedSkillList: [[SK.NC_SILVERSNIPER, 1]]
};
SkillInfo[SK.SC_SHADOWFORM] = {
	Name: 'SC_SHADOWFORM',
	SkillName: '魅影形态',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.RG_TUNNELDRIVE, 3]]
};
SkillInfo[SK.SC_DEADLYINFECT] = {
	Name: 'SC_DEADLYINFECT',
	SkillName: '致命感染',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_SHADOWFORM, 3],
		[SK.SC_AUTOSHADOWSPELL, 5]
	]
};
SkillInfo[SK.SC_LAZINESS] = {
	Name: 'SC_LAZINESS',
	SkillName: '面具:懒散',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [
		[SK.SC_ENERVATION, 1],
		[SK.SC_GROOMY, 1],
		[SK.SC_IGNORANCE, 1]
	]
};
SkillInfo[SK.PR_STRECOVERY] = {
	Name: 'PR_STRECOVERY',
	SkillName: '痊愈术',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.SC_BLOODYLUST] = {
	Name: 'SC_BLOODYLUST',
	SkillName: '血腥欲望',
	MaxLv: 3,
	SpAmount: [60, 70, 80],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.SC_DIMENSIONDOOR, 3]]
};
SkillInfo[SK.LG_CANNONSPEAR] = {
	Name: 'LG_CANNONSPEAR',
	SkillName: '加农炮攻击',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.LG_PINPOINTATTACK, 1]]
};
SkillInfo[SK.LG_REFLECTDAMAGE] = {
	Name: 'LG_REFLECTDAMAGE',
	SkillName: '反射伤害',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_REFLECTSHIELD, 5]]
};
SkillInfo[SK.LG_SHIELDSPELL] = {
	Name: 'LG_SHIELDSPELL',
	SkillName: '盾咒',
	MaxLv: 3,
	SpAmount: [50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.LG_SHIELDPRESS, 3],
		[SK.LG_EARTHDRIVE, 2]
	]
};
SkillInfo[SK.LG_BANDING] = {
	Name: 'LG_BANDING',
	SkillName: '聚集',
	MaxLv: 5,
	SpAmount: [30, 36, 42, 48, 54],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.LG_PINPOINTATTACK, 3],
		[SK.LG_RAGEBURST, 1]
	]
};
SkillInfo[SK.LG_EARTHDRIVE] = {
	Name: 'LG_EARTHDRIVE',
	SkillName: '大地毁灭',
	MaxLv: 5,
	SpAmount: [52, 60, 68, 76, 84],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_REFLECTDAMAGE, 3]]
};
SkillInfo[SK.SR_SKYNETBLOW] = {
	Name: 'SR_SKYNETBLOW',
	SkillName: '天罗地网',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_DRAGONCOMBO, 3]]
};
SkillInfo[SK.PR_KYRIE] = {
	Name: 'PR_KYRIE',
	SkillName: '霸邪之阵',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 25, 25, 25, 30, 30, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AL_ANGELUS, 2]]
};
SkillInfo[SK.SR_LIGHTNINGWALK] = {
	Name: 'SR_LIGHTNINGWALK',
	SkillName: '闪电步',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_WINDMILL, 1]]
};
SkillInfo[SK.SR_GATEOFHELL] = {
	Name: 'SR_GATEOFHELL',
	SkillName: '罗?破凰击',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SR_TIGERCANNON, 5],
		[SK.SR_RAMPAGEBLASTER, 1]
	]
};
SkillInfo[SK.SR_GENTLETOUCH_CHANGE] = {
	Name: 'SR_GENTLETOUCH_CHANGE',
	SkillName: '点穴-反',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SR_GENTLETOUCH_QUIET, 1],
		[SK.SR_GENTLETOUCH_CURE, 1],
		[SK.SR_GENTLETOUCH_ENERGYGAIN, 3]
	]
};
SkillInfo[SK.WA_SYMPHONY_OF_LOVER] = {
	Name: 'WA_SYMPHONY_OF_LOVER',
	SkillName: '恋人交响乐',
	MaxLv: 5,
	SpAmount: [60, 69, 78, 87, 96],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.PR_MAGNIFICAT] = {
	Name: 'PR_MAGNIFICAT',
	SkillName: '圣母之颂歌',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MI_HARMONIZE] = {
	Name: 'MI_HARMONIZE',
	SkillName: '和声演奏',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.PR_GLORIA] = {
	Name: 'PR_GLORIA',
	SkillName: '幸运之颂歌',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.PR_KYRIE, 4],
		[SK.PR_MAGNIFICAT, 3]
	],
	NeedSkillList: { [JobId.SUPERNOVICE2]: [[SK.PR_SANCTUARY, 7]] }
};
SkillInfo[SK.WM_POEMOFNETHERWORLD] = {
	Name: 'WM_POEMOFNETHERWORLD',
	SkillName: '绝望之歌',
	MaxLv: 5,
	SpAmount: [12, 16, 20, 24, 28],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_LESSON, 1]]
};
SkillInfo[SK.WM_SIRCLEOFNATURE] = {
	Name: 'WM_SIRCLEOFNATURE',
	SkillName: '循环的大自然之音',
	MaxLv: 5,
	SpAmount: [42, 46, 50, 54, 58],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LESSON, 1]]
};
SkillInfo[SK.PR_LEXDIVINA] = {
	Name: 'PR_LEXDIVINA',
	SkillName: '沉默之术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 18, 16, 14, 12, 10],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.AL_RUWACH, 1]]
};
SkillInfo[SK.WM_LERADS_DEW] = {
	Name: 'WM_LERADS_DEW',
	SkillName: "Lerad's Dew",
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.MINSTREL]: [
			[SK.MI_HARMONIZE, 1],
			[SK.MI_RUSH_WINDMILL, 1],
			[SK.MI_ECHOSONG, 1]
		],
		[JobId.WANDERER]: [
			[SK.WA_SWING_DANCE, 1],
			[SK.WA_SYMPHONY_OF_LOVER, 1],
			[SK.WA_MOONLIT_SERENADE, 1]
		]
	}
};
SkillInfo[SK.SO_FIREWALK] = {
	Name: 'SO_FIREWALK',
	SkillName: '火焰步',
	MaxLv: 5,
	SpAmount: [30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_VOLCANO, 1]]
};
SkillInfo[SK.SO_DIAMONDDUST] = {
	Name: 'SO_DIAMONDDUST',
	SkillName: '钻石星尘',
	MaxLv: 5,
	SpAmount: [50, 56, 62, 68, 74],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_DELUGE, 3]]
};
SkillInfo[SK.SO_STRIKING] = {
	Name: 'SO_STRIKING',
	SkillName: '打击强化',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_FLAMELAUNCHER, 1],
		[SK.SA_FROSTWEAPON, 1],
		[SK.SA_LIGHTNINGLOADER, 1],
		[SK.SA_SEISMICWEAPON, 1]
	]
};
SkillInfo[SK.SO_ARRULLO] = {
	Name: 'SO_ARRULLO',
	SkillName: '摇篮曲',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 9],
	_NeedSkillList: [[SK.SO_WARMER, 2]]
};
SkillInfo[SK.PR_TURNUNDEAD] = {
	Name: 'PR_TURNUNDEAD',
	SkillName: '转生术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [
		[SK.ALL_RESURRECTION, 1],
		[SK.PR_LEXDIVINA, 3]
	]
};
SkillInfo[SK.SO_EL_SYMPATHY] = {
	Name: 'SO_EL_SYMPATHY',
	SkillName: '精灵交流',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_CONTROL, 3]]
};
SkillInfo[SK.SO_WIND_INSIGNIA] = {
	Name: 'SO_WIND_INSIGNIA',
	SkillName: '风之纹章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_VENTUS, 3]]
};
SkillInfo[SK.GN_REMODELING_CART] = {
	Name: 'GN_REMODELING_CART',
	SkillName: '手推车改良',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GN_THORNS_TRAP] = {
	Name: 'GN_THORNS_TRAP',
	SkillName: '荆棘陷阱',
	MaxLv: 5,
	SpAmount: [22, 26, 30, 34, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 2]]
};
SkillInfo[SK.GN_CRAZYWEED] = {
	Name: 'GN_CRAZYWEED',
	SkillName: '疯狂野草',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_WALLOFTHORN, 3]]
};
SkillInfo[SK.PR_LEXAETERNA] = {
	Name: 'PR_LEXAETERNA',
	SkillName: '天使之怒',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.PR_LEXDIVINA, 5]]
};
SkillInfo[SK.GN_MIX_COOKING] = {
	Name: 'GN_MIX_COOKING',
	SkillName: '调配料理',
	MaxLv: 2,
	SpAmount: [5, 40],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 1]]
};
SkillInfo[SK.GD_EXTENSION] = {
	Name: 'GD_EXTENSION',
	SkillName: '扩充组合体制',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AB_SECRAMENT] = {
	Name: 'AB_SECRAMENT',
	SkillName: '圣典',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_EXPIATIO, 1],
		[SK.AB_EPICLESIS, 1]
	]
};
SkillInfo[SK.PR_MAGNUS] = {
	Name: 'PR_MAGNUS',
	SkillName: '十字驱魔攻击',
	MaxLv: 10,
	SpAmount: [40, 42, 44, 46, 48, 50, 52, 54, 56, 58],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SAFETYWALL, 1],
		[SK.PR_LEXAETERNA, 1],
		[SK.PR_TURNUNDEAD, 3]
	]
};
SkillInfo[SK.ALL_BUYING_STORE] = {
	Name: 'ALL_BUYING_STORE',
	SkillName: '开设购买商店(BUYING STORE)',
	MaxLv: 2,
	SpAmount: [30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1]
};
SkillInfo[SK.SM_BASH] = {
	Name: 'SM_BASH',
	SkillName: '狂击',
	MaxLv: 10,
	SpAmount: [8, 8, 8, 8, 8, 15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WZ_FIREPILLAR] = {
	Name: 'WZ_FIREPILLAR',
	SkillName: '火柱攻击',
	MaxLv: 10,
	SpAmount: [75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_FIREWALL, 1]]
};
SkillInfo[SK.MA_REMOVETRAP] = {
	Name: 'MA_REMOVETRAP',
	SkillName: '陷阱移除',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [2]
};
SkillInfo[SK.MER_RECUPERATE] = {
	Name: 'MER_RECUPERATE',
	SkillName: '复原',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.WZ_SIGHTRASHER] = {
	Name: 'WZ_SIGHTRASHER',
	SkillName: '火之猎杀',
	MaxLv: 10,
	SpAmount: [35, 37, 39, 41, 43, 45, 47, 49, 51, 53],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SIGHT, 1],
		[SK.MG_LIGHTNINGBOLT, 1]
	]
};
SkillInfo[SK.EL_WATER_DROP] = {
	Name: 'EL_WATER_DROP',
	SkillName: '大豪雨',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WZ_FIREIVY] = {
	Name: 'WZ_FIREIVY',
	SkillName: '火焰藤蔓',
	MaxLv: 0,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: []
};
SkillInfo[SK.EL_TYPOON_MIS] = {
	Name: 'EL_TYPOON_MIS',
	SkillName: '台风飞弹',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.WZ_METEOR] = {
	Name: 'WZ_METEOR',
	SkillName: '陨石术',
	MaxLv: 10,
	SpAmount: [20, 24, 30, 34, 40, 44, 50, 54, 60, 64],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_THUNDERSTORM, 1],
		[SK.WZ_SIGHTRASHER, 2]
	]
};
SkillInfo[SK.WZ_JUPITEL] = {
	Name: 'WZ_JUPITEL',
	SkillName: '雷鸣术',
	MaxLv: 10,
	SpAmount: [20, 23, 26, 29, 32, 35, 38, 41, 44, 47],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_NAPALMBEAT, 1],
		[SK.MG_LIGHTNINGBOLT, 1]
	]
};
SkillInfo[SK.WZ_VERMILION] = {
	Name: 'WZ_VERMILION',
	SkillName: '怒雷强击',
	MaxLv: 10,
	SpAmount: [60, 64, 68, 72, 76, 80, 84, 88, 92, 96],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_THUNDERSTORM, 1],
		[SK.WZ_JUPITEL, 5]
	]
};
SkillInfo[SK.WZ_WATERBALL] = {
	Name: 'WZ_WATERBALL',
	SkillName: '水球术',
	MaxLv: 5,
	SpAmount: [15, 20, 20, 25, 25],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_COLDBOLT, 1],
		[SK.MG_LIGHTNINGBOLT, 1]
	]
};
SkillInfo[SK.WZ_ICEWALL] = {
	Name: 'WZ_ICEWALL',
	SkillName: '冰刃之墙',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_STONECURSE, 1],
		[SK.MG_FROSTDIVER, 1]
	]
};
SkillInfo[SK.WZ_FROSTNOVA] = {
	Name: 'WZ_FROSTNOVA',
	SkillName: '霜冻之术',
	MaxLv: 10,
	SpAmount: [45, 43, 41, 39, 37, 35, 33, 31, 29, 27],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_ICEWALL, 1]]
};
SkillInfo[SK.WZ_STORMGUST] = {
	Name: 'WZ_STORMGUST',
	SkillName: '暴风雪',
	MaxLv: 10,
	SpAmount: [78, 78, 78, 78, 78, 78, 78, 78, 78, 78],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_FROSTDIVER, 1],
		[SK.WZ_JUPITEL, 3]
	]
};
SkillInfo[SK.WZ_EARTHSPIKE] = {
	Name: 'WZ_EARTHSPIKE',
	SkillName: '地震术',
	MaxLv: 5,
	SpAmount: [14, 18, 22, 26, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_STONECURSE, 1]],
	NeedSkillList: { [JobId.SAGE]: [[SK.SA_SEISMICWEAPON, 1]] }
};
SkillInfo[SK.WZ_HEAVENDRIVE] = {
	Name: 'WZ_HEAVENDRIVE',
	SkillName: "Heaven's Drive",
	MaxLv: 5,
	SpAmount: [28, 32, 36, 40, 44],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_EARTHSPIKE, 3]],
	NeedSkillList: { [JobId.SAGE]: [[SK.WZ_EARTHSPIKE, 1]] }
};
SkillInfo[SK.WZ_QUAGMIRE] = {
	Name: 'WZ_QUAGMIRE',
	SkillName: '泥沼地',
	MaxLv: 5,
	SpAmount: [5, 10, 15, 20, 25],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_HEAVENDRIVE, 1]]
};
SkillInfo[SK.WZ_ESTIMATION] = {
	Name: 'WZ_ESTIMATION',
	SkillName: '怪物情报',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.HLIF_BRAIN] = {
	Name: 'HLIF_BRAIN',
	SkillName: '脑手术',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HFLI_SPEED] = {
	Name: 'HFLI_SPEED',
	SkillName: '紧急回避',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_NEEDLE_OF_PARALYZE] = {
	Name: 'MH_NEEDLE_OF_PARALYZE',
	SkillName: '麻痹针',
	MaxLv: 10,
	SpAmount: [42, 48, 54, 60, 66, 72, 78, 84, 90, 96],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
};
SkillInfo[SK.MH_STYLE_CHANGE] = {
	Name: 'MH_STYLE_CHANGE',
	SkillName: '转换型态',
	MaxLv: 1,
	SpAmount: [35],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MH_ANGRIFFS_MODUS] = {
	Name: 'MH_ANGRIFFS_MODUS',
	SkillName: '攻击准备',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_VOLCANIC_ASH] = {
	Name: 'MH_VOLCANIC_ASH',
	SkillName: '火山灰',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7]
};
SkillInfo[SK.BS_IRON] = {
	Name: 'BS_IRON',
	SkillName: '铁制造',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_GLORYGUILD] = {
	Name: 'GD_GLORYGUILD',
	SkillName: '公会荣耀',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.BS_STEEL] = {
	Name: 'BS_STEEL',
	SkillName: '钢制造',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_IRON, 1]]
};
SkillInfo[SK.SM_PROVOKE] = {
	Name: 'SM_PROVOKE',
	SkillName: '挑衅',
	MaxLv: 10,
	SpAmount: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.BS_ENCHANTEDSTONE] = {
	Name: 'BS_ENCHANTEDSTONE',
	SkillName: '属性石制造',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_IRON, 1]]
};
SkillInfo[SK.MA_CHARGEARROW] = {
	Name: 'MA_CHARGEARROW',
	SkillName: '冲锋箭',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MER_MENTALCURE] = {
	Name: 'MER_MENTALCURE',
	SkillName: '精神治愈',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BS_ORIDEOCON] = {
	Name: 'BS_ORIDEOCON',
	SkillName: '神之金属研究',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_ENCHANTEDSTONE, 1]]
};
SkillInfo[SK.EL_WATER_BARRIER] = {
	Name: 'EL_WATER_BARRIER',
	SkillName: '水之屏障',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_DAGGER] = {
	Name: 'BS_DAGGER',
	SkillName: '短剑制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.EL_TYPOON_MIS_ATK] = {
	Name: 'EL_TYPOON_MIS_ATK',
	SkillName: '台风飞弹',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [11]
};
SkillInfo[SK.BS_SWORD] = {
	Name: 'BS_SWORD',
	SkillName: '剑制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_DAGGER, 1]]
};
SkillInfo[SK.BS_TWOHANDSWORD] = {
	Name: 'BS_TWOHANDSWORD',
	SkillName: '双手剑制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_SWORD, 1]]
};
SkillInfo[SK.BS_AXE] = {
	Name: 'BS_AXE',
	SkillName: '斧头制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_SWORD, 2]]
};
SkillInfo[SK.BS_MACE] = {
	Name: 'BS_MACE',
	SkillName: '令牌制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_KNUCKLE, 1]]
};
SkillInfo[SK.BS_KNUCKLE] = {
	Name: 'BS_KNUCKLE',
	SkillName: '拳套制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_DAGGER, 1]]
};
SkillInfo[SK.BS_SPEAR] = {
	Name: 'BS_SPEAR',
	SkillName: '长矛制作',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.BS_DAGGER, 2]]
};
SkillInfo[SK.BS_HILTBINDING] = {
	Name: 'BS_HILTBINDING',
	SkillName: '武器保有',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_FINDINGORE] = {
	Name: 'BS_FINDINGORE',
	SkillName: '寻找矿石',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.BS_HILTBINDING, 1],
		[SK.BS_STEEL, 1]
	]
};
SkillInfo[SK.BS_WEAPONRESEARCH] = {
	Name: 'BS_WEAPONRESEARCH',
	SkillName: '武器研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_HILTBINDING, 1]]
};
SkillInfo[SK.BS_REPAIRWEAPON] = {
	Name: 'BS_REPAIRWEAPON',
	SkillName: '武器修理',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [2],
	_NeedSkillList: [[SK.BS_WEAPONRESEARCH, 1]]
};
SkillInfo[SK.BS_SKINTEMPER] = {
	Name: 'BS_SKINTEMPER',
	SkillName: '强化火属性',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.BS_HAMMERFALL] = {
	Name: 'BS_HAMMERFALL',
	SkillName: '大地之击',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_LEADERSHIP] = {
	Name: 'GD_LEADERSHIP',
	SkillName: '伟大的指导力',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.BS_ADRENALINE] = {
	Name: 'BS_ADRENALINE',
	SkillName: '速度激发',
	MaxLv: 5,
	SpAmount: [20, 23, 26, 29, 32],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_HAMMERFALL, 2]]
};
SkillInfo[SK.SM_MAGNUM] = {
	Name: 'SM_MAGNUM',
	SkillName: '怒爆',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_BASH, 5]]
};
SkillInfo[SK.BS_WEAPONPERFECT] = {
	Name: 'BS_WEAPONPERFECT',
	SkillName: '无视体型攻击',
	MaxLv: 5,
	SpAmount: [18, 16, 14, 12, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BS_WEAPONRESEARCH, 2],
		[SK.BS_ADRENALINE, 2]
	]
};
SkillInfo[SK.MA_SHARPSHOOTING] = {
	Name: 'MA_SHARPSHOOTING',
	SkillName: '锐利射击',
	MaxLv: 5,
	SpAmount: [18, 21, 24, 27, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_COMPRESS] = {
	Name: 'MER_COMPRESS',
	SkillName: '压制',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.BS_OVERTHRUST] = {
	Name: 'BS_OVERTHRUST',
	SkillName: '凶砍',
	MaxLv: 5,
	SpAmount: [18, 16, 14, 12, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BS_ADRENALINE, 3]]
};
SkillInfo[SK.EL_WIND_STEP] = {
	Name: 'EL_WIND_STEP',
	SkillName: '风之闪现',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BS_MAXIMIZE] = {
	Name: 'BS_MAXIMIZE',
	SkillName: '武器值最大化',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BS_WEAPONPERFECT, 3],
		[SK.BS_OVERTHRUST, 2]
	]
};
SkillInfo[SK.EL_STONE_HAMMER] = {
	Name: 'EL_STONE_HAMMER',
	SkillName: '石锤',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [5]
};
SkillInfo[SK.HT_SKIDTRAP] = {
	Name: 'HT_SKIDTRAP',
	SkillName: '滑动陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.HT_LANDMINE] = {
	Name: 'HT_LANDMINE',
	SkillName: '地雷陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.HT_ANKLESNARE] = {
	Name: 'HT_ANKLESNARE',
	SkillName: '定位陷阱',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_SKIDTRAP, 1]]
};
SkillInfo[SK.HT_SHOCKWAVE] = {
	Name: 'HT_SHOCKWAVE',
	SkillName: '魔耗陷阱',
	MaxLv: 5,
	SpAmount: [45, 45, 45, 45, 45],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_ANKLESNARE, 1]]
};
SkillInfo[SK.HT_SANDMAN] = {
	Name: 'HT_SANDMAN',
	SkillName: '睡魔陷阱',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_FLASHER, 1]]
};
SkillInfo[SK.HT_FLASHER] = {
	Name: 'HT_FLASHER',
	SkillName: '强光陷阱',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_SKIDTRAP, 1]]
};
SkillInfo[SK.HT_FREEZINGTRAP] = {
	Name: 'HT_FREEZINGTRAP',
	SkillName: '霜冻陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_FLASHER, 1]]
};
SkillInfo[SK.HT_BLASTMINE] = {
	Name: 'HT_BLASTMINE',
	SkillName: '定时爆炸陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.HT_LANDMINE, 1],
		[SK.HT_SANDMAN, 1],
		[SK.HT_FREEZINGTRAP, 1]
	]
};
SkillInfo[SK.HT_CLAYMORETRAP] = {
	Name: 'HT_CLAYMORETRAP',
	SkillName: '爆散陷阱',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.HT_SHOCKWAVE, 1],
		[SK.HT_BLASTMINE, 1]
	]
};
SkillInfo[SK.HT_REMOVETRAP] = {
	Name: 'HT_REMOVETRAP',
	SkillName: '陷阱移除',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [2],
	_NeedSkillList: [[SK.HT_LANDMINE, 1]],
	NeedSkillList: { [JobId.ROGUE]: [[SK.AC_DOUBLE, 5]] }
};
SkillInfo[SK.HT_TALKIEBOX] = {
	Name: 'HT_TALKIEBOX',
	SkillName: '陷阱探查',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [
		[SK.HT_REMOVETRAP, 1],
		[SK.HT_SHOCKWAVE, 1]
	]
};
SkillInfo[SK.RK_SONICWAVE] = {
	Name: 'RK_SONICWAVE',
	SkillName: '音速冲击波',
	MaxLv: 10,
	SpAmount: [33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
	bSeperateLv: true,
	AttackRange: [7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
	_NeedSkillList: [[SK.RK_ENCHANTBLADE, 3]]
};
SkillInfo[SK.RK_HUNDREDSPEAR] = {
	Name: 'RK_HUNDREDSPEAR',
	SkillName: '百矛穿刺',
	MaxLv: 10,
	SpAmount: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.RK_PHANTOMTHRUST, 3]]
};
SkillInfo[SK.RK_IGNITIONBREAK] = {
	Name: 'RK_IGNITIONBREAK',
	SkillName: '致命爆裂',
	MaxLv: 5,
	SpAmount: [35, 40, 45, 50, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RK_DEATHBOUND, 5],
		[SK.RK_SONICWAVE, 2],
		[SK.RK_WINDCUTTER, 3]
	]
};
SkillInfo[SK.RK_DRAGONBREATH] = {
	Name: 'RK_DRAGONBREATH',
	SkillName: "Dragon's Breath",
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RK_DRAGONTRAINING, 2]]
};
SkillInfo[SK.RK_RUNEMASTERY] = {
	Name: 'RK_RUNEMASTERY',
	SkillName: '卢恩精熟',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_CRUSHSTRIKE] = {
	Name: 'RK_CRUSHSTRIKE',
	SkillName: '重击强袭',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.HT_BEASTBANE] = {
	Name: 'HT_BEASTBANE',
	SkillName: '动物杀手',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_VITALITYACTIVATION] = {
	Name: 'RK_VITALITYACTIVATION',
	SkillName: '生命激化',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RK_FIGHTINGSPIRIT] = {
	Name: 'RK_FIGHTINGSPIRIT',
	SkillName: '提升斗志',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RK_PHANTOMTHRUST] = {
	Name: 'RK_PHANTOMTHRUST',
	SkillName: '幻象突刺',
	MaxLv: 5,
	SpAmount: [15, 18, 21, 24, 27],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.KN_BRANDISHSPEAR, 2]]
};
SkillInfo[SK.GC_CROSSIMPACT] = {
	Name: 'GC_CROSSIMPACT',
	SkillName: '十字斩',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.AS_SONICBLOW, 10]]
};
SkillInfo[SK.GC_RESEARCHNEWPOISON] = {
	Name: 'GC_RESEARCHNEWPOISON',
	SkillName: '新毒研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GC_ANTIDOTE] = {
	Name: 'GC_ANTIDOTE',
	SkillName: '解毒剂',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [5],
	_NeedSkillList: [[SK.GC_RESEARCHNEWPOISON, 5]]
};
SkillInfo[SK.GC_WEAPONBLOCKING] = {
	Name: 'GC_WEAPONBLOCKING',
	SkillName: '武器抵御',
	MaxLv: 5,
	SpAmount: [40, 36, 32, 28, 24],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_LEFT, 5]]
};
SkillInfo[SK.HT_FALCON] = {
	Name: 'HT_FALCON',
	SkillName: '驯鹰术',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.HT_BEASTBANE, 1]]
};
SkillInfo[SK.GC_POISONSMOKE] = {
	Name: 'GC_POISONSMOKE',
	SkillName: '毒雾',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [
		[SK.GC_POISONINGWEAPON, 5],
		[SK.GC_VENOMPRESSURE, 5]
	]
};
SkillInfo[SK.GC_PHANTOMMENACE] = {
	Name: 'GC_PHANTOMMENACE',
	SkillName: '恶灵威胁',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.GC_CLOAKINGEXCEED, 5],
		[SK.GC_DARKILLUSION, 5]
	]
};
SkillInfo[SK.GC_ROLLINGCUTTER] = {
	Name: 'GC_ROLLINGCUTTER',
	SkillName: '回旋刀刃',
	MaxLv: 5,
	SpAmount: [5, 5, 5, 5, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_SONICBLOW, 10]]
};
SkillInfo[SK.AB_JUDEX] = {
	Name: 'AB_JUDEX',
	SkillName: '审判',
	MaxLv: 10,
	SpAmount: [20, 23, 26, 29, 32, 34, 36, 38, 40, 42],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_TURNUNDEAD, 1]]
};
SkillInfo[SK.AB_ADORAMUS] = {
	Name: 'AB_ADORAMUS',
	SkillName: '讴歌',
	MaxLv: 10,
	SpAmount: [32, 40, 48, 56, 64, 72, 80, 88, 96, 104],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_JUDEX, 5],
		[SK.AB_ANCILLA, 1],
		[SK.PR_MAGNUS, 1]
	]
};
SkillInfo[SK.AB_CANTO] = {
	Name: 'AB_CANTO',
	SkillName: '纯白百合花',
	MaxLv: 3,
	SpAmount: [200, 220, 240],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.AL_INCAGI, 1]]
};
SkillInfo[SK.SM_ENDURE] = {
	Name: 'SM_ENDURE',
	SkillName: '霸体',
	MaxLv: 10,
	SpAmount: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SM_PROVOKE, 5]]
};
SkillInfo[SK.HT_STEELCROW] = {
	Name: 'HT_STEELCROW',
	SkillName: '钢制喙',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.HT_BLITZBEAT, 5]]
};
SkillInfo[SK.AB_LAUDARAMUS] = {
	Name: 'AB_LAUDARAMUS',
	SkillName: '折枝赞颂',
	MaxLv: 4,
	SpAmount: [50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_LAUDAAGNUS, 2]]
};
SkillInfo[SK.AB_CLEARANCE] = {
	Name: 'AB_CLEARANCE',
	SkillName: '解除',
	MaxLv: 5,
	SpAmount: [54, 60, 66, 72, 78],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_LAUDARAMUS, 2]]
};
SkillInfo[SK.AB_DUPLELIGHT] = {
	Name: 'AB_DUPLELIGHT',
	SkillName: '二道圣光',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_ASPERSIO, 1]]
};
SkillInfo[SK.AB_DUPLELIGHT_MAGIC] = {
	Name: 'AB_DUPLELIGHT_MAGIC',
	SkillName: '二道圣光',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11]
};
SkillInfo[SK.HT_BLITZBEAT] = {
	Name: 'HT_BLITZBEAT',
	SkillName: '闪电冲击',
	MaxLv: 5,
	SpAmount: [10, 13, 16, 19, 22],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.HT_FALCON, 1]]
};
SkillInfo[SK.HT_DETECTING] = {
	Name: 'HT_DETECTING',
	SkillName: '猎鹰寻敌',
	MaxLv: 4,
	SpAmount: [8, 8, 8, 8],
	bSeperateLv: false,
	AttackRange: [3, 5, 7, 9],
	_NeedSkillList: [
		[SK.AC_CONCENTRATION, 1],
		[SK.HT_FALCON, 1]
	]
};
SkillInfo[SK.HT_SPRINGTRAP] = {
	Name: 'HT_SPRINGTRAP',
	SkillName: '爆破陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [4, 5, 6, 7, 8],
	_NeedSkillList: [[SK.HT_FALCON], [SK.HT_REMOVETRAP, 1]]
};
SkillInfo[SK.EL_WIND_CURTAIN] = {
	Name: 'EL_WIND_CURTAIN',
	SkillName: '风之魂',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AS_RIGHT] = {
	Name: 'AS_RIGHT',
	SkillName: '右手修练',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_ROCK_CRUSHER] = {
	Name: 'EL_ROCK_CRUSHER',
	SkillName: '碎石',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [3]
};
SkillInfo[SK.AS_LEFT] = {
	Name: 'AS_LEFT',
	SkillName: '左手修练',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_RIGHT, 2]]
};
SkillInfo[SK.AS_KATAR] = {
	Name: 'AS_KATAR',
	SkillName: '拳刃修练',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AS_CLOAKING] = {
	Name: 'AS_CLOAKING',
	SkillName: '伪装',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_HIDING, 2]]
};
SkillInfo[SK.AS_SONICBLOW] = {
	Name: 'AS_SONICBLOW',
	SkillName: '音速投掷',
	MaxLv: 10,
	SpAmount: [16, 18, 20, 22, 24, 26, 28, 30, 32, 34],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_KATAR, 4]]
};
SkillInfo[SK.AS_GRIMTOOTH] = {
	Name: 'AS_GRIMTOOTH',
	SkillName: '无影之牙',
	MaxLv: 5,
	SpAmount: [3, 3, 3, 3, 3],
	bSeperateLv: false,
	AttackRange: [2, 3, 4, 5, 6],
	_NeedSkillList: [
		[SK.AS_CLOAKING, 2],
		[SK.AS_SONICBLOW, 5]
	]
};
SkillInfo[SK.AS_ENCHANTPOISON] = {
	Name: 'AS_ENCHANTPOISON',
	SkillName: '涂毒',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_POISON, 1]]
};
SkillInfo[SK.WL_RADIUS] = {
	Name: 'WL_RADIUS',
	SkillName: '半径扩大',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.WL_HELLINFERNO] = {
	Name: 'WL_HELLINFERNO',
	SkillName: '地狱火焰',
	MaxLv: 5,
	SpAmount: [64, 70, 76, 82, 88],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_CRIMSONROCK, 2]]
};
SkillInfo[SK.WL_EARTHSTRAIN] = {
	Name: 'WL_EARTHSTRAIN',
	SkillName: '地牛翻身',
	MaxLv: 5,
	SpAmount: [70, 78, 86, 94, 102],
	bSeperateLv: true,
	AttackRange: [6, 6, 6, 6, 6],
	_NeedSkillList: [[SK.WL_SIENNAEXECRATE, 2]]
};
SkillInfo[SK.AS_POISONREACT] = {
	Name: 'AS_POISONREACT',
	SkillName: '毒性反弹',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 45, 45],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AS_ENCHANTPOISON, 3]]
};
SkillInfo[SK.WL_SUMMONWB] = {
	Name: 'WL_SUMMONWB',
	SkillName: '召唤水球',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_STORMGUST, 1]]
};
SkillInfo[SK.WL_FREEZE_SP] = {
	Name: 'WL_FREEZE_SP',
	SkillName: '魔法保存',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AS_VENOMDUST] = {
	Name: 'AS_VENOMDUST',
	SkillName: '病毒散拨',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.AS_ENCHANTPOISON, 5]]
};
SkillInfo[SK.RA_WUGMASTERY] = {
	Name: 'RA_WUGMASTERY',
	SkillName: '召狼术',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RA_WUGBITE] = {
	Name: 'RA_WUGBITE',
	SkillName: '狼咬',
	MaxLv: 5,
	SpAmount: [40, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_WUGSTRIKE, 1]]
};
SkillInfo[SK.RA_RESEARCHTRAP] = {
	Name: 'RA_RESEARCHTRAP',
	SkillName: '陷阱研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.HT_CLAYMORETRAP, 1],
		[SK.HT_REMOVETRAP, 1]
	]
};
SkillInfo[SK.AS_SPLASHER] = {
	Name: 'AS_SPLASHER',
	SkillName: '毒性感染',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AS_VENOMDUST, 5],
		[SK.AS_POISONREACT, 5]
	]
};
SkillInfo[SK.NC_BOOSTKNUCKLE] = {
	Name: 'NC_BOOSTKNUCKLE',
	SkillName: '喷射飞拳',
	MaxLv: 5,
	SpAmount: [5, 10, 15, 20, 25],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 1]]
};
SkillInfo[SK.NC_COLDSLOWER] = {
	Name: 'NC_COLDSLOWER',
	SkillName: '液体冷却弹',
	MaxLv: 3,
	SpAmount: [20, 20, 20],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.NC_VULCANARM, 3]]
};
SkillInfo[SK.NC_F_SIDESLIDE] = {
	Name: 'NC_F_SIDESLIDE',
	SkillName: '大步前进、前侧滑行',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_HOVERING, 1]]
};
SkillInfo[SK.NV_FIRSTAID] = {
	Name: 'NV_FIRSTAID',
	SkillName: '紧急治疗',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [3],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.NC_MAGNETICFIELD] = {
	Name: 'NC_MAGNETICFIELD',
	SkillName: '磁场',
	MaxLv: 3,
	SpAmount: [60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_EMERGENCYCOOL, 1]]
};
SkillInfo[SK.NC_TRAININGAXE] = {
	Name: 'NC_TRAININGAXE',
	SkillName: '斧头使用熟练度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.NC_AXETORNADO] = {
	Name: 'NC_AXETORNADO',
	SkillName: '战斧飓风',
	MaxLv: 5,
	SpAmount: [45, 45, 45, 45, 45],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_TRAININGAXE, 1]]
};
SkillInfo[SK.NV_TRICKDEAD] = {
	Name: 'NV_TRICKDEAD',
	SkillName: '装死',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SC_TRIANGLESHOT] = {
	Name: 'SC_TRIANGLESHOT',
	SkillName: '三角射击',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 9, 9, 9, 9, 11, 11, 11],
	_NeedSkillList: [[SK.AC_DOUBLE, 7]]
};
SkillInfo[SK.SC_ENERVATION] = {
	Name: 'SC_ENERVATION',
	SkillName: '面具:无力',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.SC_BODYPAINT, 1]]
};
SkillInfo[SK.MG_SRECOVERY] = {
	Name: 'MG_SRECOVERY',
	SkillName: '禅心',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SM_MOVINGRECOVERY] = {
	Name: 'SM_MOVINGRECOVERY',
	SkillName: '移动时恢复HP',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SC_FEINTBOMB] = {
	Name: 'SC_FEINTBOMB',
	SkillName: '虚击炸弹',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SC_DIMENSIONDOOR, 3]]
};
SkillInfo[SK.LG_BANISHINGPOINT] = {
	Name: 'LG_BANISHINGPOINT',
	SkillName: '放逐攻击',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 25, 25, 25, 25, 25],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 1]]
};
SkillInfo[SK.LG_PINPOINTATTACK] = {
	Name: 'LG_PINPOINTATTACK',
	SkillName: '精准攻击',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.LG_BANISHINGPOINT, 5]]
};
SkillInfo[SK.SM_FATALBLOW] = {
	Name: 'SM_FATALBLOW',
	SkillName: '攻击弱点',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.LG_MOONSLASHER] = {
	Name: 'LG_MOONSLASHER',
	SkillName: '半月斩',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 1]]
};
SkillInfo[SK.LG_HESPERUSLIT] = {
	Name: 'LG_HESPERUSLIT',
	SkillName: '黄昏星之光',
	MaxLv: 5,
	SpAmount: [37, 44, 51, 58, 65],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.LG_PRESTIGE, 3],
		[SK.LG_BANDING, 3]
	]
};
SkillInfo[SK.SR_EARTHSHAKER] = {
	Name: 'SR_EARTHSHAKER',
	SkillName: '地雷震',
	MaxLv: 5,
	SpAmount: [36, 40, 44, 48, 52],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_DRAGONCOMBO, 3]]
};
SkillInfo[SK.SM_AUTOBERSERK] = {
	Name: 'SM_AUTOBERSERK',
	SkillName: '狂暴状态',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SR_KNUCKLEARROW] = {
	Name: 'SR_KNUCKLEARROW',
	SkillName: '修罗身弹',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: false,
	AttackRange: [7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
	_NeedSkillList: [[SK.SR_LIGHTNINGWALK, 1]]
};
SkillInfo[SK.SR_ASSIMILATEPOWER] = {
	Name: 'SR_ASSIMILATEPOWER',
	SkillName: '吸气攻',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.MO_ABSORBSPIRITS, 1],
		[SK.SR_POWERVELOCITY, 1]
	]
};
SkillInfo[SK.SR_GENTLETOUCH_QUIET] = {
	Name: 'SR_GENTLETOUCH_QUIET',
	SkillName: '点穴-默',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: []
};
SkillInfo[SK.AC_MAKINGARROW] = {
	Name: 'AC_MAKINGARROW',
	SkillName: '制作箭',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WA_MOONLIT_SERENADE] = {
	Name: 'WA_MOONLIT_SERENADE',
	SkillName: '月光小夜曲',
	MaxLv: 5,
	SpAmount: [84, 96, 108, 120, 134],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.AC_CHARGEARROW] = {
	Name: 'AC_CHARGEARROW',
	SkillName: '冲锋箭',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.TF_SPRINKLESAND] = {
	Name: 'TF_SPRINKLESAND',
	SkillName: '喷砂',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [9],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TF_BACKSLIDING] = {
	Name: 'TF_BACKSLIDING',
	SkillName: '后退回避',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [7],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.TF_PICKSTONE] = {
	Name: 'TF_PICKSTONE',
	SkillName: '捡石头',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [2],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WM_VOICEOFSIREN] = {
	Name: 'WM_VOICEOFSIREN',
	SkillName: "Siren's Voice",
	MaxLv: 5,
	SpAmount: [48, 56, 64, 72, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_POEMOFNETHERWORLD, 3]]
};
SkillInfo[SK.WM_RANDOMIZESPELL] = {
	Name: 'WM_RANDOMIZESPELL',
	SkillName: '不确定要素的语言',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_POEMOFNETHERWORLD, 1]]
};
SkillInfo[SK.TF_THROWSTONE] = {
	Name: 'TF_THROWSTONE',
	SkillName: '投掷石头',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [2],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.WM_MELODYOFSINK] = {
	Name: 'WM_MELODYOFSINK',
	SkillName: '消沈旋律',
	MaxLv: 5,
	SpAmount: [120, 130, 140, 150, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_SONG_OF_MANA, 1]]
};
SkillInfo[SK.MC_CARTREVOLUTION] = {
	Name: 'MC_CARTREVOLUTION',
	SkillName: '手推车攻击',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [12],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SO_POISON_BUSTER] = {
	Name: 'SO_POISON_BUSTER',
	SkillName: '剧毒猛击',
	MaxLv: 5,
	SpAmount: [70, 90, 110, 130, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SO_CLOUD_KILL, 2]]
};
SkillInfo[SK.SO_WARMER] = {
	Name: 'SO_WARMER',
	SkillName: '加热术',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_VOLCANO, 1],
		[SK.SA_VIOLENTGALE, 1]
	]
};
SkillInfo[SK.SO_EL_CONTROL] = {
	Name: 'SO_EL_CONTROL',
	SkillName: '操控精灵',
	MaxLv: 4,
	SpAmount: [10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_ANALYSIS, 1]]
};
SkillInfo[SK.MC_CHANGECART] = {
	Name: 'MC_CHANGECART',
	SkillName: '改装手推车',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SO_EL_CURE] = {
	Name: 'SO_EL_CURE',
	SkillName: '精灵治愈',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SO_EL_SYMPATHY, 1]]
};
SkillInfo[SK.SO_EARTH_INSIGNIA] = {
	Name: 'SO_EARTH_INSIGNIA',
	SkillName: '地之纹章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_TERA, 3]]
};
SkillInfo[SK.MC_LOUD] = {
	Name: 'MC_LOUD',
	SkillName: '大声吶喊',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [8],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GN_BLOOD_SUCKER] = {
	Name: 'GN_BLOOD_SUCKER',
	SkillName: '吸血植物',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 3]]
};
SkillInfo[SK.AL_HOLYLIGHT] = {
	Name: 'AL_HOLYLIGHT',
	SkillName: '神圣之光',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.GN_MAKEBOMB] = {
	Name: 'GN_MAKEBOMB',
	SkillName: '炸弹制造',
	MaxLv: 2,
	SpAmount: [5, 40],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.GN_MIX_COOKING, 1]]
};
SkillInfo[SK.GD_SOULCOLD] = {
	Name: 'GD_SOULCOLD',
	SkillName: '冷漠之心',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_ENERGYCOAT] = {
	Name: 'MG_ENERGYCOAT',
	SkillName: '能量外套',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ALL_GUARDIAN_RECALL] = {
	Name: 'ALL_GUARDIAN_RECALL',
	SkillName: '守护者的召唤',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MG_SIGHT] = {
	Name: 'MG_SIGHT',
	SkillName: '火狩',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MS_BASH] = {
	Name: 'MS_BASH',
	SkillName: '狂击',
	MaxLv: 10,
	SpAmount: [8, 8, 8, 8, 8, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ML_BRANDISH] = {
	Name: 'ML_BRANDISH',
	SkillName: '骑乘攻击',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.MER_AUTOBERSERK] = {
	Name: 'MER_AUTOBERSERK',
	SkillName: '狂暴状态',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_ZEPHYR] = {
	Name: 'EL_ZEPHYR',
	SkillName: '风之结界',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_FIRE_ARROW] = {
	Name: 'EL_FIRE_ARROW',
	SkillName: '火箭',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_ROCK_CRUSHER_ATK] = {
	Name: 'EL_ROCK_CRUSHER_ATK',
	SkillName: '碎石',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [5]
};
SkillInfo[SK.MG_NAPALMBEAT] = {
	Name: 'MG_NAPALMBEAT',
	SkillName: '心灵爆破',
	MaxLv: 10,
	SpAmount: [9, 9, 9, 12, 12, 12, 15, 15, 15, 18],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.HAMI_CASTLE] = {
	Name: 'HAMI_CASTLE',
	SkillName: '位置互换',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HVAN_CAPRICE] = {
	Name: 'HVAN_CAPRICE',
	SkillName: '善变',
	MaxLv: 5,
	SpAmount: [22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.MH_PAIN_KILLER] = {
	Name: 'MH_PAIN_KILLER',
	SkillName: '镇痛剂',
	MaxLv: 10,
	SpAmount: [48, 52, 56, 60, 64, 68, 72, 76, 80, 84],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
};
SkillInfo[SK.MH_SILVERVEIN_RUSH] = {
	Name: 'MH_SILVERVEIN_RUSH',
	SkillName: '银脉冲击',
	MaxLv: 10,
	SpAmount: [17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
};
SkillInfo[SK.MH_CBC] = {
	Name: 'MH_CBC',
	SkillName: 'C.B.C : 连续突破组合',
	MaxLv: 5,
	SpAmount: [10, 20, 30, 40, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_HAWKEYES] = {
	Name: 'GD_HAWKEYES',
	SkillName: '尖锐的视线',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_SAFETYWALL] = {
	Name: 'MG_SAFETYWALL',
	SkillName: '暗之障壁',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 35, 35, 35, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_NAPALMBEAT, 7],
		[SK.MG_SOULSTRIKE, 5]
	],
	NeedSkillList: {
		[JobId.PRIEST]: [
			[SK.PR_SANCTUARY, 3],
			[SK.PR_ASPERSIO, 4]
		]
	}
};
SkillInfo[SK.MS_MAGNUM] = {
	Name: 'MS_MAGNUM',
	SkillName: '怒爆',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ML_SPIRALPIERCE] = {
	Name: 'ML_SPIRALPIERCE',
	SkillName: '螺旋击刺',
	MaxLv: 5,
	SpAmount: [18, 21, 24, 27, 30],
	bSeperateLv: false,
	AttackRange: [4, 4, 4, 4, 4]
};
SkillInfo[SK.MER_DECAGI] = {
	Name: 'MER_DECAGI',
	SkillName: '缓速术',
	MaxLv: 10,
	SpAmount: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.EL_SOLID_SKIN] = {
	Name: 'EL_SOLID_SKIN',
	SkillName: '皮肤固化',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_FIRE_BOMB] = {
	Name: 'EL_FIRE_BOMB',
	SkillName: '火焰炸弹',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_STONE_RAIN] = {
	Name: 'EL_STONE_RAIN',
	SkillName: '岩石风暴',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MG_SOULSTRIKE] = {
	Name: 'MG_SOULSTRIKE',
	SkillName: '圣灵召唤',
	MaxLv: 10,
	SpAmount: [18, 14, 24, 20, 30, 26, 36, 32, 42, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_NAPALMBEAT, 4]]
};
SkillInfo[SK.RG_SNATCHER] = {
	Name: 'RG_SNATCHER',
	SkillName: '强夺',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_STEAL, 1]]
};
SkillInfo[SK.RG_STEALCOIN] = {
	Name: 'RG_STEALCOIN',
	SkillName: '偷钱',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_SNATCHER, 4]]
};
SkillInfo[SK.RG_BACKSTAP] = {
	Name: 'RG_BACKSTAP',
	SkillName: '背刺',
	MaxLv: 10,
	SpAmount: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STEALCOIN, 4]]
};
SkillInfo[SK.RG_TUNNELDRIVE] = {
	Name: 'RG_TUNNELDRIVE',
	SkillName: '潜遁',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TF_HIDING, 1]]
};
SkillInfo[SK.RG_RAID] = {
	Name: 'RG_RAID',
	SkillName: '潜击',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RG_TUNNELDRIVE, 2],
		[SK.RG_BACKSTAP, 2]
	]
};
SkillInfo[SK.RG_STRIPWEAPON] = {
	Name: 'RG_STRIPWEAPON',
	SkillName: '卸除武器',
	MaxLv: 5,
	SpAmount: [17, 19, 21, 23, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPARMOR, 5]]
};
SkillInfo[SK.RG_STRIPSHIELD] = {
	Name: 'RG_STRIPSHIELD',
	SkillName: '卸除盾牌',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPHELM, 5]]
};
SkillInfo[SK.RG_STRIPARMOR] = {
	Name: 'RG_STRIPARMOR',
	SkillName: '卸除铠甲',
	MaxLv: 5,
	SpAmount: [17, 19, 21, 23, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STRIPSHIELD, 5]]
};
SkillInfo[SK.RG_STRIPHELM] = {
	Name: 'RG_STRIPHELM',
	SkillName: '卸除头盔',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_STEALCOIN, 2]]
};
SkillInfo[SK.RG_INTIMIDATE] = {
	Name: 'RG_INTIMIDATE',
	SkillName: '胁持',
	MaxLv: 5,
	SpAmount: [13, 16, 19, 22, 25],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RG_BACKSTAP, 4],
		[SK.RG_RAID, 5]
	]
};
SkillInfo[SK.RG_GRAFFITI] = {
	Name: 'RG_GRAFFITI',
	SkillName: '涂鸦',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_FLAGGRAFFITI, 5]]
};
SkillInfo[SK.GD_BATTLEORDER] = {
	Name: 'GD_BATTLEORDER',
	SkillName: '下达战斗命令',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RG_FLAGGRAFFITI] = {
	Name: 'RG_FLAGGRAFFITI',
	SkillName: '旗帜涂鸦',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_CLEANER, 1]]
};
SkillInfo[SK.RG_CLEANER] = {
	Name: 'RG_CLEANER',
	SkillName: '清洗',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_GANGSTER, 1]]
};
SkillInfo[SK.RG_GANGSTER] = {
	Name: 'RG_GANGSTER',
	SkillName: '流氓天国',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RG_STRIPSHIELD, 3]]
};
SkillInfo[SK.GD_ITEMEMERGENCYCALL] = {
	Name: 'GD_ITEMEMERGENCYCALL',
	SkillName: '紧急呼叫',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.MG_COLDBOLT] = {
	Name: 'MG_COLDBOLT',
	SkillName: '冰箭术',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.RG_COMPULSION] = {
	Name: 'RG_COMPULSION',
	SkillName: '强制减价',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_GANGSTER, 1]]
};
SkillInfo[SK.DE_GPAIN] = {
	Name: 'DE_GPAIN',
	SkillName: '死亡骑士<痛苦冲击>',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MS_BOWLINGBASH] = {
	Name: 'MS_BOWLINGBASH',
	SkillName: '怪物互击',
	MaxLv: 10,
	SpAmount: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.ML_DEFENDER] = {
	Name: 'ML_DEFENDER',
	SkillName: '光之盾',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.RG_PLAGIARISM] = {
	Name: 'RG_PLAGIARISM',
	SkillName: '抄袭',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_INTIMIDATE, 5]]
};
SkillInfo[SK.SR_DRAGONCOMBO] = {
	Name: 'SR_DRAGONCOMBO',
	SkillName: '双龙?',
	MaxLv: 10,
	SpAmount: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_TRIPLEATTACK, 5]]
};
SkillInfo[SK.SC_STRIPACCESSARY] = {
	Name: 'SC_STRIPACCESSARY',
	SkillName: '卸除配件',
	MaxLv: 5,
	SpAmount: [15, 18, 21, 24, 27],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RG_STRIPWEAPON, 1]]
};
SkillInfo[SK.GD_GLORYWOUNDS] = {
	Name: 'GD_GLORYWOUNDS',
	SkillName: '光荣的伤口',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_AXEMASTERY] = {
	Name: 'AM_AXEMASTERY',
	SkillName: '斧头使用熟练度',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GD_GUARDUP] = {
	Name: 'GD_GUARDUP',
	SkillName: '监护人魔物强化',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.GD_APPROVAL] = {
	Name: 'GD_APPROVAL',
	SkillName: '正式工会认证',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MER_INCAGI] = {
	Name: 'MER_INCAGI',
	SkillName: '加速术',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.AM_LEARNINGPOTION] = {
	Name: 'AM_LEARNINGPOTION',
	SkillName: '知识药水',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MER_BLESSING] = {
	Name: 'MER_BLESSING',
	SkillName: '天使之赐福',
	MaxLv: 10,
	SpAmount: [28, 32, 36, 40, 44, 48, 52, 56, 60, 64],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_KYRIE] = {
	Name: 'MER_KYRIE',
	SkillName: '霸邪之阵',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 25, 25, 25, 30, 30, 30, 35],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.EL_STONE_SHIELD] = {
	Name: 'EL_STONE_SHIELD',
	SkillName: '岩石盾',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_PHARMACY] = {
	Name: 'AM_PHARMACY',
	SkillName: '配药',
	MaxLv: 10,
	SpAmount: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_LEARNINGPOTION, 5]]
};
SkillInfo[SK.MER_ESTIMATION] = {
	Name: 'MER_ESTIMATION',
	SkillName: '怪物情报',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MER_LEXDIVINA] = {
	Name: 'MER_LEXDIVINA',
	SkillName: '沉默之术',
	MaxLv: 10,
	SpAmount: [20, 20, 20, 20, 20, 18, 16, 14, 12, 10],
	bSeperateLv: false,
	AttackRange: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
};
SkillInfo[SK.MER_SCAPEGOAT] = {
	Name: 'MER_SCAPEGOAT',
	SkillName: '替罪羔羊',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_DEMONSTRATION] = {
	Name: 'AM_DEMONSTRATION',
	SkillName: '火烟瓶投掷',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_PHARMACY, 4]]
};
SkillInfo[SK.MER_PROVOKE] = {
	Name: 'MER_PROVOKE',
	SkillName: '挑衅',
	MaxLv: 10,
	SpAmount: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MER_CRASH] = {
	Name: 'MER_CRASH',
	SkillName: '撞击',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MER_SIGHT] = {
	Name: 'MER_SIGHT',
	SkillName: '火狩',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_ACIDTERROR] = {
	Name: 'AM_ACIDTERROR',
	SkillName: '强酸攻击',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_PHARMACY, 5]]
};
SkillInfo[SK.LG_SHIELDPRESS] = {
	Name: 'LG_SHIELDPRESS',
	SkillName: '重压盾击',
	MaxLv: 10,
	SpAmount: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_SHIELDCHARGE, 3]]
};
SkillInfo[SK.ML_AUTOGUARD] = {
	Name: 'ML_AUTOGUARD',
	SkillName: '自动防御',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ML_PIERCE] = {
	Name: 'ML_PIERCE',
	SkillName: '连刺攻击',
	MaxLv: 10,
	SpAmount: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.AM_POTIONPITCHER] = {
	Name: 'AM_POTIONPITCHER',
	SkillName: '药水投掷',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AM_PHARMACY, 3]]
};
SkillInfo[SK.MA_FREEZINGTRAP] = {
	Name: 'MA_FREEZINGTRAP',
	SkillName: '霜冻陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MA_SKIDTRAP] = {
	Name: 'MA_SKIDTRAP',
	SkillName: '滑动陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3]
};
SkillInfo[SK.MA_SHOWER] = {
	Name: 'MA_SHOWER',
	SkillName: '箭雨',
	MaxLv: 10,
	SpAmount: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.AM_CANNIBALIZE] = {
	Name: 'AM_CANNIBALIZE',
	SkillName: '生物调拨',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4],
	_NeedSkillList: [[SK.AM_PHARMACY, 6]]
};
SkillInfo[SK.MA_DOUBLE] = {
	Name: 'MA_DOUBLE',
	SkillName: '二连矢',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MS_BERSERK] = {
	Name: 'MS_BERSERK',
	SkillName: '狂怒之枪',
	MaxLv: 1,
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MS_REFLECTSHIELD] = {
	Name: 'MS_REFLECTSHIELD',
	SkillName: '反射盾',
	MaxLv: 10,
	SpAmount: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_SPHEREMINE] = {
	Name: 'AM_SPHEREMINE',
	SkillName: '气泡虫召唤',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_PHARMACY, 2]]
};
SkillInfo[SK.MS_PARRYING] = {
	Name: 'MS_PARRYING',
	SkillName: '双剑挌挡',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_PYROCLASTIC] = {
	Name: 'MH_PYROCLASTIC',
	SkillName: '火山尘暴',
	MaxLv: 10,
	SpAmount: [20, 28, 36, 44, 52, 56, 60, 64, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_GRANITIC_ARMOR] = {
	Name: 'MH_GRANITIC_ARMOR',
	SkillName: '花岗岩铠甲',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_CP_WEAPON] = {
	Name: 'AM_CP_WEAPON',
	SkillName: '化学武器保护',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CP_ARMOR, 3]]
};
SkillInfo[SK.MH_MAGMA_FLOW] = {
	Name: 'MH_MAGMA_FLOW',
	SkillName: '岩浆流动',
	MaxLv: 5,
	SpAmount: [34, 38, 42, 46, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_BLAST] = {
	Name: 'EL_BLAST',
	SkillName: '风暴冲击',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MH_TINDER_BREAKER] = {
	Name: 'MH_TINDER_BREAKER',
	SkillName: '粉碎骨折',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [3, 4, 5, 6, 7]
};
SkillInfo[SK.AM_CP_SHIELD] = {
	Name: 'AM_CP_SHIELD',
	SkillName: '化学盾牌保护',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CP_HELM, 3]]
};
SkillInfo[SK.MH_HEILIGE_STANGE] = {
	Name: 'MH_HEILIGE_STANGE',
	SkillName: '圣刺',
	MaxLv: 10,
	SpAmount: [48, 54, 60, 66, 72, 78, 84, 90, 96, 102],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MH_GOLDENE_FERSE] = {
	Name: 'MH_GOLDENE_FERSE',
	SkillName: '黄金脚跟',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.NPC_ALLHEAL] = {
	Name: 'NPC_ALLHEAL',
	SkillName: '生命之流',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.AM_CP_ARMOR] = {
	Name: 'AM_CP_ARMOR',
	SkillName: '化学铠甲保护',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CP_SHIELD, 3]]
};
SkillInfo[SK.MH_SONIC_CRAW] = {
	Name: 'MH_SONIC_CRAW',
	SkillName: '音速利爪',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_SILENT_BREEZE] = {
	Name: 'MH_SILENT_BREEZE',
	SkillName: '沉默微风',
	MaxLv: 5,
	SpAmount: [45, 54, 63, 72, 81],
	bSeperateLv: true,
	AttackRange: [5, 5, 7, 7, 9]
};
SkillInfo[SK.AM_CP_HELM] = {
	Name: 'AM_CP_HELM',
	SkillName: '化学头盔保护',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_PHARMACY, 2]]
};
SkillInfo[SK.MH_ERASER_CUTTER] = {
	Name: 'MH_ERASER_CUTTER',
	SkillName: '音速刀刃',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
};
SkillInfo[SK.MH_OVERED_BOOST] = {
	Name: 'MH_OVERED_BOOST',
	SkillName: '瞬间增压',
	MaxLv: 5,
	SpAmount: [70, 90, 110, 130, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MH_LIGHT_OF_REGENE] = {
	Name: 'MH_LIGHT_OF_REGENE',
	SkillName: '重生之光',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.AM_BIOETHICS] = {
	Name: 'AM_BIOETHICS',
	SkillName: '生命伦理',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MH_POISON_MIST] = {
	Name: 'MH_POISON_MIST',
	SkillName: '剧毒粉',
	MaxLv: 5,
	SpAmount: [65, 75, 85, 95, 105],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5]
};
SkillInfo[SK.MH_SUMMON_LEGION] = {
	Name: 'MH_SUMMON_LEGION',
	SkillName: '召唤虫团',
	MaxLv: 5,
	SpAmount: [60, 80, 100, 120, 140],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.HVAN_EXPLOSION] = {
	Name: 'HVAN_EXPLOSION',
	SkillName: '生物爆炸',
	MaxLv: 3,
	SpAmount: [1, 1, 1],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.AM_BIOTECHNOLOGY] = {
	Name: 'AM_BIOTECHNOLOGY',
	SkillName: '生命工学研究',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_CREATECON] = {
	Name: 'SA_CREATECON',
	SkillName: '元素肯贝特制作',
	MaxLv: 1,
	Type: 'Quest',
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_WILD_STORM] = {
	Name: 'EL_WILD_STORM',
	SkillName: '荒野风暴',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MG_FROSTDIVER] = {
	Name: 'MG_FROSTDIVER',
	SkillName: '冰冻术',
	MaxLv: 10,
	SpAmount: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_COLDBOLT, 5]]
};
SkillInfo[SK.AM_CREATECREATURE] = {
	Name: 'AM_CREATECREATURE',
	SkillName: '生命体',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HFLI_SBR44] = {
	Name: 'HFLI_SBR44',
	SkillName: 'S.B.R.44',
	MaxLv: 3,
	SpAmount: [1, 1, 1],
	bSeperateLv: true,
	AttackRange: [9, 9, 9]
};
SkillInfo[SK.HFLI_FLEET] = {
	Name: 'HFLI_FLEET',
	SkillName: '横越速度',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HAMI_BLOODLUST] = {
	Name: 'HAMI_BLOODLUST',
	SkillName: '血的贪求',
	MaxLv: 3,
	SpAmount: [120, 120, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.AM_CULTIVATION] = {
	Name: 'AM_CULTIVATION',
	SkillName: '培养',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HAMI_SKIN] = {
	Name: 'HAMI_SKIN',
	SkillName: '活命之肤',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_CURSED_SOIL] = {
	Name: 'EL_CURSED_SOIL',
	SkillName: '诅咒之地',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.HLIF_CHANGE] = {
	Name: 'HLIF_CHANGE',
	SkillName: '智力变换',
	MaxLv: 3,
	SpAmount: [100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.AM_FLAMECONTROL] = {
	Name: 'AM_FLAMECONTROL',
	SkillName: '火焰控制',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HLIF_AVOID] = {
	Name: 'HLIF_AVOID',
	SkillName: '轻捷移动',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.LG_OVERBRAND] = {
	Name: 'LG_OVERBRAND',
	SkillName: '支配烙印',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.LG_MOONSLASHER, 3],
		[SK.LG_PINPOINTATTACK, 1]
	]
};
SkillInfo[SK.ALL_ODINS_RECALL] = {
	Name: 'ALL_ODINS_RECALL',
	SkillName: '奥丁的召唤',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AM_CALLHOMUN] = {
	Name: 'AM_CALLHOMUN',
	SkillName: '生命体召唤',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_REST, 1]]
};
SkillInfo[SK.SR_RIDEINLIGHTNING] = {
	Name: 'SR_RIDEINLIGHTNING',
	SkillName: '雷光弹',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.MO_FINGEROFFENSIVE, 3]]
};
SkillInfo[SK.SR_HOWLINGOFLION] = {
	Name: 'SR_HOWLINGOFLION',
	SkillName: "Lion's Howl",
	MaxLv: 5,
	SpAmount: [70, 70, 70, 70, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SR_RIDEINLIGHTNING, 3],
		[SK.SR_ASSIMILATEPOWER, 1]
	]
};
SkillInfo[SK.SR_TIGERCANNON] = {
	Name: 'SR_TIGERCANNON',
	SkillName: '号炮',
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_FALLENEMPIRE, 3]]
};
SkillInfo[SK.AM_REST] = {
	Name: 'AM_REST',
	SkillName: '安息',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AM_BIOETHICS, 1]]
};
SkillInfo[SK.GN_CHANGEMATERIAL] = {
	Name: 'GN_CHANGEMATERIAL',
	SkillName: '素材变化',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GN_SLINGITEM] = {
	Name: 'GN_SLINGITEM',
	SkillName: '道具投掷',
	MaxLv: 1,
	SpAmount: [4],
	bSeperateLv: false,
	AttackRange: [11],
	_NeedSkillList: [[SK.GN_CHANGEMATERIAL, 1]]
};
SkillInfo[SK.GN_MANDRAGORA] = {
	Name: 'GN_MANDRAGORA',
	SkillName: '曼陀罗魔花的尖叫',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_HELLS_PLANT, 3]]
};
SkillInfo[SK.AM_DRILLMASTER] = {
	Name: 'AM_DRILLMASTER',
	SkillName: '攻击力训练',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.GN_HELLS_PLANT] = {
	Name: 'GN_HELLS_PLANT',
	SkillName: '地狱植物',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_BLOOD_SUCKER, 3]]
};
SkillInfo[SK.GN_FIRE_EXPANSION] = {
	Name: 'GN_FIRE_EXPANSION',
	SkillName: '火焰扩散',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_DEMONIC_FIRE, 3]]
};
SkillInfo[SK.GN_DEMONIC_FIRE] = {
	Name: 'GN_DEMONIC_FIRE',
	SkillName: '恶魔火焰',
	MaxLv: 5,
	SpAmount: [24, 28, 32, 36, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.GN_SPORE_EXPLOSION, 3]]
};
SkillInfo[SK.AM_HEALHOMUN] = {
	Name: 'AM_HEALHOMUN',
	SkillName: '治愈生命体',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.GN_WALLOFTHORN] = {
	Name: 'GN_WALLOFTHORN',
	SkillName: '荆棘之壁',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_THORNS_TRAP, 3]]
};
SkillInfo[SK.SR_CRESCENTELBOW] = {
	Name: 'SR_CRESCENTELBOW',
	SkillName: '破碎柱',
	MaxLv: 5,
	SpAmount: [80, 80, 80, 80, 80],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_WINDMILL, 1]]
};
SkillInfo[SK.GN_CARTBOOST] = {
	Name: 'GN_CARTBOOST',
	SkillName: '手推车加速',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_REMODELING_CART, 3]]
};
SkillInfo[SK.AM_RESURRECTHOMUN] = {
	Name: 'AM_RESURRECTHOMUN',
	SkillName: '复活生命体',
	MaxLv: 5,
	SpAmount: [74, 68, 62, 56, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AM_CALLHOMUN, 1]]
};
SkillInfo[SK.GN_CARTCANNON] = {
	Name: 'GN_CARTCANNON',
	SkillName: '手推车加农炮',
	MaxLv: 5,
	SpAmount: [40, 42, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [[SK.GN_REMODELING_CART, 2]]
};
SkillInfo[SK.GN_CART_TORNADO] = {
	Name: 'GN_CART_TORNADO',
	SkillName: '手推车龙卷风攻击',
	MaxLv: 10,
	SpAmount: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_REMODELING_CART, 1]]
};
SkillInfo[SK.GN_TRAINING_SWORD] = {
	Name: 'GN_TRAINING_SWORD',
	SkillName: '单手剑使用熟练度',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.CR_TRUST] = {
	Name: 'CR_TRUST',
	SkillName: '信任',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_WATER_SCREW_ATK] = {
	Name: 'EL_WATER_SCREW_ATK',
	SkillName: '螺旋水波',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_WATER_SCREW] = {
	Name: 'EL_WATER_SCREW',
	SkillName: '螺旋水波',
	MaxLv: 1,
	SpAmount: [60],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.EL_ICE_NEEDLE] = {
	Name: 'EL_ICE_NEEDLE',
	SkillName: '冰针',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.CR_AUTOGUARD] = {
	Name: 'CR_AUTOGUARD',
	SkillName: '自动防御',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_FIRE_WAVE_ATK] = {
	Name: 'EL_FIRE_WAVE_ATK',
	SkillName: '火焰冲击波',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_FIRE_WAVE] = {
	Name: 'EL_FIRE_WAVE',
	SkillName: '火焰冲击波',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.EL_FIRE_BOMB_ATK] = {
	Name: 'EL_FIRE_BOMB_ATK',
	SkillName: '火焰炸弹',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [6]
};
SkillInfo[SK.CR_SHIELDCHARGE] = {
	Name: 'CR_SHIELDCHARGE',
	SkillName: '盾击',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.CR_AUTOGUARD, 5]]
};
SkillInfo[SK.EL_UPHEAVAL] = {
	Name: 'EL_UPHEAVAL',
	SkillName: '天崩地裂',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.HAMI_DEFENCE] = {
	Name: 'HAMI_DEFENCE',
	SkillName: '防御力',
	MaxLv: 5,
	SpAmount: [20, 25, 30, 35, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.HVAN_CHAOTIC] = {
	Name: 'HVAN_CHAOTIC',
	SkillName: '混乱的祈福',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.CR_SHIELDBOOMERANG] = {
	Name: 'CR_SHIELDBOOMERANG',
	SkillName: '回旋盾击',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [3, 5, 7, 9, 11],
	_NeedSkillList: [[SK.CR_SHIELDCHARGE, 3]]
};
SkillInfo[SK.MH_MIDNIGHT_FRENZY] = {
	Name: 'MH_MIDNIGHT_FRENZY',
	SkillName: '午夜狂暴',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
};
SkillInfo[SK.MH_EQC] = {
	Name: 'MH_EQC',
	SkillName: 'E.Q.C : 永恒快速组合',
	MaxLv: 5,
	SpAmount: [24, 28, 32, 36, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.EL_GUST] = {
	Name: 'EL_GUST',
	SkillName: '雷电强化',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CR_REFLECTSHIELD] = {
	Name: 'CR_REFLECTSHIELD',
	SkillName: '反射盾',
	MaxLv: 10,
	SpAmount: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_SHIELDBOOMERANG, 3]]
};
SkillInfo[SK.EL_CHILLY_AIR] = {
	Name: 'EL_CHILLY_AIR',
	SkillName: '绝对零度',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.EL_COOLER] = {
	Name: 'EL_COOLER',
	SkillName: '急速降温',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.GD_REGENERATION] = {
	Name: 'GD_REGENERATION',
	SkillName: '复兴公会员体力',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.CR_HOLYCROSS] = {
	Name: 'CR_HOLYCROSS',
	SkillName: '圣十字攻击',
	MaxLv: 10,
	SpAmount: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.CR_TRUST, 7]]
};
SkillInfo[SK.SO_CLOUD_KILL] = {
	Name: 'SO_CLOUD_KILL',
	SkillName: '云杀',
	MaxLv: 5,
	SpAmount: [48, 56, 64, 70, 78],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_HEAVENDRIVE, 5]]
};
SkillInfo[SK.EL_AQUAPLAY] = {
	Name: 'EL_AQUAPLAY',
	SkillName: '冰封领域',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SO_EL_ACTION] = {
	Name: 'SO_EL_ACTION',
	SkillName: '精灵激发',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [5],
	_NeedSkillList: [[SK.SO_EL_CONTROL, 3]]
};
SkillInfo[SK.CR_GRANDCROSS] = {
	Name: 'CR_GRANDCROSS',
	SkillName: '圣十字审判',
	MaxLv: 10,
	SpAmount: [37, 44, 51, 58, 65, 72, 78, 86, 93, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CR_TRUST, 10],
		[SK.CR_HOLYCROSS, 6]
	]
};
SkillInfo[SK.SO_WATER_INSIGNIA] = {
	Name: 'SO_WATER_INSIGNIA',
	SkillName: '水之纹章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_AQUA, 3]]
};
SkillInfo[SK.SR_RAISINGDRAGON] = {
	Name: 'SR_RAISINGDRAGON',
	SkillName: '潜龙升天',
	MaxLv: 10,
	SpAmount: [120, 120, 120, 120, 120, 120, 120, 120, 120, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MO_CALLSPIRITS, 5],
		[SK.SR_POWERVELOCITY, 1]
	]
};
SkillInfo[SK.SR_POWERVELOCITY] = {
	Name: 'SR_POWERVELOCITY',
	SkillName: '全气注入',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.MO_CALLSPIRITS, 5]]
};
SkillInfo[SK.CR_DEVOTION] = {
	Name: 'CR_DEVOTION',
	SkillName: '牺牲',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [
		[SK.CR_GRANDCROSS, 4],
		[SK.CR_REFLECTSHIELD, 5]
	]
};
SkillInfo[SK.SO_SUMMON_AQUA] = {
	Name: 'SO_SUMMON_AQUA',
	SkillName: '召唤水精灵阿奎亚',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_DIAMONDDUST, 3]
	]
};
SkillInfo[SK.NV_BASIC] = {
	Name: 'NV_BASIC',
	SkillName: '基本技能',
	MaxLv: 9,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_STONECURSE] = {
	Name: 'MG_STONECURSE',
	SkillName: '石化术',
	MaxLv: 10,
	SpAmount: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
};
SkillInfo[SK.CR_PROVIDENCE] = {
	Name: 'CR_PROVIDENCE',
	SkillName: '神佑之光',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AL_DP, 5],
		[SK.AL_HEAL, 5]
	]
};
SkillInfo[SK.AB_EUCHARISTICA] = {
	Name: 'AB_EUCHARISTICA',
	SkillName: '感恩祈祷',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AB_EXPIATIO, 1],
		[SK.AB_EPICLESIS, 1]
	]
};
SkillInfo[SK.CR_DEFENDER] = {
	Name: 'CR_DEFENDER',
	SkillName: '光之盾',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_SHIELDBOOMERANG, 1]]
};
SkillInfo[SK.AB_SILENTIUM] = {
	Name: 'AB_SILENTIUM',
	SkillName: '静寂',
	MaxLv: 5,
	SpAmount: [64, 68, 72, 76, 80],
	bSeperateLv: true,
	AttackRange: [4, 5, 6, 7, 8],
	_NeedSkillList: [[SK.AB_CLEARANCE, 1]]
};
SkillInfo[SK.CR_SPEARQUICKEN] = {
	Name: 'CR_SPEARQUICKEN',
	SkillName: '长矛加速术',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_SPEARMASTERY, 10]]
};
SkillInfo[SK.SO_SUMMON_TERA] = {
	Name: 'SO_SUMMON_TERA',
	SkillName: '召唤泰拉',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_EARTHGRAVE, 3]
	]
};
SkillInfo[SK.MO_IRONHAND] = {
	Name: 'MO_IRONHAND',
	SkillName: '铁沙掌',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AL_DEMONBANE, 10],
		[SK.AL_DP, 10]
	]
};
SkillInfo[SK.SO_SUMMON_VENTUS] = {
	Name: 'SO_SUMMON_VENTUS',
	SkillName: '召唤风精灵梵图斯',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_VARETYR_SPEAR, 3]
	]
};
SkillInfo[SK.MO_SPIRITSRECOVERY] = {
	Name: 'MO_SPIRITSRECOVERY',
	SkillName: '运气调息',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_BLADESTOP, 2]]
};
SkillInfo[SK.SO_EL_ANALYSIS] = {
	Name: 'SO_EL_ANALYSIS',
	SkillName: '4元素分析',
	MaxLv: 2,
	SpAmount: [10, 20],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [
		[SK.SA_FLAMELAUNCHER, 1],
		[SK.SA_FROSTWEAPON, 1],
		[SK.SA_LIGHTNINGLOADER, 1],
		[SK.SA_SEISMICWEAPON, 1]
	]
};
SkillInfo[SK.MO_CALLSPIRITS] = {
	Name: 'MO_CALLSPIRITS',
	SkillName: '蓄气',
	MaxLv: 5,
	SpAmount: [8, 8, 8, 8, 8],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_IRONHAND, 2]]
};
SkillInfo[SK.SO_VARETYR_SPEAR] = {
	Name: 'SO_VARETYR_SPEAR',
	SkillName: '圣枪刺击',
	MaxLv: 10,
	SpAmount: [65, 70, 75, 80, 85, 90, 95, 100, 105, 110],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_SEISMICWEAPON, 1],
		[SK.SA_VIOLENTGALE, 4]
	]
};
SkillInfo[SK.MO_ABSORBSPIRITS] = {
	Name: 'MO_ABSORBSPIRITS',
	SkillName: '吸气',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.MO_CALLSPIRITS, 5]]
};
SkillInfo[SK.SO_VACUUM_EXTREME] = {
	Name: 'SO_VACUUM_EXTREME',
	SkillName: '极限空虚',
	MaxLv: 5,
	SpAmount: [34, 42, 50, 58, 66],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_LANDPROTECTOR, 2]]
};
SkillInfo[SK.MO_TRIPLEATTACK] = {
	Name: 'MO_TRIPLEATTACK',
	SkillName: '六合拳',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_DODGE, 5]]
};
SkillInfo[SK.EL_POWER_OF_GAIA] = {
	Name: 'EL_POWER_OF_GAIA',
	SkillName: '天神下凡',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MO_BODYRELOCATION] = {
	Name: 'MO_BODYRELOCATION',
	SkillName: '弓身弹影',
	MaxLv: 1,
	SpAmount: [14],
	bSeperateLv: false,
	AttackRange: [18],
	_NeedSkillList: [
		[SK.MO_SPIRITSRECOVERY, 2],
		[SK.MO_EXTREMITYFIST, 3],
		[SK.MO_STEELBODY, 3]
	]
};
SkillInfo[SK.SR_GENTLETOUCH_ENERGYGAIN] = {
	Name: 'SR_GENTLETOUCH_ENERGYGAIN',
	SkillName: '点穴-球',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_GENTLETOUCH_CURE, 1]]
};
SkillInfo[SK.MO_DODGE] = {
	Name: 'MO_DODGE',
	SkillName: '移花接木',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 5],
		[SK.MO_CALLSPIRITS, 5]
	]
};
SkillInfo[SK.SO_EARTHGRAVE] = {
	Name: 'SO_EARTHGRAVE',
	SkillName: '大地坟场',
	MaxLv: 5,
	SpAmount: [62, 70, 78, 86, 94],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WZ_EARTHSPIKE, 5]]
};
SkillInfo[SK.MO_INVESTIGATE] = {
	Name: 'MO_INVESTIGATE',
	SkillName: '浸透劲',
	MaxLv: 5,
	SpAmount: [10, 14, 17, 19, 20],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_CALLSPIRITS, 5]]
};
SkillInfo[SK.SO_SPELLFIST] = {
	Name: 'SO_SPELLFIST',
	SkillName: '魔力拳',
	MaxLv: 10,
	SpAmount: [40, 44, 48, 52, 56, 60, 64, 68, 72, 76],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_AUTOSPELL, 4]]
};
SkillInfo[SK.MO_FINGEROFFENSIVE] = {
	Name: 'MO_FINGEROFFENSIVE',
	SkillName: '弹指神通',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MO_INVESTIGATE, 3]]
};
SkillInfo[SK.SO_ELECTRICWALK] = {
	Name: 'SO_ELECTRICWALK',
	SkillName: '电流步',
	MaxLv: 5,
	SpAmount: [30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_VIOLENTGALE, 1]]
};
SkillInfo[SK.MO_STEELBODY] = {
	Name: 'MO_STEELBODY',
	SkillName: '金刚不坏',
	MaxLv: 5,
	SpAmount: [200, 200, 200, 200, 200],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_COMBOFINISH, 3]]
};
SkillInfo[SK.WM_UNLIMITED_HUMMING_VOICE] = {
	Name: 'WM_UNLIMITED_HUMMING_VOICE',
	SkillName: '无限哼唱声',
	MaxLv: 5,
	SpAmount: [120, 130, 140, 150, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.WM_BEYOND_OF_WARCRY, 1],
		[SK.WM_SOUND_OF_DESTRUCTION, 1]
	]
};
SkillInfo[SK.MO_BLADESTOP] = {
	Name: 'MO_BLADESTOP',
	SkillName: '真剑百破道',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_DODGE, 5]]
};
SkillInfo[SK.WA_SWING_DANCE] = {
	Name: 'WA_SWING_DANCE',
	SkillName: '摇摆舞',
	MaxLv: 5,
	SpAmount: [96, 112, 128, 144, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.MO_EXPLOSIONSPIRITS] = {
	Name: 'MO_EXPLOSIONSPIRITS',
	SkillName: '爆气',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_ABSORBSPIRITS, 1]]
};
SkillInfo[SK.WM_SATURDAY_NIGHT_FEVER] = {
	Name: 'WM_SATURDAY_NIGHT_FEVER',
	SkillName: '狂欢周末夜',
	MaxLv: 5,
	SpAmount: [150, 160, 170, 180, 190],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_DANCE_WITH_WUG, 1]]
};
SkillInfo[SK.MO_EXTREMITYFIST] = {
	Name: 'MO_EXTREMITYFIST',
	SkillName: '阿修罗霸凰拳',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_EXPLOSIONSPIRITS, 3],
		[SK.MO_FINGEROFFENSIVE, 3]
	]
};
SkillInfo[SK.MG_FIREBALL] = {
	Name: 'MG_FIREBALL',
	SkillName: '火球术',
	MaxLv: 10,
	SpAmount: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_FIREBOLT, 4]]
};
SkillInfo[SK.MO_CHAINCOMBO] = {
	Name: 'MO_CHAINCOMBO',
	SkillName: '连环全身掌',
	MaxLv: 5,
	SpAmount: [5, 6, 7, 8, 9],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_TRIPLEATTACK, 5]]
};
SkillInfo[SK.WM_SOUND_OF_DESTRUCTION] = {
	Name: 'WM_SOUND_OF_DESTRUCTION',
	SkillName: '毁灭之声',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.WM_SATURDAY_NIGHT_FEVER, 3],
		[SK.WM_MELODYOFSINK, 3]
	]
};
SkillInfo[SK.MO_COMBOFINISH] = {
	Name: 'MO_COMBOFINISH',
	SkillName: '猛龙夸强',
	MaxLv: 5,
	SpAmount: [3, 4, 5, 6, 7],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.MO_CHAINCOMBO, 3]]
};
SkillInfo[SK.WM_DANCE_WITH_WUG] = {
	Name: 'WM_DANCE_WITH_WUG',
	SkillName: '与狼共舞',
	MaxLv: 5,
	SpAmount: [120, 140, 160, 180, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.MINSTREL]: [
			[SK.MI_HARMONIZE, 1],
			[SK.MI_RUSH_WINDMILL, 1],
			[SK.MI_ECHOSONG, 1]
		],
		[JobId.WANDERER]: [
			[SK.WA_SWING_DANCE, 1],
			[SK.WA_SYMPHONY_OF_LOVER, 1],
			[SK.WA_MOONLIT_SERENADE, 1]
		]
	}
};
SkillInfo[SK.SA_ADVANCEDBOOK] = {
	Name: 'SA_ADVANCEDBOOK',
	SkillName: '进化之书',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_SONG_OF_MANA] = {
	Name: 'WM_SONG_OF_MANA',
	SkillName: '魔力之歌',
	MaxLv: 5,
	SpAmount: [120, 140, 160, 180, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.MINSTREL]: [
			[SK.MI_HARMONIZE, 1],
			[SK.MI_RUSH_WINDMILL, 1],
			[SK.MI_ECHOSONG, 1]
		],
		[JobId.WANDERER]: [
			[SK.WA_SWING_DANCE, 1],
			[SK.WA_SYMPHONY_OF_LOVER, 1],
			[SK.WA_MOONLIT_SERENADE, 1]
		]
	}
};
SkillInfo[SK.SA_CASTCANCEL] = {
	Name: 'SA_CASTCANCEL',
	SkillName: '取消施法',
	MaxLv: 5,
	SpAmount: [2, 2, 2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_ADVANCEDBOOK, 2]]
};
SkillInfo[SK.WL_WHITEIMPRISON] = {
	Name: 'WL_WHITEIMPRISON',
	SkillName: '白色监狱',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SOULEXPANSION, 3]]
};
SkillInfo[SK.SA_MAGICROD] = {
	Name: 'SA_MAGICROD',
	SkillName: '魔法惩罚',
	MaxLv: 5,
	SpAmount: [2, 2, 2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_ADVANCEDBOOK, 4]]
};
SkillInfo[SK.WL_STASIS] = {
	Name: 'WL_STASIS',
	SkillName: '魔力冻结',
	MaxLv: 5,
	SpAmount: [50, 60, 70, 80, 90],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_DRAINLIFE, 1]]
};
SkillInfo[SK.SA_SPELLBREAKER] = {
	Name: 'SA_SPELLBREAKER',
	SkillName: '念咒拆除',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_MAGICROD, 1]]
};
SkillInfo[SK.WL_TETRAVORTEX] = {
	Name: 'WL_TETRAVORTEX',
	SkillName: '属性漩涡',
	MaxLv: 10,
	SpAmount: [120, 150, 180, 210, 240, 200, 240, 280, 320, 360],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.WL_CHAINLIGHTNING, 5],
		[SK.WL_HELLINFERNO, 5],
		[SK.WL_JACKFROST, 5],
		[SK.WL_EARTHSTRAIN, 5]
	]
};
SkillInfo[SK.SA_FREECAST] = {
	Name: 'SA_FREECAST',
	SkillName: '自由施法',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_CASTCANCEL, 1]]
};
SkillInfo[SK.WM_GREAT_ECHO] = {
	Name: 'WM_GREAT_ECHO',
	SkillName: '巨大共鸣',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_METALICSOUND, 1]]
};
SkillInfo[SK.SA_AUTOSPELL] = {
	Name: 'SA_AUTOSPELL',
	SkillName: '自动念咒',
	MaxLv: 10,
	SpAmount: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_FREECAST, 4]]
};
SkillInfo[SK.RA_ARROWSTORM] = {
	Name: 'RA_ARROWSTORM',
	SkillName: '箭雨风暴',
	MaxLv: 10,
	SpAmount: [24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_AIMEDBOLT, 5]]
};
SkillInfo[SK.SA_FLAMELAUNCHER] = {
	Name: 'SA_FLAMELAUNCHER',
	SkillName: '火焰属性附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_FIREBOLT, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.RA_WUGRIDER] = {
	Name: 'RA_WUGRIDER',
	SkillName: '骑狼术',
	MaxLv: 3,
	SpAmount: [2, 2, 2],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.RA_WUGMASTERY, 1]]
};
SkillInfo[SK.SA_FROSTWEAPON] = {
	Name: 'SA_FROSTWEAPON',
	SkillName: '水属性附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_COLDBOLT, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.RA_MAGENTATRAP] = {
	Name: 'RA_MAGENTATRAP',
	SkillName: '紫红陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.SA_LIGHTNINGLOADER] = {
	Name: 'SA_LIGHTNINGLOADER',
	SkillName: '风属性附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_LIGHTNINGBOLT, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.NC_PILEBUNKER] = {
	Name: 'NC_PILEBUNKER',
	SkillName: '冲击椎',
	MaxLv: 3,
	SpAmount: [50, 50, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.NC_BOOSTKNUCKLE, 2]]
};
SkillInfo[SK.SA_SEISMICWEAPON] = {
	Name: 'SA_SEISMICWEAPON',
	SkillName: '地属性附加',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_STONECURSE, 1],
		[SK.SA_ADVANCEDBOOK, 5]
	]
};
SkillInfo[SK.NC_B_SIDESLIDE] = {
	Name: 'NC_B_SIDESLIDE',
	SkillName: '大步后退、后侧滑行',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_HOVERING, 1]]
};
SkillInfo[SK.SA_DRAGONOLOGY] = {
	Name: 'SA_DRAGONOLOGY',
	SkillName: '龙知识',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SA_ADVANCEDBOOK, 9]]
};
SkillInfo[SK.NC_NEUTRALBARRIER] = {
	Name: 'NC_NEUTRALBARRIER',
	SkillName: '中性防护罩',
	MaxLv: 3,
	SpAmount: [80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_MAGNETICFIELD, 2]]
};
SkillInfo[SK.SA_VOLCANO] = {
	Name: 'SA_VOLCANO',
	SkillName: '火元素领域',
	MaxLv: 5,
	SpAmount: [48, 46, 44, 42, 40],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SA_FLAMELAUNCHER, 2]]
};
SkillInfo[SK.NC_SILVERSNIPER] = {
	Name: 'NC_SILVERSNIPER',
	SkillName: 'FAW银光狙击手',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.NC_RESEARCHFE, 2]]
};
SkillInfo[SK.SA_DELUGE] = {
	Name: 'SA_DELUGE',
	SkillName: '水元素领域',
	MaxLv: 5,
	SpAmount: [48, 46, 44, 42, 40],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SA_FROSTWEAPON, 2]]
};
SkillInfo[SK.SC_BODYPAINT] = {
	Name: 'SC_BODYPAINT',
	SkillName: '人体彩绘',
	MaxLv: 5,
	SpAmount: [10, 15, 20, 25, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_VIOLENTGALE] = {
	Name: 'SA_VIOLENTGALE',
	SkillName: '风元素领域',
	MaxLv: 5,
	SpAmount: [48, 46, 44, 42, 40],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SA_LIGHTNINGLOADER, 2]]
};
SkillInfo[SK.MG_FIREWALL] = {
	Name: 'MG_FIREWALL',
	SkillName: '火焰之壁',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.MG_SIGHT, 1],
		[SK.MG_FIREBALL, 5]
	]
};
SkillInfo[SK.SA_LANDPROTECTOR] = {
	Name: 'SA_LANDPROTECTOR',
	SkillName: '地元素领域',
	MaxLv: 5,
	SpAmount: [66, 62, 58, 54, 50],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SA_DELUGE, 3],
		[SK.SA_VIOLENTGALE, 3],
		[SK.SA_VOLCANO, 3]
	]
};
SkillInfo[SK.WM_GLOOMYDAY] = {
	Name: 'WM_GLOOMYDAY',
	SkillName: '羞怯一天的忧郁',
	MaxLv: 5,
	SpAmount: [42, 46, 50, 54, 58],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_RANDOMIZESPELL, 1]]
};
SkillInfo[SK.SA_DISPELL] = {
	Name: 'SA_DISPELL',
	SkillName: '魔法效果解除',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_SPELLBREAKER, 3]]
};
SkillInfo[SK.LG_FORCEOFVANGUARD] = {
	Name: 'LG_FORCEOFVANGUARD',
	SkillName: '先锋部队',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_ABRACADABRA] = {
	Name: 'SA_ABRACADABRA',
	SkillName: '随机技能',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SA_AUTOSPELL, 5],
		[SK.SA_DISPELL, 1],
		[SK.SA_LANDPROTECTOR, 1]
	]
};
SkillInfo[SK.LG_RAYOFGENESIS] = {
	Name: 'LG_RAYOFGENESIS',
	SkillName: '创世之光',
	MaxLv: 10,
	SpAmount: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_GRANDCROSS, 5]]
};
SkillInfo[SK.SA_MONOCELL] = {
	Name: 'SA_MONOCELL',
	SkillName: '变换成波利',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.SR_FALLENEMPIRE] = {
	Name: 'SR_FALLENEMPIRE',
	SkillName: '大缠崩坠',
	MaxLv: 10,
	SpAmount: [18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SR_DRAGONCOMBO, 3]]
};
SkillInfo[SK.SA_CLASSCHANGE] = {
	Name: 'SA_CLASSCHANGE',
	SkillName: '变换成Boss级魔物',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.SR_WINDMILL] = {
	Name: 'SR_WINDMILL',
	SkillName: '旋风腿',
	MaxLv: 1,
	SpAmount: [45],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SR_CURSEDCIRCLE, 1]]
};
SkillInfo[SK.SA_SUMMONMONSTER] = {
	Name: 'SA_SUMMONMONSTER',
	SkillName: '召唤魔物',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SR_GENTLETOUCH_CURE] = {
	Name: 'SR_GENTLETOUCH_CURE',
	SkillName: '点穴-快',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.SR_GENTLETOUCH_QUIET, 1]]
};
SkillInfo[SK.SA_REVERSEORCISH] = {
	Name: 'SA_REVERSEORCISH',
	SkillName: '变成兽人面孔',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_LULLABY_DEEPSLEEP] = {
	Name: 'WM_LULLABY_DEEPSLEEP',
	SkillName: '沉睡摇篮曲',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LESSON, 1]]
};
SkillInfo[SK.SA_DEATH] = {
	Name: 'SA_DEATH',
	SkillName: '死身',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.WM_DEADHILLHERE] = {
	Name: 'WM_DEADHILLHERE',
	SkillName: '死亡峡谷',
	MaxLv: 5,
	SpAmount: [50, 53, 56, 59, 62],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.WM_SIRCLEOFNATURE, 3]]
};
SkillInfo[SK.SA_FORTUNE] = {
	Name: 'SA_FORTUNE',
	SkillName: '宿命',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.WM_SEVERE_RAINSTORM] = {
	Name: 'WM_SEVERE_RAINSTORM',
	SkillName: '大暴雨',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.MINSTREL]: [[SK.BA_MUSICALSTRIKE, 5]],
		[JobId.WANDERER]: [[SK.DC_THROWARROW, 5]]
	}
};
SkillInfo[SK.SA_TAMINGMONSTER] = {
	Name: 'SA_TAMINGMONSTER',
	SkillName: '认养宠物',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.MI_RUSH_WINDMILL] = {
	Name: 'MI_RUSH_WINDMILL',
	SkillName: '朝风车突击',
	MaxLv: 5,
	SpAmount: [82, 88, 94, 100, 106],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.SA_QUESTION] = {
	Name: 'SA_QUESTION',
	SkillName: '问号',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_REVERBERATION] = {
	Name: 'WM_REVERBERATION',
	SkillName: '残响',
	MaxLv: 5,
	SpAmount: [56, 62, 68, 74, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	NeedSkillList: {
		[JobId.MINSTREL]: [[SK.BA_DISSONANCE, 5]],
		[JobId.WANDERER]: [[SK.DC_UGLYDANCE, 5]]
	}
};
SkillInfo[SK.SA_GRAVITY] = {
	Name: 'SA_GRAVITY',
	SkillName: 'GRAVITY',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_METALICSOUND] = {
	Name: 'WM_METALICSOUND',
	SkillName: '重金属音乐',
	MaxLv: 10,
	SpAmount: [62, 64, 66, 68, 70, 72, 74, 76, 78, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_REVERBERATION, 5]]
};
SkillInfo[SK.SA_LEVELUP] = {
	Name: 'SA_LEVELUP',
	SkillName: '升级',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_LESSON] = {
	Name: 'WM_LESSON',
	SkillName: '课程',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SA_INSTANTDEATH] = {
	Name: 'SA_INSTANTDEATH',
	SkillName: '当场死亡',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MI_ECHOSONG] = {
	Name: 'MI_ECHOSONG',
	SkillName: '回音之歌',
	MaxLv: 5,
	SpAmount: [86, 92, 98, 104, 110],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LULLABY_DEEPSLEEP, 1]]
};
SkillInfo[SK.SA_FULLRECOVERY] = {
	Name: 'SA_FULLRECOVERY',
	SkillName: '完全恢复',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.WM_DOMINION_IMPULSE] = {
	Name: 'WM_DOMINION_IMPULSE',
	SkillName: '支配动力',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [11],
	_NeedSkillList: [[SK.WM_REVERBERATION, 1]]
};
SkillInfo[SK.SA_COMA] = {
	Name: 'SA_COMA',
	SkillName: '频死之术',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MG_FIREBOLT] = {
	Name: 'MG_FIREBOLT',
	SkillName: '火箭术',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.BD_ADAPTATION] = {
	Name: 'BD_ADAPTATION',
	SkillName: '临机应变',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WM_BEYOND_OF_WARCRY] = {
	Name: 'WM_BEYOND_OF_WARCRY',
	SkillName: '战嚎的彼端',
	MaxLv: 5,
	SpAmount: [120, 130, 140, 150, 160],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LERADS_DEW, 1]]
};
SkillInfo[SK.BD_ENCORE] = {
	Name: 'BD_ENCORE',
	SkillName: '安可',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BD_ADAPTATION, 1]]
};
SkillInfo[SK.SR_GENTLETOUCH_REVITALIZE] = {
	Name: 'SR_GENTLETOUCH_REVITALIZE',
	SkillName: '点穴-活',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SR_GENTLETOUCH_QUIET, 1],
		[SK.SR_GENTLETOUCH_CURE, 1],
		[SK.SR_GENTLETOUCH_ENERGYGAIN, 3]
	]
};
SkillInfo[SK.BD_LULLABY] = {
	Name: 'BD_LULLABY',
	SkillName: '摇篮曲',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1],
	NeedSkillList: { [JobId.BARD]: [[SK.BA_WHISTLE, 10]], [JobId.DANCER]: [[SK.DC_HUMMING, 10]] }
};
SkillInfo[SK.SO_PSYCHIC_WAVE] = {
	Name: 'SO_PSYCHIC_WAVE',
	SkillName: '超自然波',
	MaxLv: 5,
	SpAmount: [48, 56, 64, 70, 78],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SA_DISPELL, 1]]
};
SkillInfo[SK.BD_RICHMANKIM] = {
	Name: 'BD_RICHMANKIM',
	SkillName: '经验值倍增',
	MaxLv: 5,
	SpAmount: [62, 68, 74, 80, 86],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BD_SIEGFRIED, 3]]
};
SkillInfo[SK.SO_SUMMON_AGNI] = {
	Name: 'SO_SUMMON_AGNI',
	SkillName: '召唤火精灵阿格',
	MaxLv: 3,
	SpAmount: [100, 150, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SO_EL_CONTROL, 1],
		[SK.SO_WARMER, 3]
	]
};
SkillInfo[SK.BD_ETERNALCHAOS] = {
	Name: 'BD_ETERNALCHAOS',
	SkillName: '永远的混沌',
	MaxLv: 1,
	SpAmount: [120],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BD_ROKISWEIL, 1]]
};
SkillInfo[SK.SO_FIRE_INSIGNIA] = {
	Name: 'SO_FIRE_INSIGNIA',
	SkillName: '火之纹章',
	MaxLv: 3,
	SpAmount: [22, 30, 38],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [[SK.SO_SUMMON_AGNI, 3]]
};
SkillInfo[SK.BD_DRUMBATTLEFIELD] = {
	Name: 'BD_DRUMBATTLEFIELD',
	SkillName: '战鼓震天',
	MaxLv: 5,
	SpAmount: [50, 54, 58, 62, 66],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: {
		[JobId.BARD]: [[SK.BA_APPLEIDUN, 10]],
		[JobId.DANCER]: [[SK.DC_SERVICEFORYOU, 10]]
	}
};
SkillInfo[SK.SR_CURSEDCIRCLE] = {
	Name: 'SR_CURSEDCIRCLE',
	SkillName: '?缚阵',
	MaxLv: 5,
	SpAmount: [40, 60, 80, 100, 120],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MO_BLADESTOP, 2]]
};
SkillInfo[SK.BD_RINGNIBELUNGEN] = {
	Name: 'BD_RINGNIBELUNGEN',
	SkillName: '尼贝隆根之戒指',
	MaxLv: 5,
	SpAmount: [64, 60, 56, 52, 48],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BD_DRUMBATTLEFIELD, 3]]
};
SkillInfo[SK.GN_SPORE_EXPLOSION] = {
	Name: 'GN_SPORE_EXPLOSION',
	SkillName: '爆炸孢子',
	MaxLv: 10,
	SpAmount: [48, 52, 56, 60, 64, 68, 72, 76, 80, 84],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 4]]
};
SkillInfo[SK.BD_ROKISWEIL] = {
	Name: 'BD_ROKISWEIL',
	SkillName: '洛奇的悲鸣',
	MaxLv: 1,
	SpAmount: [180],
	bSeperateLv: false,
	AttackRange: [1],
	NeedSkillList: {
		[JobId.BARD]: [[SK.BA_ASSASSINCROSS, 10]],
		[JobId.DANCER]: [[SK.DC_DONTFORGETME, 10]]
	}
};
SkillInfo[SK.SR_RAMPAGEBLASTER] = {
	Name: 'SR_RAMPAGEBLASTER',
	SkillName: '爆气散弹',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SR_EARTHSHAKER, 2]]
};
SkillInfo[SK.BD_INTOABYSS] = {
	Name: 'BD_INTOABYSS',
	SkillName: '触媒之所',
	MaxLv: 1,
	SpAmount: [70],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.BD_LULLABY, 1]]
};
SkillInfo[SK.GN_S_PHARMACY] = {
	Name: 'GN_S_PHARMACY',
	SkillName: '专门配药',
	MaxLv: 10,
	SpAmount: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.BD_SIEGFRIED] = {
	Name: 'BD_SIEGFRIED',
	SkillName: '不死神齐格弗里德',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	NeedSkillList: { [JobId.BARD]: [[SK.BA_POEMBRAGI, 10]], [JobId.DANCER]: [[SK.DC_FORTUNEKISS, 10]] }
};
SkillInfo[SK.GD_RESTORE] = {
	Name: 'GD_RESTORE',
	SkillName: '恢复公会员体力',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.BD_RAGNAROK] = {
	Name: 'BD_RAGNAROK',
	SkillName: '仙境传说',
	MaxLv: 0,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: []
};
SkillInfo[SK.LG_INSPIRATION] = {
	Name: 'LG_INSPIRATION',
	SkillName: '灵感',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.LG_PIETY, 5],
		[SK.LG_RAYOFGENESIS, 4],
		[SK.LG_SHIELDSPELL, 3]
	]
};
SkillInfo[SK.BA_MUSICALLESSON] = {
	Name: 'BA_MUSICALLESSON',
	SkillName: '操控乐器',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.LG_PIETY] = {
	Name: 'LG_PIETY',
	SkillName: '虔诚',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.CR_TRUST, 3]]
};
SkillInfo[SK.BA_MUSICALSTRIKE] = {
	Name: 'BA_MUSICALSTRIKE',
	SkillName: '乐器攻击',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.BA_MUSICALLESSON, 3]]
};
SkillInfo[SK.LG_PRESTIGE] = {
	Name: 'LG_PRESTIGE',
	SkillName: '威信',
	MaxLv: 5,
	SpAmount: [75, 80, 85, 90, 95],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_TRAMPLE, 3]]
};
SkillInfo[SK.BA_DISSONANCE] = {
	Name: 'BA_DISSONANCE',
	SkillName: '不谐和音',
	MaxLv: 5,
	SpAmount: [35, 38, 41, 44, 47],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BD_ADAPTATION, 1],
		[SK.BA_MUSICALLESSON, 1]
	]
};
SkillInfo[SK.ALL_ODINS_POWER] = {
	Name: 'ALL_ODINS_POWER',
	SkillName: '奥丁之神力',
	MaxLv: 2,
	SpAmount: [70, 100],
	bSeperateLv: false,
	AttackRange: [9, 9]
};
SkillInfo[SK.BA_FROSTJOKE] = {
	Name: 'BA_FROSTJOKE',
	SkillName: '冷笑话',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.BD_ENCORE, 1]]
};
SkillInfo[SK.LG_EXEEDBREAK] = {
	Name: 'LG_EXEEDBREAK',
	SkillName: '强化冲击',
	MaxLv: 5,
	SpAmount: [20, 32, 44, 56, 68],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_BANISHINGPOINT, 3]]
};
SkillInfo[SK.BA_WHISTLE] = {
	Name: 'BA_WHISTLE',
	SkillName: '吹口哨',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.MG_LIGHTNINGBOLT] = {
	Name: 'MG_LIGHTNINGBOLT',
	SkillName: '雷击术',
	MaxLv: 10,
	SpAmount: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
};
SkillInfo[SK.BA_ASSASSINCROSS] = {
	Name: 'BA_ASSASSINCROSS',
	SkillName: '刺客的黄昏',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.LG_RAGEBURST] = {
	Name: 'LG_RAGEBURST',
	SkillName: '愤怒突击',
	MaxLv: 1,
	SpAmount: [150],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.LG_FORCEOFVANGUARD, 1]]
};
SkillInfo[SK.BA_POEMBRAGI] = {
	Name: 'BA_POEMBRAGI',
	SkillName: '布莱奇之诗',
	MaxLv: 10,
	SpAmount: [65, 70, 75, 80, 85, 90, 95, 100, 105, 110],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.ML_DEVOTION] = {
	Name: 'ML_DEVOTION',
	SkillName: '牺牲',
	MaxLv: 5,
	SpAmount: [25, 25, 25, 25, 25],
	bSeperateLv: false,
	AttackRange: [7, 8, 9, 10, 11]
};
SkillInfo[SK.BA_APPLEIDUN] = {
	Name: 'BA_APPLEIDUN',
	SkillName: '伊登的苹果',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.LG_TRAMPLE] = {
	Name: 'LG_TRAMPLE',
	SkillName: '摧残',
	MaxLv: 3,
	SpAmount: [30, 45, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1]
};
SkillInfo[SK.DC_DANCINGLESSON] = {
	Name: 'DC_DANCINGLESSON',
	SkillName: '练习舞蹈',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SC_MAELSTROM] = {
	Name: 'SC_MAELSTROM',
	SkillName: '漩涡',
	MaxLv: 3,
	SpAmount: [50, 55, 60],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [
		[SK.SC_CHAOSPANIC, 3],
		[SK.SC_UNLUCKY, 3]
	]
};
SkillInfo[SK.DC_THROWARROW] = {
	Name: 'DC_THROWARROW',
	SkillName: '缠箭投掷',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.DC_DANCINGLESSON, 3]]
};
SkillInfo[SK.SC_CHAOSPANIC] = {
	Name: 'SC_CHAOSPANIC',
	SkillName: '混沌恐慌',
	MaxLv: 3,
	SpAmount: [30, 36, 42],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.SC_MANHOLE, 1]]
};
SkillInfo[SK.DC_UGLYDANCE] = {
	Name: 'DC_UGLYDANCE',
	SkillName: '丑陋之舞',
	MaxLv: 5,
	SpAmount: [35, 38, 41, 44, 47],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BD_ADAPTATION, 1],
		[SK.DC_DANCINGLESSON, 1]
	]
};
SkillInfo[SK.SC_DIMENSIONDOOR] = {
	Name: 'SC_DIMENSIONDOOR',
	SkillName: '异次元之门',
	MaxLv: 3,
	SpAmount: [30, 36, 42],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.SC_MANHOLE, 1]]
};
SkillInfo[SK.DC_SCREAM] = {
	Name: 'DC_SCREAM',
	SkillName: '惊声尖叫',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BD_ENCORE, 1]]
};
SkillInfo[SK.SC_MANHOLE] = {
	Name: 'SC_MANHOLE',
	SkillName: '人孔',
	MaxLv: 3,
	SpAmount: [20, 25, 30],
	bSeperateLv: true,
	AttackRange: [7, 7, 7],
	_NeedSkillList: [[SK.RG_FLAGGRAFFITI, 1]]
};
SkillInfo[SK.DC_HUMMING] = {
	Name: 'DC_HUMMING',
	SkillName: '哼唱之音',
	MaxLv: 10,
	SpAmount: [33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.EL_PYROTECHNIC] = {
	Name: 'EL_PYROTECHNIC',
	SkillName: '烈焰强化',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DC_DONTFORGETME] = {
	Name: 'DC_DONTFORGETME',
	SkillName: '勿忘我',
	MaxLv: 10,
	SpAmount: [38, 41, 44, 47, 50, 53, 56, 59, 62, 65],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SC_WEAKNESS] = {
	Name: 'SC_WEAKNESS',
	SkillName: '面具 : 衰弱',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [
		[SK.SC_ENERVATION, 1],
		[SK.SC_GROOMY, 1],
		[SK.SC_IGNORANCE, 1]
	]
};
SkillInfo[SK.DC_FORTUNEKISS] = {
	Name: 'DC_FORTUNEKISS',
	SkillName: '女神之吻',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SC_UNLUCKY] = {
	Name: 'SC_UNLUCKY',
	SkillName: '面具 : 不幸',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [
		[SK.SC_LAZINESS, 1],
		[SK.SC_WEAKNESS, 1]
	]
};
SkillInfo[SK.DC_SERVICEFORYOU] = {
	Name: 'DC_SERVICEFORYOU',
	SkillName: "Gypsy's Kiss",
	MaxLv: 10,
	SpAmount: [60, 63, 66, 69, 72, 75, 78, 81, 84, 87],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SC_IGNORANCE] = {
	Name: 'SC_IGNORANCE',
	SkillName: '面具 : 无知',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.SC_BODYPAINT, 1]]
};
SkillInfo[SK.SC_GROOMY] = {
	Name: 'SC_GROOMY',
	SkillName: '面具 : 忧郁',
	MaxLv: 3,
	SpAmount: [30, 40, 50],
	bSeperateLv: true,
	AttackRange: [3, 3, 3],
	_NeedSkillList: [[SK.SC_BODYPAINT, 1]]
};
SkillInfo[SK.SC_INVISIBILITY] = {
	Name: 'SC_INVISIBILITY',
	SkillName: '透明术',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_UNLUCKY, 3],
		[SK.SC_AUTOSHADOWSPELL, 7],
		[SK.SC_DEADLYINFECT, 5]
	]
};
SkillInfo[SK.SC_AUTOSHADOWSPELL] = {
	Name: 'SC_AUTOSHADOWSPELL',
	SkillName: '自动魅影念咒',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SC_REPRODUCE, 5]]
};
SkillInfo[SK.SC_REPRODUCE] = {
	Name: 'SC_REPRODUCE',
	SkillName: '繁殖',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_PLAGIARISM, 5]]
};
SkillInfo[SK.SC_FATALMENACE] = {
	Name: 'SC_FATALMENACE',
	SkillName: '致命威胁',
	MaxLv: 10,
	SpAmount: [10, 14, 18, 22, 26, 30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RG_INTIMIDATE, 5]]
};
SkillInfo[SK.NC_MAGICDECOY] = {
	Name: 'NC_MAGICDECOY',
	SkillName: 'FAW 魔法傀儡',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.NC_SILVERSNIPER, 2]]
};
SkillInfo[SK.WE_MALE] = {
	Name: 'WE_MALE',
	SkillName: '只呵护妳',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.NC_AXEBOOMERANG] = {
	Name: 'NC_AXEBOOMERANG',
	SkillName: '回旋斧',
	MaxLv: 5,
	SpAmount: [20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.NC_TRAININGAXE, 1]]
};
SkillInfo[SK.WE_FEMALE] = {
	Name: 'WE_FEMALE',
	SkillName: '只为你牺牲',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.MG_THUNDERSTORM] = {
	Name: 'MG_THUNDERSTORM',
	SkillName: '雷爆术',
	MaxLv: 10,
	SpAmount: [29, 34, 39, 44, 49, 54, 59, 64, 69, 74],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MG_LIGHTNINGBOLT, 4]]
};
SkillInfo[SK.WE_CALLPARTNER] = {
	Name: 'WE_CALLPARTNER',
	SkillName: '想念你',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.NC_RESEARCHFE] = {
	Name: 'NC_RESEARCHFE',
	SkillName: '火焰与大地的研究',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.ITM_TOMAHAWK] = {
	Name: 'ITM_TOMAHAWK',
	SkillName: '投掷风灵之斧',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [9]
};
SkillInfo[SK.NC_STEALTHFIELD] = {
	Name: 'NC_STEALTHFIELD',
	SkillName: '隐形力场',
	MaxLv: 3,
	SpAmount: [80, 100, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.NC_ANALYZE, 3],
		[SK.NC_NEUTRALBARRIER, 2]
	]
};
SkillInfo[SK.NC_INFRAREDSCAN] = {
	Name: 'NC_INFRAREDSCAN',
	SkillName: '红外线扫瞄',
	MaxLv: 1,
	SpAmount: [45],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_SHAPESHIFT, 2]]
};
SkillInfo[SK.NC_EMERGENCYCOOL] = {
	Name: 'NC_EMERGENCYCOOL',
	SkillName: '紧急冷却',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NC_SELFDESTRUCTION, 2]]
};
SkillInfo[SK.NC_SHAPESHIFT] = {
	Name: 'NC_SHAPESHIFT',
	SkillName: '形态转换',
	MaxLv: 4,
	SpAmount: [100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_MAINFRAME, 2]]
};
SkillInfo[SK.NC_SELFDESTRUCTION] = {
	Name: 'NC_SELFDESTRUCTION',
	SkillName: '自我摧毁',
	MaxLv: 3,
	SpAmount: [200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_MAINFRAME, 2]]
};
SkillInfo[SK.NC_MAINFRAME] = {
	Name: 'NC_MAINFRAME',
	SkillName: '主体改造',
	MaxLv: 4,
	SpAmount: [0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 4]]
};
SkillInfo[SK.NC_ACCELERATION] = {
	Name: 'NC_ACCELERATION',
	SkillName: '魔导机甲加速',
	MaxLv: 3,
	SpAmount: [20, 40, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.NC_MADOLICENCE, 1]]
};
SkillInfo[SK.NC_ARMSCANNON] = {
	Name: 'NC_ARMSCANNON',
	SkillName: '加农炮',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.NC_FLAMELAUNCHER, 2],
		[SK.NC_COLDSLOWER, 2]
	]
};
SkillInfo[SK.NC_VULCANARM] = {
	Name: 'NC_VULCANARM',
	SkillName: '火神炮',
	MaxLv: 3,
	SpAmount: [9, 12, 15],
	bSeperateLv: true,
	AttackRange: [13, 13, 13],
	_NeedSkillList: [[SK.NC_BOOSTKNUCKLE, 2]]
};
SkillInfo[SK.RA_ICEBOUNDTRAP] = {
	Name: 'RA_ICEBOUNDTRAP',
	SkillName: '冰封陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RA_DETONATOR, 1]]
};
SkillInfo[SK.RA_FIRINGTRAP] = {
	Name: 'RA_FIRINGTRAP',
	SkillName: '燃烧陷阱',
	MaxLv: 5,
	SpAmount: [10, 10, 10, 10, 10],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.RA_DETONATOR, 1]]
};
SkillInfo[SK.RA_VERDURETRAP] = {
	Name: 'RA_VERDURETRAP',
	SkillName: '青翠陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.RA_COBALTTRAP] = {
	Name: 'RA_COBALTTRAP',
	SkillName: '深蓝陷阱',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [3],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 1]]
};
SkillInfo[SK.RA_SENSITIVEKEEN] = {
	Name: 'RA_SENSITIVEKEEN',
	SkillName: '敏锐嗅觉',
	MaxLv: 5,
	SpAmount: [12, 12, 12, 12, 12],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_TOOTHOFWUG, 3]]
};
SkillInfo[SK.RA_TOOTHOFWUG] = {
	Name: 'RA_TOOTHOFWUG',
	SkillName: '狼牙',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_WUGMASTERY, 1]]
};
SkillInfo[SK.RA_WUGDASH] = {
	Name: 'RA_WUGDASH',
	SkillName: '疾狼术',
	MaxLv: 1,
	SpAmount: [4],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.RA_WUGRIDER, 1]]
};
SkillInfo[SK.RA_ELECTRICSHOCKER] = {
	Name: 'RA_ELECTRICSHOCKER',
	SkillName: '电击陷阱',
	MaxLv: 5,
	SpAmount: [35, 35, 35, 35, 35],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.HT_SHOCKWAVE, 5]]
};
SkillInfo[SK.RA_DETONATOR] = {
	Name: 'RA_DETONATOR',
	SkillName: '雷管',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.RA_CLUSTERBOMB, 3]]
};
SkillInfo[SK.RA_AIMEDBOLT] = {
	Name: 'RA_AIMEDBOLT',
	SkillName: '瞄准标靶',
	MaxLv: 10,
	SpAmount: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.HT_ANKLESNARE, 5]]
};
SkillInfo[SK.RA_RANGERMAIN] = {
	Name: 'RA_RANGERMAIN',
	SkillName: '游侠主意',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RA_FEARBREEZE] = {
	Name: 'RA_FEARBREEZE',
	SkillName: '微风恐惧',
	MaxLv: 5,
	SpAmount: [55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.RA_ARROWSTORM, 5],
		[SK.RA_CAMOUFLAGE, 1]
	]
};
SkillInfo[SK.WL_RELEASE] = {
	Name: 'WL_RELEASE',
	SkillName: '释放',
	MaxLv: 2,
	SpAmount: [10, 10],
	bSeperateLv: true,
	AttackRange: [11, 11]
};
SkillInfo[SK.WL_SUMMONSTONE] = {
	Name: 'WL_SUMMONSTONE',
	SkillName: '召唤石块',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_HEAVENDRIVE, 1]]
};
SkillInfo[SK.WL_SUMMONFB] = {
	Name: 'WL_SUMMONFB',
	SkillName: '召唤火焰球',
	MaxLv: 2,
	SpAmount: [10, 50],
	bSeperateLv: true,
	AttackRange: [1, 1],
	_NeedSkillList: [[SK.WZ_METEOR, 1]]
};
SkillInfo[SK.WL_CHAINLIGHTNING] = {
	Name: 'WL_CHAINLIGHTNING',
	SkillName: '连锁电击',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SUMMONBL, 1]]
};
SkillInfo[SK.WL_COMET] = {
	Name: 'WL_COMET',
	SkillName: '毁灭慧星',
	MaxLv: 5,
	SpAmount: [70, 90, 110, 130, 150],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_HELLINFERNO, 3]]
};
SkillInfo[SK.WL_DRAINLIFE] = {
	Name: 'WL_DRAINLIFE',
	SkillName: '吸星大法',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_RADIUS, 1]]
};
SkillInfo[SK.WL_RECOGNIZEDSPELL] = {
	Name: 'WL_RECOGNIZEDSPELL',
	SkillName: '魔法省悟',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.WL_RELEASE, 2],
		[SK.WL_STASIS, 1],
		[SK.WL_WHITEIMPRISON, 1]
	]
};
SkillInfo[SK.AL_DP] = {
	Name: 'AL_DP',
	SkillName: '天使之护',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	NeedSkillList: { [JobId.CRUSADER]: [[SK.AL_CURE, 1]] }
};
SkillInfo[SK.WL_MARSHOFABYSS] = {
	Name: 'WL_MARSHOFABYSS',
	SkillName: '深渊沼地',
	MaxLv: 5,
	SpAmount: [40, 42, 44, 46, 48],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WZ_QUAGMIRE, 1]]
};
SkillInfo[SK.WL_JACKFROST] = {
	Name: 'WL_JACKFROST',
	SkillName: '冻僵术',
	MaxLv: 5,
	SpAmount: [50, 60, 70, 80, 90],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_FROSTMISTY, 2]]
};
SkillInfo[SK.WL_FROSTMISTY] = {
	Name: 'WL_FROSTMISTY',
	SkillName: '寒冰浓雾',
	MaxLv: 5,
	SpAmount: [40, 48, 56, 64, 72],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_SUMMONWB, 1]]
};
SkillInfo[SK.WL_SOULEXPANSION] = {
	Name: 'WL_SOULEXPANSION',
	SkillName: '灵魂爆炸',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.WL_DRAINLIFE, 1]]
};
SkillInfo[SK.AB_EXPIATIO] = {
	Name: 'AB_EXPIATIO',
	SkillName: '赎罪',
	MaxLv: 5,
	SpAmount: [35, 40, 45, 50, 55],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_DUPLELIGHT, 5],
		[SK.AB_ORATIO, 5]
	]
};
SkillInfo[SK.LK_AURABLADE] = {
	Name: 'LK_AURABLADE',
	SkillName: '灵气剑',
	MaxLv: 5,
	SpAmount: [18, 26, 34, 42, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SM_MAGNUM, 5],
		[SK.SM_TWOHAND, 5]
	]
};
SkillInfo[SK.AB_RENOVATIO] = {
	Name: 'AB_RENOVATIO',
	SkillName: '净化',
	MaxLv: 4,
	SpAmount: [240, 280, 320, 360],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_CHEAL, 3]]
};
SkillInfo[SK.LK_PARRYING] = {
	Name: 'LK_PARRYING',
	SkillName: '双剑挌挡',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SM_PROVOKE, 5],
		[SK.SM_TWOHAND, 10],
		[SK.KN_TWOHANDQUICKEN, 3]
	]
};
SkillInfo[SK.AB_LAUDAAGNUS] = {
	Name: 'AB_LAUDAAGNUS',
	SkillName: '羔羊歌颂',
	MaxLv: 4,
	SpAmount: [50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_STRECOVERY, 1]]
};
SkillInfo[SK.LK_CONCENTRATION] = {
	Name: 'LK_CONCENTRATION',
	SkillName: '集中攻击',
	MaxLv: 5,
	SpAmount: [14, 18, 22, 26, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SM_RECOVERY, 5],
		[SK.KN_SPEARMASTERY, 5],
		[SK.KN_RIDING, 1]
	]
};
SkillInfo[SK.AB_ORATIO] = {
	Name: 'AB_ORATIO',
	SkillName: '祈祷文',
	MaxLv: 10,
	SpAmount: [35, 38, 41, 44, 47, 50, 53, 56, 59, 62],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.AB_PRAEFATIO, 5]]
};
SkillInfo[SK.LK_TENSIONRELAX] = {
	Name: 'LK_TENSIONRELAX',
	SkillName: '极速回复',
	MaxLv: 1,
	SpAmount: [15],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SM_PROVOKE, 5],
		[SK.SM_RECOVERY, 10],
		[SK.SM_ENDURE, 3]
	]
};
SkillInfo[SK.AB_PRAEFATIO] = {
	Name: 'AB_PRAEFATIO',
	SkillName: '感恩歌',
	MaxLv: 10,
	SpAmount: [90, 100, 110, 120, 130, 140, 150, 160, 170, 180],
	bSeperateLv: false,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.PR_KYRIE, 1]]
};
SkillInfo[SK.LK_BERSERK] = {
	Name: 'LK_BERSERK',
	SkillName: '狂怒之枪',
	MaxLv: 1,
	SpAmount: [200],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.AB_EPICLESIS] = {
	Name: 'AB_EPICLESIS',
	SkillName: '圣灵降临祈祷',
	MaxLv: 5,
	SpAmount: [300, 300, 300, 300, 300],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AB_ANCILLA, 1],
		[SK.AB_HIGHNESSHEAL, 1]
	]
};
SkillInfo[SK.AB_CHEAL] = {
	Name: 'AB_CHEAL',
	SkillName: '灿烂圣光',
	MaxLv: 3,
	SpAmount: [200, 220, 240],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.AL_HEAL, 1]]
};
SkillInfo[SK.AB_ANCILLA] = {
	Name: 'AB_ANCILLA',
	SkillName: '安希拉',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.AB_CLEMENTIA, 3]]
};
SkillInfo[SK.HP_ASSUMPTIO] = {
	Name: 'HP_ASSUMPTIO',
	SkillName: '圣母之祈福',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AL_ANGELUS, 1],
		[SK.MG_SRECOVERY, 3],
		[SK.PR_IMPOSITIO, 3]
	]
};
SkillInfo[SK.GC_HALLUCINATIONWALK] = {
	Name: 'GC_HALLUCINATIONWALK',
	SkillName: '幻影步',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_PHANTOMMENACE, 1]]
};
SkillInfo[SK.HP_BASILICA] = {
	Name: 'HP_BASILICA',
	SkillName: '神圣殿堂',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.PR_GLORIA, 2],
		[SK.MG_SRECOVERY, 1],
		[SK.PR_KYRIE, 3]
	]
};
SkillInfo[SK.GC_VENOMPRESSURE] = {
	Name: 'GC_VENOMPRESSURE',
	SkillName: '剧毒强制赋予',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.GC_WEAPONBLOCKING, 1],
		[SK.GC_POISONINGWEAPON, 3]
	]
};
SkillInfo[SK.HP_MEDITATIO] = {
	Name: 'HP_MEDITATIO',
	SkillName: '冥想',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 5],
		[SK.PR_LEXDIVINA, 5],
		[SK.PR_ASPERSIO, 3]
	]
};
SkillInfo[SK.GC_WEAPONCRUSH] = {
	Name: 'GC_WEAPONCRUSH',
	SkillName: '卸除武装',
	MaxLv: 5,
	SpAmount: [20, 20, 20, 20, 20],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_WEAPONBLOCKING, 1]]
};
SkillInfo[SK.HW_SOULDRAIN] = {
	Name: 'HW_SOULDRAIN',
	SkillName: '吸魂术',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 5],
		[SK.MG_SOULSTRIKE, 7]
	]
};
SkillInfo[SK.GC_POISONINGWEAPON] = {
	Name: 'GC_POISONINGWEAPON',
	SkillName: '剧毒武器',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_CREATENEWPOISON, 1]]
};
SkillInfo[SK.HW_MAGICCRASHER] = {
	Name: 'HW_MAGICCRASHER',
	SkillName: '魔击术',
	MaxLv: 1,
	SpAmount: [8],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.MG_SRECOVERY, 1]]
};
SkillInfo[SK.GC_DARKILLUSION] = {
	Name: 'GC_DARKILLUSION',
	SkillName: '黑色幻影',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.GC_CROSSIMPACT, 3]]
};
SkillInfo[SK.HW_MAGICPOWER] = {
	Name: 'HW_MAGICPOWER',
	SkillName: '魔力增幅',
	MaxLv: 10,
	SpAmount: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_ABUNDANCE] = {
	Name: 'RK_ABUNDANCE',
	SkillName: '丰足',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PA_PRESSURE] = {
	Name: 'PA_PRESSURE',
	SkillName: '神之威压',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SM_ENDURE, 5],
		[SK.CR_TRUST, 5],
		[SK.CR_SHIELDCHARGE, 2]
	]
};
SkillInfo[SK.AL_DEMONBANE] = {
	Name: 'AL_DEMONBANE',
	SkillName: '天使之击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AL_DP, 3]]
};
SkillInfo[SK.PA_SACRIFICE] = {
	Name: 'PA_SACRIFICE',
	SkillName: "Martyr's Reckoning",
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: false,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SM_ENDURE, 1],
		[SK.CR_DEVOTION, 3]
	]
};
SkillInfo[SK.RK_STONEHARDSKIN] = {
	Name: 'RK_STONEHARDSKIN',
	SkillName: '岩石皮肤',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.PA_GOSPEL] = {
	Name: 'PA_GOSPEL',
	SkillName: '圣音',
	MaxLv: 10,
	SpAmount: [80, 80, 80, 80, 80, 100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.CR_TRUST, 8],
		[SK.AL_DP, 3],
		[SK.AL_DEMONBANE, 5]
	]
};
SkillInfo[SK.RK_GIANTGROWTH] = {
	Name: 'RK_GIANTGROWTH',
	SkillName: '力量成长',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CH_PALMSTRIKE] = {
	Name: 'CH_PALMSTRIKE',
	SkillName: '猛虎硬爬山',
	MaxLv: 5,
	SpAmount: [2, 4, 6, 8, 10],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 7],
		[SK.MO_CALLSPIRITS, 5]
	]
};
SkillInfo[SK.RK_MILLENNIUMSHIELD] = {
	Name: 'RK_MILLENNIUMSHIELD',
	SkillName: '千年神盾',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.CH_TIGERFIST] = {
	Name: 'CH_TIGERFIST',
	SkillName: '伏虎拳',
	MaxLv: 5,
	SpAmount: [4, 6, 8, 10, 12],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 5],
		[SK.MO_TRIPLEATTACK, 5],
		[SK.MO_COMBOFINISH, 3]
	]
};
SkillInfo[SK.RK_DRAGONTRAINING] = {
	Name: 'RK_DRAGONTRAINING',
	SkillName: '龙驾驭',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KN_CAVALIERMASTERY, 1]]
};
SkillInfo[SK.CH_CHAINCRUSH] = {
	Name: 'CH_CHAINCRUSH',
	SkillName: '气绝崩击',
	MaxLv: 10,
	SpAmount: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.MO_IRONHAND, 5],
		[SK.MO_CALLSPIRITS, 5],
		[SK.CH_TIGERFIST, 2]
	]
};
SkillInfo[SK.RK_DEATHBOUND] = {
	Name: 'RK_DEATHBOUND',
	SkillName: '死亡反弹',
	MaxLv: 10,
	SpAmount: [50, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.KN_AUTOCOUNTER, 1],
		[SK.RK_ENCHANTBLADE, 2]
	]
};
SkillInfo[SK.PF_HPCONVERSION] = {
	Name: 'PF_HPCONVERSION',
	SkillName: 'HP转换',
	MaxLv: 5,
	SpAmount: [1, 2, 3, 4, 5],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MG_SRECOVERY, 1],
		[SK.SA_MAGICROD, 1]
	]
};
SkillInfo[SK.HVAN_INSTRUCT] = {
	Name: 'HVAN_INSTRUCT',
	SkillName: '变更指示',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.PF_SOULCHANGE] = {
	Name: 'PF_SOULCHANGE',
	SkillName: '心神互换',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [
		[SK.SA_MAGICROD, 3],
		[SK.SA_SPELLBREAKER, 2]
	]
};
SkillInfo[SK.MH_STAHL_HORN] = {
	Name: 'MH_STAHL_HORN',
	SkillName: '钢铁之角',
	MaxLv: 10,
	SpAmount: [43, 46, 49, 52, 55, 58, 61, 64, 67, 70],
	bSeperateLv: true,
	AttackRange: [5, 5, 6, 6, 7, 7, 8, 8, 9, 9]
};
SkillInfo[SK.PF_SOULBURN] = {
	Name: 'PF_SOULBURN',
	SkillName: '精神耗弱术',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SA_CASTCANCEL, 5],
		[SK.SA_MAGICROD, 3],
		[SK.SA_DISPELL, 3]
	]
};
SkillInfo[SK.NPC_MAGICMIRROR] = {
	Name: 'NPC_MAGICMIRROR',
	SkillName: '魔镜',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ASC_KATAR] = {
	Name: 'ASC_KATAR',
	SkillName: '高阶拳刃修练',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TF_DOUBLE, 5],
		[SK.AS_KATAR, 7]
	]
};
SkillInfo[SK.DA_DREAM] = {
	Name: 'DA_DREAM',
	SkillName: '<黑暗搜集者>宝石之梦',
	MaxLv: 5,
	SpAmount: [600, 500, 400, 300, 200],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DA_SPACE] = {
	Name: 'DA_SPACE',
	SkillName: '<黑暗搜集者>暮光',
	MaxLv: 5,
	SpAmount: [120, 100, 80, 60, 40],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.GD_EMERGENCYCALL] = {
	Name: 'GD_EMERGENCYCALL',
	SkillName: '紧急呼叫',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ASC_EDP] = {
	Name: 'ASC_EDP',
	SkillName: '致命涂毒',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.ASC_CDP, 1]]
};
SkillInfo[SK.DE_NIGHTMARE] = {
	Name: 'DE_NIGHTMARE',
	SkillName: '<死亡骑士>梦魇',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [4]
};
SkillInfo[SK.ASC_BREAKER] = {
	Name: 'ASC_BREAKER',
	SkillName: '心灵震波',
	MaxLv: 10,
	SpAmount: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	_NeedSkillList: [
		[SK.TF_DOUBLE, 5],
		[SK.TF_POISON, 5],
		[SK.AS_CLOAKING, 3],
		[SK.AS_ENCHANTPOISON, 6]
	]
};
SkillInfo[SK.SL_GUNNER] = {
	Name: 'SL_GUNNER',
	SkillName: '神枪手之魂',
	MaxLv: 5,
	SpAmount: [460, 360, 260, 160, 60],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.SN_SIGHT] = {
	Name: 'SN_SIGHT',
	SkillName: '狙杀瞄准',
	MaxLv: 10,
	SpAmount: [20, 20, 25, 25, 30, 30, 35, 35, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AC_OWL, 10],
		[SK.AC_VULTURE, 10],
		[SK.AC_CONCENTRATION, 10],
		[SK.HT_FALCON, 1]
	]
};
SkillInfo[SK.MB_MUNAKKNOWLEDGE] = {
	Name: 'MB_MUNAKKNOWLEDGE',
	SkillName:
		'ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã…â€™Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã¢â‚¬â€œÃƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¶ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [4]
};
SkillInfo[SK.SN_FALCONASSAULT] = {
	Name: 'SN_FALCONASSAULT',
	SkillName: '猎鹰突击',
	MaxLv: 5,
	SpAmount: [30, 34, 38, 42, 46],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AC_VULTURE, 5],
		[SK.HT_FALCON, 1],
		[SK.HT_BLITZBEAT, 5],
		[SK.HT_STEELCROW, 3]
	]
};
SkillInfo[SK.NJ_NEN] = {
	Name: 'NJ_NEN',
	SkillName: '念',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_NINPOU, 5]]
};
SkillInfo[SK.SN_SHARPSHOOTING] = {
	Name: 'SN_SHARPSHOOTING',
	SkillName: '锐利射击',
	MaxLv: 5,
	SpAmount: [16, 18, 20, 22, 24],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.AC_DOUBLE, 5],
		[SK.AC_CONCENTRATION, 10]
	]
};
SkillInfo[SK.NJ_TATAMIGAESHI] = {
	Name: 'NJ_TATAMIGAESHI',
	SkillName: '榻榻米攻击',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.GS_CHAINACTION] = {
	Name: 'GS_CHAINACTION',
	SkillName: '连锁冲击',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GS_SINGLEACTION, 1]]
};
SkillInfo[SK.KO_YAMIKUMO] = {
	Name: 'KO_YAMIKUMO',
	SkillName: '暗云',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.NJ_KIRIKAGE, 5]]
};
SkillInfo[SK.KO_RIGHT] = {
	Name: 'KO_RIGHT',
	SkillName: '右手修练',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.KO_LEFT] = {
	Name: 'KO_LEFT',
	SkillName: '左手修练',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.KO_JYUMONJIKIRI] = {
	Name: 'KO_JYUMONJIKIRI',
	SkillName: '幽冥十字斩',
	MaxLv: 10,
	SpAmount: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28],
	bSeperateLv: true,
	AttackRange: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7],
	_NeedSkillList: [[SK.KO_YAMIKUMO, 1]]
};
SkillInfo[SK.KO_SETSUDAN] = {
	Name: 'KO_SETSUDAN',
	SkillName: '灵魂阻隔',
	MaxLv: 5,
	SpAmount: [12, 16, 20, 24, 28],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.KO_JYUMONJIKIRI, 2]]
};
SkillInfo[SK.KO_BAKURETSU] = {
	Name: 'KO_BAKURETSU',
	SkillName: '炸弹飞刀',
	MaxLv: 5,
	SpAmount: [5, 6, 7, 8, 9],
	bSeperateLv: true,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [[SK.NJ_KUNAI, 5]]
};
SkillInfo[SK.KO_HAPPOKUNAI] = {
	Name: 'KO_HAPPOKUNAI',
	SkillName: '八方飞刀',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KO_BAKURETSU, 1]]
};
SkillInfo[SK.KO_MUCHANAGE] = {
	Name: 'KO_MUCHANAGE',
	SkillName: '投掷魔币',
	MaxLv: 10,
	SpAmount: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.KO_MAKIBISHI, 3]]
};
SkillInfo[SK.KO_HUUMARANKA] = {
	Name: 'KO_HUUMARANKA',
	SkillName: '风魔飞镖之飘花',
	MaxLv: 10,
	SpAmount: [22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.NJ_HUUMA, 5]]
};
SkillInfo[SK.KO_MAKIBISHI] = {
	Name: 'KO_MAKIBISHI',
	SkillName: '投掷三角钉',
	MaxLv: 5,
	SpAmount: [9, 12, 15, 18, 21],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.NJ_ZENYNAGE, 1]]
};
SkillInfo[SK.KO_MEIKYOUSISUI] = {
	Name: 'KO_MEIKYOUSISUI',
	SkillName: '明镜止水',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_NINPOU, 10]]
};
SkillInfo[SK.KO_ZANZOU] = {
	Name: 'KO_ZANZOU',
	SkillName: '幻术-残影',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_UTSUSEMI, 1]]
};
SkillInfo[SK.KO_KYOUGAKU] = {
	Name: 'KO_KYOUGAKU',
	SkillName: '幻术-惊恐',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.KO_GENWAKU, 2]]
};
SkillInfo[SK.KO_JYUSATSU] = {
	Name: 'KO_JYUSATSU',
	SkillName: '幻术-咒死',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [5, 5, 5, 5, 5],
	_NeedSkillList: [[SK.KO_KYOUGAKU, 3]]
};
SkillInfo[SK.KO_KAHU_ENTEN] = {
	Name: 'KO_KAHU_ENTEN',
	SkillName: '火符:炎天',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_HYOUHU_HUBUKI] = {
	Name: 'KO_HYOUHU_HUBUKI',
	SkillName: '冰符:吹雪',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_KAZEHU_SEIRAN] = {
	Name: 'KO_KAZEHU_SEIRAN',
	SkillName: '风符:?岚',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_DOHU_KOUKAI] = {
	Name: 'KO_DOHU_KOUKAI',
	SkillName: '地符:刚块',
	MaxLv: 1,
	SpAmount: [20],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.KO_KAIHOU] = {
	Name: 'KO_KAIHOU',
	SkillName: '法术-释放',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.KO_KAHU_ENTEN, 1],
		[SK.KO_HYOUHU_HUBUKI, 1],
		[SK.KO_KAZEHU_SEIRAN, 1],
		[SK.KO_DOHU_KOUKAI, 1]
	]
};
SkillInfo[SK.KO_ZENKAI] = {
	Name: 'KO_ZENKAI',
	SkillName: '法术-施展',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.KO_KAIHOU, 1],
		[SK.KO_IZAYOI, 1]
	]
};
SkillInfo[SK.KO_GENWAKU] = {
	Name: 'KO_GENWAKU',
	SkillName: '幻术-迷惑',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [5, 6, 7, 8, 9],
	_NeedSkillList: [[SK.NJ_UTSUSEMI, 1]]
};
SkillInfo[SK.KO_IZAYOI] = {
	Name: 'KO_IZAYOI',
	SkillName: '第16个夜晚',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NJ_NINPOU, 5]]
};
SkillInfo[SK.KG_KAGEHUMI] = {
	Name: 'KG_KAGEHUMI',
	SkillName: '踏影',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [5, 7, 9, 11, 13],
	_NeedSkillList: [[SK.KO_ZANZOU, 1]]
};
SkillInfo[SK.KG_KYOMU] = {
	Name: 'KG_KYOMU',
	SkillName: '虚无飘妙之影',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KG_KAGEHUMI, 2]]
};
SkillInfo[SK.KG_KAGEMUSYA] = {
	Name: 'KG_KAGEMUSYA',
	SkillName: '影子武士',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.KG_KYOMU, 3]]
};
SkillInfo[SK.OB_ZANGETSU] = {
	Name: 'OB_ZANGETSU',
	SkillName: '变形的上弦月',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.KO_GENWAKU, 1]]
};
SkillInfo[SK.OB_OBOROGENSOU] = {
	Name: 'OB_OBOROGENSOU',
	SkillName: '阴月的幻影',
	MaxLv: 5,
	SpAmount: [55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.OB_AKAITSUKI, 3]]
};
SkillInfo[SK.OB_AKAITSUKI] = {
	Name: 'OB_AKAITSUKI',
	SkillName: '不祥的红月',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.OB_ZANGETSU, 2]]
};
SkillInfo[SK.ECLAGE_RECALL] = {
	Name: 'ECLAGE_RECALL',
	SkillName: '返回艾可拉珠',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.ECL_SNOWFLIP] = {
	Name: 'ECL_SNOWFLIP',
	SkillName: '冰雪寒叶',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ECL_PEONYMAMY] = {
	Name: 'ECL_PEONYMAMY',
	SkillName: '粉红厚叶',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ECL_SADAGUI] = {
	Name: 'ECL_SADAGUI',
	SkillName: '筮答葵叶',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ECL_SEQUOIADUST] = {
	Name: 'ECL_SEQUOIADUST',
	SkillName: '世界树之尘',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [7]
};
SkillInfo[SK.ALL_RAY_OF_PROTECTION] = {
	Name: 'ALL_RAY_OF_PROTECTION',
	SkillName:
		'ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¶ÃƒÆ’Ã‹â€ Ãƒâ€šÃ‚Â£ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã¢â‚¬Â¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â» ',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.MER_INVINCIBLEOFF2] = {
	Name: 'MER_INVINCIBLEOFF2',
	SkillName: '心灵净化',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [2]
};
SkillInfo[SK.GC_DARKCROW] = {
	Name: 'GC_DARKCROW',
	SkillName: '致命爪痕',
	MaxLv: 5,
	SpAmount: [22, 34, 46, 58, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GC_DARKILLUSION, 5]]
};
SkillInfo[SK.RA_UNLIMIT] = {
	Name: 'RA_UNLIMIT',
	SkillName: '精英狙击',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_FEARBREEZE, 5]]
};
SkillInfo[SK.LG_KINGS_GRACE] = {
	Name: 'LG_KINGS_GRACE',
	SkillName: "King's Grace",
	MaxLv: 5,
	SpAmount: [200, 180, 160, 140, 120],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.LG_REFLECTDAMAGE, 5]]
};
SkillInfo[SK.RK_DRAGONBREATH_WATER] = {
	Name: 'RK_DRAGONBREATH_WATER',
	SkillName: "Dragon's Water Breath",
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RK_DRAGONTRAINING, 2]]
};
SkillInfo[SK.NC_MAGMA_ERUPTION] = {
	Name: 'NC_MAGMA_ERUPTION',
	SkillName: '岩浆喷发',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.NC_RESEARCHFE, 1]]
};
SkillInfo[SK.WM_FRIGG_SONG] = {
	Name: 'WM_FRIGG_SONG',
	SkillName: "Frigg's Song",
	MaxLv: 5,
	SpAmount: [200, 230, 260, 290, 320],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WM_LESSON, 2]]
};
SkillInfo[SK.SO_ELEMENTAL_SHIELD] = {
	Name: 'SO_ELEMENTAL_SHIELD',
	SkillName: '精灵结界',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_CONTROL, 3]]
};
SkillInfo[SK.SR_FLASHCOMBO] = {
	Name: 'SR_FLASHCOMBO',
	SkillName: '闪光连击',
	MaxLv: 5,
	SpAmount: [65, 65, 65, 65, 65],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SR_DRAGONCOMBO, 3],
		[SK.SR_FALLENEMPIRE, 3],
		[SK.SR_SKYNETBLOW, 1],
		[SK.SR_TIGERCANNON, 5]
	]
};
SkillInfo[SK.SC_ESCAPE] = {
	Name: 'SC_ESCAPE',
	SkillName: '紧急脱身',
	MaxLv: 5,
	SpAmount: [30, 26, 22, 18, 14],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SC_TRIANGLESHOT, 2]]
};
SkillInfo[SK.AB_OFFERTORIUM] = {
	Name: 'AB_OFFERTORIUM',
	SkillName: '奉献颂',
	MaxLv: 5,
	SpAmount: [30, 60, 90, 120, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AB_HIGHNESSHEAL, 2]]
};
SkillInfo[SK.WL_TELEKINESIS_INTENSE] = {
	Name: 'WL_TELEKINESIS_INTENSE',
	SkillName: '终极念力',
	MaxLv: 5,
	SpAmount: [100, 150, 200, 250, 300],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WL_SOULEXPANSION, 5]]
};
SkillInfo[SK.ALL_FULL_THROTTLE] = {
	Name: 'ALL_FULL_THROTTLE',
	SkillName: '烈火战车',
	MaxLv: 5,
	SpAmount: [1, 1, 1, 1, 1],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: []
};
SkillInfo[SK.GN_ILLUSIONDOPING] = {
	Name: 'GN_ILLUSIONDOPING',
	SkillName: '幻觉禁药',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 1]]
};
SkillInfo[SK.GM_ITEM_ATKMAX] = {
	Name: 'GM_ITEM_ATKMAX',
	SkillName: '物理道具最大攻击力',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GM_ITEM_ATKMIN] = {
	Name: 'GM_ITEM_ATKMIN',
	SkillName: '物理道具最小攻击力',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GM_ITEM_MATKMAX] = {
	Name: 'GM_ITEM_MATKMAX',
	SkillName: '魔法道具最大攻击力',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GM_ITEM_MATKMIN] = {
	Name: 'GM_ITEM_MATKMIN',
	SkillName: '魔法道具最小攻击力',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.RL_D_TAIL] = {
	Name: 'RL_D_TAIL',
	SkillName: '魔兽摆尾',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.RL_H_MINE, 3],
		[SK.RL_C_MARKER, 1]
	]
};
SkillInfo[SK.RL_R_TRIP] = {
	Name: 'RL_R_TRIP',
	SkillName: '圆桌舞蹈',
	MaxLv: 10,
	SpAmount: [43, 46, 49, 52, 55, 58, 61, 64, 67, 70],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_FIRE_RAIN, 1]]
};
SkillInfo[SK.RL_RICHS_COIN] = {
	Name: 'RL_RICHS_COIN',
	SkillName: "Rich's Coin",
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [0],
	_NeedSkillList: [[SK.GS_GLITTERING, 5]]
};
SkillInfo[SK.RL_MASS_SPIRAL] = {
	Name: 'RL_MASS_SPIRAL',
	SkillName: '绝对贯穿',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [15, 15, 15, 15, 15],
	_NeedSkillList: [[SK.GS_PIERCINGSHOT, 1]]
};
SkillInfo[SK.RL_B_TRAP] = {
	Name: 'RL_B_TRAP',
	SkillName: '暗黑地狱',
	MaxLv: 5,
	SpAmount: [30, 32, 34, 36, 38],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_FLICKER, 1]]
};
SkillInfo[SK.RL_BANISHING_BUSTER] = {
	Name: 'RL_BANISHING_BUSTER',
	SkillName: '强制驱逐',
	MaxLv: 10,
	SpAmount: [55, 57, 59, 61, 63, 65, 67, 69, 71, 73],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RL_S_STORM, 1]]
};
SkillInfo[SK.RL_S_STORM] = {
	Name: 'RL_S_STORM',
	SkillName: '粉碎风暴',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.GS_DISARM, 1],
		[SK.GS_DUST, 1]
	]
};
SkillInfo[SK.RL_SLUGSHOT] = {
	Name: 'RL_SLUGSHOT',
	SkillName: '根源破坏',
	MaxLv: 5,
	SpAmount: [80, 84, 88, 92, 96],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RL_BANISHING_BUSTER, 3]]
};
SkillInfo[SK.RL_AM_BLAST] = {
	Name: 'RL_AM_BLAST',
	SkillName: '毁灭重击',
	MaxLv: 5,
	SpAmount: [80, 84, 88, 92, 96],
	bSeperateLv: true,
	AttackRange: [15, 15, 15, 15, 15],
	_NeedSkillList: [[SK.RL_MASS_SPIRAL, 1]]
};
SkillInfo[SK.RL_E_CHAIN] = {
	Name: 'RL_E_CHAIN',
	SkillName: '无限连锁',
	MaxLv: 10,
	SpAmount: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_NeedSkillList: [
		[SK.GS_GLITTERING, 1],
		[SK.GS_CHAINACTION, 10]
	]
};
SkillInfo[SK.RL_QD_SHOT] = {
	Name: 'RL_QD_SHOT',
	SkillName: '瞬速子弹',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [0],
	_NeedSkillList: [[SK.GS_CHAINACTION, 1]]
};
SkillInfo[SK.RL_C_MARKER] = {
	Name: 'RL_C_MARKER',
	SkillName: '血色烙印',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [11],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RL_FIREDANCE] = {
	Name: 'RL_FIREDANCE',
	SkillName: '杀戮暗舞',
	MaxLv: 10,
	SpAmount: [13, 16, 19, 22, 25, 28, 31, 34, 37, 40],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.GS_DESPERADO, 1]]
};
SkillInfo[SK.RL_FIRE_RAIN] = {
	Name: 'RL_FIRE_RAIN',
	SkillName: '火焰暴雨',
	MaxLv: 5,
	SpAmount: [70, 70, 70, 70, 70],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.GS_GATLINGFEVER, 1]]
};
SkillInfo[SK.RL_FALLEN_ANGEL] = {
	Name: 'RL_FALLEN_ANGEL',
	SkillName: '堕落天使',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.GS_DESPERADO, 10]]
};
SkillInfo[SK.RL_P_ALTER] = {
	Name: 'RL_P_ALTER',
	SkillName: '白金祭坛',
	MaxLv: 5,
	SpAmount: [20, 24, 28, 32, 36],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_RICHS_COIN, 1]]
};
SkillInfo[SK.RL_FLICKER] = {
	Name: 'RL_FLICKER',
	SkillName: '闪烁信号',
	MaxLv: 1,
	SpAmount: [2],
	bSeperateLv: false,
	AttackRange: [0],
	_NeedSkillList: [[SK.GS_GLITTERING, 1]]
};
SkillInfo[SK.RL_H_MINE] = {
	Name: 'RL_H_MINE',
	SkillName: '破坏怒吼',
	MaxLv: 5,
	SpAmount: [45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [7, 8, 9, 10, 11],
	_NeedSkillList: [[SK.GS_GROUNDDRIFT, 1]]
};
SkillInfo[SK.RL_HAMMER_OF_GOD] = {
	Name: 'RL_HAMMER_OF_GOD',
	SkillName: "God's Hammer",
	MaxLv: 10,
	SpAmount: [37, 39, 41, 43, 45, 47, 49, 51, 53, 55],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [
		[SK.RL_RICHS_COIN, 1],
		[SK.RL_AM_BLAST, 3]
	]
};
SkillInfo[SK.RL_HEAT_BARREL] = {
	Name: 'RL_HEAT_BARREL',
	SkillName: '加速子弹',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [0, 0, 0, 0, 0],
	_NeedSkillList: [[SK.RL_RICHS_COIN, 1]]
};
SkillInfo[SK.MC_CARTDECORATE] = {
	Name: 'MC_CARTDECORATE',
	SkillName: 'Cart Decoration',
	MaxLv: 1,
	SpAmount: [40],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SU_BASIC_SKILL] = {
	Name: 'SU_BASIC_SKILL',
	SkillName: 'New Basic Skill',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.SU_BITE] = {
	Name: 'SU_BITE',
	SkillName: 'Bite',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [2],
	_NeedSkillList: [[SK.SU_BASIC_SKILL, 1]]
};
SkillInfo[SK.SU_HIDE] = {
	Name: 'SU_HIDE',
	SkillName: 'Hide',
	MaxLv: 1,
	SpAmount: [30],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_BITE, 1]]
};
SkillInfo[SK.SU_SCRATCH] = {
	Name: 'SU_SCRATCH',
	SkillName: 'Scratch',
	MaxLv: 3,
	SpAmount: [20, 25, 30],
	bSeperateLv: true,
	AttackRange: [2, 2, 2],
	_NeedSkillList: [[SK.SU_HIDE, 1]]
};
SkillInfo[SK.SU_STOOP] = {
	Name: 'SU_STOOP',
	SkillName: 'Stoop',
	MaxLv: 1,
	SpAmount: [10],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_SCRATCH, 3]]
};
SkillInfo[SK.SU_LOPE] = {
	Name: 'SU_LOPE',
	SkillName: 'Lope',
	MaxLv: 3,
	SpAmount: [30, 30, 30],
	bSeperateLv: false,
	AttackRange: [6, 10, 14],
	_NeedSkillList: [[SK.SU_STOOP, 1]]
};
SkillInfo[SK.SU_SPRITEMABLE] = {
	Name: 'SU_SPRITEMABLE',
	SkillName: 'Sprite Mable',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_LOPE, 3]]
};
SkillInfo[SK.SU_FRESHSHRIMP] = {
	Name: 'SU_FRESHSHRIMP',
	SkillName: 'Fresh Shrimp',
	MaxLv: 5,
	SpAmount: [22, 24, 26, 28, 30],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_BUNCHOFSHRIMP] = {
	Name: 'SU_BUNCHOFSHRIMP',
	SkillName: 'Bunch of Shrimp',
	MaxLv: 5,
	SpAmount: [44, 48, 52, 56, 60],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SU_FRESHSHRIMP, 3]]
};
SkillInfo[SK.SU_TUNABELLY] = {
	Name: 'SU_TUNABELLY',
	SkillName: 'Tuna Belly',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_BUNCHOFSHRIMP, 3]]
};
SkillInfo[SK.SU_TUNAPARTY] = {
	Name: 'SU_TUNAPARTY',
	SkillName: 'Tuna Party',
	MaxLv: 5,
	SpAmount: [20, 30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_TUNABELLY, 3]]
};
SkillInfo[SK.SU_SV_STEMSPEAR] = {
	Name: 'SU_SV_STEMSPEAR',
	SkillName: 'SV Stem Spear',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_SV_ROOTTWIST] = {
	Name: 'SU_SV_ROOTTWIST',
	SkillName: 'SV Root Twist',
	MaxLv: 5,
	SpAmount: [10, 12, 14, 16, 18],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SV_STEMSPEAR, 3]]
};
SkillInfo[SK.SU_CN_METEOR] = {
	Name: 'SU_CN_METEOR',
	SkillName: 'CN Meteor',
	MaxLv: 5,
	SpAmount: [20, 35, 50, 65, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SV_ROOTTWIST, 3]]
};
SkillInfo[SK.SU_CN_POWDERING] = {
	Name: 'SU_CN_POWDERING',
	SkillName: 'CN Powdering',
	MaxLv: 5,
	SpAmount: [40, 36, 32, 28, 24],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_CN_METEOR, 3]]
};
SkillInfo[SK.SU_PICKYPECK] = {
	Name: 'SU_PICKYPECK',
	SkillName: 'Picky Peck',
	MaxLv: 5,
	SpAmount: [10, 12, 14, 16, 18],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_ARCLOUSEDASH] = {
	Name: 'SU_ARCLOUSEDASH',
	SkillName: 'Arclouze Dash',
	MaxLv: 5,
	SpAmount: [12, 14, 16, 18, 20],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_PICKYPECK, 3]]
};
SkillInfo[SK.SU_SCAROFTAROU] = {
	Name: 'SU_SCAROFTAROU',
	SkillName: 'Scar of Tarou',
	MaxLv: 5,
	SpAmount: [10, 12, 14, 16, 18],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_ARCLOUSEDASH, 3]]
};
SkillInfo[SK.SU_LUNATICCARROTBEAT] = {
	Name: 'SU_LUNATICCARROTBEAT',
	SkillName: 'Lunatic Carrot Beat',
	MaxLv: 5,
	SpAmount: [15, 20, 25, 30, 35],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_SCAROFTAROU, 3]]
};
SkillInfo[SK.SU_POWEROFSEA] = {
	Name: 'SU_POWEROFSEA',
	SkillName: 'Power of Sea',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_TUNAPARTY, 3]]
};
SkillInfo[SK.SU_POWEROFLAND] = {
	Name: 'SU_POWEROFLAND',
	SkillName: 'Power of Land',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_CN_POWDERING, 3]]
};
SkillInfo[SK.SU_POWEROFLIFE] = {
	Name: 'SU_POWEROFLIFE',
	SkillName: 'Power of Life',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SU_LUNATICCARROTBEAT, 3]]
};
SkillInfo[SK.SU_SOULATTACK] = {
	Name: 'SU_SOULATTACK',
	SkillName: 'Soul Attack',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [9],
	_NeedSkillList: [[SK.SU_SPRITEMABLE, 1]]
};
SkillInfo[SK.SU_POWEROFFLOCK] = {
	Name: 'SU_POWEROFFLOCK',
	SkillName: 'Power Of Lock',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_HISS, 5]]
};
SkillInfo[SK.SU_SVG_SPIRIT] = {
	Name: 'SU_SVG_SPIRIT',
	SkillName: 'Sprit Of Savage',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_POWEROFFLOCK, 5]]
};
SkillInfo[SK.SU_HISS] = {
	Name: 'SU_HISS',
	SkillName: 'Hiss',
	MaxLv: 5,
	SpAmount: [50, 46, 42, 38, 34],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_POWEROFLIFE, 1]]
};
SkillInfo[SK.SU_NYANGGRASS] = {
	Name: 'SU_NYANGGRASS',
	SkillName: 'Nyang Grass',
	MaxLv: 5,
	SpAmount: [50, 48, 46, 44, 42],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SU_MEOWMEOW, 5]]
};
SkillInfo[SK.SU_GROOMING] = {
	Name: 'SU_GROOMING',
	SkillName: 'Grooming',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_POWEROFSEA, 1]]
};
SkillInfo[SK.SU_PURRING] = {
	Name: 'SU_PURRING',
	SkillName: 'Purring',
	MaxLv: 5,
	SpAmount: [70, 65, 60, 55, 50],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_GROOMING, 5]]
};
SkillInfo[SK.SU_SHRIMPARTY] = {
	Name: 'SU_SHRIMPARTY',
	SkillName: 'Tasty Shrimp Party',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_PURRING, 5]]
};
SkillInfo[SK.SU_SPIRITOFLIFE] = {
	Name: 'SU_SPIRITOFLIFE',
	SkillName: 'Spirit Of Life',
	MaxLv: 1,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_SVG_SPIRIT, 5]]
};
SkillInfo[SK.SU_MEOWMEOW] = {
	Name: 'SU_MEOWMEOW',
	SkillName: 'Meow Meow',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_CHATTERING, 5]]
};
SkillInfo[SK.SU_SPIRITOFLAND] = {
	Name: 'SU_SPIRITOFLAND',
	SkillName: 'Spirit Of Land',
	MaxLv: 1,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_NYANGGRASS, 5]]
};
SkillInfo[SK.SU_CHATTERING] = {
	Name: 'SU_CHATTERING',
	SkillName: 'Chattering',
	MaxLv: 5,
	SpAmount: [50, 45, 40, 35, 30],
	bSeperateLv: true,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_POWEROFLAND, 1]]
};
SkillInfo[SK.SU_SPIRITOFSEA] = {
	Name: 'SU_SPIRITOFSEA',
	SkillName: 'Spirit Of Sea',
	MaxLv: 1,
	SpAmount: [],
	bSeperateLv: false,
	AttackRange: [],
	_NeedSkillList: [[SK.SU_SHRIMPARTY, 5]]
};
SkillInfo[SK.ALL_PRONTERA_RECALL] = {
	Name: 'ALL_PRONTERA_RECALL',
	SkillName: '返回普隆德拉',
	MaxLv: 2,
	SpAmount: [0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1]
};
SkillInfo[SK.NPC_IGNITIONBREAK] = {
	Name: 'NPC_IGNITIONBREAK',
	SkillName: 'Ignition Break',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11]
	]
};
SkillInfo[SK.NPC_MANDRAGORA] = {
	Name: 'NPC_MANDRAGORA',
	SkillName: 'Mandragora Howl',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[13, 13],
		[15, 15],
		[17, 17],
		[19, 19]
	]
};
SkillInfo[SK.NPC_FATALMENACE] = {
	Name: 'NPC_FATALMENACE',
	SkillName: 'Fatal Menace',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[3, 3],
		[5, 5],
		[7, 7],
		[9, 9],
		[11, 11]
	]
};
SkillInfo[SK.NPC_SR_CURSEDCIRCLE] = {
	Name: 'NPC_SR_CURSEDCIRCLE',
	SkillName: 'Cursed Circle',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[3, 3],
		[5, 5],
		[7, 7],
		[9, 9],
		[11, 11]
	]
};
SkillInfo[SK.NPC_JACKFROST] = {
	Name: 'NPC_JACKFROST',
	SkillName: 'Jack Frost',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[13, 13],
		[15, 15],
		[17, 17],
		[19, 19]
	]
};
SkillInfo[SK.NPC_VENOMFOG] = {
	Name: 'NPC_VENOMFOG',
	SkillName: 'Venom fog',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[27, 27]
	]
};
SkillInfo[SK.NPC_ASSASSINCROSS] = {
	Name: 'NPC_ASSASSINCROSS',
	SkillName: 'Impressive Riff',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_FLAMECROSS] = {
	Name: 'NPC_FLAMECROSS',
	SkillName: 'Flame cross',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_ICEMINE] = {
	Name: 'NPC_ICEMINE',
	SkillName: 'Ice mine',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_DISSONANCE] = {
	Name: 'NPC_DISSONANCE',
	SkillName: 'Unchained Serenade',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_UGLYDANCE] = {
	Name: 'NPC_UGLYDANCE',
	SkillName: 'Hip Shaker',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_WIDEHEALTHFEAR] = {
	Name: 'NPC_WIDEHEALTHFEAR',
	SkillName: 'Wide area fear',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDE_DEEP_SLEEP] = {
	Name: 'NPC_WIDE_DEEP_SLEEP',
	SkillName: 'Wide area deep sleep',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESIREN] = {
	Name: 'NPC_WIDESIREN',
	SkillName: 'Wide area fascination',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEBODYBURNNING] = {
	Name: 'NPC_WIDEBODYBURNNING',
	SkillName: 'Wide area burnning',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEFROSTMISTY] = {
	Name: 'NPC_WIDEFROSTMISTY',
	SkillName: 'Wide area frost misty',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECOLD] = {
	Name: 'NPC_WIDECOLD',
	SkillName: 'Wide area freeze',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_CLOUD_KILL] = {
	Name: 'NPC_CLOUD_KILL',
	SkillName: 'Killing Cloud',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9],
	SkillScale: [
		[3, 3],
		[5, 5],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_RAYOFGENESIS] = {
	Name: 'NPC_RAYOFGENESIS',
	SkillName: 'Genesis Ray',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[11, 11],
		[11, 11],
		[17, 17],
		[17, 17],
		[23, 23],
		[23, 23],
		[27, 27],
		[27, 27],
		[27, 27],
		[27, 27]
	]
};
SkillInfo[SK.NPC_PSYCHIC_WAVE] = {
	Name: 'NPC_PSYCHIC_WAVE',
	SkillName: 'Psychic Wave',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	SkillScale: [
		[7, 7],
		[9, 9],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11]
	]
};
SkillInfo[SK.NPC_MAGMA_ERUPTION] = {
	Name: 'NPC_MAGMA_ERUPTION',
	SkillName: 'Lava Flow',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_COMET] = {
	Name: 'NPC_COMET',
	SkillName: 'Comet',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[19, 19],
		[19, 19],
		[19, 19],
		[19, 19],
		[19, 19]
	]
};
SkillInfo[SK.NPC_WIDEWEB] = {
	Name: 'NPC_WIDEWEB',
	SkillName: 'Wide web',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[15, 15]]
};
SkillInfo[SK.NPC_WIDESIGHT] = {
	Name: 'NPC_WIDESIGHT',
	SkillName: 'Wide sight',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[11, 11]]
};
SkillInfo[SK.NPC_WIDESUCK] = {
	Name: 'NPC_WIDESUCK',
	SkillName: 'Wide bloodsucking',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	SkillScale: [[27, 27]]
};
SkillInfo[SK.NPC_STORMGUST2] = {
	Name: 'NPC_STORMGUST2',
	SkillName: 'Storm Gust',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [9, 9, 9],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11]
	]
};
SkillInfo[SK.NPC_FIRESTORM] = {
	Name: 'NPC_FIRESTORM',
	SkillName: 'Fire storm',
	MaxLv: 3,
	SpAmount: [0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1],
	SkillScale: [
		[7, 7],
		[7, 7],
		[7, 7]
	]
};
SkillInfo[SK.NPC_DRAGONBREATH] = {
	Name: 'NPC_DRAGONBREATH',
	SkillName: "Dragon's Breath",
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
	SkillScale: [
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9],
		[9, 9]
	]
};
SkillInfo[SK.NPC_REVERBERATION] = {
	Name: 'NPC_REVERBERATION',
	SkillName: '残响',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[5, 5],
		[5, 5],
		[5, 5],
		[5, 5]
	]
};
SkillInfo[SK.NPC_LEX_AETERNA] = {
	Name: 'NPC_LEX_AETERNA',
	SkillName: '广泛天使之怒',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.WE_CALLALLFAMILY] = {
	Name: 'WE_CALLALLFAMILY',
	SkillName: "Let's Go Family!",
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.WE_ONEFOREVER] = {
	Name: 'WE_ONEFOREVER',
	SkillName: 'Love Conquers Death',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: false,
	AttackRange: [3]
};
SkillInfo[SK.WE_CHEERUP] = {
	Name: 'WE_CHEERUP',
	SkillName: 'Go! Parents Go!',
	MaxLv: 1,
	SpAmount: [50],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.GD_GUILD_STORAGE] = {
	Name: 'GD_GUILD_STORAGE',
	SkillName: '公会仓库扩充',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.CG_SPECIALSINGER] = {
	Name: 'SK_CG_SPECIALSINGER',
	SkillName: 'Skilled Special Singer',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	NeedSkillList: {
		[JobId.BARD_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.BA_DISSONANCE, 3],
			[SK.BA_MUSICALLESSON, 10]
		],
		[JobId.DANCER_H]: [
			[SK.CG_MARIONETTE, 1],
			[SK.DC_UGLYDANCE, 3],
			[SK.DC_DANCINGLESSON, 10]
		]
	}
};
SkillInfo[SK.BA_POEMBRAGI2] = {
	Name: 'BA_POEMBRAGI2',
	SkillName: '布莱奇之诗',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BA_DISSONANCE, 3]]
};
SkillInfo[SK.DC_FORTUNEKISS2] = {
	Name: 'DC_FORTUNEKISS2',
	SkillName: '女神之吻',
	MaxLv: 10,
	SpAmount: [43, 46, 49, 52, 55, 58, 61, 64, 67, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DC_UGLYDANCE, 3]]
};
SkillInfo[SK.SJ_LIGHTOFMOON] = {
	Name: 'SJ_LIGHTOFMOON',
	SkillName: 'Lunar Luminance',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_FULLMOONKICK, 3]]
};
SkillInfo[SK.SJ_LUNARSTANCE] = {
	Name: 'SJ_LUNARSTANCE',
	SkillName: 'Lunar Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SJ_DOCUMENT, 1]]
};
SkillInfo[SK.SJ_FULLMOONKICK] = {
	Name: 'SJ_FULLMOONKICK',
	SkillName: 'Full Moon Kick',
	MaxLv: 10,
	SpAmount: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_NEWMOONKICK, 7]]
};
SkillInfo[SK.SJ_NEWMOONKICK] = {
	Name: 'SJ_NEWMOONKICK',
	SkillName: 'New Moon Kick',
	MaxLv: 7,
	SpAmount: [20, 25, 30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_LUNARSTANCE, 1]]
};
SkillInfo[SK.SJ_LIGHTOFSTAR] = {
	Name: 'SJ_LIGHTOFSTAR',
	SkillName: 'Stellar Luminance',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_FALLINGSTAR, 3]]
};
SkillInfo[SK.SJ_STARSTANCE] = {
	Name: 'SJ_STARSTANCE',
	SkillName: 'Stellar Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SJ_DOCUMENT, 1]]
};
SkillInfo[SK.SJ_FLASHKICK] = {
	Name: 'SJ_FLASHKICK',
	SkillName: 'Flash Kick',
	MaxLv: 7,
	SpAmount: [45, 40, 35, 30, 25, 20, 15],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_STARSTANCE, 1]]
};
SkillInfo[SK.SJ_STAREMPEROR] = {
	Name: 'SJ_STAREMPEROR',
	SkillName: "Star Emperor's Descent",
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SJ_NOVAEXPLOSING, 5],
		[SK.SJ_UNIVERSESTANCE, 3]
	]
};
SkillInfo[SK.SJ_NOVAEXPLOSING] = {
	Name: 'SJ_NOVAEXPLOSING',
	SkillName: 'Nova Explosion',
	MaxLv: 5,
	SpAmount: [60, 65, 70, 75, 80],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.SJ_UNIVERSESTANCE, 1]]
};
SkillInfo[SK.SJ_UNIVERSESTANCE] = {
	Name: 'SJ_UNIVERSESTANCE',
	SkillName: 'Universal Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SJ_SUNSTANCE, 3],
		[SK.SJ_LUNARSTANCE, 3],
		[SK.SJ_STARSTANCE, 3]
	]
};
SkillInfo[SK.SJ_FALLINGSTAR] = {
	Name: 'SJ_FALLINGSTAR',
	SkillName: 'Falling Stars',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_FLASHKICK, 7]]
};
SkillInfo[SK.SJ_GRAVITYCONTROL] = {
	Name: 'SJ_GRAVITYCONTROL',
	SkillName: 'Gravity Control',
	MaxLv: 1,
	SpAmount: [80],
	bSeperateLv: true,
	AttackRange: [9],
	_NeedSkillList: [[SK.SJ_UNIVERSESTANCE, 1]]
};
SkillInfo[SK.SJ_BOOKOFDIMENSION] = {
	Name: 'SJ_BOOKOFDIMENSION',
	SkillName: 'Book of Dimensions',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SJ_STAREMPEROR, 3],
		[SK.SJ_DOCUMENT, 3]
	]
};
SkillInfo[SK.SJ_BOOKOFCREATINGSTAR] = {
	Name: 'SJ_BOOKOFCREATINGSTAR',
	SkillName: "Star Creator's Book",
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SJ_STAREMPEROR, 3],
		[SK.SJ_DOCUMENT, 3]
	]
};
SkillInfo[SK.SJ_DOCUMENT] = {
	Name: 'SJ_DOCUMENT',
	SkillName: 'Solar, Lunar, and Stellar Record',
	MaxLv: 3,
	SpAmount: [60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [
		[SK.SG_FEEL, 3],
		[SK.SG_HATE, 3]
	]
};
SkillInfo[SK.SJ_PURIFY] = {
	Name: 'SJ_PURIFY',
	SkillName: 'Solar, Lunar, and Stellar Purification',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.SG_DEVIL, 10]]
};
SkillInfo[SK.SJ_LIGHTOFSUN] = {
	Name: 'SJ_LIGHTOFSUN',
	SkillName: 'Solar Luminance',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_SOLARBURST, 3]]
};
SkillInfo[SK.SJ_SUNSTANCE] = {
	Name: 'SJ_SUNSTANCE',
	SkillName: 'Solar Stance',
	MaxLv: 3,
	SpAmount: [10, 10, 10],
	bSeperateLv: true,
	AttackRange: [1, 1, 1],
	_NeedSkillList: [[SK.SJ_DOCUMENT, 1]]
};
SkillInfo[SK.SJ_SOLARBURST] = {
	Name: 'SJ_SOLARBURST',
	SkillName: 'Solar Explosion',
	MaxLv: 10,
	SpAmount: [34, 37, 40, 43, 46, 49, 52, 55, 58, 61],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_PROMINENCEKICK, 7]]
};
SkillInfo[SK.SJ_PROMINENCEKICK] = {
	Name: 'SJ_PROMINENCEKICK',
	SkillName: 'Blaze Kick',
	MaxLv: 7,
	SpAmount: [20, 20, 20, 20, 20, 20, 20],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SJ_SUNSTANCE, 1]]
};
SkillInfo[SK.SP_SOULGOLEM] = {
	Name: 'SP_SOULGOLEM',
	SkillName: 'Golem Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREVOLVE, 2]]
};
SkillInfo[SK.SP_SOULSHADOW] = {
	Name: 'SP_SOULSHADOW',
	SkillName: 'Shadow Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULUNITY, 5]]
};
SkillInfo[SK.SP_SOULFALCON] = {
	Name: 'SP_SOULFALCON',
	SkillName: 'Falcon Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREVOLVE, 2]]
};
SkillInfo[SK.SP_SOULFAIRY] = {
	Name: 'SP_SOULFAIRY',
	SkillName: 'Fairy Soul',
	MaxLv: 5,
	SpAmount: [250, 200, 150, 100, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULUNITY, 5]]
};
SkillInfo[SK.SP_CURSEEXPLOSION] = {
	Name: 'SP_CURSEEXPLOSION',
	SkillName: 'Curse Explosion',
	MaxLv: 10,
	SpAmount: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULCURSE, 3]]
};
SkillInfo[SK.SP_SOULCURSE] = {
	Name: 'SP_SOULCURSE',
	SkillName: 'Evil Soul Curse',
	MaxLv: 5,
	SpAmount: [70, 70, 70, 70, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREAPER, 3]]
};
SkillInfo[SK.SP_SPA] = {
	Name: 'SP_SPA',
	SkillName: 'Espa',
	MaxLv: 10,
	SpAmount: [52, 56, 60, 64, 68, 72, 76, 80, 84, 88],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SHA, 1]]
};
SkillInfo[SK.SP_SHA] = {
	Name: 'SP_SHA',
	SkillName: 'Esha',
	MaxLv: 5,
	SpAmount: [18, 20, 22, 24, 26],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SOULREAPER, 3]]
};
SkillInfo[SK.SP_SWHOO] = {
	Name: 'SP_SWHOO',
	SkillName: 'Eswoo',
	MaxLv: 10,
	SpAmount: [66, 70, 74, 78, 82, 86, 90, 94, 98, 102],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.SP_SPA, 3]]
};
SkillInfo[SK.SP_SOULUNITY] = {
	Name: 'SP_SOULUNITY',
	SkillName: 'Soul Bind',
	MaxLv: 7,
	SpAmount: [44, 46, 48, 50, 52, 54, 56],
	bSeperateLv: true,
	AttackRange: [11, 11, 11, 11, 11, 11, 11],
	_NeedSkillList: [[SK.SP_SOULENERGY, 3]]
};
SkillInfo[SK.SP_SOULDIVISION] = {
	Name: 'SP_SOULDIVISION',
	SkillName: 'Soul Division',
	MaxLv: 5,
	SpAmount: [36, 40, 44, 48, 52],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SP_SPA, 5],
		[SK.SP_SHA, 5]
	]
};
SkillInfo[SK.SP_SOULREAPER] = {
	Name: 'SP_SOULREAPER',
	SkillName: 'Soul Harvest',
	MaxLv: 5,
	SpAmount: [42, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SP_SOULCOLLECT, 1]]
};
SkillInfo[SK.SP_SOULCOLLECT] = {
	Name: 'SP_SOULCOLLECT',
	SkillName: 'Soul Collection',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SP_SOULREVOLVE] = {
	Name: 'SP_SOULREVOLVE',
	SkillName: 'Soul Circulation',
	MaxLv: 3,
	SpAmount: [50, 100, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9],
	_NeedSkillList: [
		[SK.SP_SOULENERGY, 3],
		[SK.SP_KAUTE, 3]
	]
};
SkillInfo[SK.SP_SOULEXPLOSION] = {
	Name: 'SP_SOULEXPLOSION',
	SkillName: 'Soul Explosion',
	MaxLv: 5,
	SpAmount: [30, 60, 90, 120, 150],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SP_SOULSHADOW, 1],
		[SK.SP_SOULFALCON, 1],
		[SK.SP_SOULFAIRY, 1],
		[SK.SP_SOULGOLEM, 1],
		[SK.SP_CURSEEXPLOSION, 2]
	]
};
SkillInfo[SK.SP_KAUTE] = {
	Name: 'SP_KAUTE',
	SkillName: 'Kaute',
	MaxLv: 5,
	SpAmount: [24, 30, 36, 42, 48],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.SP_SOULENERGY, 1]]
};
SkillInfo[SK.SP_SOULENERGY] = {
	Name: 'SP_SOULENERGY',
	SkillName: 'Soul Energy Research',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SP_SOULCOLLECT, 1]]
};
SkillInfo[SK.SJ_FALLINGSTAR_ATK2] = {
	Name: 'SJ_FALLINGSTAR_ATK2',
	SkillName: 'Falling Star',
	MaxLv: 1,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.SJ_FALLINGSTAR_ATK] = {
	Name: 'SJ_FALLINGSTAR_ATK',
	SkillName: 'Falling Star',
	MaxLv: 1,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.RK_LUXANIMA] = {
	Name: 'RK_LUXANIMA',
	SkillName: 'Lux Anima',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: []
};
SkillInfo[SK.NPC_WIDEBLEEDING2] = {
	Name: 'NPC_WIDEBLEEDING2',
	SkillName: 'Demonic Mass Bleeding',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESILENCE2] = {
	Name: 'NPC_WIDESILENCE2',
	SkillName: 'Demonic Mass Silence',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTUN2] = {
	Name: 'NPC_WIDESTUN2',
	SkillName: 'Demonic Mass Stun',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESTONE2] = {
	Name: 'NPC_WIDESTONE2',
	SkillName: 'Demonic Mass Stone',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDESLEEP2] = {
	Name: 'NPC_WIDESLEEP2',
	SkillName: 'Demonic Mass Sleep',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECURSE2] = {
	Name: 'NPC_WIDECURSE2',
	SkillName: 'Demonic Mass Curse',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDECONFUSE2] = {
	Name: 'NPC_WIDECONFUSE2',
	SkillName: 'Demonic Mass Confuse',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_WIDEFREEZE2] = {
	Name: 'NPC_WIDEFREEZE2',
	SkillName: 'Demonic Mass Freeze',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[11, 11],
		[17, 17],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_EVILLAND2] = {
	Name: 'NPC_EVILLAND2',
	SkillName: 'Demonic Evil Land',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	SkillScale: [
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[11, 11],
		[13, 13],
		[15, 15],
		[19, 19],
		[23, 23],
		[29, 29]
	]
};
SkillInfo[SK.NPC_HELLJUDGEMENT2] = {
	Name: 'NPC_HELLJUDGEMENT2',
	SkillName: 'Demonic Hell Judgment',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	SkillScale: [
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29],
		[29, 29]
	]
};
SkillInfo[SK.NV_BREAKTHROUGH] = {
	Name: 'NV_BREAKTHROUGH',
	SkillName: 'Breakthrough',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: []
};
SkillInfo[SK.NV_HELPANGEL] = {
	Name: 'NV_HELPANGEL',
	SkillName: 'Help, Angel!',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: []
};
SkillInfo[SK.NV_TRANSCENDENCE] = {
	Name: 'NV_TRANSCENDENCE',
	SkillName: 'Transcendence',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: []
};
SkillInfo[SK.ALL_NIFLHEIM_RECALL] = {
	Name: 'ALL_NIFLHEIM_RECALL',
	SkillName: 'The World of the Dead!',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: false,
	AttackRange: [1]
};
SkillInfo[SK.DK_SERVANTWEAPON] = {
	Name: 'DK_SERVANTWEAPON',
	SkillName: 'Servant Weapon',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.DK_SERVANT_W_SIGN] = {
	Name: 'DK_SERVANT_W_SIGN',
	SkillName: 'Servant Weapon - Sign',
	MaxLv: 5,
	SpAmount: [15, 15, 15, 15, 15],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.DK_SERVANTWEAPON, 3]]
};
SkillInfo[SK.DK_SERVANT_W_PHANTOM] = {
	Name: 'DK_SERVANT_W_PHANTOM',
	SkillName: 'Servant Weapon - Phantom',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.DK_SERVANTWEAPON, 5],
		[SK.DK_SERVANT_W_SIGN, 5]
	]
};
SkillInfo[SK.DK_SERVANT_W_DEMOL] = {
	Name: 'DK_SERVANT_W_DEMOL',
	SkillName: 'Servant Weapon - Demolition',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.DK_SERVANT_W_PHANTOM, 5]]
};
SkillInfo[SK.DK_CHARGINGPIERCE] = {
	Name: 'DK_CHARGINGPIERCE',
	SkillName: 'Charging Pierce',
	MaxLv: 10,
	SpAmount: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RK_HUNDREDSPEAR, 5]]
};
SkillInfo[SK.DK_TWOHANDDEF] = {
	Name: 'DK_TWOHANDDEF',
	SkillName: 'Two-handed Defense',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.DK_HACKANDSLASHER] = {
	Name: 'DK_HACKANDSLASHER',
	SkillName: 'Hack and Slash',
	MaxLv: 10,
	SpAmount: [34, 38, 42, 46, 50, 54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.DK_TWOHANDDEF, 5]]
};
SkillInfo[SK.DK_DRAGONIC_AURA] = {
	Name: 'DK_DRAGONIC_AURA',
	SkillName: 'Dragonic Aura',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.DK_CHARGINGPIERCE, 10],
		[SK.RK_DRAGONBREATH, 10],
		[SK.RK_DRAGONBREATH_WATER, 10]
	]
};
SkillInfo[SK.DK_MADNESS_CRUSHER] = {
	Name: 'DK_MADNESS_CRUSHER',
	SkillName: 'Madness Crusher',
	MaxLv: 5,
	SpAmount: [34, 38, 42, 46, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.DK_CHARGINGPIERCE, 5],
		[SK.DK_HACKANDSLASHER, 10]
	]
};
SkillInfo[SK.DK_VIGOR] = {
	Name: 'DK_VIGOR',
	SkillName: 'Vigor',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.DK_SERVANT_W_DEMOL, 3],
		[SK.DK_STORMSLASH, 5]
	]
};
SkillInfo[SK.DK_STORMSLASH] = {
	Name: 'DK_STORMSLASH',
	SkillName: 'Storm Slash',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.DK_TWOHANDDEF, 10],
		[SK.DK_HACKANDSLASHER, 5]
	]
};
SkillInfo[SK.AG_DEADLY_PROJECTION] = {
	Name: 'AG_DEADLY_PROJECTION',
	SkillName: 'Deadly Projection',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_MYSTERY_ILLUSION, 3]]
};
SkillInfo[SK.AG_DESTRUCTIVE_HURRICANE] = {
	Name: 'AG_DESTRUCTIVE_HURRICANE',
	SkillName: 'Destructive Hurricane',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AG_TORNADO_STORM, 3]]
};
SkillInfo[SK.AG_RAIN_OF_CRYSTAL] = {
	Name: 'AG_RAIN_OF_CRYSTAL',
	SkillName: 'Crystal Rain',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WL_FROSTMISTY, 3]]
};
SkillInfo[SK.AG_MYSTERY_ILLUSION] = {
	Name: 'AG_MYSTERY_ILLUSION',
	SkillName: 'Mystery Illusion',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AG_SOUL_VC_STRIKE, 3],
		[SK.WL_HELLINFERNO, 3]
	]
};
SkillInfo[SK.AG_VIOLENT_QUAKE] = {
	Name: 'AG_VIOLENT_QUAKE',
	SkillName: 'Violent Quake',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_STRANTUM_TREMOR, 3]]
};
SkillInfo[SK.AG_SOUL_VC_STRIKE] = {
	Name: 'AG_SOUL_VC_STRIKE',
	SkillName: 'Soul Vulcan Strike',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.WL_SOULEXPANSION, 5],
		[SK.AG_TWOHANDSTAFF, 3]
	]
};
SkillInfo[SK.AG_STRANTUM_TREMOR] = {
	Name: 'AG_STRANTUM_TREMOR',
	SkillName: 'Stratum Tremor',
	MaxLv: 5,
	SpAmount: [35, 45, 55, 65, 75],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WL_SIENNAEXECRATE, 3]]
};
SkillInfo[SK.AG_ALL_BLOOM] = {
	Name: 'AG_ALL_BLOOM',
	SkillName: 'All Bloom',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_FLORAL_FLARE_ROAD, 3]]
};
SkillInfo[SK.AG_CRYSTAL_IMPACT] = {
	Name: 'AG_CRYSTAL_IMPACT',
	SkillName: 'Crystal Impact',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AG_RAIN_OF_CRYSTAL, 3]]
};
SkillInfo[SK.AG_TORNADO_STORM] = {
	Name: 'AG_TORNADO_STORM',
	SkillName: 'Tornado Storm',
	MaxLv: 5,
	SpAmount: [45, 55, 65, 75, 85],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WL_CHAINLIGHTNING, 3]]
};
SkillInfo[SK.AG_FLORAL_FLARE_ROAD] = {
	Name: 'AG_FLORAL_FLARE_ROAD',
	SkillName: 'Floral Flare Road',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WL_CRIMSONROCK, 3]]
};
SkillInfo[SK.AG_CLIMAX] = {
	Name: 'AG_CLIMAX',
	SkillName: 'Climax',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [200, 200, 200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.WL_TETRAVORTEX, 5],
		[SK.AG_TWOHANDSTAFF, 3]
	]
};
SkillInfo[SK.AG_ASTRAL_STRIKE] = {
	Name: 'AG_ASTRAL_STRIKE',
	SkillName: 'Astral Strike',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.WL_COMET, 5],
		[SK.AG_MYSTERY_ILLUSION, 3],
		[SK.AG_DEADLY_PROJECTION, 3]
	]
};
SkillInfo[SK.AG_ROCK_DOWN] = {
	Name: 'AG_ROCK_DOWN',
	SkillName: 'Rock Down',
	MaxLv: 5,
	SpAmount: [65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_STRANTUM_TREMOR, 1]]
};
SkillInfo[SK.AG_STORM_CANNON] = {
	Name: 'AG_STORM_CANNON',
	SkillName: 'Storm Cannon',
	MaxLv: 5,
	SpAmount: [60, 70, 80, 90, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_TORNADO_STORM, 1]]
};
SkillInfo[SK.AG_CRIMSON_ARROW] = {
	Name: 'AG_CRIMSON_ARROW',
	SkillName: 'Crimson Arrow',
	MaxLv: 5,
	SpAmount: [65, 75, 85, 95, 105],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.AG_FLORAL_FLARE_ROAD, 1]]
};
SkillInfo[SK.AG_FROZEN_SLASH] = {
	Name: 'AG_FROZEN_SLASH',
	SkillName: 'Frozen Slash',
	MaxLv: 5,
	SpAmount: [45, 55, 65, 75, 85],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.AG_RAIN_OF_CRYSTAL, 1]]
};
SkillInfo[SK.AG_TWOHANDSTAFF] = {
	Name: 'AG_TWOHANDSTAFF',
	SkillName: 'Two-handed Staff Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IQ_POWERFUL_FAITH] = {
	Name: 'IQ_POWERFUL_FAITH',
	SkillName: 'Powerful Faith',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 1]]
};
SkillInfo[SK.IQ_FIRM_FAITH] = {
	Name: 'IQ_FIRM_FAITH',
	SkillName: 'Firm Faith',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 1]]
};
SkillInfo[SK.IQ_WILL_OF_FAITH] = {
	Name: 'IQ_WILL_OF_FAITH',
	SkillName: 'Will of Faith',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IQ_OLEUM_SANCTUM] = {
	Name: 'IQ_OLEUM_SANCTUM',
	SkillName: 'Oleum Sanctum',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.AL_HOLYWATER, 1],
		[SK.IQ_WILL_OF_FAITH, 3]
	]
};
SkillInfo[SK.IQ_SINCERE_FAITH] = {
	Name: 'IQ_SINCERE_FAITH',
	SkillName: 'Sincere Faith',
	MaxLv: 5,
	SpAmount: [54, 58, 62, 66, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 1]]
};
SkillInfo[SK.IQ_FIRST_BRAND] = {
	Name: 'IQ_FIRST_BRAND',
	SkillName: 'First Brand',
	MaxLv: 5,
	SpAmount: [22, 29, 36, 43, 50],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [[SK.IQ_WILL_OF_FAITH, 2]]
};
SkillInfo[SK.IQ_FIRST_FAITH_POWER] = {
	Name: 'IQ_FIRST_FAITH_POWER',
	SkillName: 'First Faith Power',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IQ_WILL_OF_FAITH, 3],
		[SK.IQ_FIRST_BRAND, 1]
	]
};
SkillInfo[SK.IQ_THIRD_PUNISH] = {
	Name: 'IQ_THIRD_PUNISH',
	SkillName: 'Third Punishment',
	MaxLv: 5,
	SpAmount: [56, 62, 68, 74, 80],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_SECOND_FAITH, 2]]
};
SkillInfo[SK.IQ_THIRD_FLAME_BOMB] = {
	Name: 'IQ_THIRD_FLAME_BOMB',
	SkillName: 'Third Flame Bomb',
	MaxLv: 5,
	SpAmount: [74, 78, 82, 86, 90],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_SECOND_FLAME, 2]]
};
SkillInfo[SK.IQ_THIRD_CONSECRATION] = {
	Name: 'IQ_THIRD_CONSECRATION',
	SkillName: 'Third Consecration',
	MaxLv: 5,
	SpAmount: [65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_SECOND_JUDGEMENT, 2]]
};
SkillInfo[SK.IQ_SECOND_FLAME] = {
	Name: 'IQ_SECOND_FLAME',
	SkillName: 'Second Flame',
	MaxLv: 5,
	SpAmount: [46, 52, 58, 64, 70],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_THIRD_EXOR_FLAME, 1]]
};
SkillInfo[SK.IQ_SECOND_FAITH] = {
	Name: 'IQ_SECOND_FAITH',
	SkillName: 'Second Faith',
	MaxLv: 5,
	SpAmount: [36, 42, 48, 54, 60],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_FIRST_FAITH_POWER, 1]]
};
SkillInfo[SK.IQ_SECOND_JUDGEMENT] = {
	Name: 'IQ_SECOND_JUDGEMENT',
	SkillName: 'Second Judgment',
	MaxLv: 5,
	SpAmount: [45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [[SK.IQ_JUDGE, 1]]
};
SkillInfo[SK.IQ_EXPOSION_BLASTER] = {
	Name: 'IQ_EXPOSION_BLASTER',
	SkillName: 'Explosion Blaster',
	MaxLv: 5,
	SpAmount: [80, 90, 100, 110, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_OLEUM_SANCTUM, 1]]
};
SkillInfo[SK.IQ_MASSIVE_F_BLASTER] = {
	Name: 'IQ_MASSIVE_F_BLASTER',
	SkillName: 'Massive Flame Blaster',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IQ_OLEUM_SANCTUM, 3],
		[SK.IQ_EXPOSION_BLASTER, 3],
		[SK.IQ_WILL_OF_FAITH, 5]
	]
};
SkillInfo[SK.IQ_JUDGE] = {
	Name: 'IQ_JUDGE',
	SkillName: 'Judgment',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_FIRST_FAITH_POWER, 1]]
};
SkillInfo[SK.IQ_THIRD_EXOR_FLAME] = {
	Name: 'IQ_THIRD_EXOR_FLAME',
	SkillName: 'Third Exorcism Flame',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IQ_JUDGE, 1]]
};
SkillInfo[SK.IG_GUARD_STANCE] = {
	Name: 'IG_GUARD_STANCE',
	SkillName: 'Guard Stance',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_SHIELD_MASTERY, 3]]
};
SkillInfo[SK.IG_GUARDIAN_SHIELD] = {
	Name: 'IG_GUARDIAN_SHIELD',
	SkillName: 'Guardian Shield',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_GUARD_STANCE, 2]]
};
SkillInfo[SK.IG_REBOUND_SHIELD] = {
	Name: 'IG_REBOUND_SHIELD',
	SkillName: 'Rebound Shield',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_GUARD_STANCE, 4]]
};
SkillInfo[SK.IG_SHIELD_MASTERY] = {
	Name: 'IG_SHIELD_MASTERY',
	SkillName: 'Shield Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IG_SPEAR_SWORD_M] = {
	Name: 'IG_SPEAR_SWORD_M',
	SkillName: 'Spear Sword Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.IG_ATTACK_STANCE] = {
	Name: 'IG_ATTACK_STANCE',
	SkillName: 'Attack Stance',
	MaxLv: 5,
	SpAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_SPEAR_SWORD_M, 3]]
};
SkillInfo[SK.IG_ULTIMATE_SACRIFICE] = {
	Name: 'IG_ULTIMATE_SACRIFICE',
	SkillName: 'Ultimate Sacrifice',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IG_REBOUND_SHIELD, 3],
		[SK.IG_GUARDIAN_SHIELD, 3]
	]
};
SkillInfo[SK.IG_HOLY_SHIELD] = {
	Name: 'IG_HOLY_SHIELD',
	SkillName: 'Holy Shield',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IG_SHIELD_MASTERY, 5],
		[SK.IG_CROSS_RAIN, 3]
	]
};
SkillInfo[SK.IG_GRAND_JUDGEMENT] = {
	Name: 'IG_GRAND_JUDGEMENT',
	SkillName: 'Grand Judgment',
	MaxLv: 10,
	SpAmount: [41, 44, 47, 50, 53, 56, 59, 62, 65, 68],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.IG_OVERSLASH, 5],
		[SK.IG_SPEAR_SWORD_M, 5]
	]
};
SkillInfo[SK.IG_JUDGEMENT_CROSS] = {
	Name: 'IG_JUDGEMENT_CROSS',
	SkillName: 'Judgement Cross',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.IG_CROSS_RAIN, 5],
		[SK.IG_HOLY_SHIELD, 3]
	]
};
SkillInfo[SK.IG_SHIELD_SHOOTING] = {
	Name: 'IG_SHIELD_SHOOTING',
	SkillName: 'Shield Shooting',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.IG_SHIELD_MASTERY, 5],
		[SK.IG_ATTACK_STANCE, 2]
	]
};
SkillInfo[SK.IG_OVERSLASH] = {
	Name: 'IG_OVERSLASH',
	SkillName: 'Overslash',
	MaxLv: 10,
	SpAmount: [41, 44, 47, 50, 53, 56, 59, 62, 65, 68],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.IG_ATTACK_STANCE, 3]]
};
SkillInfo[SK.IG_CROSS_RAIN] = {
	Name: 'IG_CROSS_RAIN',
	SkillName: 'Cross Rain',
	MaxLv: 10,
	SpAmount: [50, 54, 58, 62, 66, 70, 74, 78, 82, 86],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.IG_SHIELD_MASTERY, 1]]
};
SkillInfo[SK.SHC_DANCING_KNIFE] = {
	Name: 'SHC_DANCING_KNIFE',
	SkillName: 'Dancing Knife',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SHC_SHADOW_SENSE, 3]]
};
SkillInfo[SK.SHC_SAVAGE_IMPACT] = {
	Name: 'SHC_SAVAGE_IMPACT',
	SkillName: 'Savage Impact',
	MaxLv: 10,
	SpAmount: [28, 31, 34, 37, 40, 43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 3],
		[SK.GC_CROSSIMPACT, 5]
	]
};
SkillInfo[SK.SHC_SHADOW_SENSE] = {
	Name: 'SHC_SHADOW_SENSE',
	SkillName: 'Shadow Sense',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.SHC_ETERNAL_SLASH] = {
	Name: 'SHC_ETERNAL_SLASH',
	SkillName: 'Eternal Slash',
	MaxLv: 5,
	SpAmount: [40, 40, 40, 40, 40],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_DANCING_KNIFE, 3],
		[SK.GC_WEAPONBLOCKING, 3]
	]
};
SkillInfo[SK.SHC_ENCHANTING_SHADOW] = {
	Name: 'SHC_ENCHANTING_SHADOW',
	SkillName: 'Enchanting Shadow',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 3],
		[SK.GC_POISONINGWEAPON, 5]
	]
};
SkillInfo[SK.SHC_POTENT_VENOM] = {
	Name: 'SHC_POTENT_VENOM',
	SkillName: 'Potent Venom',
	MaxLv: 10,
	SpAmount: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_ENCHANTING_SHADOW, 3]
	]
};
SkillInfo[SK.SHC_SHADOW_EXCEED] = {
	Name: 'SHC_SHADOW_EXCEED',
	SkillName: 'Shadow Exceed',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 7],
		[SK.SHC_ENCHANTING_SHADOW, 5],
		[SK.SHC_POTENT_VENOM, 3]
	]
};
SkillInfo[SK.SHC_FATAL_SHADOW_CROW] = {
	Name: 'SHC_FATAL_SHADOW_CROW',
	SkillName: 'Fatal Shadow Claw',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SHC_SHADOW_STAB, 5],
		[SK.SHC_IMPACT_CRATER, 5]
	]
};
SkillInfo[SK.SHC_SHADOW_STAB] = {
	Name: 'SHC_SHADOW_STAB',
	SkillName: 'Shadow Stab',
	MaxLv: 5,
	SpAmount: [45, 50, 55, 60, 65],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_DANCING_KNIFE, 5],
		[SK.SHC_ETERNAL_SLASH, 3],
		[SK.GC_CLOAKINGEXCEED, 5]
	]
};
SkillInfo[SK.SHC_IMPACT_CRATER] = {
	Name: 'SHC_IMPACT_CRATER',
	SkillName: 'Impact Crater',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SHC_SHADOW_SENSE, 5],
		[SK.SHC_SAVAGE_IMPACT, 5],
		[SK.GC_ROLLINGCUTTER, 5],
		[SK.GC_WEAPONBLOCKING, 3]
	]
};
SkillInfo[SK.CD_REPARATIO] = {
	Name: 'CD_REPARATIO',
	SkillName: 'Repatatio',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.CD_MEDIALE_VOTUM, 3]]
};
SkillInfo[SK.CD_MEDIALE_VOTUM] = {
	Name: 'CD_MEDIALE_VOTUM',
	SkillName: 'Mediale Votum',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.CD_DILECTIO_HEAL, 3]]
};
SkillInfo[SK.CD_MACE_BOOK_M] = {
	Name: 'CD_MACE_BOOK_M',
	SkillName: 'Mace Book Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.CD_ARGUTUS_VITA] = {
	Name: 'CD_ARGUTUS_VITA',
	SkillName: 'Argutus Vita',
	MaxLv: 5,
	SpAmount: [30, 45, 60, 75, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_MEDIALE_VOTUM, 3],
		[SK.CD_REPARATIO, 3]
	]
};
SkillInfo[SK.CD_ARGUTUS_TELUM] = {
	Name: 'CD_ARGUTUS_TELUM',
	SkillName: 'Argutus Telum',
	MaxLv: 5,
	SpAmount: [30, 45, 60, 75, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_MEDIALE_VOTUM, 3],
		[SK.CD_REPARATIO, 3]
	]
};
SkillInfo[SK.CD_ARBITRIUM] = {
	Name: 'CD_ARBITRIUM',
	SkillName: 'Arbitrium',
	MaxLv: 10,
	SpAmount: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_ADORAMUS, 5],
		[SK.CD_FRAMEN, 3]
	]
};
SkillInfo[SK.CD_PRESENS_ACIES] = {
	Name: 'CD_PRESENS_ACIES',
	SkillName: 'Presens Acies',
	MaxLv: 5,
	SpAmount: [30, 45, 60, 75, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_MEDIALE_VOTUM, 3],
		[SK.CD_REPARATIO, 3]
	]
};
SkillInfo[SK.CD_FIDUS_ANIMUS] = {
	Name: 'CD_FIDUS_ANIMUS',
	SkillName: 'Fidus Animus',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.CD_EFFLIGO] = {
	Name: 'CD_EFFLIGO',
	SkillName: 'Effligo',
	MaxLv: 10,
	SpAmount: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
	ApAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.AB_ORATIO, 5],
		[SK.CD_PETITIO, 10]
	]
};
SkillInfo[SK.CD_COMPETENTIA] = {
	Name: 'CD_COMPETENTIA',
	SkillName: 'Competentia',
	MaxLv: 5,
	SpAmount: [60, 60, 60, 60, 60],
	ApAmount: [200, 200, 200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.CD_PRESENS_ACIES, 2],
		[SK.CD_ARGUTUS_TELUM, 2],
		[SK.CD_ARGUTUS_VITA, 2]
	]
};
SkillInfo[SK.CD_PNEUMATICUS_PROCELLA] = {
	Name: 'CD_PNEUMATICUS_PROCELLA',
	SkillName: 'Pneumaticus Procella',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.CD_FRAMEN, 5],
		[SK.CD_ARBITRIUM, 10]
	]
};
SkillInfo[SK.CD_DILECTIO_HEAL] = {
	Name: 'CD_DILECTIO_HEAL',
	SkillName: 'Dilectio Heal',
	MaxLv: 5,
	SpAmount: [50, 55, 60, 65, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_CHEAL, 3],
		[SK.AB_HIGHNESSHEAL, 3]
	]
};
SkillInfo[SK.CD_RELIGIO] = {
	Name: 'CD_RELIGIO',
	SkillName: 'Religio',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_CLEMENTIA, 3],
		[SK.CD_DILECTIO_HEAL, 2]
	]
};
SkillInfo[SK.CD_BENEDICTUM] = {
	Name: 'CD_BENEDICTUM',
	SkillName: 'Benedictum',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_CANTO, 3],
		[SK.CD_DILECTIO_HEAL, 2]
	]
};
SkillInfo[SK.CD_PETITIO] = {
	Name: 'CD_PETITIO',
	SkillName: 'Petitio',
	MaxLv: 10,
	SpAmount: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.AB_DUPLELIGHT, 10],
		[SK.CD_MACE_BOOK_M, 5]
	]
};
SkillInfo[SK.CD_FRAMEN] = {
	Name: 'CD_FRAMEN',
	SkillName: 'Flamen',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.AB_JUDEX, 10],
		[SK.CD_FIDUS_ANIMUS, 5]
	]
};
SkillInfo[SK.BO_BIONIC_PHARMACY] = {
	Name: 'BO_BIONIC_PHARMACY',
	SkillName: 'Bionic Pharmacy',
	MaxLv: 5,
	SpAmount: [30, 30, 30, 30, 30],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.GN_S_PHARMACY, 5]]
};
SkillInfo[SK.BO_BIONICS_M] = {
	Name: 'BO_BIONICS_M',
	SkillName: 'Bionics Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.BO_THE_WHOLE_PROTECTION] = {
	Name: 'BO_THE_WHOLE_PROTECTION',
	SkillName: 'Group Protection',
	MaxLv: 5,
	SpAmount: [220, 260, 300, 340, 380],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_BIONIC_PHARMACY, 5]]
};
SkillInfo[SK.BO_ADVANCE_PROTECTION] = {
	Name: 'BO_ADVANCE_PROTECTION',
	SkillName: 'Full Shadow Protection',
	MaxLv: 4,
	SpAmount: [120, 130, 140, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_BIONIC_PHARMACY, 5]]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_WATER] = {
	Name: 'BO_ACIDIFIED_ZONE_WATER',
	SkillName: 'Acidified Zone (Water)',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.BO_ACIDIFIED_ZONE_WIND, 1]]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_GROUND] = {
	Name: 'BO_ACIDIFIED_ZONE_GROUND',
	SkillName: 'Acidified Zone (Earth)',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.BO_BIONICS_M, 3],
		[SK.BO_BIONIC_PHARMACY, 5]
	]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_FIRE] = {
	Name: 'BO_ACIDIFIED_ZONE_FIRE',
	SkillName: 'Acidified Zone (Fire)',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [[SK.BO_ACIDIFIED_ZONE_GROUND, 1]]
};
SkillInfo[SK.BO_ACIDIFIED_ZONE_WIND] = {
	Name: 'BO_ACIDIFIED_ZONE_WIND',
	SkillName: 'Acidified Zone (Wind)',
	MaxLv: 5,
	SpAmount: [40, 52, 64, 76, 88],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.BO_BIONICS_M, 3],
		[SK.BO_BIONIC_PHARMACY, 5]
	]
};
SkillInfo[SK.BO_WOODENWARRIOR] = {
	Name: 'BO_WOODENWARRIOR',
	SkillName: 'Create Wooden Warrior',
	MaxLv: 5,
	SpAmount: [100, 120, 140, 160, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_CREEPER, 3]]
};
SkillInfo[SK.BO_WOODEN_FAIRY] = {
	Name: 'BO_WOODEN_FAIRY',
	SkillName: 'Create Wooden Fairy',
	MaxLv: 5,
	SpAmount: [120, 155, 180, 205, 230],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_CREEPER, 3]]
};
SkillInfo[SK.BO_CREEPER] = {
	Name: 'BO_CREEPER',
	SkillName: 'Create Creeper',
	MaxLv: 5,
	SpAmount: [80, 96, 112, 128, 144],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.BO_BIONICS_M, 5]]
};
SkillInfo[SK.BO_RESEARCHREPORT] = {
	Name: 'BO_RESEARCHREPORT',
	SkillName: 'Research Report',
	MaxLv: 1,
	SpAmount: [60],
	ApAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.BO_ACIDIFIED_ZONE_FIRE, 3],
		[SK.BO_ACIDIFIED_ZONE_WATER, 3]
	]
};
SkillInfo[SK.BO_HELLTREE] = {
	Name: 'BO_HELLTREE',
	SkillName: 'Create Hell Tree',
	MaxLv: 5,
	SpAmount: [100, 100, 100, 100, 100],
	ApAmount: [100, 100, 100, 100, 100],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.BO_WOODENWARRIOR, 3],
		[SK.BO_WOODEN_FAIRY, 3]
	]
};
SkillInfo[SK.WH_ADVANCED_TRAP] = {
	Name: 'WH_ADVANCED_TRAP',
	SkillName: 'Advanced Trap',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.RA_RESEARCHTRAP, 3]]
};
SkillInfo[SK.WH_WIND_SIGN] = {
	Name: 'WH_WIND_SIGN',
	SkillName: 'Wind Sign',
	MaxLv: 5,
	SpAmount: [100, 90, 80, 70, 60],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_NATUREFRIENDLY, 5]]
};
SkillInfo[SK.WH_NATUREFRIENDLY] = {
	Name: 'WH_NATUREFRIENDLY',
	SkillName: "Nature's Friend",
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.WH_HAWKRUSH] = {
	Name: 'WH_HAWKRUSH',
	SkillName: 'Hawk Rush',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_HAWK_M, 1]]
};
SkillInfo[SK.WH_HAWK_M] = {
	Name: 'WH_HAWK_M',
	SkillName: 'Hawk Mastery',
	MaxLv: 1,
	SpAmount: [5],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.HT_STEELCROW, 1]]
};
SkillInfo[SK.WH_CALAMITYGALE] = {
	Name: 'WH_CALAMITYGALE',
	SkillName: 'Calamity Gale',
	MaxLv: 1,
	SpAmount: [300],
	ApAmount: [200],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.WH_GALESTORM, 5],
		[SK.WH_WIND_SIGN, 5]
	]
};
SkillInfo[SK.WH_HAWKBOOMERANG] = {
	Name: 'WH_HAWKBOOMERANG',
	SkillName: 'Hawk Boomerang',
	MaxLv: 5,
	SpAmount: [120, 120, 120, 120, 120],
	ApAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_HAWKRUSH, 5]]
};
SkillInfo[SK.WH_GALESTORM] = {
	Name: 'WH_GALESTORM',
	SkillName: 'Gale Storm',
	MaxLv: 10,
	SpAmount: [80, 91, 102, 113, 124, 135, 146, 157, 168, 179],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WH_CRESCIVE_BOLT, 3]]
};
SkillInfo[SK.WH_DEEPBLINDTRAP] = {
	Name: 'WH_DEEPBLINDTRAP',
	SkillName: 'Deep Blind Trap',
	MaxLv: 5,
	SpAmount: [50, 53, 56, 59, 62],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_ADVANCED_TRAP, 3]]
};
SkillInfo[SK.WH_SOLIDTRAP] = {
	Name: 'WH_SOLIDTRAP',
	SkillName: 'Solid Trap',
	MaxLv: 5,
	SpAmount: [70, 80, 90, 100, 110],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_ADVANCED_TRAP, 3]]
};
SkillInfo[SK.WH_SWIFTTRAP] = {
	Name: 'WH_SWIFTTRAP',
	SkillName: 'Swift Trap',
	MaxLv: 5,
	SpAmount: [60, 62, 64, 66, 68],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_DEEPBLINDTRAP, 1]]
};
SkillInfo[SK.WH_CRESCIVE_BOLT] = {
	Name: 'WH_CRESCIVE_BOLT',
	SkillName: 'Crescive Bolt',
	MaxLv: 10,
	SpAmount: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.RA_AIMEDBOLT, 5]]
};
SkillInfo[SK.WH_FLAMETRAP] = {
	Name: 'WH_FLAMETRAP',
	SkillName: 'Flame Trap',
	MaxLv: 5,
	SpAmount: [40, 44, 48, 52, 56],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.WH_SOLIDTRAP, 1]]
};
SkillInfo[SK.TR_STAGE_MANNER] = {
	Name: 'TR_STAGE_MANNER',
	SkillName: 'Stage Etiquette',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.TR_RETROSPECTION] = {
	Name: 'TR_RETROSPECTION',
	SkillName: 'Retrospection',
	MaxLv: 1,
	SpAmount: [1],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [[SK.TR_STAGE_MANNER, 1]]
};
SkillInfo[SK.TR_MYSTIC_SYMPHONY] = {
	Name: 'TR_MYSTIC_SYMPHONY',
	SkillName: 'Mystic Symphony',
	MaxLv: 1,
	SpAmount: [250],
	ApAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.TR_METALIC_FURY, 1],
		[SK.TR_ROSEBLOSSOM, 5]
	]
};
SkillInfo[SK.TR_KVASIR_SONATA] = {
	Name: 'TR_KVASIR_SONATA',
	SkillName: 'Kvasir Sonata',
	MaxLv: 1,
	SpAmount: [300],
	ApAmount: [100],
	bSeperateLv: false,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.TR_ROKI_CAPRICCIO, 1],
		[SK.TR_NIPELHEIM_REQUIEM, 1]
	]
};
SkillInfo[SK.TR_ROSEBLOSSOM] = {
	Name: 'TR_ROSEBLOSSOM',
	SkillName: 'Rose Blossom',
	MaxLv: 5,
	SpAmount: [215, 230, 245, 260, 275],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.TR_RHYTHMSHOOTING, 3]]
};
SkillInfo[SK.TR_RHYTHMSHOOTING] = {
	Name: 'TR_RHYTHMSHOOTING',
	SkillName: 'Rhythm Shooting',
	MaxLv: 5,
	SpAmount: [80, 92, 104, 116, 128],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9]
};
SkillInfo[SK.TR_METALIC_FURY] = {
	Name: 'TR_METALIC_FURY',
	SkillName: 'Metallic Fury',
	MaxLv: 5,
	SpAmount: [120, 132, 144, 156, 168],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.TR_SOUNDBLEND, 1]]
};
SkillInfo[SK.TR_SOUNDBLEND] = {
	Name: 'TR_SOUNDBLEND',
	SkillName: 'Sound Blend',
	MaxLv: 5,
	SpAmount: [80, 92, 104, 116, 128],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.WM_METALICSOUND, 5]]
};
SkillInfo[SK.TR_GEF_NOCTURN] = {
	Name: 'TR_GEF_NOCTURN',
	SkillName: 'Geffenia Nocturne',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_STAGE_MANNER, 3]]
};
SkillInfo[SK.TR_ROKI_CAPRICCIO] = {
	Name: 'TR_ROKI_CAPRICCIO',
	SkillName: 'Loki Capriccio',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_JAWAII_SERENADE, 1]]
};
SkillInfo[SK.TR_AIN_RHAPSODY] = {
	Name: 'TR_AIN_RHAPSODY',
	SkillName: 'Miner Rhapsody',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_STAGE_MANNER, 3]]
};
SkillInfo[SK.TR_MUSICAL_INTERLUDE] = {
	Name: 'TR_MUSICAL_INTERLUDE',
	SkillName: 'Musical Interlude',
	MaxLv: 5,
	SpAmount: [171, 182, 193, 204, 215],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_AIN_RHAPSODY, 1]]
};
SkillInfo[SK.TR_JAWAII_SERENADE] = {
	Name: 'TR_JAWAII_SERENADE',
	SkillName: 'Jawaii Serenade',
	MaxLv: 5,
	SpAmount: [140, 150, 160, 170, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_GEF_NOCTURN, 1]]
};
SkillInfo[SK.TR_NIPELHEIM_REQUIEM] = {
	Name: 'TR_NIPELHEIM_REQUIEM',
	SkillName: 'Nifflheim Requiem',
	MaxLv: 5,
	SpAmount: [120, 160, 200, 240, 280],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.TR_MUSICAL_INTERLUDE, 1],
		[SK.TR_PRON_MARCH, 1]
	]
};
SkillInfo[SK.TR_PRON_MARCH] = {
	Name: 'TR_PRON_MARCH',
	SkillName: 'Prontera March',
	MaxLv: 5,
	SpAmount: [140, 150, 160, 170, 180],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.TR_AIN_RHAPSODY, 1]]
};
SkillInfo[SK.ABC_DAGGER_AND_BOW_M] = {
	Name: 'ABC_DAGGER_AND_BOW_M',
	SkillName: 'Dagger Bow Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.ABC_MAGIC_SWORD_M] = {
	Name: 'ABC_MAGIC_SWORD_M',
	SkillName: 'Magic Sword Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_REPRODUCE, 5],
		[SK.SC_AUTOSHADOWSPELL, 5]
	]
};
SkillInfo[SK.ABC_STRIP_SHADOW] = {
	Name: 'ABC_STRIP_SHADOW',
	SkillName: 'Divest Shadow',
	MaxLv: 5,
	SpAmount: [29, 33, 37, 41, 45],
	bSeperateLv: true,
	AttackRange: [3, 3, 3, 3, 3],
	_NeedSkillList: [
		[SK.SC_STRIPACCESSARY, 1],
		[SK.ABC_DAGGER_AND_BOW_M, 7]
	]
};
SkillInfo[SK.ABC_ABYSS_DAGGER] = {
	Name: 'ABC_ABYSS_DAGGER',
	SkillName: 'Abyss Dagger',
	MaxLv: 5,
	SpAmount: [40, 45, 50, 55, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.SC_FATALMENACE, 5],
		[SK.ABC_DAGGER_AND_BOW_M, 3]
	]
};
SkillInfo[SK.ABC_UNLUCKY_RUSH] = {
	Name: 'ABC_UNLUCKY_RUSH',
	SkillName: 'Misfortune Rush',
	MaxLv: 5,
	SpAmount: [30, 35, 40, 45, 50],
	bSeperateLv: true,
	AttackRange: [7, 7, 7, 7, 7],
	_NeedSkillList: [
		[SK.ABC_ABYSS_DAGGER, 3],
		[SK.ABC_DAGGER_AND_BOW_M, 4]
	]
};
SkillInfo[SK.ABC_CHAIN_REACTION_SHOT] = {
	Name: 'ABC_CHAIN_REACTION_SHOT',
	SkillName: 'Chain Reaction Shot',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.SC_TRIANGLESHOT, 5],
		[SK.ABC_DAGGER_AND_BOW_M, 3]
	]
};
SkillInfo[SK.ABC_FROM_THE_ABYSS] = {
	Name: 'ABC_FROM_THE_ABYSS',
	SkillName: 'From the Abyss',
	MaxLv: 5,
	SpAmount: [40, 50, 60, 70, 80],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.ABC_MAGIC_SWORD_M, 3]]
};
SkillInfo[SK.ABC_ABYSS_SLAYER] = {
	Name: 'ABC_ABYSS_SLAYER',
	SkillName: 'Abyss Slayer',
	MaxLv: 10,
	SpAmount: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.ABC_ABYSS_DAGGER, 5],
		[SK.ABC_DEFT_STAB, 5]
	]
};
SkillInfo[SK.ABC_ABYSS_STRIKE] = {
	Name: 'ABC_ABYSS_STRIKE',
	SkillName: 'Omega Abyss Strike',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.ABC_FROM_THE_ABYSS, 3],
		[SK.ABC_ABYSS_SQUARE, 3]
	]
};
SkillInfo[SK.ABC_DEFT_STAB] = {
	Name: 'ABC_DEFT_STAB',
	SkillName: 'Deft Stab',
	MaxLv: 10,
	SpAmount: [28, 31, 34, 37, 40, 43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
	_NeedSkillList: [
		[SK.ABC_ABYSS_DAGGER, 3],
		[SK.ABC_DAGGER_AND_BOW_M, 5]
	]
};
SkillInfo[SK.ABC_ABYSS_SQUARE] = {
	Name: 'ABC_ABYSS_SQUARE',
	SkillName: 'Abyss Square',
	MaxLv: 5,
	SpAmount: [65, 75, 85, 95, 105],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.ABC_MAGIC_SWORD_M, 5],
		[SK.ABC_FROM_THE_ABYSS, 1]
	]
};
SkillInfo[SK.ABC_FRENZY_SHOT] = {
	Name: 'ABC_FRENZY_SHOT',
	SkillName: 'Frenzy Shot',
	MaxLv: 10,
	SpAmount: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [
		[SK.ABC_CHAIN_REACTION_SHOT, 3],
		[SK.ABC_DAGGER_AND_BOW_M, 5]
	]
};
SkillInfo[SK.MT_AXE_STOMP] = {
	Name: 'MT_AXE_STOMP',
	SkillName: 'Axe Stomp',
	MaxLv: 5,
	SpAmount: [25, 30, 35, 40, 45],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_TWOAXEDEF, 5]]
};
SkillInfo[SK.MT_RUSH_QUAKE] = {
	Name: 'MT_RUSH_QUAKE',
	SkillName: 'Rush Quake',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.MT_AXE_STOMP, 5]]
};
SkillInfo[SK.MT_M_MACHINE] = {
	Name: 'MT_M_MACHINE',
	SkillName: 'Manufacture Machine',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1]
};
SkillInfo[SK.MT_A_MACHINE] = {
	Name: 'MT_A_MACHINE',
	SkillName: 'Activate Attack Device',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_AXE_STOMP, 3],
		[SK.MT_M_MACHINE, 3]
	]
};
SkillInfo[SK.MT_D_MACHINE] = {
	Name: 'MT_D_MACHINE',
	SkillName: 'Activate Defense Device',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_M_MACHINE, 1]]
};
SkillInfo[SK.MT_TWOAXEDEF] = {
	Name: 'MT_TWOAXEDEF',
	SkillName: 'Two-handed Axe Defense',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.MT_ABR_M] = {
	Name: 'MT_ABR_M',
	SkillName: 'ABR Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_M_MACHINE, 1]]
};
SkillInfo[SK.MT_SUMMON_ABR_BATTLE_WARIOR] = {
	Name: 'MT_SUMMON_ABR_BATTLE_WARIOR',
	SkillName: 'ABR: Battle Warrior',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [[SK.MT_ABR_M, 1]]
};
SkillInfo[SK.MT_SUMMON_ABR_DUAL_CANNON] = {
	Name: 'MT_SUMMON_ABR_DUAL_CANNON',
	SkillName: 'ABR: Dual Cannon',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_ABR_M, 3],
		[SK.MT_SUMMON_ABR_BATTLE_WARIOR, 2]
	]
};
SkillInfo[SK.MT_SUMMON_ABR_MOTHER_NET] = {
	Name: 'MT_SUMMON_ABR_MOTHER_NET',
	SkillName: 'ABR: Mother Net',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_ABR_M, 5],
		[SK.MT_SUMMON_ABR_BATTLE_WARIOR, 3],
		[SK.MT_SUMMON_ABR_DUAL_CANNON, 3]
	]
};
SkillInfo[SK.MT_SUMMON_ABR_INFINITY] = {
	Name: 'MT_SUMMON_ABR_INFINITY',
	SkillName: 'ABR: Infinity',
	MaxLv: 4,
	SpAmount: [30, 40, 50, 60],
	ApAmount: [200, 200, 200, 200],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1],
	_NeedSkillList: [
		[SK.MT_ABR_M, 10],
		[SK.MT_SUMMON_ABR_BATTLE_WARIOR, 4],
		[SK.MT_SUMMON_ABR_DUAL_CANNON, 4],
		[SK.MT_SUMMON_ABR_MOTHER_NET, 4]
	]
};
SkillInfo[SK.ABR_DUAL_CANNON_FIRE] = {
	Name: 'ABR_DUAL_CANNON_FIRE',
	SkillName: 'Dual Cannon Fire',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_BATTLE_BUSTER] = {
	Name: 'ABR_BATTLE_BUSTER',
	SkillName: 'Battle Buster',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_NET_REPAIR] = {
	Name: 'ABR_NET_REPAIR',
	SkillName: 'Net Repair',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_NET_SUPPORT] = {
	Name: 'ABR_NET_SUPPORT',
	SkillName: 'Net Support',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.ABR_INFINITY_BUSTER] = {
	Name: 'ABR_INFINITY_BUSTER',
	SkillName: 'Infinity Buster',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_MAGIC_BOOK_M] = {
	Name: 'EM_MAGIC_BOOK_M',
	SkillName: 'Magic Book Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
SkillInfo[SK.EM_SPELL_ENCHANTING] = {
	Name: 'EM_SPELL_ENCHANTING',
	SkillName: 'Spell Enchanting',
	MaxLv: 5,
	SpAmount: [43, 46, 49, 52, 55],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 5]]
};
SkillInfo[SK.EM_ACTIVITY_BURN] = {
	Name: 'EM_ACTIVITY_BURN',
	SkillName: 'AP Burn',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_SPELL_ENCHANTING, 3]]
};
SkillInfo[SK.EM_INCREASING_ACTIVITY] = {
	Name: 'EM_INCREASING_ACTIVITY',
	SkillName: 'Increase AP',
	MaxLv: 5,
	SpAmount: [30, 40, 50, 60, 70],
	ApAmount: [50, 50, 50, 50, 50],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_ACTIVITY_BURN, 5]]
};
SkillInfo[SK.EM_DIAMOND_STORM] = {
	Name: 'EM_DIAMOND_STORM',
	SkillName: 'Diamond Storm',
	MaxLv: 5,
	SpAmount: [84, 88, 92, 96, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_LIGHTNING_LAND] = {
	Name: 'EM_LIGHTNING_LAND',
	SkillName: 'Lightning Land',
	MaxLv: 5,
	SpAmount: [65, 70, 80, 85, 95],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_VENOM_SWAMP] = {
	Name: 'EM_VENOM_SWAMP',
	SkillName: 'Venom Swamp',
	MaxLv: 5,
	SpAmount: [84, 88, 92, 96, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_CONFLAGRATION] = {
	Name: 'EM_CONFLAGRATION',
	SkillName: 'Conflagration',
	MaxLv: 5,
	SpAmount: [70, 80, 90, 100, 110],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_TERRA_DRIVE] = {
	Name: 'EM_TERRA_DRIVE',
	SkillName: 'Terra Drive',
	MaxLv: 5,
	SpAmount: [84, 88, 92, 96, 100],
	bSeperateLv: true,
	AttackRange: [9, 9, 9, 9, 9],
	_NeedSkillList: [[SK.EM_MAGIC_BOOK_M, 2]]
};
SkillInfo[SK.EM_ELEMENTAL_SPIRIT_M] = {
	Name: 'EM_ELEMENTAL_SPIRIT_M',
	SkillName: 'Elemental Spirit Mastery',
	MaxLv: 10,
	SpAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	bSeperateLv: false,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.SO_EL_SYMPATHY, 1]]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_ARDOR] = {
	Name: 'EM_SUMMON_ELEMENTAL_ARDOR',
	SkillName: 'Summon Elemental: Ador',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_AGNI, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_CONFLAGRATION, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_DILUVIO] = {
	Name: 'EM_SUMMON_ELEMENTAL_DILUVIO',
	SkillName: 'Summon Elemental: Diluvio',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_AQUA, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_DIAMOND_STORM, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_PROCELLA] = {
	Name: 'EM_SUMMON_ELEMENTAL_PROCELLA',
	SkillName: 'Summon Elemental: Procella',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_VENTUS, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_LIGHTNING_LAND, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_TERREMOTUS] = {
	Name: 'EM_SUMMON_ELEMENTAL_TERREMOTUS',
	SkillName: 'Summon Elemental: Terremotus',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_TERA, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_TERRA_DRIVE, 1]
	]
};
SkillInfo[SK.EM_SUMMON_ELEMENTAL_SERPENS] = {
	Name: 'EM_SUMMON_ELEMENTAL_SERPENS',
	SkillName: 'Summon Elemental: Serpens',
	MaxLv: 1,
	SpAmount: [100],
	bSeperateLv: true,
	AttackRange: [1],
	_NeedSkillList: [
		[SK.SO_SUMMON_AGNI, 3],
		[SK.SO_SUMMON_AQUA, 3],
		[SK.SO_SUMMON_VENTUS, 3],
		[SK.SO_SUMMON_TERA, 3],
		[SK.EM_ELEMENTAL_SPIRIT_M, 1],
		[SK.EM_VENOM_SWAMP, 1]
	]
};
SkillInfo[SK.EM_ELEMENTAL_BUSTER] = {
	Name: 'EM_ELEMENTAL_BUSTER',
	SkillName: 'Elemental Buster',
	MaxLv: 10,
	SpAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	ApAmount: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	_NeedSkillList: [
		[SK.EM_SUMMON_ELEMENTAL_SERPENS, 1],
		[SK.EM_SUMMON_ELEMENTAL_TERREMOTUS, 1],
		[SK.EM_SUMMON_ELEMENTAL_PROCELLA, 1],
		[SK.EM_SUMMON_ELEMENTAL_DILUVIO, 1],
		[SK.EM_ELEMENTAL_SPIRIT_M, 5],
		[SK.EM_SUMMON_ELEMENTAL_ARDOR, 1]
	]
};
SkillInfo[SK.EM_ELEMENTAL_VEIL] = {
	Name: 'EM_ELEMENTAL_VEIL',
	SkillName: 'Elemental Veil',
	MaxLv: 5,
	SpAmount: [70, 75, 80, 85, 90],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	_NeedSkillList: [[SK.EM_ELEMENTAL_SPIRIT_M, 3]]
};
SkillInfo[SK.EM_EL_FLAMETECHNIC] = {
	Name: 'EM_EL_FLAMETECHNIC',
	SkillName: 'Flame Technique',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_FLAMEARMOR] = {
	Name: 'EM_EL_FLAMEARMOR',
	SkillName: 'Flame Armor',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_FLAMEROCK] = {
	Name: 'EM_EL_FLAMEROCK',
	SkillName: 'Flame Rock',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.EM_EL_COLD_FORCE] = {
	Name: 'EM_EL_COLD_FORCE',
	SkillName: 'Cold Force',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_CRYSTAL_ARMOR] = {
	Name: 'EM_EL_CRYSTAL_ARMOR',
	SkillName: 'Crystal Armor',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_AGE_OF_ICE] = {
	Name: 'EM_EL_AGE_OF_ICE',
	SkillName: 'Ice Age',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_GRACE_BREEZE] = {
	Name: 'EM_EL_GRACE_BREEZE',
	SkillName: 'Grace Breeze',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_EYES_OF_STORM] = {
	Name: 'EM_EL_EYES_OF_STORM',
	SkillName: 'Eye of the Storm',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_STORM_WIND] = {
	Name: 'EM_EL_STORM_WIND',
	SkillName: 'Storm Wind',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.EM_EL_EARTH_CARE] = {
	Name: 'EM_EL_EARTH_CARE',
	SkillName: 'Earth Care',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_STRONG_PROTECTION] = {
	Name: 'EM_EL_STRONG_PROTECTION',
	SkillName: 'Strong Protection',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_AVALANCHE] = {
	Name: 'EM_EL_AVALANCHE',
	SkillName: 'Avalanche',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.EM_EL_DEEP_POISONING] = {
	Name: 'EM_EL_DEEP_POISONING',
	SkillName: 'Deep Poisoning',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_POISON_SHIELD] = {
	Name: 'EM_EL_POISON_SHIELD',
	SkillName: 'Poison Shield',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [1]
};
SkillInfo[SK.EM_EL_DEADLY_POISON] = {
	Name: 'EM_EL_DEADLY_POISON',
	SkillName: 'Deadly Poison',
	MaxLv: 1,
	SpAmount: [0],
	bSeperateLv: true,
	AttackRange: [7]
};
SkillInfo[SK.NPC_DEADLYCURSE2] = {
	Name: 'NPC_DEADLYCURSE2',
	SkillName: 'Wide Deadly Curse',
	MaxLv: 5,
	SpAmount: [0, 0, 0, 0, 0],
	bSeperateLv: true,
	AttackRange: [1, 1, 1, 1, 1],
	SkillScale: [
		[5, 5],
		[7, 7],
		[9, 9],
		[11, 11],
		[13, 13]
	]
};

export default SkillInfo;
