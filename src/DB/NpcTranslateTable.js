// NPC Name Translation Table
// English→Chinese mappings for NPC display names
// getTranslation() strips #suffix before lookup

const NPC_TRANSLATIONS = {
  // ===== Kafra Employees =====
  'Kafra Employee': '卡普拉服务员',
  'Kafra Teleportation': '卡普拉传送服务',
  'Kafra Voting Staff': '卡普拉投票员工',
  'Cool Event Corp. Staff': '酷活动公司员工',

  // ===== Healer (custom) =====
  Healer: '治疗师',
  'Buffy Healer': '治疗师',

  // ===== Prontera Town NPCs =====
  'Smile Assistance': '微笑服务',
  'Mado Gear Armorer': '魔导机甲装备商',
  Dairenne: '黛琳',
  Merideth: '梅瑞狄斯',
  Strife: '斯特莱夫',
  Tono: '托诺',
  YuNa: '尤娜',
  YuPi: '尤比',
  Shuger: '舒格',

  // ===== Guides =====
  Guide: '向导',
  'Auction Hall Guide': '拍卖行向导',
  'Cash Sales Guide': '商城向导',

  // ===== Custom NPCs =====
  QuestMaster: '任务大师',
  SampleGuide: '示例向导',
  SampleShop: '示例商店',
  'Job Master': '职业大师',
  'Grand Master': '大宗师',

  // ===== Tool/Weapon/Armor/Bullet Dealers =====
  'Tool Dealer': '道具商人',
  'Weapon Dealer': '武器商人',
  'Armor Dealer': '防具商人',
  'Bullet Dealer': '弹药商人',
  'Poison Seller': '毒药商人',
  'Magic Goods Dealer': '魔法道具商人',
  Merchant: '商人',
  'Milk Vendor': '牛奶商人',
  'Pet Trader': '宠物商人',

  // ===== Refine / Enchant =====
  'Refine Master': '精炼大师',
  'Master Refiner': '精炼大师',
  'Illusion Enchanter': '幻影附魔师',
  'Illusion Merchant': '幻影商人',
  'Apprentice Craftsman': '学徒工匠',

  // ===== Special Shops =====
  'Quest Shop': '任务商店',
  Questboard: '任务板',
  Lottery: '彩票',
  'Stock Market': '股票市场',
  'Monster Arena': '怪物竞技场',
  'Hunting Missions': '狩猎任务',

  // ===== Skill/Reset NPCs =====
  'Reset Girl': '重置小姐',
  'Reset NPC': '重置 NPC',
  'Stat Reset': '属性重置',
  'Skill Reset': '技能重置',
  'Platinum Skill NPC': '铂金技能教官',
  'Clothing Effect Removal Service': '服装效果移除',

  // ===== Rental / Storage =====
  'Rental NPC': '租赁 NPC',
  'Universal Rental NPC': '通用租赁 NPC',
  'Storage Keeper': '仓库管理员',
  Banker: '银行家',

  // ===== Pet / Mount =====
  'Breeder NPC': '宠物培育员',
  'Rental Mount NPC': '坐骑租赁 NPC',
  'Pet Enthusiast': '宠物爱好者',
  'Peco Peco Breeder': '大嘴鸟饲养员',
  'Peco Peco Remover': '大嘴鸟移除',
  'Riding Creature Master': '坐骑大师',

  // ===== Stylist =====
  Stylist: '发型师',
  'Style Changer': '造型师',

  // ===== Signer / Card Remover =====
  Perchik: '签名师佩奇克',
  'Wise Old Woman': '睿智的老妇人',
  'Card Seller': '卡片商人',

  // ===== Warp / Teleport =====
  Warpra: '传送员',
  Warper: '传送员',
  'MVP Warper': 'MVP 传送员',
  'MvP Ladder Warper': 'MVP 天梯传送员',
  'Ash-Vacuum Warper': '灰烬真空传送员',
  'Zonda Rep': '宗达代表',

  // ===== Job/Class NPCs =====
  Acolyte: '服事',
  Knight: '骑士',
  'Royal Guard': '皇家卫士',
  'Young Man': '年轻男子',
  'Young man': '年轻男子',
  Woman: '女人',
  'Old Woman': '老妇人',
  'Old Lady': '老妇人',
  'Little Girl': '小女孩',

  // ===== Inn / Rest =====
  'Inn Employee': '旅店店员',

  // ===== Kafra Staff =====
  Manager: '管理员',

  // ===== Billboard / Sign / Bulletin =====
  Billboard: '公告板',
  'Bulletin Board': '公告板',
  'Prontera Bulletin': '普隆德拉公告',
  'Sign Post': '指示牌',
  Sign: '告示牌',
  'Wanted Notice': '通缉令',
  'Memorial Plaque': '纪念牌匾',
  Gravestone: '墓碑',

  // ===== Quest NPCs (named) =====
  Aelle: '艾尔',
  Arthail: '阿尔塞尔',
  'Assistant Alonzo': '助手阿隆佐',
  'Berry Toe': '贝瑞托',
  'Busy Boy': '忙碌男孩',
  Cellerb: '塞勒布',
  'Chief Officer': '首席官员',
  'Clanux Heffron': '克拉努克斯·赫弗伦',
  Dassy: '达茜',
  Driller: '钻工',
  'Furniture Deliveryman': '家具送货员',
  'Glasses-wearing Man': '戴眼镜的男人',
  Goldberg: '戈德堡',
  Hypnotist: '催眠师',
  Jayon: '杰昂',
  Karian: '卡里安',
  Kellion: '凯利恩',
  Kid: '小孩',
  Kiddo: '小家伙',
  Lenneth: '蕾娜丝',
  'Man from Morocc': '来自梦罗克的男人',
  Mason: '梅森',
  Messenger: '信使',
  'Mother Mathana': '玛萨娜妈妈',
  Nephia: '奈菲亚',
  Nerlen: '奈尔伦',
  'New Guild Master': '新公会会长',
  Nun: '修女',
  'Old Soldier': '老兵',
  'Ordinary Man': '普通男人',
  'Promotional Staff': '推广人员',
  Putty: '普蒂',
  'Rina': '丽娜',
  'Royal Messenger': '皇家信使',
  Sagle: '萨格尔',
  Tialfi: '提亚菲',
  Tine: '蒂妮',
  'Warmhearted woman': '热心女人',
  Wanderer: '流浪者',
  Veeyop: '维约普',
  'Cantankerous Geezer': '坏脾气老头',
  'Dowdy Matron': '邋遢妇人',

  // ===== Event NPCs =====
  // Halloween
  'Cool Devi': '酷酷·德维',
  Cluckers: '克拉克',
  Deviruchi: '小恶魔',
  Familiar: '使魔',
  'Gloomy Jack': '阴郁杰克',
  'Hallows\' Eve Event': '万圣节活动',
  'Pumpkin Hat Researcher': '南瓜帽研究员',
  'Suspicious Coffin': '可疑的棺材',
  Uneasy_Check: '不安检查',

  // Easter
  'Egg Salesman': '彩蛋商人',
  'Rina\'s Little Friend': '丽娜的好友',
  Traveler: '旅行者',

  // Christmas
  Caroller: '报佳音者',
  Christ: '圣诞老人',
  Happymerry: '快乐玛丽',
  Snower: '斯诺尔',

  // Valentine
  'Event Ring Maker': '活动戒指制作师',
  'Heart Merchant': '爱心商人',
  'Packs Trader': '礼包商人',
  'Valentine Vote Manager': '情人节投票管理员',
  Trader: '商人',

  // RWC
  'RWC2011 Agent': 'RWC 代理人',

  // Memorial Day
  Grast: '格拉斯',
  Lauds: '劳兹',

  // Other Events
  'Bossnia Staff': '波斯尼亚工作人员',
  'Devil Square Guardian': '恶魔广场守护者',
  'Disguise Event': '变身活动',
  Event: '活动 NPC',
  'Find the Mushroom': '找蘑菇',
  'Phantasmagorika Spokesperson': '幻景发言人',
  Mas: '马斯',

  // ===== Battle Ground =====
  'Blue Team': '蓝队',
  'Red Team': '红队',
  'Clan Helper': '公会助手',

  // ===== Training =====
  'Training Instructor': '训练教官',
  'Private MVP Room': '私人 MVP 房间',

  // ===== WOE =====
  'WOE Information': '攻城战信息',
  'Novice Castles': '新手城堡',

  // ===== Misc =====
  ChkSpace: '测试空间',
  'Pront Test': '普隆德拉测试',
  Mage: '法师',
  Oholy: '奥荷莉',
  'Pandit chacha': '潘迪特叔叔',
  'Twin Towers': '双子塔',
  Enjoy: '恩乔伊',

  // ===== Inn NPCs (town) =====
  Cook: '厨师',
  Waitress: '女服务员',
  Bard: '吟游诗人',
  Receptionist: '接待员',
};

export function getTranslation(name) {
  if (!name) return name;
  const hashIndex = name.indexOf('#');
  const baseName = hashIndex > 0 ? name.substring(0, hashIndex) : name;
  return NPC_TRANSLATIONS[baseName] || name;
}

export default NPC_TRANSLATIONS;
