// ============================================================
// NPC 对话翻译表 — 客户端侧通用 NPC 对话/菜单中文化
// 覆盖 select 菜单选项 + mes 通用短语（问候、告别、商店、服务用语）
// 拦截点：NPC.js onMessage() (mes) + onMenuAppear() (select)
// ============================================================

// select 菜单选项翻译（逐项精确匹配）
const MenuOptionTable = {
  'Cancel': '取消',
  'Yes Please': '好的',
  'No thanks.': '不用了，谢谢。',
  'No thanks': '不用了，谢谢',
  'No': '不了',
  'Heal': '治疗',
  'Leave': '离开',
  'Ok!': '好的！',
  'OK': '确定',
  'Tell me more...': '了解更多...',
  'Never mind.': '算了。',
  'Never mind': '算了',
  'Go back': '返回',
  'I changed my mind about this.': '我改主意了。',
  'I changed my mind': '我改主意了',
  'Very well. Do it.': '好的，开始吧。',
  'Yes, it does.': '是的，请帮忙。',
  'No thanks.': '不用了，谢谢。',
  'What do you charge?': '费用是多少？',
  'Sign my items, please!': '请帮我签名！',
  'The item.': '保住装备。',
  'The cards.': '保住卡片。',
  'Reset Skills': '重置技能',
  'Reset Stats': '重置属性',
  'Reset Both': '全部重置',
  'Yes': '是',
  'Warp': '传送',
  'Info': '信息',
  'Information': '信息',
  'Yes, let\'s go.': '好的，出发吧。',
  'Let me think': '让我想想',
  'That\'s fine': '没问题',
  'Sure': '好的',
  'Close': '关闭',
  'Take me there!': '带我去！',
  'I\'ll pass.': '不了',
  'I\'ll pass': '不了',
  'Buy': '购买',
  'Sell': '出售',
  'I want to buy something.': '我想买东西。',
  'Never mind, I\'m fine.': '不用了，谢谢。',
  'I would like to buy something.': '我想买东西。',
  'Talk to me about something else.': '跟我说点别的。',
  'I\'d like to have a look.': '我想看看。',
  'No, I\'m fine.': '不用了，谢谢。',
  'I am fine.': '不用了，谢谢。',
  'Let me see.': '让我看看。',
  'I have changed my mind.': '我改主意了。',
  'Yes, I want to.': '是的，我想。',
  'No, I don\'t.': '不了。',
  'I think not.': '不了。',
  'I\'m ready.': '我准备好了。',
  'Not yet.': '还没。',
  'Go ahead.': '开始吧。',
  'Okay.': '好的。',
  'Next': '下一步',
  'Again': '再来一次',

  // ---- 转职/技能 ----
  'I want to change my job.': '我想转职。',
  'Do it.': '开始吧。',
  'I\'m sure.': '我确定。',
  'Yes, I am sure.': '是的，我确定。',

  // ---- Kafra ----
  'Save': '保存',
  'Use Storage': '使用仓库',
  'Rent a Pushcart': '租用手推车',
  'Check other commands.': '查看其他指令。',
  'Talk about Storage.': '谈谈仓库。',
  'Talk about Teleport Service.': '谈谈传送服务。',
  'Talk about the Teleport Service.': '谈谈传送服务。',
  'Information about saving.': '关于保存的信息。',
  'I\'d like to use the Save Service.': '我想使用保存服务。',
  'I\'d like to Save.': '我想保存。',
  'Talk about saving.': '谈谈保存。',
};

// mes 对话翻译（完整短语精确/前缀匹配）
const DialogTable = {
  // ---- 通用 ----
  'Welcome!': '欢迎光临！',
  'Welcome,': '欢迎光临，',
  'See you later~': '再见~',
  'Have a nice day... >.>': '祝你愉快... >.>',
  'Have a nice day.': '祝你愉快。',
  'There you go!': '搞定了！',
  'Done!': '搞定！',

  // ---- 转职/Job Master ----
  'I can give you the special skills available to your job.': '我可以传授你所选职业的特殊技能。',
  'Would you like these skills now?': '现在就要学习吗？',
  'Level requirement:': '等级要求：',
  'Select a job.': '请选择职业。',

  // ---- 治疗 ----
  'Healing costs': '治疗费用',

  // ---- 商店 ----
  'Welcome! I can sell you any normal monster card in the game. Would you like to have a look?': '欢迎光临！我可以出售游戏中的任何普通怪物卡片。想看看吗？',
  'I am sorry, it seems like something went wrong.': '抱歉，好像出了点问题。',
  'I cannot find any cards in our database at the moment.': '目前数据库里找不到任何卡片。',
  'Please contact a game master.': '请联系GM处理。',

  // ---- 重置 ----
  'I am the Reset Girl.': '我是重置小姐。',
  'Reset Stats:': '重置属性：',
  'Reset Skills:': '重置技能：',
  'Reset Both:': '全部重置：',
  'Please select the service you want:': '请选择所需服务：',
  'Sorry, you don\'t have enough Zeny.': '抱歉，你的 Zeny 不够。',
  'Sorry you don\'t have enough Zeny.': '抱歉，你的 Zeny 不够。',
  'Sorry you can only reset': '抱歉，你一生只能重置',

  // ---- Kafra ----
  'Welcome to Kafra Corporation.': '欢迎光临卡普拉公司。',
  'Welcome to the Kafra Corporation.': '欢迎光临卡普拉公司。',
  'How can I help you?': '有什么可以帮您的？',
  'What can I do for you?': '有什么可以帮您的？',
  'Thank you for using the Kafra Services.': '感谢您使用卡普拉服务。',
  'Thank you for using our services.': '感谢您使用我们的服务。',
  'We\'ll be seeing you.': '期待再次为您服务。',
  'Please come again.': '欢迎再次光临。',

  // ---- Tool Dealer / 商人 ----
  'I can sell you any normal monster card': '我可以出售任何普通怪物卡片',

  // ---- Warper / 传送 ----
  'Where would you like to go?': '你想去哪里？',
  'I can warp you to various locations.': '我可以传送你去各个地方。',
  'Last Warp': '上次传送',
  'I can warp you to': '我可以传送你去',

  // ---- Guide / 向导 ----
  'I can give you some information.': '我可以告诉你一些信息。',
  'Welcome to Prontera.': '欢迎来到普隆德拉。',
  'Welcome to Geffen.': '欢迎来到吉芬。',

  // ---- 其他 NPC 类型 ----
  'What do you want?': '你想干什么？',
  'What do you need?': '你需要什么？',
  'What can I help you with?': '有什么可以帮您的？',
  'Good day.': '你好。',
  'Hi, there.': '你好。',
  'Hello.': '你好。',
  'Hello!': '你好！',
  'Hey, you.': '嘿，你。',
  'Greetings.': '你好。',
  'Good to see you.': '很高兴见到你。',
  'It\'s nice to see you.': '很高兴见到你。',
  'Goodbye.': '再见。',
  'Good bye.': '再见。',
  'Bye.': '再见。',
  'Farewell.': '再见。',
  'See you.': '再见。',
  'Take care.': '保重。',
  'Come back anytime.': '随时回来。',
  'Come again.': '再来啊。',
};

/**
 * 翻译单个 select 菜单选项
 * @param {string} option - 菜单选项文本
 * @returns {string} 翻译后的文本
 */
function translateMenuOption(option) {
  const trimmed = option.trim();
  if (MenuOptionTable[trimmed]) {
    return MenuOptionTable[trimmed];
  }
  return option;
}

/**
 * 翻译 NPC 对话文本
 * @param {string} text - 对话文本
 * @returns {string} 翻译后的文本
 */
function translateDialog(text) {
  const trimmed = text.trim();
  // 精确匹配
  if (DialogTable[trimmed]) {
    return DialogTable[trimmed];
  }
  // 前缀匹配（用于带变量的消息如 "Healing costs 0 Zeny."）
  for (const [en, zh] of Object.entries(DialogTable)) {
    if (trimmed.startsWith(en)) {
      const remaining = trimmed.slice(en.length);
      return zh + remaining;
    }
  }
  return text;
}

/**
 * 翻译 select 菜单（colon-separated）
 * @param {string} menu - 菜单文本（以 : 分隔的选项列表）
 * @returns {string} 翻译后的菜单文本
 */
function translateMenu(menu) {
  if (!menu || typeof menu !== 'string') return menu;
  const options = menu.split(':');
  const translated = options.map(translateMenuOption);
  return translated.join(':');
}

export { translateMenu, translateDialog, translateMenuOption };
