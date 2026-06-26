/**
 * NPC Name Translation Table
 *
 * Maps English NPC display names (from server) to Chinese translations.
 * Pattern: 'English Name' => '中文名'
 *
 * IMPORTANT: The English key must match the EXACT name sent by the server.
 * Use the NPC script name (the part after 'script' and before the class ID).
 */

const NpcTranslateTable = {
  // Kafra
  'Kafra Employee': '卡普拉服务员',
  'Kafra Service': '卡普拉服务',
  'Kafra Employee#1': '卡普拉服务员',
  'Kafra Employee#2': '卡普拉服务员',
  'Kafra Employee#3': '卡普拉服务员',
  'Kafra Employee#4': '卡普拉服务员',
  'Cool Event Corp. Staff': '酷活动公司员工',
  'Kafra Voting Staff': '卡普拉投票员工',

  // Healer
  Healer: '治疗师',

  // Prontera Town NPCs
  'Smile Assistance': '微笑服务',
  'Mado Gear Armorer': '魔导机甲装备商',

  // Tool/Weapon/Armor Dealers
  'Tool Dealer': '道具商人',
  'Weapon Dealer': '武器商人',
  'Armor Dealer': '防具商人',

  // Item Dealers (various types)
  'Item Dealer': '物品商人',
  'Accessory Dealer': '饰品商人',

  // Guides
  Guide: '向导',

  // Custom NPCs
  QuestMaster: '任务大师',
  SampleGuide: '示例向导',
  SampleShop: '示例商店',

  // Job NPCs
  'Job Master': '职业大师',
  'Job Changer': '转职人员',
  'Platinum Skill NPC': '铂金技能教官',

  // Card
  'Card Seller': '卡片商人',

  // Refine/Enchant
  'Refine Master': '精炼大师',
  'Refine Expert': '精炼专家',
  'Enchanter NPC': '附魔师',

  // Trader NPCs
  Trader: '交易商',

  // PvP/WoE
  'Warper Agent': '传送代理人',

  // Inn / Rest
  'Inn Employee': '旅店店员',

  // Skill Reset NPCs
  'Reset Girl': '重置小姐',
  'Reset NPC': '重置 NPC',
  'Stat Reset': '属性重置',
  'Skill Reset': '技能重置',

  // Rental NPCs
  'Rental NPC': '租赁 NPC',

  // Storage
  'Storage Keeper': '仓库管理员',

  // Pet / Mount
  'Breeder NPC': '宠物培育员',
  'Rental Mount NPC': '坐骑租赁 NPC',

  // Stylist
  Stylist: '发型师',
  'Style Changer': '造型师',

  // Signer
  Perchik: '签名师佩奇克',
  'Wise Old Woman': '睿智的老妇人',

  // Bulletins / Mission
  'Mission Board': '任务公告栏',

  // Events / Holidays
  Event: '活动NPC',

  // Barber / Dye
  'Hair Stylist': '理发师',
  'Dye Maker': '染色师',

  // Auction
  'Auction Dealer': '拍卖商人',

  // Marriage / Wedding
  'Marriage Officiator': '婚礼主持人',
  'Divorce Staff': '离婚管理员',

  // Bingo
  'Bingo Event': '宾果活动',

  // Poring Event
  'Poring Event': '波利活动',
  'Poring Box': '波利盒子',

  // Battleground
  'Battleground Recruiter': '战场招募官',

  // Instance
  'Instance Manager': '副本管理员',

  // Poring War
  'Poring King': '波利国王',

  // Other common NPCs
  'Guild Manager': '公会管理员',

  // Prontera Town NPCs
  'Prontera Citizen': '普隆德拉居民',
  'Prontera Guard': '普隆德拉守卫',
  'Security Staff': '保安人员',

  // Mail
  'Mail Manager': '邮件管理员',

  // Repeat: duplicate names with different uniqueIDs
  // These are auto-resolved by stripping the #suffix during lookup
};

export function getTranslation(originalName) {
  if (!originalName) return originalName;

  // Exact match
  if (NpcTranslateTable[originalName]) {
    return NpcTranslateTable[originalName];
  }

  // Strip #suffix for duplicate NPC names (e.g. "Kafra Employee#prt" -> "Kafra Employee")
  const hashIdx = originalName.indexOf('#');
  if (hashIdx > 0) {
    const baseName = originalName.substring(0, hashIdx);
    if (NpcTranslateTable[baseName]) {
      return NpcTranslateTable[baseName];
    }
  }

  return originalName;
}

export function addTranslation(english, chinese) {
  NpcTranslateTable[english] = chinese;
}

export default NpcTranslateTable;
