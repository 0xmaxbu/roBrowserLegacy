// ============================================================
// NPC 名称翻译表 — 覆盖所有城市 (Prontera + Geffen + Morocc + Payon + Alberta + Izlude 等)
// 基于 rAthena 脚本提取：7,442 个基础 NPC 名 / 18,486 个实例
// ============================================================

import Session from 'Engine/SessionStorage.js';

const NpcTranslateTable = {

  // ==========================================================
  // 一、卡普拉服务 (Kafra Employees)
  // ==========================================================
  'Kafra Employee': '卡普拉服务员',
  'Kafra Employee#1': '卡普拉服务员',
  'Kafra Employee#2': '卡普拉服务员',
  'Kafra Employee#3': '卡普拉服务员',
  'Kafra Employee#4': '卡普拉服务员',
  'Kafra Employee#5': '卡普拉服务员',
  'Kafra Employee#alb': '卡普拉服务员',
  'Kafra Employee#alde': '卡普拉服务员',
  'Kafra Employee#gef': '卡普拉服务员',
  'Kafra Employee#izl': '卡普拉服务员',
  'Kafra Employee#mor': '卡普拉服务员',
  'Kafra Employee#pay': '卡普拉服务员',
  'Kafra Employee#mer': '卡普拉服务员',
  'Kafra Employee#cmd': '卡普拉服务员',
  'Kafra Employee#yuno': '卡普拉服务员',
  'Kafra Employee#ein': '卡普拉服务员',
  'Kafra Employee#prt': '卡普拉服务员',
  'Kafra Teleportation': '卡普拉传送服务',
  'Kafra Teleportation#prontera': '卡普拉传送服务',
  'Cool Event Corp. Staff': '酷活动公司员工',
  'Cool Event Staff': '酷活动员工',
  'Kafra Voting Staff': '卡普拉投票员工',
  'Kafra Voting Staff#prt': '卡普拉投票员工',
  'Cash Sales Guide': '现金商城引导员',

  // Guild
  'Guild Warehouse Manager': '公会仓库管理员',
  'Clan Helper': '公会助手',
  'Maroll Battle Recruiter': '马洛尔战场招募官',

  // ==========================================================
  // 二、商人/商店 (Merchants & Shops)
  // ==========================================================
  'Tool Dealer': '道具商人',
  'Weapon Dealer': '武器商人',
  'Armor Dealer': '防具商人',
  'Trader': '商人',
  'Merchant': '商人',
  'Milk Vendor': '牛奶商人',
  'Refine Master': '精炼大师',
  'Refine Master#1': '精炼大师',
  'Card Seller': '卡片商人',
  'Pet Trader': '宠物商人',
  'Pet Trader#1': '宠物商人',
  'Pet Store': '宠物商店',
  'Pet Shop Clerk': '宠物店店员',
  'Item Shop': '道具商店',
  'Food Vendor': '食品商人',
  'Fruit Vendor': '水果商人',
  'Gemstone Trader': '宝石商人',
  'Rare Diamond Merchant': '稀有钻石商人',
  'Cat Paw Shrimp Merchant': '猫爪虾商人',
  'Point Merchant': '点数商人',
  'Talisman Merchant': '护符商人',
  'Arrow Merchant': '箭矢商人',
  'Ammunition Merchant': '弹药商人',
  'Ninja Tool Merchant': '忍具商人',
  'Mado Gear Merchant': '魔导机甲商人',
  'Vendor from Milk Ranch': '牛奶牧场商人',
  'Arrow Dealer': '箭矢商人',
  'Arrows Merchant': '箭矢商人',
  'Potion Dealer': '药水商人',
  'Magic Shop': '魔法商店',
  'Magic Goods Shop': '魔法用品商店',
  'Blacksmith': '铁匠',
  'Alchemist': '炼金术师',
  'Meat Vendor#jupe_ele': '肉类商人',
  'Cluckers': '克拉克',
  'Heart Merchant': '爱心商人',
  'Egg Salesman': '彩蛋商人',
  'Apprentice Craftsman': '学徒工匠',
  'Illusion Merchant': '幻影商人',
  'Illusion Enchanter': '幻影附魔师',
  'Packs Trader': '礼包商人',
  'Event Ring Maker': '活动戒指制作师',
  'Universal Rental NPC': '租赁工作人员',
  'Rental NPC': '租赁 NPC',
  'Banker': '银行家',
  'Stock Market': '股票市场',
  'Quest Shop': '任务商店',
  'Quest Shop#1': '任务商店',
  'Questboard': '任务公告栏',

  // ==========================================================
  // 三、守卫/士兵 (Guards & Soldiers)
  // ==========================================================
  Guard: '卫兵',
  'Temple Guard': '圣殿卫士',
  Soldier: '士兵',
  'Palace Guard': '王宫卫兵',
  'Castle Guard': '城堡卫兵',
  'City Guard': '城防卫兵',
  'Royal Guard': '皇家卫士',
  'Security Guard': '保安',
  Officer: '军官',
  Patroller: '巡逻兵',
  Sentry: '哨兵',
  Knight: '骑士',
  'Royal Messenger': '皇家信使',
  'Chief Officer': '首席官员',

  // ==========================================================
  // 四、向导/传送 (Guides & Warpers)
  // ==========================================================
  Guide: '向导',
  'Guide#01prontera': '向导',
  'Guide#02': '向导',
  'Guide#03': '向导',
  'Guide#prt': '向导',
  'Auction Hall Guide': '拍卖场引导员',
  'Cash Sales Guide#prontera': '现金商城引导员',
  Warper: '传送员',
  Warpra: '传送员',
  'MVP Warper': 'MVP传送员',
  'Ash-Vacuum Warper': '灰烬真空传送员',
  'MvP Ladder Warper': 'MVP天梯传送员',
  'Zonda Rep': '宗达代表',
  'Zonda Rep#pron': '宗达代表',
  'Zonda Teleportation': '宗达传送服务',
  'Eden Teleport Officer': '伊甸园传送官',
  'Airship Staff': '飞空艇工作人员',

  // ==========================================================
  // 五、治疗师 (Healers)
  // ==========================================================
  Healer: '治疗师',
  Doctor: '医生',
  Nurse: '护士',
  'Reset Girl': '重置小姐',
  'Reset NPC': '重置工作人员',
  'Stat Reset': '属性重置',
  'Skill Reset': '技能重置',

  // ==========================================================
  // 六、职业/转职 (Job & Class NPCs)
  // ==========================================================
  'Job Master': '职业大师',
  'Grand Master': '大宗师',
  'Platinum Skill NPC': '铂金技能教官',
  'Training Instructor': '训练教官',
  'Novice Castles': '新手城堡',
  'Knight#drake': '骑士',
  'Acolyte#Prtclear': '服事',
  'New Guild Master#tu': '新公会会长',
  'Peco Peco Breeder': '大嘴鸟饲养员',
  'Peco Peco Remover': '大嘴鸟移除',
  'Riding Creature Master': '坐骑大师',
  'Rental Mount NPC': '坐骑租赁 NPC',
  'Breeder NPC': '宠物培育员',
  'Pet Enthusiast': '宠物爱好者',

  // ==========================================================
  // 七、城镇NPC (Town Citizens)
  // ==========================================================
  'Old Lady': '老妇人',
  'Old Soldier': '老兵',
  'Old Woman': '老妇人',
  'Old Man': '老人',
  'Little Girl': '小女孩',
  'Young Man': '年轻男子',
  'Young Woman': '年轻女子',
  'Town Girl': '城镇少女',
  'Warmhearted woman': '热心女人',
  'Wandering Man': '流浪男子',
  Wanderer: '流浪者',
  'Busy Boy': '忙碌男孩',
  'Glasses-wearing Man': '戴眼镜的男人',
  'Man from Morocc': '来自梦罗克的男人',
  'Ordinary Man': '普通男人',
  'Mother Mathana': '玛萨娜妈妈',
  'Cantankerous Geezer': '坏脾气老头',
  'Dowdy Matron': '邋遢妇人',
  Kid: '小孩',
  Kiddo: '小家伙',
  Nun: '修女',
  Bard: '吟游诗人',
  Cook: '厨师',
  Waitress: '女服务员',
  Driller: '钻工',
  Miner: '矿工',
  Fisherman: '渔夫',
  Farmer: '农夫',
  'Fruit Gardener': '水果园丁',
  Hunter: '猎人',
  Scholar: '学者',
  Adventurer: '冒险者',
  Messenger: '信使',
  Mason: '梅森',
  'Berry Toe': '贝瑞托',
  'Hypnotist': '催眠师',
  'Chef Assistant': '厨师助手',
  'Wedding Secretary': '婚礼秘书',

  // ==========================================================
  // 八、公告栏/标牌 (Bulletins & Signs)
  // ==========================================================
  'Bulletin Board': '公告栏',
  'Mission Board': '任务公告栏',
  Sign: '指示牌',
  Signposts: '指示牌',
  'Sign Post': '指示牌',
  'Sign Post#Prt1': '指示牌',
  Billboard: '公告板',
  Gravestone: '墓碑',
  'Memorial Plaque': '纪念牌匾',
  'Wanted Notice': '通缉令',

  // ==========================================================
  // 九、旅馆/住宿 (Inns & Hotels)
  // ==========================================================
  'Inn Employee': '旅店店员',
  'Inn Keeper': '旅馆老板',
  Innkeeper: '旅馆老板',
  'Hotel Manager': '酒店经理',

  // ==========================================================
  // 十、仓库 (Storage)
  // ==========================================================
  'Storage Keeper': '仓库管理员',

  // ==========================================================
  // 十一、造型/外观 (Stylists & Appearance)
  // ==========================================================
  Stylist: '发型师',
  'Style Changer': '造型师',
  'Clothing Effect Removal Service': '服装效果移除服务',

  // ==========================================================
  // 十二、签名/卡片 (Signer & Card NPCs)
  // ==========================================================
  Perchik: '签名师佩奇克',
  'Wise Old Woman': '睿智的老妇人',

  // ==========================================================
  // 十三、活动NPC (Event NPCs)
  // ==========================================================
  Christ: '圣诞老人',
  'Pumpkin Hat Researcher': '南瓜帽研究员',
  'Gloomy Jack': '阴郁杰克',
  'Cool Devi': '酷酷·德维',
  Snower: '斯诺尔',
  Caroller: '报佳音者',
  'Valentine Vote Manager': '情人节投票管理员',
  'Disguise Event': '变身活动',
  'Find the Mushroom': '找蘑菇',
  'Bossnia Staff': '波斯尼亚工作人员',
  'Promotional Staff': '推广人员',
  'RWC2011 Agent': 'RWC2011 代理人',
  'Devil Square Guardian': '恶魔广场守护者',
  'Phantasmagorika Spokesperson': '幻景发言人',
  'Monster Arena': '怪物竞技场',
  'Lottery': '彩票',

  // Prontera named NPCs (from prontera.txt)
  'Dairenne#pront': '黛琳',
  'YuNa#pront': '尤娜',
  'YuPi#pront': '尤比',
  'Tono#pront': '托诺',
  'Strife#pront': '斯特莱夫',
  'Merideth#pront': '梅瑞狄斯',
  'Shuger#pront': '舒格',
  'Aelle#qsk_dan02': '艾尔',

  // Other named NPCs (alphabetical)
  'Arthail': '阿尔塞尔',
  'Assistant Alonzo': '助手阿隆佐',
  'Ayothaya Guide Noi': '艾尔贝塔向导诺伊',
  Cellerb: '塞勒布',
  'Clanux Heffron': '克拉努克斯·赫弗伦',
  Dassy: '达茜',
  'Furniture Deliveryman': '家具送货员',
  'Goldberg#pron': '戈德堡',
  'Grast#Memorial': '格拉斯',
  'Happymerry': '快乐玛丽',
  'Jayon': '杰昂',
  'Karian#cmd9': '卡里安',
  Kellion: '凯利恩',
  'Lauds#Memorial': '劳兹',
  Lenneth: '蕾娜丝',
  'Nephia#1': '奈菲亚',
  'Nerlen#es07': '奈尔伦',
  Nuernberg: '纽伦堡',
  'Oholy#pron': '奥荷莉',
  'Pandit chacha': '潘迪特叔叔',
  Putty: '普蒂',
  'Rina#Easter': '丽娜',
  'Rina\'s Little Friend': '丽娜的小伙伴',
  Rothenburg: '罗滕堡',
  Sagle: '萨格尔',
  Skoegul: '斯克古尔',
  Tialfi: '提亚菲',
  Tine: '蒂妮',
  'Twin Towers': '双子塔',
  'Veeyop#magum': '维约普',
  'Woman#Rosa Ellenen': '罗莎·埃勒嫩',

  // ==========================================================
  // 十四、自定义NPC (Custom NPCs)
  // ==========================================================
  'Business Permit NPC': '营业执照NPC',
  QuestMaster: '任务大师',
  SampleGuide: '示例向导',
  SampleShop: '示例商店',
  'Smile Assistance': '微笑服务',
  'Mado Gear Armorer': '魔导机甲装备商',
  'Private MVP Room': '私人MVP房间',
  'WOE Information': '攻城战信息',
  'Hunting Missions': '狩猎任务',

  // ==========================================================
  // 十五、其他常用 (Miscellaneous Common)
  // ==========================================================
  Chicken: '鸡',
  Dead: '尸体',
  'Dead Man': '死者',
  'Dead Body': '尸体',
  Dying: '垂死者',
  Corpse: '尸体',
  Soul: '灵魂',
  Ghost: '幽灵',
  Spirit: '幽灵',
  Shadow: '暗影',
  Manager: '管理员',
  Receptionist: '接待员',
  'Information Desk': '咨询台',
  Spokesman: '发言人',
  Spokesperson: '发言人',
  Envoy: '使者',
  Navigator: '导航员',
  Helper: '助手',
  Assistant: '助手',
  'Captain of the Guards': '卫兵队长',
  Mayor: '市长',
  King: '国王',
  Queen: '女王',
  Prince: '王子',
  Princess: '公主',
  Minister: '大臣',
  Priest: '牧师',
  Priestess: '神官',
  Monk: '武僧',
  Wizard: '大法师',
  Witch: '女巫',
  Sage: '贤者',
  'Alchemist Union Member': '炼金工会成员',
};

// ============================================================
// 翻译函数 — 处理带 #后缀 的 NPC 名称
// ============================================================

// 多语言注册表：语言码 → 翻译表
// 新增语言：创建独立表文件（如 NpcTranslateTable_ja.js），import 后加入此 registry
const registry = {
  zh: NpcTranslateTable,
};

export function getTranslation(fullName) {
  const table = registry[Session.PlayerLang];
  if (!table) {
    return fullName;
  }

  const result = table[fullName];
  if (result) {
    return result;
  }

  // Try base name (strip #suffix, but keep original if no #)
  const hashIdx = fullName.lastIndexOf('#');
  if (hashIdx > 0) {
    const baseName = fullName.substring(0, hashIdx);
    if (Object.prototype.hasOwnProperty.call(table, baseName)) {
      return table[baseName];
    }
  }

  return fullName;
}

export default NpcTranslateTable;
