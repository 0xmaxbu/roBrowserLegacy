/**
 * DB/Status/StatusInfoOverlay_zh.js
 *
 * buff 状态图标悬停提示 — 全量中文覆盖层（zh）
 *
 * 键 = SC/EFST 数值 ID（与 StatusInfo.js / StatusConst.js 键空间一致，WR-02 独立表）
 * name: 中文标题；null = 无标题行（与英文 descript 结构同构）
 * type: buff/debuff/toggle/system 决定标题行颜色；null = 无标题行
 * time: 1 = 保留 %s 剩余时间占位行（与英文 descript 一致）
 * lines: 中文描述行
 *
 * 由 tools/gen-status-overlay-zh.py 从 StatusInfo.js 的 326 条英文描述翻译生成
 * 未命中的状态回退 StatusInfo.js 英文原文（LangOverlay.getStatusInfo 机制）
 */

export const STATUS_INFO_OVERLAY_ZH = {
	// 挑衅（PROVOKE）
	0: { name: '挑衅', type: 'buff', time: 1, lines: ['降低 VIT 防御', '提升攻击力'] },
	// 霸体（ENDURE）
	1: { name: '霸体', type: 'buff', time: 1, lines: ['受到攻击时', '仍可攻击与移动'] },
	// 双手剑加速（TWOHANDQUICKEN）
	2: { name: '双手剑加速', type: 'buff', time: 1, lines: ['使用双手武器时', '提升攻击速度'] },
	// 心神集中（CONCENTRATION）
	3: { name: '心神集中', type: 'buff', time: 1, lines: ['提升 DEX 与 AGI', '侦测附近隐藏的敌人'] },
	// 隐匿（HIDING）
	4: { name: '隐匿', type: 'buff', time: 1, lines: ['藏身地下回避敌人的攻击', '可被侦测技能发现'] },
	// 潜行（CLOAKING）
	5: { name: '潜行', type: 'buff', time: 1, lines: ['隐形'] },
	// 毒性强化（ENCHANTPOISON）
	6: { name: '毒性强化', type: 'buff', time: 1, lines: ['武器赋予毒属性'] },
	// 毒性反击（POISONREACT）
	7: { name: '毒性反击', type: 'buff', time: 1, lines: ['以一次攻击反击毒属性攻击', '被非毒属性物理攻击命中时', '有几率对目标施放施毒'] },
	// 泥沼地（QUAGMIRE）
	8: { name: '泥沼地', type: 'debuff', time: 1, lines: ['降低移动速度', '降低 AGI 与 DEX'] },
	// 天使之护（ANGELUS）
	9: { name: '天使之护', type: 'buff', time: 1, lines: ['提升 VIT 防御'] },
	// 天使之赐福（BLESSING）
	10: { name: '天使之赐福', type: 'buff', time: 1, lines: ['提升 DEX、INT 与 STR', '解除部分异常状态'] },
	// 十字架标记（CRUCIS）
	11: { name: '十字架标记', type: 'buff', time: 1, lines: ['降低不死族与恶魔的 DEF'] },
	// 加速术（INC_AGI）
	12: { name: '加速术', type: 'buff', time: 1, lines: ['提升移动速度', '提升攻击速度'] },
	// 缓速术（DEC_AGI）
	13: { name: '缓速术', type: 'debuff', time: 1, lines: ['降低移动速度', '降低攻击速度'] },
	// 毒缓释（SLOWPOISON）
	14: { name: '毒缓释', type: 'buff', time: 1, lines: ['暂时停止中毒伤害'] },
	// 圣灵祈祷（IMPOSITIO）
	15: { name: '圣灵祈祷', type: 'buff', time: 1, lines: ['提升武器攻击力'] },
	// 牺牲祈福（SUFFRAGIUM）
	16: { name: '牺牲祈福', type: 'buff', time: 1, lines: ['缩短咏唱时间'] },
	// 圣水祈福（ASPERSIO）
	17: { name: '圣水祈福', type: 'buff', time: 1, lines: ['武器赋予圣属性'] },
	// BENEDICTIO（BENEDICTIO）
	18: { name: null, type: null, time: 1, lines: ['护甲赋予圣属性'] },
	// 神之祈祷（KYRIE）
	19: { name: '神之祈祷', type: 'buff', time: 1, lines: ['生成可抵挡一定次数攻击的防御屏障'] },
	// 圣母之颂歌（MAGNIFICAT）
	20: { name: '圣母之颂歌', type: 'buff', time: 1, lines: ['提升 SP 自然恢复速度'] },
	// 圣母之祈福（GLORIA）
	21: { name: '圣母之祈福', type: 'buff', time: 1, lines: ['提升 LUK'] },
	// 永恒契约（LEXAETERNA）
	22: { name: '永恒契约', type: 'debuff', time: 1, lines: ['下一次攻击伤害加倍'] },
	// 肾上腺素（ADRENALINE）
	23: { name: '肾上腺素', type: 'buff', time: 1, lines: ['提升斧与钝器类', '武器的攻击速度'] },
	// 武器极致化（WEAPONPERFECT）
	24: { name: '武器极致化', type: 'buff', time: 1, lines: ['对小、中、大型怪物', '均造成 100% 伤害'] },
	// 武器最大化（OVERTHRUST）
	25: { name: '武器最大化', type: 'buff', time: 1, lines: ['提升武器攻击力', '有几率损坏武器'] },
	// 能量最大化（MAXIMIZE）
	26: { name: '能量最大化', type: 'buff', time: 1, lines: ['将伤害提升至最大值', '持续消耗 SP'] },
	// 骑乘（RIDING）
	27: { name: '骑乘', type: 'toggle', time: 0, lines: [] },
	// 训鹰术（FALCON）
	28: { name: '训鹰术', type: 'toggle', time: 0, lines: ['租借猎鹰'] },
	// 装死（TRICKDEAD）
	29: { name: '装死', type: 'toggle', time: 0, lines: ['假装死亡的状态'] },
	// 大声呐喊（SHOUT）
	30: { name: '大声呐喊', type: 'buff', time: 1, lines: ['提升 STR'] },
	// 能量外套（ENERGYCOAT）
	31: { name: '能量外套', type: 'buff', time: 1, lines: ['按剩余 SP 比例', '减少受到的伤害'] },
	// 护甲已损坏（BROKENARMOR）
	32: { name: '护甲已损坏', type: 'debuff', time: 0, lines: [] },
	// 武器已损坏（BROKENWEAPON）
	33: { name: '武器已损坏', type: 'debuff', time: 0, lines: [] },
	// 幻觉（ILLUSION）
	34: { name: '幻觉', type: 'debuff', time: 1, lines: ['画面扭曲', '显示的伤害虚高', '随机打断咏唱'] },
	// 超重 50%（WEIGHTOVER50）
	35: { name: '超重 50%', type: 'debuff', time: 0, lines: ['HP 与 SP 无法自然恢复'] },
	// 超重 90%（WEIGHTOVER90）
	36: { name: '超重 90%', type: 'debuff', time: 0, lines: ['HP 与 SP 无法自然恢复', '无法攻击与使用技能'] },
	// 集中药水（ATTHASTE_POTION1）
	37: { name: '集中药水', type: 'buff', time: 1, lines: ['提升攻击速度'] },
	// 觉醒药水（ATTHASTE_POTION2）
	38: { name: '觉醒药水', type: 'buff', time: 1, lines: ['提升攻击速度'] },
	// 狂暴药水（ATTHASTE_POTION3）
	39: { name: '狂暴药水', type: 'buff', time: 1, lines: ['提升攻击速度'] },
	// MOVHASTE_POTION（MOVHASTE_POTION）
	41: { name: null, type: null, time: 1, lines: ['提升移动速度'] },
	// MOVHASTE_INFINITY（MOVHASTE_INFINITY）
	42: { name: null, type: null, time: 0, lines: ['提升移动速度'] },
	// 卸除武器（NOEQUIPWEAPON）
	50: { name: '卸除武器', type: 'debuff', time: 1, lines: ['无法装备武器'] },
	// 卸除盾牌（NOEQUIPSHIELD）
	51: { name: '卸除盾牌', type: 'debuff', time: 1, lines: ['无法装备盾牌'] },
	// 卸除护甲（NOEQUIPARMOR）
	52: { name: '卸除护甲', type: 'debuff', time: 1, lines: ['无法装备护甲'] },
	// 卸除头饰（NOEQUIPHELM）
	53: { name: '卸除头饰', type: 'debuff', time: 1, lines: ['无法装备头饰'] },
	// 化学保护（武器）（PROTECTWEAPON）
	54: { name: '化学保护（武器）', type: 'buff', time: 1, lines: ['防止武器被卸除/破坏'] },
	// 化学保护（盾牌）（PROTECTSHIELD）
	55: { name: '化学保护（盾牌）', type: 'buff', time: 1, lines: ['防止盾牌被卸除/破坏'] },
	// 化学保护（护甲）（PROTECTARMOR）
	56: { name: '化学保护（护甲）', type: 'buff', time: 1, lines: ['防止护甲被卸除/破坏'] },
	// 化学保护（头饰）（PROTECTHELM）
	57: { name: '化学保护（头饰）', type: 'buff', time: 1, lines: ['防止头饰被破坏'] },
	// 自动防御（AUTOGUARD）
	58: { name: '自动防御', type: 'buff', time: 1, lines: ['有几率格挡物理攻击'] },
	// 反射盾（REFLECTSHIELD）
	59: { name: '反射盾', type: 'buff', time: 1, lines: ['被近距离物理攻击命中时', '反弹部分伤害'] },
	// 献身（DEVOTION）
	60: { name: '献身', type: 'buff', time: 1, lines: ['十字军正在替你承受伤害'] },
	// 神之守护（PROVIDENCE）
	61: { name: '神之守护', type: 'buff', time: 1, lines: ['提升对不死族', '与恶魔种族的抵抗力'] },
	// 防御姿态（DEFENDER）
	62: { name: '防御姿态', type: 'buff', time: 1, lines: ['降低受到的远程物理伤害', '降低移动速度与攻击速度'] },
	// WEAPONPROPERTY（WEAPONPROPERTY）
	64: { name: null, type: null, time: 0, lines: ['武器已获得属性'] },
	// 自动念咒（AUTOSPELL）
	65: { name: '自动念咒', type: 'buff', time: 1, lines: ['物理攻击时', '自动以无咏唱方式施放指定技能', 'SP 消耗为正常的 2/3', 'SP 不足时不会施放'] },
	// 枪速激发（SPEARQUICKEN）
	68: { name: '枪速激发', type: 'buff', time: 1, lines: ['使用长矛时提升攻击速度', '提升暴击率', '提升回避'] },
	// 金刚不坏（STEELBODY）
	87: { name: '金刚不坏', type: 'buff', time: 1, lines: ['DEF 与 MDEF 固定为固定值', '降低移动速度与攻击速度', '无法使用技能'] },
	// 阿修罗霸凰拳（EXTREMITYFIST）
	88: { name: '阿修罗霸凰拳', type: 'debuff', time: 1, lines: ['SP 恢复无效'] },
	// 烈焰装填（PROPERTYFIRE）
	90: { name: '烈焰装填', type: 'buff', time: 1, lines: ['武器赋予火属性'] },
	// 水流武器（PROPERTYWATER）
	91: { name: '水流武器', type: 'buff', time: 1, lines: ['武器赋予水属性'] },
	// 闪电装填（PROPERTYWIND）
	92: { name: '闪电装填', type: 'buff', time: 1, lines: ['武器赋予风属性'] },
	// 大地武器（PROPERTYGROUND）
	93: { name: '大地武器', type: 'buff', time: 1, lines: ['武器赋予地属性'] },
	// PROPERTYUNDEAD（PROPERTYUNDEAD）
	97: { name: null, type: null, time: 0, lines: ['护甲赋予不死属性'] },
	// 格挡（PARRYING）
	104: { name: '格挡', type: 'buff', time: 1, lines: ['有几率格挡物理攻击'] },
	// 放松（TENSIONRELAX）
	106: { name: '放松', type: 'buff', time: 1, lines: ['提升 HP 自然恢复量'] },
	// 圣母之守护（ASSUMPTIO）
	110: { name: '圣母之守护', type: 'buff', time: 1, lines: ['减少受到的伤害'] },
	// GROUNDMAGIC（GROUNDMAGIC）
	112: { name: null, type: null, time: 1, lines: ['地面魔法效果'] },
	// 致命涂毒（EDP）
	114: { name: '致命涂毒', type: 'buff', time: 1, lines: ['将剧毒涂抹于武器', '伤害提升对魔物（BOSS）无效'] },
	// 真实之眼（TRUESIGHT）
	115: { name: '真实之眼', type: 'buff', time: 1, lines: ['提升全部属性', '提升攻击力、命中与暴击'] },
	// 风之步（WINDWALK）
	116: { name: '风之步', type: 'buff', time: 1, lines: ['提升移动速度与回避'] },
	// 熔解（MELTDOWN）
	117: { name: '熔解', type: 'buff', time: 1, lines: ['攻击玩家时', '有几率破坏其武器/防具', '攻击怪物时'] },
	// 手推车加速（CARTBOOST）
	118: { name: '手推车加速', type: 'buff', time: 1, lines: ['提升移动速度'] },
	// 剑术格挡（SWORDREJECT）
	120: { name: '剑术格挡', type: 'buff', time: 0, lines: ['将伤害反弹给攻击的怪物', '（对所有怪物攻击生效）', '受到的伤害减半', '剩余一半伤害由自己承受'] },
	// 提线木偶（施放者）（MARIONETTE_MASTER）
	121: { name: '提线木偶（施放者）', type: 'buff', time: 1, lines: ['将自身属性', '转移给玩家'] },
	// 提线木偶（目标）（MARIONETTE）
	122: { name: '提线木偶（目标）', type: 'buff', time: 1, lines: ['被转移属性的', '目标玩家'] },
	// 流血（BLOODING）
	124: { name: '流血', type: 'buff', time: 1, lines: ['HP 与 SP 无法恢复', '每 10 秒损失 HP'] },
	// 关节破坏（JOINTBEAT）
	125: { name: '关节破坏', type: 'buff', time: 1, lines: ['因关节损伤', '附加各种异常状态'] },
	// 家人的爱（PROTECTEXP）
	130: { name: '家人的爱', type: 'buff', time: 1, lines: ['死亡时不损失经验值'] },
	// 狂暴状态（AUTOBERSERK）
	132: { name: '狂暴状态', type: 'buff', time: 0, lines: ['濒死时自动进入狂暴'] },
	// 旋风脚准备（STORMKICK_ON）
	135: { name: '旋风脚准备', type: 'buff', time: 0, lines: ['攻击敌人时', '有几率发动旋风脚'] },
	// 落下脚准备（DOWNKICK_ON）
	137: { name: '落下脚准备', type: 'buff', time: 0, lines: ['击中敌人', '击中敌人', '有几率发动落下脚'] },
	// 回旋脚准备（TURNKICK_ON）
	139: { name: '回旋脚准备', type: 'buff', time: 0, lines: ['攻击敌人时'] },
	// 反击准备（COUNTER_ON）
	141: { name: '反击准备', type: 'buff', time: 0, lines: ['击中敌人', '击中敌人', '即可准备反击'] },
	// 闪避准备（DODGE_ON）
	143: { name: '闪避准备', type: 'buff', time: 0, lines: ['可以飞踢作为反击', '可以飞踢作为反击', '受到魔法攻击时', '有几率完全回避', '若同时处于冲刺蓄力状态', '也有几率回避物理攻击'] },
	// 冲刺蓄力（STRUP）
	145: { name: '冲刺蓄力', type: 'buff', time: 1, lines: ['提升 STR', '条件：未装备武器', '且技能等级足够'] },
	// PROPERTYDARK（PROPERTYDARK）
	146: { name: null, type: null, time: 1, lines: ['护甲赋予暗属性'] },
	// 极限肾上腺素（ADRENALINE2）
	147: { name: '极限肾上腺素', type: 'buff', time: 1, lines: ['提升除弓类外武器的攻击速度'] },
	// 暖风（PROPERTYTELEKINESIS）
	148: { name: '暖风', type: 'buff', time: 1, lines: ['武器赋予念力属性'] },
	// PLUSATTACKPOWER（PLUSATTACKPOWER）
	150: { name: null, type: null, time: 1, lines: ['提升攻击力'] },
	// PLUSMAGICPOWER（PLUSMAGICPOWER）
	151: { name: null, type: null, time: 1, lines: ['提升魔法攻击力'] },
	// 复生祝福（KAIZEL）
	156: { name: '复生祝福', type: 'buff', time: 1, lines: ['咏唱时间不受 DEX 影响', '死亡时将以神之祈祷状态复活 2 秒'] },
	// 火魂（KAAHI）
	157: { name: '火魂', type: 'buff', time: 1, lines: ['被普攻命中时', '消耗 SP 并恢复 HP'] },
	// 挡开（KAUPE）
	158: { name: '挡开', type: 'buff', time: 1, lines: ['有几率闪避敌人的攻击'] },
	// 单手剑加速（ONEHANDQUICKEN）
	161: { name: '单手剑加速', type: 'buff', time: 1, lines: ['使用单手武器时', '提升攻击速度'] },
	// 太阳的庇佑（SUN_COMFORT）
	169: { name: '太阳的庇佑', type: 'buff', time: 1, lines: ['提升 VIT 防御'] },
	// 月亮的庇佑（MOON_COMFORT）
	170: { name: '月亮的庇佑', type: 'buff', time: 1, lines: ['提升回避'] },
	// 星辰的庇佑（STAR_COMFORT）
	171: { name: '星辰的庇佑', type: 'buff', time: 1, lines: ['提升攻击速度'] },
	// 技能保存（PRESERVE）
	181: { name: '技能保存', type: 'buff', time: 1, lines: ['保持已复制的技能不被覆盖'] },
	// CHASEWALK2（CHASEWALK2）
	182: { name: null, type: null, time: 1, lines: ['提升 STR'] },
	// 双重施法（DOUBLECASTING）
	186: { name: '双重施法', type: 'buff', time: 1, lines: ['咏唱箭系魔法时', '咏唱箭系魔法时', '有几率自动追加施放一次'] },
	// 武器极致化（最大）（OVERTHRUSTMAX）
	188: { name: '武器极致化（最大）', type: 'buff', time: 1, lines: ['提升武器攻击力', '有几率损坏武器'] },
	// 命运塔罗牌（TAROTCARD）
	191: { name: '命运塔罗牌', type: 'buff', time: 1, lines: ['随机抽选 14 张塔罗牌之一并产生其效果'] },
	// 收缩（CR_SHRINK）
	197: { name: '收缩', type: 'buff', time: 1, lines: ['自动防御成功时', '有几率将攻击者击退'] },
	// 火线冲击（WZ_SIGHTBLASTER）
	198: { name: '火线冲击', type: 'buff', time: 1, lines: ['以一次攻击袭击', '靠近的敌人会受到', '一次爆炸攻击'] },
	// 紧闭束缚（RG_CCONFINE_M）
	200: { name: '紧闭束缚', type: 'buff', time: 1, lines: ['束缚双方均无法移动', '双方均无法移动', '提升回避', '对魔物（BOSS）无效'] },
	// 紧闭束缚（RG_CCONFINE_S）
	201: { name: '紧闭束缚', type: 'buff', time: 1, lines: ['双方均无法移动', '提升回避', '对魔物（BOSS）无效'] },
	// 疯狂暴走（GS_MADNESSCANCEL）
	203: { name: '疯狂暴走', type: 'buff', time: 1, lines: ['提升攻击力', '提升攻击速度', '无法移动'] },
	// 加特林狂热（GS_GATLINGFEVER）
	204: { name: '加特林狂热', type: 'buff', time: 1, lines: ['提升伤害与攻击速度', '降低移动速度'] },
	// 乐休（EARTHSCROLL）
	205: { name: '乐休', type: 'buff', time: 1, lines: ['与其他跆拳少年一同坐下时', '恢复一定量的 SP', '使用大地之卷轴时有几率不被消耗'] },
	// 蝉蜕（NJ_UTSUSEMI）
	206: { name: '蝉蜕', type: 'buff', time: 1, lines: ['回避一定次数的物理攻击', '回避时向攻击者反方向移动'] },
	// 分身术（NJ_BUNSINJYUTSU）
	207: { name: '分身术', type: 'buff', time: 1, lines: ['回避一定次数的物理攻击', '魔法攻击无法回避'] },
	// 气魂（NJ_NEN）
	208: { name: '气魂', type: 'buff', time: 1, lines: ['提升 INT 与 STR'] },
	// 姿态调整（GS_ADJUSTMENT）
	209: { name: '姿态调整', type: 'buff', time: 1, lines: ['降低命中', '提升回避', '降低受到的远程物理伤害'] },
	// 精准强化（GS_ACCURACY）
	210: { name: '精准强化', type: 'buff', time: 1, lines: ['提升命中', '提升 DEX', '提升 AGI'] },
	// 骑乘狮鹫（GRIFFON）
	217: { name: '骑乘狮鹫', type: 'toggle', time: 0, lines: [] },
	// FOOD_STR（FOOD_STR）
	241: { name: null, type: null, time: 1, lines: ['提升 STR'] },
	// FOOD_AGI（FOOD_AGI）
	242: { name: null, type: null, time: 1, lines: ['提升 AGI'] },
	// FOOD_VIT（FOOD_VIT）
	243: { name: null, type: null, time: 1, lines: ['提升 VIT'] },
	// FOOD_DEX（FOOD_DEX）
	244: { name: null, type: null, time: 1, lines: ['提升 DEX'] },
	// FOOD_INT（FOOD_INT）
	245: { name: null, type: null, time: 1, lines: ['提升 INT'] },
	// FOOD_LUK（FOOD_LUK）
	246: { name: null, type: null, time: 1, lines: ['提升 LUK'] },
	// FOOD_BASICAVOIDANCE（FOOD_BASICAVOIDANCE）
	247: { name: null, type: null, time: 1, lines: ['提升回避'] },
	// FOOD_BASICHIT（FOOD_BASICHIT）
	248: { name: null, type: null, time: 1, lines: ['提升命中'] },
	// FOOD_CRITICALSUCCESSVALUE（FOOD_CRITICALSUCCESSVALUE）
	249: { name: null, type: null, time: 1, lines: ['提升暴击'] },
	// CASH_PLUSEXP（CASH_PLUSEXP）
	250: { name: null, type: null, time: 1, lines: ['提升获得的经验值'] },
	// 生命保险（CASH_DEATHPENALTY）
	251: { name: '生命保险', type: 'buff', time: 1, lines: ['死亡时不损失经验值'] },
	// CASH_RECEIVEITEM（CASH_RECEIVEITEM）
	252: { name: null, type: null, time: 1, lines: ['击杀怪物时', '掉落几率加倍'] },
	// FOOD_STR_CASH（FOOD_STR_CASH）
	271: { name: null, type: null, time: 1, lines: ['提升 STR'] },
	// FOOD_AGI_CASH（FOOD_AGI_CASH）
	272: { name: null, type: null, time: 1, lines: ['提升 AGI'] },
	// FOOD_VIT_CASH（FOOD_VIT_CASH）
	273: { name: null, type: null, time: 1, lines: ['提升 VIT'] },
	// FOOD_DEX_CASH（FOOD_DEX_CASH）
	274: { name: null, type: null, time: 1, lines: ['提升 DEX'] },
	// FOOD_INT_CASH（FOOD_INT_CASH）
	275: { name: null, type: null, time: 1, lines: ['提升 INT'] },
	// FOOD_LUK_CASH（FOOD_LUK_CASH）
	276: { name: null, type: null, time: 1, lines: ['提升 LUK'] },
	// 咏唱迟缓（SLOWCAST）
	282: { name: '咏唱迟缓', type: 'debuff', time: 1, lines: ['延长咏唱时间'] },
	// 致命伤口（CRITICALWOUND）
	286: { name: '致命伤口', type: 'debuff', time: 1, lines: ['降低治愈技能的效果'] },
	// MOVHASTE_HORSE（MOVHASTE_HORSE）
	289: { name: null, type: null, time: 1, lines: ['提升移动速度'] },
	// 防御保护药水（PROTECT_DEF）
	290: { name: '防御保护药水', type: 'buff', time: 1, lines: ['提升物理 DEF'] },
	// 抗魔药水（PROTECT_MDEF）
	291: { name: '抗魔药水', type: 'buff', time: 1, lines: ['提升魔法攻击的抵抗力'] },
	// 强化治愈药水（HEALPLUS）
	292: { name: '强化治愈药水', type: 'buff', time: 1, lines: ['使用恢复道具治疗时', '治疗效果提升'] },
	// 小生命药水（S_LIFEPOTION）
	293: { name: '小生命药水', type: 'buff', time: 1, lines: ['每 5 秒恢复 HP', '狂暴状态时无效'] },
	// 中生命药水（L_LIFEPOTION）
	294: { name: '中生命药水', type: 'buff', time: 1, lines: ['每 4 秒恢复 HP', '狂暴状态时无效'] },
	// 清漆（CRITICALPERCENT）
	295: { name: '清漆', type: 'buff', time: 1, lines: ['提升暴击'] },
	// 欢迎之杯（PLUSAVOIDVALUE）
	296: { name: '欢迎之杯', type: 'buff', time: 1, lines: ['提升完全回避 20'] },
	// 幻影佳酿（ATKER_ASPD）
	297: { name: '幻影佳酿', type: 'buff', time: 1, lines: ['提升最大 HP', '提升 HP 恢复量'] },
	// TARGET_ASPD（TARGET_ASPD）
	298: { name: null, type: null, time: 1, lines: ['提升最大 SP，降低 SP 消耗'] },
	// 跆拳特饮（ATKER_MOVESPEED）
	299: { name: '跆拳特饮', type: 'buff', time: 1, lines: ['提升最大 SP', '提升 SP 恢复量'] },
	// SP消耗减轻药水（ATKER_BLOOD）
	300: { name: 'SP消耗减轻药水', type: 'buff', time: 1, lines: ['技能 SP 消耗减少 15%'] },
	// 抵抗药水（TARGET_BLOOD）
	301: { name: '抵抗药水', type: 'buff', time: 1, lines: ['提升对以下状态的抵抗力', '眩晕、冰冻、石化、睡眠、沉默', '黑暗、诅咒、中毒、流血、混乱'] },
	// 护甲属性变换（ARMOR_PROPERTY）
	302: { name: '护甲属性变换', type: 'buff', time: 1, lines: ['改变自身的属性'] },
	// 地狱之力（HELLPOWER）
	304: { name: '地狱之力', type: 'buff', time: 1, lines: ['无法被复活', '献身技能失效', '齐格弗里德凭证失效'] },
	// CASH_PLUSONLYJOBEXP（CASH_PLUSONLYJOBEXP）
	312: { name: null, type: null, time: 1, lines: ['提升获得的职业经验值'] },
	// PARTYFLEE（PARTYFLEE）
	313: { name: null, type: null, time: 1, lines: ['提升回避率'] },
	// 守护天使（ANGEL_PROTECT）
	314: { name: '守护天使', type: 'buff', time: 1, lines: ['死亡时不损失经验值'] },
	// 附魔之刃（ENCHANTBLADE）
	316: { name: '附魔之刃', type: 'buff', time: 1, lines: ['为物理攻击附加魔法伤害'] },
	// 卢恩石：焕新（REFRESH）
	318: { name: '卢恩石：焕新', type: 'buff', time: 1, lines: ['施放时解除所有异常状态', '施放时解除所有减益状态', '获得减益免疫', '恢复一定量的 HP'] },
	// 卢恩石：巨人成长（GIANTGROWTH）
	319: { name: '卢恩石：巨人成长', type: 'buff', time: 1, lines: ['提升 STR', '近距离物理攻击', '有几率大幅提升伤害', '每次攻击有几率损坏武器'] },
	// 卢恩石：石化皮肤（STONEHARDSKIN）
	320: { name: '卢恩石：石化皮肤', type: 'buff', time: 1, lines: ['抵御消耗 HP 等量的伤害', '抵御等同于施放时消耗 HP 的伤害', '用武器攻击你的玩家', '有几率损坏其武器', '对怪物则降低其攻击力 10 秒'] },
	// 卢恩石：活力激活（VITALITYACTIVATION）
	321: { name: '卢恩石：活力激活', type: 'buff', time: 1, lines: ['提升治愈效果', '对施放者自身', '提升治愈技能与道具效果', '停止 SP 自然恢复', '降低 SP 恢复道具的效果'] },
	// 卢恩石：斗志（FIGHTINGSPIRIT）
	322: { name: '卢恩石：斗志', type: 'buff', time: 1, lines: ['提升攻击力', '提升施放者攻击速度'] },
	// 卢恩石：丰盈（ABUNDANCE）
	323: { name: '卢恩石：丰盈', type: 'buff', time: 1, lines: ['每 10 秒恢复 SP'] },
	// 强化潜行（CLOAKINGEXCEED）
	333: { name: '强化潜行', type: 'buff', time: 0, lines: ['对昆虫与恶魔种族也能隐形', '受到一定次数攻击前保持隐形', '提升移动速度'] },
	// 幻影步（HALLUCINATIONWALK）
	334: { name: '幻影步', type: 'buff', time: 1, lines: ['提升回避率', '有几率闪避魔法伤害'] },
	// 新生（RENOVATIO）
	336: { name: '新生', type: 'buff', time: 1, lines: ['每 5 秒恢复 HP', '对不死族怪物使用时', '依技能等级造成高伤害'] },
	// 武器格挡（WEAPONBLOCKING）
	337: { name: '武器格挡', type: 'buff', time: 1, lines: ['被近距离物理攻击命中时', '有几率完全抵消伤害'] },
	// 涂毒（POISONINGWEAPON）
	341: { name: '涂毒', type: 'buff', time: 1, lines: ['将武器上涂抹的毒应用于目标'] },
	// 毒素（TOXIN）
	342: { name: '毒素', type: 'buff', time: 1, lines: ['每 10 秒干扰一次技能', '无视 Phen 卡效果', '每 10 秒消耗 SP'] },
	// 麻痹（PARALYSE）
	343: { name: '麻痹', type: 'buff', time: 1, lines: ['降低攻击速度', '降低回避', '降低移动速度'] },
	// 毒血浸出（VENOMBLEED）
	344: { name: '毒血浸出', type: 'debuff', time: 1, lines: ['降低最大 HP'] },
	// 魔力蘑菇（MAGICMUSHROOM）
	345: { name: '魔力蘑菇', type: 'buff', time: 1, lines: ['使用微笑表情', '每 4 秒随机施放法术', '每 4 秒损失 HP'] },
	// 死亡创伤（污染伤口毒）（DEATHHURT）
	346: { name: '死亡创伤（污染伤口毒）', type: 'debuff', time: 1, lines: ['降低治愈技能的效果'] },
	// 发热（PYREXIA）
	347: { name: '发热', type: 'buff', time: 1, lines: ['黑暗与幻觉状态'] },
	// 遗忘诅咒（OBLIVIONCURSE）
	348: { name: '遗忘诅咒', type: 'debuff', time: 1, lines: ['陷入遗忘状态'] },
	// 水蛭汲取（LEECHESEND）
	349: { name: '水蛭汲取', type: 'buff', time: 1, lines: ['每秒吸取 HP'] },
	// 寒冷状态（FROSTMISTY）
	351: { name: '寒冷状态', type: 'debuff', time: 1, lines: ['降低防御、攻击速度与移动速度', '延长固定咏唱时间'] },
	// 恐惧微风（FEARBREEZE）
	352: { name: '恐惧微风', type: 'buff', time: 1, lines: ['使用弓箭攻击时', '有几率追加攻击'] },
	// 深渊泥沼（MARSHOFABYSS）
	354: { name: '深渊泥沼', type: 'debuff', time: 1, lines: ['降低移动速度', '降低 DEF 与回避'] },
	// 领悟法术（RECOGNIZEDSPELL）
	355: { name: '领悟法术', type: 'buff', time: 1, lines: ['魔法技能造成最大伤害', '所有技能消耗更多 SP'] },
	// 骑狼（WUGRIDER）
	357: { name: '骑狼', type: 'buff', time: 1, lines: ['无法使用弓箭', '只能使用狼系技能'] },
	// 加速装置（ACCELERATION）
	361: { name: '加速装置', type: 'buff', time: 1, lines: ['提升魔导机甲的移动速度'] },
	// 悬浮（HOVERING）
	362: { name: '悬浮', type: 'buff', time: 1, lines: ['陷阱与部分地面技能无效'] },
	// 塔奥群卡卷轴（MVPCARD_TAOGUNKA）
	368: { name: '塔奥群卡卷轴', type: 'buff', time: 1, lines: ['提升最大 HP', '降低 DEF 与 MDEF'] },
	// 娥娒娘卷轴（MVPCARD_MISTRESS）
	369: { name: '娥娒娘卷轴', type: 'buff', time: 1, lines: ['特定魔法无需宝石', '特定魔法无需魔力矿石', '提升 SP 消耗'] },
	// 兽人英雄卷轴（MVPCARD_ORCHERO）
	370: { name: '兽人英雄卷轴', type: 'buff', time: 1, lines: ['免疫眩晕状态'] },
	// 兽人酋长卷轴（MVPCARD_ORCLORD）
	371: { name: '兽人酋长卷轴', type: 'buff', time: 1, lines: ['反弹受到的部分物理伤害'] },
	// 过热（OVERHEAT）
	373: { name: '过热', type: 'buff', time: 0, lines: ['因技能使用而发热', '因技能使用而发热', '每秒损失 HP'] },
	// 属性变换（SHAPESHIFT）
	374: { name: '属性变换', type: 'buff', time: 1, lines: ['改变魔导机甲的属性'] },
	// 红外扫描（INFRAREDSCAN）
	375: { name: '红外扫描', type: 'buff', time: 1, lines: ['发现隐匿的目标', '发现隐匿的目标', '有几率降低附近敌人的回避'] },
	// 中立屏障（NEUTRALBARRIER）
	377: { name: '中立屏障', type: 'buff', time: 1, lines: ['提升 DEF 与 MDEF', '无效化远程攻击'] },
	// 隐形力场（STEALTHFIELD）
	379: { name: '隐形力场', type: 'buff', time: 1, lines: ['使施放者周围一定范围内的所有人隐形', '持续期间消耗 SP', '降低移动速度'] },
	// MANU_ATK（MANU_ATK）
	381: { name: null, type: null, time: 1, lines: ['提升对马努克原野所有怪物的', '物理攻击力'] },
	// MANU_DEF（MANU_DEF）
	382: { name: null, type: null, time: 1, lines: ['降低来自马努克原野怪物的', '物理与魔法伤害'] },
	// SPL_ATK（SPL_ATK）
	383: { name: null, type: null, time: 1, lines: ['提升对斯普兰德原野所有怪物的', '物理攻击力'] },
	// 蜂蜜果酱（SPL_DEF）
	384: { name: '蜂蜜果酱', type: 'buff', time: 1, lines: ['降低来自斯普兰德原野怪物的', '物理与魔法伤害'] },
	// 复制（REPRODUCE）
	385: { name: '复制', type: 'buff', time: 0, lines: ['被技能指定为目标时发动', '只能学习一个技能'] },
	// MANU_MATK（MANU_MATK）
	386: { name: null, type: null, time: 1, lines: ['提升对马努克原野所有怪物的', '魔法攻击力'] },
	// SPL_MATK（SPL_MATK）
	387: { name: null, type: null, time: 1, lines: ['提升对斯普兰德原野所有怪物的', '魔法攻击力'] },
	// STR_SCROLL（STR_SCROLL）
	388: { name: null, type: null, time: 1, lines: ['提升 STR'] },
	// INT_SCROLL（INT_SCROLL）
	389: { name: null, type: null, time: 1, lines: ['提升 INT'] },
	// 反射伤害（LG_REFLECTDAMAGE）
	390: { name: '反射伤害', type: 'toggle', time: 1, lines: ['将受到的部分伤害', '反弹给范围内所有敌人', '每秒消耗 SP'] },
	// 先锋之力（FORCEOFVANGUARD）
	391: { name: '先锋之力', type: 'buff', time: 1, lines: ['提升最大 HP 与防御', '被物理攻击时有几率获得怒气计数', '持续期间消耗 SP'] },
	// 自动暗影咒（AUTOSHADOWSPELL）
	393: { name: '自动暗影咒', type: 'buff', time: 1, lines: ['自动施放', '一个可用的魔法技能'] },
	// 暗影形态（SHADOWFORM）
	394: { name: '暗影形态', type: 'buff', time: 1, lines: ['在一定次数的攻击内', '让目标代替自己承受伤害'] },
	// 盾咒（DEF）（SHIELDSPELL_DEF）
	396: { name: '盾咒（DEF）', type: 'buff', time: 1, lines: ['依据 DEF 引动魔法效果'] },
	// 盾咒（MDEF）（SHIELDSPELL_MDEF）
	397: { name: '盾咒（MDEF）', type: 'buff', time: 1, lines: ['依据 MDEF 引动魔法效果'] },
	// 盾咒（精炼）（SHIELDSPELL_REF）
	398: { name: '盾咒（精炼）', type: 'buff', time: 1, lines: ['依据精炼值引动魔法效果'] },
	// 人体彩绘（BODYPAINT）
	399: { name: '人体彩绘', type: 'buff', time: 1, lines: ['现出隐藏的敌人', '有几率使敌人陷入黑暗', '降低敌人攻击速度'] },
	// 阿多拉姆斯（ADORAMUS）
	401: { name: '阿多拉姆斯', type: 'buff', time: 1, lines: ['使目标黑暗并降低移动速度'] },
	// 威望（PRESTIGE）
	402: { name: '威望', type: 'buff', time: 1, lines: ['有几率回避魔法攻击', '防御提升'] },
	// 隐形（INVISIBILITY）
	403: { name: '隐形', type: 'buff', time: 1, lines: ['从视野中隐藏自己', '所有攻击变为念力等级 1 属性', '持续消耗 SP', '无法使用技能与道具'] },
	// 致死传染（DEADLYINFECT）
	404: { name: '致死传染', type: 'buff', time: 1, lines: ['攻击或被攻击时', '自身的异常状态', '会传染给对方'] },
	// 结队（BANDING）
	405: { name: '结队', type: 'buff', time: 1, lines: ['结队状态'] },
	// 启发（INSPIRATION）
	407: { name: '启发', type: 'buff', time: 1, lines: ['命中率、属性、伤害、最大 HP 提升', '解除所有增益与状态效果', '持续损失 HP 与 SP', '不会陷入异常状态', '损失一定比例的经验值'] },
	// 假面·疲惫（ENERVATION）
	408: { name: '假面·疲惫', type: 'debuff', time: 1, lines: ['降低攻击力', '移除气弹'] },
	// 假面·阴郁（GROOMY）
	409: { name: '假面·阴郁', type: 'debuff', time: 1, lines: ['降低攻击速度与命中', '强制解除坐骑及相关动物', '坐骑及相关动物失效'] },
	// 升龙气（RAISINGDRAGON）
	410: { name: '升龙气', type: 'buff', time: 0, lines: ['气弹上限提升', '气弹上限提升', '提升最大 HP/SP', '提升攻击速度', '保持爆气状态', '每秒缓慢损失 HP'] },
	// 假面·无知（IGNORANCE）
	411: { name: '假面·无知', type: 'debuff', time: 1, lines: ['损失一定量的 SP', '损失一定量的 SP', '无法使用技能与魔法'] },
	// 假面·怠惰（LAZINESS）
	412: { name: '假面·怠惰', type: 'debuff', time: 1, lines: ['降低移动速度与回避', '延长咏唱时间', '使用技能时额外消耗一定量 SP'] },
	// 雷步（LIGHTNINGWALK）
	413: { name: '雷步', type: 'buff', time: 1, lines: ['被魔法攻击指定为目标时', '有几率回避后', '直线移动至施放者身边'] },
	// 阿卡拉热（ACARAJE）
	414: { name: '阿卡拉热', type: 'buff', time: 1, lines: ['提升命中与攻击速度'] },
	// 假面·不幸（UNLUCKY）
	415: { name: '假面·不幸', type: 'debuff', time: 1, lines: ['降低暴击率', '降低完全回避', '使用技能消耗 Zeny', '持续伤害会附带异常状态'] },
	// 假面·衰弱（WEAKNESS）
	418: { name: '假面·衰弱', type: 'debuff', time: 1, lines: ['降低最大 HP', '被回避时武器与盾牌被卸除', '无法装备武器与盾牌'] },
	// 弯月肘击（CRESCENTELBOW）
	419: { name: '弯月肘击', type: 'buff', time: 1, lines: ['将对手击退并造成伤害', '自己也会承受部分伤害', '对魔物（BOSS）无效'] },
	// 卸除饰品（STRIPACCESSARY）
	421: { name: '卸除饰品', type: 'debuff', time: 1, lines: ['无法装备饰品'] },
	// 教皇饼干（POPECOOKIE）
	423: { name: '教皇饼干', type: 'buff', time: 1, lines: ['提升攻击力与魔法攻击力', '提升对所有属性的抵抗力'] },
	// 点穴·聚气（GENTLETOUCH_ENERGYGAIN）
	425: { name: '点穴·聚气', type: 'buff', time: 1, lines: ['攻击或被攻击时', '有几率获得一个气弹'] },
	// 点穴·转气（GENTLETOUCH_CHANGE）
	426: { name: '点穴·转气', type: 'buff', time: 1, lines: ['降低 DEF 与 MDEF', '提升伤害与攻击速度'] },
	// 点穴·活气（GENTLETOUCH_REVITALIZE）
	427: { name: '点穴·活气', type: 'buff', time: 1, lines: ['提升 VIT 与最大 HP', '提升 DEF', '提升 HP 自然恢复量', '移动速度提升'] },
	// 摇摆舞（SWING）
	429: { name: '摇摆舞', type: 'buff', time: 1, lines: ['提升移动速度', '提升攻击速度'] },
	// 爱之交响曲（SYMPHONY_LOVE）
	430: { name: '爱之交响曲', type: 'buff', time: 1, lines: ['提升魔法防御'] },
	// 深度睡眠（DEEP_SLEEP）
	435: { name: '深度睡眠', type: 'buff', time: 1, lines: ['受到的伤害提升至 1.5 倍', '每 2 秒恢复 HP/SP'] },
	// SIRCLEOFNATURE（SIRCLEOFNATURE）
	436: { name: null, type: null, time: 1, lines: ['消耗 SP 并恢复 HP'] },
	// 冻结（COLD）
	437: { name: '冻结', type: 'debuff', time: 1, lines: ['无法移动、攻击、使用技能与道具', '持续损失 SP 与 HP', '受到钝器、斧、双手斧攻击的伤害增加', '受到风属性法术的伤害增加', '受到短剑、剑、双手剑与箭的伤害降低'] },
	// 阴郁之日（GLOOMYDAY）
	438: { name: '阴郁之日', type: 'buff', time: 1, lines: ['提升特定技能的伤害', '降低回避与攻击速度'] },
	// 玛那之歌（SONG_OF_MANA）
	439: { name: '玛那之歌', type: 'buff', time: 1, lines: ['每 5 秒恢复 SP'] },
	// 与狼共舞（DANCE_WITH_WUG）
	441: { name: '与狼共舞', type: 'buff', time: 1, lines: ['提升攻击速度', '缩短固定咏唱时间'] },
	// 风车突击（RUSH_WINDMILL）
	442: { name: '风车突击', type: 'buff', time: 1, lines: ['提升伤害'] },
	// 回声之歌（ECHOSONG）
	443: { name: '回声之歌', type: 'buff', time: 1, lines: ['提升 DEF'] },
	// 和声（HARMONIZE）
	444: { name: '和声', type: 'buff', time: 1, lines: ['提升全部属性'] },
	// 强化打击（STRIKING）
	445: { name: '强化打击', type: 'buff', time: 1, lines: ['提升武器攻击力与暴击几率'] },
	// 暖身（WARMER）
	446: { name: '暖身', type: 'buff', time: 1, lines: ['解除冰冻/寒冷状态', '免疫冰冻/寒冷状态', '每 3 秒恢复 HP'] },
	// 月光小夜曲（MOONLIT_SERENADE）
	447: { name: '月光小夜曲', type: 'buff', time: 1, lines: ['提升魔法技能伤害'] },
	// 狂乱（SATURDAY_NIGHT_FEVER）
	448: { name: '狂乱', type: 'debuff', time: 1, lines: ['每 3 秒损失 HP/SP', '伤害增加，防御与回避下降', '无法使用技能与道具'] },
	// 分析（ANALYZE）
	450: { name: '分析', type: 'buff', time: 1, lines: ['降低物理与魔法防御'] },
	// LERADS_DEW（LERADS_DEW）
	451: { name: null, type: null, time: 1, lines: ['提升最大 HP'] },
	// 沉沦之曲（MELODYOFSINK）
	452: { name: '沉沦之曲', type: 'buff', time: 1, lines: ['提升魔法伤害', '降低物理伤害'] },
	// 彼端战吼（BEYOND_OF_WARCRY）
	453: { name: '彼端战吼', type: 'buff', time: 1, lines: ['提升物理攻击力', '降低魔法攻击力'] },
	// 无限哼唱（UNLIMITED_HUMMING_VOICE）
	454: { name: '无限哼唱', type: 'buff', time: 1, lines: ['提升 SP 消耗', '提升 SP 消耗'] },
	// 手推车加速（GN_CARTBOOST）
	461: { name: '手推车加速', type: 'buff', time: 1, lines: ['提升移动速度'] },
	// 荆棘陷阱（THORNS_TRAP）
	463: { name: '荆棘陷阱', type: 'debuff', time: 1, lines: ['周期性造成伤害'] },
	// 圣礼（AB_SECRAMENT）
	472: { name: '圣礼', type: 'buff', time: 1, lines: ['缩短固定咏唱时间'] },
	// 圣母之守护（ASSUMPTIO2）
	473: { name: '圣母之守护', type: 'buff', time: 1, lines: ['提升防御'] },
	// 腹痛（STOMACHACHE）
	476: { name: '腹痛', type: 'buff', time: 1, lines: ['降低全部属性', '降低移动速度', '每 10 秒强制坐下一次', '10 秒内消耗一定量 SP'] },
	// 狂野烧烤（SAVAGE_STEAK）
	491: { name: '狂野烧烤', type: 'buff', time: 1, lines: ['提升 STR'] },
	// 狼血鸡尾酒（COCKTAIL_WARG_BLOOD）
	492: { name: '狼血鸡尾酒', type: 'buff', time: 1, lines: ['提升 INT'] },
	// 小恶魔炖肉（MINOR_BBQ）
	493: { name: '小恶魔炖肉', type: 'buff', time: 1, lines: ['提升 VIT'] },
	// 丝罗马冰茶（SIROMA_ICE_TEA）
	494: { name: '丝罗马冰茶', type: 'buff', time: 1, lines: ['提升 DEX'] },
	// 茅膏菜香草沙拉（DROCERA_HERB_STEAMED）
	495: { name: '茅膏菜香草沙拉', type: 'buff', time: 1, lines: ['提升 AGI'] },
	// 小妖尾拉面（PUTTI_TAILS_NOODLES）
	496: { name: '小妖尾拉面', type: 'buff', time: 1, lines: ['提升 LUK'] },
	// 摩拉浆果（MORA_BUFF）
	573: { name: '摩拉浆果', type: 'buff', time: 1, lines: ['提升对摩拉城镇附近', '原野所有怪物的抵抗力'] },
	// 止痛剂（PAIN_KILLER）
	577: { name: '止痛剂', type: 'buff', time: 1, lines: ['受击无移动延迟', '受击后无移动延迟', '降低受到的伤害'] },
	// 恒速生命之水（G_LIFEPOTION）
	578: { name: '恒速生命之水', type: 'buff', time: 1, lines: ['每 3 秒恢复 HP', '狂暴状态时无效'] },
	// 活力药水（VITALIZE_POTION）
	579: { name: '活力药水', type: 'buff', time: 1, lines: ['提升攻击力与魔法攻击力', '提升治愈与恢复道具的效果'] },
	// 再生之光（LIGHT_OF_REGENE）
	580: { name: '再生之光', type: 'buff', time: 1, lines: ['召唤师死亡时', '召唤师死亡时', '生命体会牺牲自己将其复活'] },
	// 超载加速（OVERED_BOOST）
	581: { name: '超载加速', type: 'buff', time: 1, lines: ['按固定值提升攻击速度与回避'] },
	// ODINS_POWER（ODINS_POWER）
	583: { name: null, type: null, time: 1, lines: ['提升攻击力与魔法攻击力', '降低 DEF 与 MDEF'] },
	// 造型变换（STYLE_CHANGE）
	584: { name: '造型变换', type: 'toggle', time: 0, lines: ['生命体切换为战斗造型'] },
	// 岩浆流动（MAGMA_FLOW）
	605: { name: '岩浆流动', type: 'buff', time: 1, lines: ['受到伤害时', '有几率向周围喷出岩浆'] },
	// 花岗岩护甲（GRANITIC_ARMOR）
	606: { name: '花岗岩护甲', type: 'buff', time: 1, lines: ['降低受到的伤害', '状态结束时损失部分 HP'] },
	// 火山碎屑（PYROCLASTIC）
	607: { name: '火山碎屑', type: 'buff', time: 1, lines: ['德伊特与主人的武器', '德伊特与主人的武器', '变为火属性', '提升武器攻击力'] },
	// 火山灰（VOLCANIC_ASH）
	608: { name: '火山灰', type: 'debuff', time: 1, lines: ['降低命中率', '技能有几率失败', '受到的火属性伤害增加'] },
	// 魔法糖果（MAGIC_CANDY）
	611: { name: '魔法糖果', type: 'buff', time: 1, lines: ['提升魔法攻击力', '缩短固定咏唱时间', '咏唱不会被打断', '每 10 秒消耗 SP'] },
	// 骑乘（ALL_RIDING）
	613: { name: '骑乘', type: 'toggle', time: 0, lines: [] },
	// 宏禁用（MACRO_POSTDELAY）
	616: { name: '宏禁用', type: 'system', time: 1, lines: ['宏已停用'] },
	// 马尔当戈猫罐头（OVERLAPEXPUP）
	618: { name: '马尔当戈猫罐头', type: 'buff', time: 1, lines: ['在马尔当戈击杀怪物时', '提升基础与职业经验值', '提升物品掉落率'] },
	// 怪物变身（MONSTER_TRANSFORM）
	621: { name: '怪物变身', type: 'buff', time: 1, lines: ['已变身为怪物'] },
	// 坐下（SIT）
	622: { name: '坐下', type: 'toggle', time: 0, lines: [] },
	// 宏使用中（MACRO_PERMIT）
	630: { name: '宏使用中', type: 'system', time: 1, lines: ['宏已激活'] },
	// SKF_CAST（SKF_CAST）
	632: { name: null, type: null, time: 1, lines: ['缩短咏唱时间'] },
	// SKF_ASPD（SKF_ASPD）
	633: { name: null, type: null, time: 1, lines: ['提升攻击速度'] },
	// SKF_ATK（SKF_ATK）
	634: { name: null, type: null, time: 1, lines: ['提升攻击力'] },
	// SKF_MATK（SKF_MATK）
	635: { name: null, type: null, time: 1, lines: ['提升魔法攻击力'] },
	// REWARD_PLUSONLYJOBEXP（REWARD_PLUSONLYJOBEXP）
	636: { name: null, type: null, time: 1, lines: ['提升获得的职业经验值'] },
	// 恢复无效状态（HANDICAPSTATE_NORECOVER）
	637: { name: '恢复无效状态', type: 'debuff', time: 1, lines: ['HP 与 SP 恢复无效'] },
	// SET_NUM_DEF（SET_NUM_DEF）
	638: { name: null, type: null, time: 1, lines: ['DEF 数值已固定'] },
	// SET_NUM_MDEF（SET_NUM_MDEF）
	639: { name: null, type: null, time: 1, lines: ['MDEF 数值已固定'] },
	// SET_PER_DEF（SET_PER_DEF）
	640: { name: null, type: null, time: 0, lines: ['DEF 被固定为一定百分比'] },
	// SET_PER_MDEF（SET_PER_MDEF）
	641: { name: null, type: null, time: 0, lines: ['MDEF 被固定为一定百分比'] },
	// 明镜止水（MEIKYOUSISUI）
	646: { name: '明镜止水', type: 'buff', time: 1, lines: ['恢复一定量的 HP', '恢复一定量的 SP', '无法移动', '被攻击时有几率无视伤害', '被击中时有几率提前解除效果'] },
	// ASPD强化药水（ATTHASTE_CASH）
	647: { name: 'ASPD强化药水', type: 'buff', time: 1, lines: ['提升攻击速度'] },
	// 烟花（RWC2011）
	650: { name: '烟花', type: 'buff', time: 1, lines: ['提升全部属性', '提升攻击力与魔法攻击力'] },
	// 十六夜（IZAYOI）
	652: { name: '十六夜', type: 'buff', time: 1, lines: ['移除固定咏唱时间', '缩短可变咏唱时间', '提升魔法攻击力', '每秒消耗 SP'] },
	// 影踏（KG_KAGEHUMI）
	654: { name: '影踏', type: 'debuff', time: 1, lines: ['无法移动', '无法使用部分技能与道具', '潜行与瞬移类技能、道具失效', '无法使用紧急呼叫'] },
	// 虚无（KYOMU）
	655: { name: '虚无', type: 'debuff', time: 1, lines: ['被物理或魔法攻击命中时反射无效', '被物理或魔法攻击命中时反射无效', '咏唱时技能有几率失败'] },
	// 影武者（KAGEMUSYA）
	656: { name: '影武者', type: 'buff', time: 1, lines: ['附加双重攻击效果', '每秒消耗 SP', '受到一定次数攻击后状态结束'] },
	// 斩月（ZANGETSU）
	657: { name: '斩月', type: 'buff', time: 1, lines: ['攻击力与魔法攻击力随 HP 与 SP 变化', '攻击力与魔法攻击力', '随 HP 与 SP 比例变化'] },
	// PHI_DEMON（PHI_DEMON）
	658: { name: null, type: null, time: 1, lines: ['变为恶魔族怪物', '提升物理与魔法伤害'] },
	// 幻想（GENSOU）
	659: { name: '幻想', type: 'buff', time: 1, lines: ['随机增减 HP 与 SP', '被魔法攻击命中时', '一半伤害会分摊到周围区域'] },
	// 绯月（AKAITSUKI）
	660: { name: '绯月', type: 'debuff', time: 1, lines: ['受到治愈技能时', '受到治愈技能时', '恢复量将转化为伤害'] },
	// 战斗药水（GM_BATTLE）
	662: { name: '战斗药水', type: 'buff', time: 1, lines: ['提升攻击力与魔法攻击力', '降低最大 HP 与最大 SP'] },
	// 高级战斗药水（GM_BATTLE2）
	663: { name: '高级战斗药水', type: 'buff', time: 1, lines: ['提升攻击力与魔法攻击力', '降低最大 HP 与最大 SP'] },
	// 红色强化剂（RWC_SCROLL2011）
	664: { name: '红色强化剂', type: 'buff', time: 1, lines: ['提升攻击力与魔法攻击力', '提升攻击速度', '缩短可变咏唱时间', '受到物理与魔法伤害时', '有几率自动施放心神集中'] },
	// 神秘粉末（MYSTICPOWDER）
	666: { name: '神秘粉末', type: 'buff', time: 1, lines: ['提升回避与 LUK'] },
	// 神秘生命药水（M_LIFEPOTION）
	670: { name: '神秘生命药水', type: 'buff', time: 1, lines: ['每 3 秒恢复一定量的 HP', '狂暴状态时无效'] },
	// 丰盛的花枝（FLOWER_LEAF）
	675: { name: '丰盛的花枝', type: 'buff', time: 1, lines: ['提升回避', '提升完全回避'] },
	// 武器属性·无（ATTACK_PROPERTY_NOTHING）
	897: { name: '武器属性·无', type: 'buff', time: 1, lines: ['武器赋予无属性'] },
	// 武器属性·水（ATTACK_PROPERTY_WATER）
	898: { name: '武器属性·水', type: 'buff', time: 1, lines: ['武器赋予水属性'] },
	// 武器属性·地（ATTACK_PROPERTY_GROUND）
	899: { name: '武器属性·地', type: 'buff', time: 1, lines: ['武器赋予地属性'] },
	// 武器属性·火（ATTACK_PROPERTY_FIRE）
	900: { name: '武器属性·火', type: 'buff', time: 1, lines: ['武器赋予火属性'] },
	// 武器属性·风（ATTACK_PROPERTY_WIND）
	901: { name: '武器属性·风', type: 'buff', time: 1, lines: ['武器赋予风属性'] },
	// 武器属性·毒（ATTACK_PROPERTY_POISON）
	902: { name: '武器属性·毒', type: 'buff', time: 1, lines: ['武器赋予毒属性'] },
	// 武器属性·圣（ATTACK_PROPERTY_SAINT）
	903: { name: '武器属性·圣', type: 'buff', time: 1, lines: ['武器赋予圣属性'] },
	// 武器属性·暗（ATTACK_PROPERTY_DARKNESS）
	904: { name: '武器属性·暗', type: 'buff', time: 1, lines: ['武器赋予暗属性'] },
	// 武器属性·念（ATTACK_PROPERTY_TELEKINESIS）
	905: { name: '武器属性·念', type: 'buff', time: 1, lines: ['武器赋予念力属性'] },
	// 武器属性·不死（ATTACK_PROPERTY_UNDEAD）
	906: { name: '武器属性·不死', type: 'buff', time: 1, lines: ['武器赋予不死属性'] },
	// 抗性·无（RESIST_PROPERTY_NOTHING）
	907: { name: '抗性·无', type: 'buff', time: 1, lines: ['提升对无属性的抵抗力'] },
	// 抗性·水（RESIST_PROPERTY_WATER）
	908: { name: '抗性·水', type: 'buff', time: 1, lines: ['提升对水属性的抵抗力'] },
	// 抗性·地（RESIST_PROPERTY_GROUND）
	909: { name: '抗性·地', type: 'buff', time: 1, lines: ['提升对地属性的抵抗力'] },
	// 抗性·火（RESIST_PROPERTY_FIRE）
	910: { name: '抗性·火', type: 'buff', time: 1, lines: ['提升对火属性的抵抗力'] },
	// 抗性·风（RESIST_PROPERTY_WIND）
	911: { name: '抗性·风', type: 'buff', time: 1, lines: ['提升对风属性的抵抗力'] },
	// 抗性·毒（RESIST_PROPERTY_POISON）
	912: { name: '抗性·毒', type: 'buff', time: 1, lines: ['提升对毒属性的抵抗力'] },
	// 抗性·圣（RESIST_PROPERTY_SAINT）
	913: { name: '抗性·圣', type: 'buff', time: 1, lines: ['提升对圣属性的抵抗力'] },
	// 抗性·暗（RESIST_PROPERTY_DARKNESS）
	914: { name: '抗性·暗', type: 'buff', time: 1, lines: ['提升对暗属性的抵抗力'] },
	// 抗性·念（RESIST_PROPERTY_TELEKINESIS）
	915: { name: '抗性·念', type: 'buff', time: 1, lines: ['提升对念力属性的抵抗力'] },
	// 抗性·不死（RESIST_PROPERTY_UNDEAD）
	916: { name: '抗性·不死', type: 'buff', time: 1, lines: ['提升对不死属性的抵抗力'] },
};

export default STATUS_INFO_OVERLAY_ZH;