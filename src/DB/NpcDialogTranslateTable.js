// ============================================================
// NPC 对话翻译表 - Kafra + Warper + 通用 NPC 对话中文化
// ============================================================

const MenuOptionTable = {
  // Kafra 服务菜单
  'Save': '保存',
  'Use Storage': '使用仓库',
  'Check other commands.': '查看其他指令',
  'Check other commands': '查看其他指令',
  'Talk about Storage.': '谈谈仓库',
  'Talk about Storage': '谈谈仓库',
  'Talk about saving.': '谈谈保存',
  'Talk about saving': '谈谈保存',
  'Information about saving.': '关于保存的信息',
  'Talk about the Teleport Service.': '谈谈传送服务',
  'Talk about Teleport Service.': '谈谈传送服务',
  "I'd like to Save.": '我想保存',
  "I'd like to Save": '我想保存',
  "I'd like to use the Save Service.": '我想使用保存服务',
  "I'd like to use the Save Service": '我想使用保存服务',
  'Rent a Pushcart': '租用手推车',

  // 通用菜单选项
  'Cancel': '取消', 'Cancel.': '取消。',
  'No': '不', 'No.': '不。',
  'Yes': '是', 'Yes.': '是。',
  'Sure': '好的', 'Sure.': '好的。', 'Sure!': '好的！',
  'Quit': '退出', 'Quit.': '退出。',
  'Nothing': '没什么', 'Nothing.': '没什么。',
  'No thanks': '不了，谢谢', 'No thanks.': '不了，谢谢。',
  'No, thanks': '不了，谢谢', 'No, thanks.': '不了，谢谢。',
  'End Conversation': '结束对话', 'End conversation': '结束对话',
  'End Conversation.': '结束对话。', 'End conversation.': '结束对话。',
  'I want to quit': '我想退出',
  'Forget it': '算了', 'Forget it.': '算了。',
  'Leave': '离开', 'Leave.': '离开。',
  'Give up': '放弃', 'Give up.': '放弃。',
  'Not yet': '还没', 'Not yet.': '还没。',
  'Next': '下一步', 'Again': '再来一次',
  'Go ahead': '继续', 'Go ahead.': '继续。',
  'Ignore': '忽略', 'Ignore.': '忽略。',
  'Ignore it': '忽略', 'Ignore it.': '忽略。',
  'Ignore him': '不理他',
  'Do not': '不要', 'Do not.': '不要。',
  "Let's go": '出发吧', "Let's go!": '出发吧！',
  'Yes, please': '好的，请', 'Yes, please.': '好的，请。',
  'Yes, I do': '是的', 'Yes, I do.': '是的。',
  'Pass': '跳过', 'Pass.': '跳过。',
  'Enter': '进入', 'Exit': '退出',
  'Maybe next time': '下次吧', 'Maybe next time.': '下次吧。',
  'Nope': '不', 'Nope.': '不。',
  'No way': '不可能', 'No way.': '不可能。',
  'Leave it': '算了', 'Leave it.': '算了。',
  "I'm ready": '我准备好了', "I'm ready.": '我准备好了。',
  'Keep reading': '继续读', 'Keep reading.': '继续读。',
  'Stop reading': '停止阅读', 'Stop reading.': '停止阅读。',
  'Pull': '拉', 'Push': '推',
  'Setting': '设置',
  'Look at items': '看看物品', 'Look at items.': '看看物品。',
  'Gather Items': '收集物品',
  'I want to buy something': '我想买东西',

  // Warper 菜单
  'Last Warp': '上次传送',
  'Previous Menu': '上一页菜单',
  'Next Page': '下一页',
  'Remove Marks from Mini-Map': '移除小地图标记',

  // 城镇传送
  'Prontera': '普隆德拉', 'Alberta': '艾尔贝塔', 'Morocc': '梦罗克',
  'Geffen': '吉芬', 'Payon': '斐扬', 'Izlude': '伊斯鲁德',
  'Juno': '朱诺', 'Aldebaran': '艾尔帕兰',
};

const DialogTable = {
  // === Kafra 完整对话（multi-line mes 逐行翻译）===
  'Welcome to the': '欢迎光临',
  'Kafra Corporation.': '卡普拉公司。',
  'The Kafra Corporation': '卡普拉公司',
  'are always on your side.': '永远与您同在。',
  'is always working to provide': '一直在努力为您提供',
  'you with convenient services.': '便捷的服务。',
  'always ready to serve you.': '随时准备为您服务。',
  'with its excellent service. So': '以卓越的服务。请',
  "Kafra's Employees are": '卡普拉的员工',
  'The Kafra services': '卡普拉服务',
  "How can I help you today?": '今天有什么可以帮您的？',
  'How may I be of assistance?': '有什么可以帮您的？',
  'How may I assist you?': '有什么可以帮您的？',
  'what can I do for you today?': '今天有什么可以帮您的？',
  'What can I do for you?': '有什么可以帮您的？',
  'How can I help you?': '有什么可以帮您的？',
  'How may I help you?': '有什么可以帮您的？',
  'Is there anything else I can do for you?': '还有什么事需要我帮忙吗？',
  'Thank you for using the Kafra Services.': '感谢您使用卡普拉服务。',
  "We'll be seeing you.": '期待再次为您服务。',
  'Please come again.': '欢迎再次光临。',
  'using the Kafra Service': '使用卡普拉服务',

  // === Warper 传送对话 ===
  'Where would you like to go?': '你想去哪里？',
  'Would you like to check any other locations?': '还想查看其他地点吗？',
  'I can warp you to various locations.': '我可以传送你去各个地方。',
  "I'm sorry, but you don't": '抱歉，你没有',
  'have enough money to pay': '足够的钱支付',
  'the teleport fee is': '传送费用是',
  'teleport to this destination.': '传送到这个目的地。',
  'not have enough zeny to': '没有足够的 Zeny',
  'check your funds again.': '请再检查一下你的资金。',
  "I'm sorry, but you do": '抱歉，你',

  // === 通用对话 ===
  'Welcome!': '欢迎光临！',
  'Welcome.': '欢迎光临。',
  'Hello': '你好', 'Hello.': '你好。', 'Hello!': '你好！',
  'Hi': '你好', 'Hi!': '你好！',
  'Good day': '你好', 'Good day.': '你好。',
  'Thank you': '谢谢你', 'Thank you.': '谢谢你。',
  'Thanks': '谢谢', 'Thanks.': '谢谢。',
  'See you': '再见', 'See you.': '再见。',
  'See you later': '再见',
  'Bye': '再见', 'Bye.': '再见。',
  'Goodbye': '再见', 'Goodbye.': '再见。',
  'Farewell': '再见', 'Farewell.': '再见。',
  'Take care': '保重', 'Take care.': '保重。',
  'Come again': '再来啊', 'Come again.': '再来啊。',
  'Good luck': '祝你好运', 'Good luck.': '祝你好运。', 'Good luck!': '祝你好运！',
  'Congratulations': '恭喜', 'Congratulations.': '恭喜。', 'Congratulations!': '恭喜！',
  'Are you ready?': '准备好了吗？',
  'I understand': '我明白了', 'I understand.': '我明白了。',
  'Alright': '好的', 'Alright.': '好的。', 'Alright...': '好的...',
  'Okay': '好的', 'Okay.': '好的。', 'Okay...': '好的...',
  'Wait...': '请等一下...',
  'Wait a minute': '请等一下',
  'What do you want?': '你想干什么？',
  'Really?': '真的吗？',
  'No problem': '没问题', 'No problem.': '没问题。',
  'Excuse me': '打扰一下', 'Excuse me.': '打扰一下。', 'Excuse me...': '打扰一下...',
  'Who are you?': '你是谁？',
  'What happened?': '发生什么事了？',
  'I see': '我明白了', 'I see.': '我明白了。', 'I see...': '我明白了...',
  'Hmm': '嗯...', 'Hmm...': '嗯...',
  'Umm...': '嗯...', 'Ugh...': '呃...',
  'Huh?': '嗯？', 'Oh...!': '哦...！', 'Oh...?': '哦...？',
  'What?!': '什么？！',
  'Do you need additional directions?': '需要更多指引吗？',
  "There's a small lever. Will you pull it?": '这里有个小拉杆。要拉一下吗？',
  'If you change your mind, please come back.': '如果你改变主意，请回来。',
  'Merry Christmas!': '圣诞快乐！',
  'An unknown error has occurred.': '发生未知错误。',
  'Please try again': '请再试一次',
  'Please try again.': '请再试一次。',
  'What are you talking about?': '你在说什么？',

  // === 元素/属性 ===
  'Fire': '火', 'Wind': '风', 'Earth': '地', 'Water': '水',
  'Scissors': '剪刀', 'Rock': '石头', 'Paper': '布',
};

function translateMenuOption(option) {
  const trimmed = option.trim();
  return MenuOptionTable[trimmed] || option;
}

function translateDialog(text) {
  const trimmed = text.trim();
  if (DialogTable[trimmed]) return DialogTable[trimmed];
  for (const [en, zh] of Object.entries(DialogTable)) {
    if (trimmed.startsWith(en)) {
      return zh + trimmed.slice(en.length);
    }
  }
  return text;
}

function translateMenu(menu) {
  if (!menu || typeof menu !== 'string') return menu;
  return menu.split(':').map(translateMenuOption).join(':');
}

export { translateMenu, translateDialog, translateMenuOption };
