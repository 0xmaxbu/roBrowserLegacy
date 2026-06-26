/**
 * DB/Map/MapTable.js
 *
 * Look up table mapname
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */

const MapInfo = {
	'1@gol1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Biological Experiment Center',
			subTitle: 'Expedition'
		},
		notifyEnter: true,
		displayName: '生物实验楼'
	},
	'1@tnm1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Demon's Tower - Upper floor"
		},
		notifyEnter: true,
		displayName: "Demon's Tower - Upper floor"
	},
	'gld_dun01_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon Underground F2',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '公会地下密穴 2层'
	},
	'ra_temin.rsw': {
		displayName: '神殿内部'
	},
	'1@lhz.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Wolfchev's Lab"
		},
		notifyEnter: true,
		displayName: "Wolfchev's Lab"
	},
	'pvp_n_4-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'verus01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Laboratory-OPTATIO',
			subTitle: 'Verus City'
		},
		notifyEnter: true,
		displayName: '实验楼-OPTATIO'
	},
	'payon_in03.rsw': {
		displayName: '山岳之都 斐扬'
	},
	'job3_rune02.rsw': {
		displayName: '符文骑士转职考场'
	},
	'hero_lb.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Garden of Beginnings',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚初始庭园'
	},
	'rag_fes_a.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'RAG-FES Exhibition Hall',
			subTitle: 'Ragnarok Festival'
		},
		notifyEnter: true,
		displayName: 'RAG-FES Exhibition Hall'
	},
	'1@gl_he2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Incomplete Dimensions',
			subTitle: 'Event Mode'
		},
		notifyEnter: true,
		displayName: 'Event Mode Incomplete Dimensions'
	},
	'lhz_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: "Grim Reaper's Valley",
			subTitle: 'Lighthalzen Field'
		},
		notifyEnter: true,
		displayName: "Lighthalzen Field(Grim Reaper's Valley)"
	},
	've_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	'ra_san02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary West Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: '拉赫 神殿圣域1层 西边地区'
	},
	'hero_tra.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Training Grounds',
			subTitle: 'Sanctuary Herosria'
		},
		notifyEnter: true,
		displayName: '圣域希罗斯里亚训练场'
	},
	'1@xm_d2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Horror Toy Factory'
		},
		notifyEnter: true,
		displayName: 'Horror Toy Factory'
	},
	'te_prtcas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Wigner Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Wigner Castle'
	},
	'lou_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Suei Long Gon'
		},
		notifyEnter: true,
		displayName: '龙之城 审良宫'
	},
	'pvp_n_2-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'dew_in01.rsw': {
		displayName: '贾提族部落 内部'
	},
	'ayo_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Inside Ancient Shrine'
		},
		notifyEnter: true,
		displayName: '哎哟泰雅 古代神殿内部'
	},
	'star_frst.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Yu Seong Lim'
		},
		notifyEnter: true,
		displayName: '流星林'
	},
	'1@bamq.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Unfair Dock'
		},
		notifyEnter: true,
		displayName: '飞空艇机场'
	},
	'1@def03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Lava',
			subTitle: 'Wave Dungeon'
		},
		notifyEnter: true,
		displayName: 'Wave Dungeon - Lava'
	},
	'wolfvill.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Gray Wolf Village',
			subTitle: 'Native Hidout'
		},
		notifyEnter: true,
		displayName: '灰狼村'
	},
	'tur_d03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Desolate Village',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: 'Desolate Village'
	},
	'mosk_ship.rsw': {
		displayName: '船舶'
	},
	'1@vrev.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Amykitia's Secret Lab",
			subTitle: 'Fantasy Series-003'
		},
		notifyEnter: true,
		displayName: "Fantasy Series-Amykitia's Secret Lab"
	},
	'te_prtcas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Nerius Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Nerius Castle'
	},
	'mjolnir_04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 北边地区'
	},
	'gon_test.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Kunlun Fighting Ground'
		},
		notifyEnter: true,
		displayName: '昆仑 战斗场'
	},
	'bra_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Beyond the Waterfall',
			subTitle: 'Brasilis'
		},
		notifyEnter: true,
		displayName: '巴西瀑布里 洞穴内部'
	},
	'xmas.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Lutie',
			subTitle: 'Snow Village'
		},
		notifyEnter: true,
		displayName: '白雪村落 姜饼城'
	},
	'iz_ac02_a.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F2'
		},
		notifyEnter: true,
		displayName: '魔法学院 2层'
	},
	'jor_back4.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Beach'
		},
		notifyEnter: true,
		displayName: 'Frozen Scale Beach'
	},
	'vis_h02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Investigation Corridor F2'
		},
		notifyEnter: true,
		displayName: 'Investigation Corridor F2'
	},
	'ma_zif09.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'rockmi1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Rockridge Mine F1'
		},
		notifyEnter: true,
		displayName: '洛克里奇矿山'
	},
	'jor_back6.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Ancient Ice Canyon West'
		},
		notifyEnter: true,
		displayName: 'Ancient Ice Canyon West'
	},
	'aru_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Valfreyja',
			subTitle: 'Rachel'
		},
		notifyEnter: true,
		displayName: '发菲依雅公会'
	},
	'ordeal_2-2.rsw': {
		displayName: '团体战斗模式'
	},
	'arug_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Mardol Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: '发菲依雅公会'
	},
	'tha_t11.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Despair',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层 绝望之房'
	},
	'1@4sac.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Shadow Mension'
		},
		notifyEnter: true,
		displayName: '影宅'
	},
	'lou_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Inside the Royal Tomb'
		},
		notifyEnter: true,
		displayName: '龙之城王陵 内部'
	},
	'priest_1-1.rsw': {
		displayName: '牧师转职所'
	},
	'1@md_pay.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Weekend Memorial'
		},
		notifyEnter: true,
		displayName: 'Weekend Memorial'
	},
	'ra_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Od Canyon'
		},
		notifyEnter: true,
		displayName: '拉赫欧兹峡谷'
	},
	'iz_d05_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Deep Sea Cave'
		},
		notifyEnter: true,
		displayName: '深渊海底洞穴下层'
	},
	'1@4inq.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Monastery Basement'
		},
		notifyEnter: true,
		displayName: '修道院地下'
	},
	'pvp_y_4-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'1@vrhha.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Heart Hunter Training Center',
			subTitle: 'Fantasy Series-008'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series - Heart Hunter Training Center'
	},
	'1@tnm3.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Morocc Castle - Basement'
		},
		notifyEnter: true,
		displayName: '梦罗克城地下'
	},
	'aldebaran.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Aldebaran',
			subTitle: 'Border City in the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '运河之都 艾尔帕兰'
	},
	'3@ch_t.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Constellation Tower'
		},
		notifyEnter: true,
		displayName: 'Constellation Tower'
	},
	'2@ch_t.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Constellation Tower'
		},
		notifyEnter: true,
		displayName: 'Constellation Tower'
	},
	'1@ch_t.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Constellation Tower'
		},
		notifyEnter: true,
		displayName: 'Constellation Tower'
	},
	'pvp_y_2-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'yuno_in05.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Power Plant of Ymir's Heart"
		},
		notifyEnter: true,
		displayName: "Power Plant of Ymir's Heart"
	},
	'1@bamn.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Twilight Garden'
		},
		notifyEnter: true,
		displayName: '暮光庭院'
	},
	'pvp_n_8-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'pvp_n_1-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'jor_root3.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Deep Root Cave'
		},
		notifyEnter: true,
		displayName: 'Deep Root Cave'
	},
	'mag_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Nogg Road F3'
		},
		notifyEnter: true,
		displayName: '朱诺 诺可罗德 3层'
	},
	'ayo_in02.rsw': {
		displayName: '哎哟泰雅 内部'
	},
	'pvp_n_6-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'yuno_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Schwartzwald Guards Camp'
		},
		notifyEnter: true,
		displayName: '秀发兹发德 警备队露营地'
	},
	'prt_fild08a.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'South Field of Prontera'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'bat_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Battlegrounds Waiting Room'
		},
		notifyEnter: true,
		displayName: '战场等候室'
	},
	'jor_twig.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: "Twig's Nest",
			subTitle: 'Isgard Sanctuary'
		},
		notifyEnter: true,
		displayName: "Isgard Sanctuary Twig's Nest"
	},
	'job_soul.rsw': {
		displayName: '灵魂之地'
	},
	'pvp_y_6-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'1@swat.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Heart Hunter Military Base'
		},
		notifyEnter: true,
		displayName: '邪心猎人军事基地'
	},
	'lasa_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Dragon Nest F1'
		},
		notifyEnter: true,
		displayName: '龙巢穴'
	},
	'dic_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Scaraba Hole',
			subTitle: 'Kamidal Tunnel'
		},
		notifyEnter: true,
		displayName: '斯卡勒伯熔岩'
	},
	'pvp_y_5-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'pvp_c_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Waiting Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 等候室'
	},
	'hero_in3.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Fall Garden',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚秋季庭园'
	},
	'1@def01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Forest',
			subTitle: 'Wave Dungeon'
		},
		notifyEnter: true,
		displayName: 'Wave Dungeon - Forest'
	},
	'1@mjo1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Airplane Crash Site',
			subTitle: 'Mjolnir Mountains'
		},
		notifyEnter: true,
		displayName: 'Mjolnir Mountains - Airplane Crash Site'
	},
	'1@cata.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Catacombs'
		},
		notifyEnter: true,
		displayName: '地下墓穴'
	},
	'2@cata.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Sealed Shrine'
		},
		notifyEnter: true,
		displayName: '封印的神殿'
	},
	'ba_2whs02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Lower Floor of Tartaros Storage'
		},
		notifyEnter: true,
		displayName: '塔尔塔罗斯储藏室下层'
	},
	'pvp_n_6-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'bra_in01.rsw': {
		displayName: '巴西内部'
	},
	'gef_fild00.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'prtg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Skoegul Castle',
			subTitle: 'Valkyrie Realm'
		},
		notifyEnter: true,
		displayName: '瓦尔基里雷恩 公会'
	},
	'1@ghg.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Orthos Aqua',
			subTitle: 'Floating Garden'
		},
		notifyEnter: true,
		displayName: '水精灵奥尔图斯'
	},
	'gld_dun04_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon Underground F2',
			subTitle: 'Brittoria'
		},
		notifyEnter: true,
		displayName: '公会地下密穴 2层'
	},
	'payg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Bright Arbor Castle',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '青林湖泊 公会'
	},
	'prtg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Gondul Castle',
			subTitle: 'Valkyrie Realm'
		},
		notifyEnter: true,
		displayName: '瓦尔基里雷恩 公会'
	},
	'sec_in01.rsw': {
		displayName: '巴哈拉宫 内部'
	},
	'mosk_in.rsw': {
		displayName: '莫斯科比亚 内部'
	},
	'bl_venom.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Venom',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Venom'
	},
	'cmd_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Kokomo Beach',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 海边'
	},
	'1@cor.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Cor'
		},
		notifyEnter: true,
		displayName: '柯尔记忆副本'
	},
	'pay_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'1@exnw.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Clana Nemieri'
		},
		notifyEnter: true,
		displayName: '夜巡者转职考试地点'
	},
	'moc_fild18.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'job_sage.rsw': {
		displayName: '贤者转职考场'
	},
	'job_gun.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Shelter of Rebellion'
		},
		notifyEnter: true,
		displayName: '解放的休憩区'
	},
	'1@ffp.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Remnant Hideout'
		},
		notifyEnter: true,
		displayName: 'Remnant Hideout'
	},
	'te_prtcas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Richard Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Richard Castle'
	},
	'gef_d01_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '250 Pages',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: '第250页'
	},
	've_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	'c_tower4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower F4',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰 钟塔上层 4层'
	},
	'ra_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Audumla Grassland'
		},
		notifyEnter: true,
		displayName: '拉赫 奥顿拉草原'
	},
	'ra_san05.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary Central Area 2F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: '拉赫 神殿圣域2层 中央地区'
	},
	'hero_ent3.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: "3rd Hero's Gateway",
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: "Herosria 3rd Hero's Gateway"
	},
	'harboro2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Waterway',
			subTitle: 'Rockridge'
		},
		notifyEnter: true,
		displayName: '地下水道'
	},
	'prt_elib.rsw': {
		backgroundBmp: 'village_s1',
		signName: {
			subTitle: 'Prontera East Library'
		},
		notifyEnter: true,
		displayName: 'Prontera East Library'
	},
	'iz_ac01.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F1'
		},
		notifyEnter: true,
		displayName: '魔法学院 1层'
	},
	'gef_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'1@eom.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Shrine of Demon God'
		},
		notifyEnter: true,
		displayName: '魔神殿'
	},
	'1@exsh.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Deep Forest'
		},
		notifyEnter: true,
		displayName: '深邃的森林'
	},
	'z_agit.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Z Gang's Hideout"
		},
		notifyEnter: true,
		displayName: "Z Gang's Hideout"
	},
	'kh_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Robot Factory F2'
		},
		notifyEnter: true,
		displayName: '机械娃娃工厂 2层'
	},
	'ma_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bangungot Hospital F1'
		},
		notifyEnter: true,
		displayName: '噩梦医院 1层'
	},
	'thor_camp.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Thor Volcano Camp'
		},
		notifyEnter: true,
		displayName: '伯仁斯托尔火山 后勤基地'
	},
	'1@exds.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Foot of Mt. Mumyeong'
		},
		notifyEnter: true,
		displayName: '无名山山脚'
	},
	'2@exds.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Foot of Mt. Mumyeong'
		},
		notifyEnter: true,
		displayName: '无名山山脚'
	},
	'lhz_in03.rsw': {
		displayName: '里希塔乐镇 内部'
	},
	'turbo_e_16.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'job3_arch01.rsw': {
		displayName: '大主教转职等候室'
	},
	'prt_monk.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'St. Capitolina Abbey'
		},
		notifyEnter: true,
		displayName: '圣●卡毕利那 修道院'
	},
	'odin_tem02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: "Odin's Temple South Area"
		},
		notifyEnter: true,
		displayName: "Odin's Temple South Area"
	},
	'new_1-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'mjolnir_06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir South Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 南边地区'
	},
	'schg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Hljod Castle',
			subTitle: 'Nidhoggur'
		},
		notifyEnter: true,
		displayName: '尼它堆公会'
	},
	'prt_sewb4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Culvert F4',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉地下水道 4层'
	},
	'jor_back5.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Ancient Ice Canyon East'
		},
		notifyEnter: true,
		displayName: 'Ancient Ice Canyon East'
	},
	'ra_fild12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Ida Plains'
		},
		notifyEnter: true,
		displayName: '拉赫 伊达 旷野'
	},
	'tha_t08.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Angel',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层 天使之房'
	},
	'gefg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Bergel Castle',
			subTitle: 'Britoniah'
		},
		notifyEnter: true,
		displayName: '咘哩妥利亚 公会'
	},
	'ra_fild10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Od Canyon'
		},
		notifyEnter: true,
		displayName: '拉赫欧兹峡谷'
	},
	'que_temsky.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Sky Garden',
			subTitle: "Pope's Room"
		},
		notifyEnter: true,
		displayName: "Pope's Room (Sky Garden"
	},
	'pvp_y_2-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'1@dth1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Bios Island'
		},
		notifyEnter: true,
		displayName: '拜欧斯岛'
	},
	'gefg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Repherion Castle',
			subTitle: 'Britoniah'
		},
		notifyEnter: true,
		displayName: '咘哩妥利亚 公会'
	},
	'1@halo.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Halloween Festival'
		},
		notifyEnter: true,
		displayName: 'Halloween Festival'
	},
	'com_d02_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Luanda, the North Cave',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: '北边洞穴 卢安达'
	},
	'job_monk.rsw': {
		displayName: '圣●卡毕利那 修道院'
	},
	'lasagna.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Lasagna',
			subTitle: 'Far-Star Continental Port Town'
		},
		notifyEnter: true,
		displayName: '港口都市 罗札纳'
	},
	'iz_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B5',
			subTitle: 'Baylan Island'
		},
		notifyEnter: true,
		displayName: '依斯鲁得海底洞穴 5层'
	},
	'2@gl_k2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Chivalry F1',
			subTitle: 'Old Glastheim'
		},
		notifyEnter: true,
		displayName: 'Old Glastheim Chivalry F1'
	},
	'prtg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Swanhild Castle',
			subTitle: 'Valkyrie Realm'
		},
		notifyEnter: true,
		displayName: '瓦尔基里雷恩 公会'
	},
	'1@soul.rsw': {
		displayName: '灵魂的通道'
	},
	'1@sthd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Air Fortress - Top Floor'
		},
		notifyEnter: true,
		displayName: '空中要塞最顶层'
	},
	'pvp_n_5-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'bl_death.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Death',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Death'
	},
	'nameless_i.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Nameless Island Entrance'
		},
		notifyEnter: true,
		displayName: '无名岛'
	},
	'pay_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Greenwood Lake',
			subTitle: 'Payon'
		},
		notifyEnter: true,
		displayName: '青林湖泊'
	},
	'kh_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Robot Factory F1'
		},
		notifyEnter: true,
		displayName: '机械娃娃工厂 1层'
	},
	'xmas_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Toy Factory Warehouse',
			subTitle: 'Lutie'
		},
		notifyEnter: true,
		displayName: '姜饼城 玩具工厂仓库'
	},
	'alberta_in.rsw': {
		displayName: '港口之都 艾尔贝塔'
	},
	'prt_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'pvp_n_1-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'dic_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Bottom of Kamidal Mountain',
			subTitle: 'Jotunheim'
		},
		notifyEnter: true,
		displayName: '卡米达山麓'
	},
	'ra_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Ida Plains'
		},
		notifyEnter: true,
		displayName: '拉赫 伊达平原'
	},
	'1@mist.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'The Hazy Maze Forest'
		},
		notifyEnter: true,
		displayName: '迷雾森林'
	},
	'moc_pryd04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid F4',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 4层'
	},
	'gld_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Britoniah'
		},
		notifyEnter: true,
		displayName: '公会地下密穴'
	},
	'verus03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Central Plaza',
			subTitle: 'Verus City'
		},
		notifyEnter: true,
		displayName: '贝鲁兹 中央广场'
	},
	'niflheim.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Niflheim',
			subTitle: 'Realm of the Dead'
		},
		notifyEnter: true,
		displayName: '亡者国度 尼芙菲姆'
	},
	'guild_vs3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Guild Arena'
		},
		notifyEnter: true,
		displayName: '公会对抗竞技场'
	},
	'pvp_y_8-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'6@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Memory of Despair',
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '绝望的记忆'
	},
	'5@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Memory of Sadness',
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '悲哀的记忆'
	},
	'8@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Magician Thanatos' Memory",
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '达纳托斯塔'
	},
	'7@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Memories of Anger',
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '愤怒的记忆'
	},
	'2@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Angel's Warning",
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: "Angel's Warning"
	},
	'1@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Thanatos Tower',
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '达纳托斯塔'
	},
	'4@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Memory of Agony',
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '苦恼的记忆'
	},
	'3@thts.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Hateful Memories',
			subTitle: 'Thanatos Memory'
		},
		notifyEnter: true,
		displayName: '憎恨的记忆'
	},
	'jor_maze.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Snake Labyrinth'
		},
		notifyEnter: true,
		displayName: 'Snake Labyrinth'
	},
	'schg_que01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Morestone Prairie'
		},
		notifyEnter: true,
		displayName: '莫尔斯敦草地'
	},
	'job_thief1.rsw': {
		displayName: '盗贼转职所'
	},
	'rockrdg1.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Kiwawa Desert',
			subTitle: 'Rockridge'
		},
		notifyEnter: true,
		displayName: '契瓦瓦沙漠'
	},
	'gl_cas01_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Castle F1',
			subTitle: 'Abyss Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城深渊1层'
	},
	'moc_fild19.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'lasa_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Ravioli Plain, Border Post',
			subTitle: 'Lasagna'
		},
		notifyEnter: true,
		displayName: '罗比奥平原岗亭'
	},
	'air_if.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Inside the Aircraft Ifho'
		},
		notifyEnter: true,
		displayName: '飞空艇伊夫号内部'
	},
	'1@tre.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Suspicious Shipwreck'
		},
		notifyEnter: true,
		displayName: 'Suspicious Shipwreck'
	},
	'abyss_02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Cave 2F',
			subTitle: 'Abyss Lake'
		},
		notifyEnter: true,
		displayName: '毀葛深渊湖水 地下洞穴2层'
	},
	'ma_zif02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'jor_twice.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Drift Ice Zone'
		},
		notifyEnter: true,
		displayName: 'Drift Ice Zone'
	},
	'1@vrcas.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Lilium Palace',
			subTitle: 'Fantasy Series-001'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series-Lilium Palace'
	},
	'auction_02.rsw': {
		displayName: '拍卖场'
	},
	'hero_in2.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Summer Garden',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚夏季庭园'
	},
	'pvp_n_3-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'1@lvcb.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Damp Sewer',
			subTitle: 'Fantasy Series-xxx'
		},
		notifyEnter: true,
		displayName: 'Damp Sewer'
	},
	'ordeal_1-2.rsw': {
		displayName: '团体战斗模式'
	},
	'poring_w02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Poring War Market'
		},
		notifyEnter: true,
		displayName: '波利大战场'
	},
	'ma_zif06.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'ein_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Einbroch Mine F2'
		},
		notifyEnter: true,
		displayName: '艾音贝赫矿山 2层'
	},
	'ama_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Battle Field in the Underground Forest'
		},
		notifyEnter: true,
		displayName: '樱花城 地下森林战场'
	},
	'job_knt.rsw': {
		displayName: '骑士转职考场'
	},
	'pvp_n_4-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'mjolnir_01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 北边地区'
	},
	'gonryun.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Gonryun(Kunlun)',
			subTitle: 'Hermit Land'
		},
		notifyEnter: true,
		displayName: '神仙之岛 昆仑'
	},
	'bat_c02.rsw': {
		notifyEnter: true,
		displayName: '克里格·冯·米德加尔特'
	},
	'1@twsd.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Drift Ice Zone'
		},
		notifyEnter: true,
		displayName: 'Drift Ice Zone'
	},
	'icas_in2.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Inside the Ice Castle'
		},
		notifyEnter: true,
		displayName: 'Inside the Ice Castle'
	},
	'dic_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Scaraba Hall',
			subTitle: 'Kamidal Tunnel'
		},
		notifyEnter: true,
		displayName: '斯卡勒伯熔岩'
	},
	'pay_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'cmd_fild03.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Zenhai Marsh',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 基乃依沼泽地'
	},
	'mjolnir_10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir South Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 南边地区'
	},
	'job4_mag.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Magic Fountain'
		},
		notifyEnter: true,
		displayName: '魔力之泉'
	},
	'moc_fild20.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Dimensional Rift',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠 次元裂缝'
	},
	'teg_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Underground Dungeon',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Guild Underground Dungeon'
	},
	'dali02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Dimensional Rift'
		},
		notifyEnter: true,
		displayName: '次元裂缝'
	},
	'hu_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Hugel Field'
		},
		notifyEnter: true,
		displayName: '毁葛 旷野'
	},
	'ma_in01.rsw': {
		displayName: '马来亚 市内'
	},
	'gef_fild10.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Orc Village',
			subTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '东边 兽人村落'
	},
	'prt_maze03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Labyrinth Forest F3',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉北部森林 密穴3层'
	},
	'dew_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Istana Cave',
			subTitle: 'Dewata'
		},
		notifyEnter: true,
		displayName: '伊斯坦纳洞穴'
	},
	'ba_in01.rsw': {
		displayName: "Inside the Varmundt's Mansion"
	},
	'pvp_y_2-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'wizard_2-1.rsw': {
		displayName: '巫师转职所'
	},
	'amicitia2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '2nd Floor - Intensive Culture Room',
			subTitle: 'Abandoned Lab Amicitia'
		},
		notifyEnter: true,
		displayName: '废弃研究所阿米希提娅'
	},
	'1@vrgen.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Genetic Labs',
			subTitle: 'Fantasy Series-004'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series-Genetic Labs'
	},
	'guild_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Guild Arena Waiting Room'
		},
		notifyEnter: true,
		displayName: '公会对抗竞技场 休息室'
	},
	'bl_lava.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Flame',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Flame'
	},
	'kh_school.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Kiel Hyre's Academy"
		},
		notifyEnter: true,
		displayName: "Kiel Hyre's Academy"
	},
	'malaya.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Port Malaya'
		},
		notifyEnter: true,
		displayName: '马来亚港'
	},
	'alberta.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Alberta',
			subTitle: 'Port City of Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '港口之都 艾尔贝塔'
	},
	'ra_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Portus Luna'
		},
		notifyEnter: true,
		displayName: '珀尔特鲁纳'
	},
	'tur_dun04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Turtle Palace'
		},
		notifyEnter: true,
		displayName: '乌龟岛  密穴'
	},
	'jupe_gate.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos, Restricted Zone'
		},
		notifyEnter: true,
		displayName: '优配擂斯保安旷野'
	},
	'mal_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Starry Coral Area'
		},
		notifyEnter: true,
		displayName: '星光珊瑚 地区'
	},
	'pvp_y_7-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'gl_knt01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Chivalry F1',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 骑士团1层'
	},
	'gl_sew02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Waterway B2',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下水道2层'
	},
	'prt_maze02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Labyrinth Forest F2',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉北部森林 密穴2层'
	},
	'moc_fild13.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'thana_boss.rsw': {
		displayName: '达纳托斯之塔 (未知旷野)'
	},
	'ra_temsky.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Sky Garden',
			subTitle: "Pope's Room"
		},
		notifyEnter: true,
		displayName: "Pope's Room (Sky Garden)"
	},
	'knight_3-1.rsw': {
		displayName: '骑士转职所'
	},
	'job_cru.rsw': {
		displayName: '十字军 转职考场'
	},
	'gw_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Gray Wolf Forest'
		},
		notifyEnter: true,
		displayName: '灰狼森林'
	},
	'eclage.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Eclage',
			subTitle: 'Alfheim - Lapine Capital'
		},
		notifyEnter: true,
		displayName: '守护精灵首都 埃克拉珠'
	},
	'einbech.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Einbech',
			subTitle: 'Mining Village in the Schwartzwald Republic'
		},
		notifyEnter: true,
		displayName: '采矿村落 艾音贝赫'
	},
	'verus02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Research Building-WISH',
			subTitle: 'Verus City'
		},
		notifyEnter: true,
		displayName: '研究楼-WISH'
	},
	'tur_dun05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Underground Swamp Zone'
		},
		notifyEnter: true,
		displayName: '地下沼泽区'
	},
	'1@ma_b.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bakonawa Hideout'
		},
		notifyEnter: true,
		displayName: '食月者的藏身处'
	},
	'c_tower3_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower F3',
			subTitle: 'The Twisted Time'
		},
		notifyEnter: true,
		displayName: '梦魇钟塔 3层'
	},
	'1@infi.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Infinite Space'
		},
		notifyEnter: true,
		displayName: '无限空间'
	},
	'1@dime.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Beyond the Dimension Wall'
		},
		notifyEnter: true,
		displayName: 'Beyond the Dimension Wall'
	},
	'tha_t09.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Agony',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层 苦恼之房'
	},
	'1@exhn.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: "Novice's Memory"
		},
		notifyEnter: true,
		displayName: "Novice's Memory"
	},
	'moc_fild21.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Dimensional Rift',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠 次元裂缝'
	},
	'amicitia1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: '1st Floor - Comprehensive Lab',
			subTitle: 'Abandoned Lab Amicitia'
		},
		notifyEnter: true,
		displayName: '废弃研究所阿米希提娅'
	},
	'man_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Manuk Field'
		},
		notifyEnter: true,
		displayName: '马努克 旷野'
	},
	'clock_01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Unknown Basement',
			subTitle: 'Clock Tower'
		},
		notifyEnter: true,
		displayName: '钟塔：未知的地下层'
	},
	'jor_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Snake God's Warmth 1st Floor"
		},
		notifyEnter: true,
		displayName: "Snake God's Warmth 1st Floor"
	},
	'bossnia_04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: '波斯尼亚'
	},
	'icecastle.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Ice Castle',
			subTitle: 'Isgard'
		},
		notifyEnter: true,
		displayName: '伊斯加尔特冰封之城'
	},
	'1@os_a.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Occupied Battle'
		},
		notifyEnter: true,
		displayName: '占领欧斯大作战'
	},
	'guild_vs2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Guild Arena'
		},
		notifyEnter: true,
		displayName: '公会对抗竞技场'
	},
	'izlude_in.rsw': {
		displayName: '依斯鲁得 内部'
	},
	'new_5-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'nif_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Dead Man's Banquet Hall",
			subTitle: 'Niflheim Dungeon - 1st Floor'
		},
		notifyEnter: true,
		displayName: "Niflheim Dungeon - Dead Man's Banquet Hall"
	},
	'moc_pryd03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid F3',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 3层'
	},
	'jor_tail.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Tail'
		},
		notifyEnter: true,
		displayName: '冰鳞尽头'
	},
	'yuno_in03.rsw': {
		displayName: '朱诺 内部'
	},
	'pvp_y_1-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'geffen.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Geffen',
			subTitle: 'Magic City in the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '魔法之都 吉芬'
	},
	'bat_a01.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Tierra Valley',
			subTitle: 'Battleground'
		},
		notifyEnter: true,
		displayName: '提耶拉峡谷'
	},
	've_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	've_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	'aldeg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Rothenburg Castle',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: '露依纳公会'
	},
	'cmd_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Fortress Saint Darmain (South'
		},
		notifyEnter: true,
		displayName: '要塞都市 山特乐曼 南边地区'
	},
	'ra_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Ida Plains'
		},
		notifyEnter: true,
		displayName: '拉赫 伊达平原'
	},
	'man_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Manuk Field'
		},
		notifyEnter: true,
		displayName: '马努克 旷野'
	},
	'dew_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Tribal Village',
			subTitle: 'Dewata'
		},
		notifyEnter: true,
		displayName: '德瓦他旷野 贾提族部落'
	},
	'1@os_b.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Sealed OS'
		},
		notifyEnter: true,
		displayName: '封锁的欧斯'
	},
	'priest_2-1.rsw': {
		displayName: '牧师转职所'
	},
	'ant_d02_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Garden of Awareness',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: 'Garden of Awareness'
	},
	'alde_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower B4',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰钟塔 地下4层'
	},
	'job3_arch02.rsw': {
		displayName: '奥丁神殿'
	},
	'man_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Manuk Mining Camp'
		},
		notifyEnter: true,
		displayName: '马努克 旷野'
	},
	'new_4-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'ecl_fild01.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Blooming Flower Land'
		},
		notifyEnter: true,
		displayName: '花开伊始的大地'
	},
	'job3_rune03.rsw': {
		displayName: '符文骑士转职考场'
	},
	'treasure_n1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Izlude Shipwreck B1'
		},
		notifyEnter: true,
		displayName: '依斯鲁得遇难船 1层'
	},
	'1@lost.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Farm of Forgotten Time',
			subTitle: 'Lost Valley'
		},
		notifyEnter: true,
		displayName: '被时间遗忘的饲养场'
	},
	'pvp_n_3-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'1@exsr.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Inner World'
		},
		notifyEnter: true,
		displayName: '内心世界'
	},
	'iz_ac02_d.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F2'
		},
		notifyEnter: true,
		displayName: '魔法学院 2层'
	},
	'1@vrac1.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Critura Academy 1st Floor',
			subTitle: 'Fantasy Series'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series - Academy 1st Floor'
	},
	'treasure01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sunken Ship B1',
			subTitle: 'Alberta'
		},
		notifyEnter: true,
		displayName: '艾尔贝塔沉船 1层'
	},
	'que_qaru04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'gl_prison.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Prison B1',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下监狱1层'
	},
	'1@rev.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Morse Cave'
		},
		notifyEnter: true,
		displayName: '死亡洞穴'
	},
	'anthell01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Ant Hell Dungeon F1',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '蚂蚁地狱密穴 1层'
	},
	'ayo_in01.rsw': {
		displayName: '哎哟泰雅 内部'
	},
	'gl_sew01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Waterway B1',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下水道1层'
	},
	'1@sthc.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Air Fortress - Secret Chamber'
		},
		notifyEnter: true,
		displayName: '空中要塞神秘的房间'
	},
	'ecl_tdun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bifrost Tower 3F'
		},
		notifyEnter: true,
		displayName: '彩虹桥高塔 3层'
	},
	'gef_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffen Dungeon B2'
		},
		notifyEnter: true,
		displayName: '吉芬 地下密穴 1层'
	},
	'1@gol2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Body Storage',
			subTitle: 'Expedition'
		},
		notifyEnter: true,
		displayName: '停尸房'
	},
	'que_thr.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Inside Thor Volcano'
		},
		notifyEnter: true,
		displayName: '托尔火山内部'
	},
	'prt_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'pay_dun00.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Payon Cave F1',
			subTitle: 'Payon Archer Village'
		},
		notifyEnter: true,
		displayName: '斐扬洞穴 1层'
	},
	'que_qaru02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'lhz_in02.rsw': {
		displayName: '里希塔乐镇 内部'
	},
	'hero_in1.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Spring Garden',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚春季庭园'
	},
	'slabw01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Werner Research Institute'
		},
		notifyEnter: true,
		displayName: '维尔纳研究所'
	},
	'harboro1.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Rockridge'
		},
		notifyEnter: true,
		displayName: '洛克里奇'
	},
	'orcsdun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Orc Dungeon F2',
			subTitle: 'Orc Village'
		},
		notifyEnter: true,
		displayName: '吉芬 兽人地下洞穴 2层'
	},
	'himinn.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Valkyrie Hall'
		},
		notifyEnter: true,
		displayName: '瓦尔基里 神殿'
	},
	'pvp_2vs2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Event Coliseum'
		},
		notifyEnter: true,
		displayName: 'PvP : 活动 竞技场'
	},
	'new_1-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'prt_prison.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Dungeon',
			subTitle: 'Prontera Castle'
		},
		notifyEnter: true,
		displayName: '普隆德拉地下监狱'
	},
	'1@rgsr.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Regenshir',
			subTitle: 'Research Institute'
		},
		notifyEnter: true,
		displayName: '雷根修芦'
	},
	'moscovia.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Moscovia'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚'
	},
	'nyd_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Yggdrasil Root F2'
		},
		notifyEnter: true,
		displayName: '辉煌残暴者的伤口 2层'
	},
	'1@orcs.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Orc Underground Cave'
		},
		notifyEnter: true,
		displayName: '兽人地下洞穴'
	},
	'2@orcs.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Orc Underground Cave'
		},
		notifyEnter: true,
		displayName: '兽人地下洞穴'
	},
	'que_rachel.rsw': {
		displayName: "Inside Freya's Temple"
	},
	'new_5-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'iz_ac01_b.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F1'
		},
		notifyEnter: true,
		displayName: '魔法学院 1层'
	},
	'iz_int03.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: '新手地图'
	},
	'1@jorchs.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Confused Snake's Nest"
		},
		notifyEnter: true,
		displayName: "Confused Snake's Nest"
	},
	'ama_in01.rsw': {
		displayName: '樱花城 内部'
	},
	'lasa_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Dragon Nest F3'
		},
		notifyEnter: true,
		displayName: '龙巢穴'
	},
	'prontera.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Prontera',
			subTitle: 'Capital of the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '卢恩 米德加兹王国 首都 普隆德拉'
	},
	'ra_pol01.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Power Twisted Plains'
		},
		notifyEnter: true,
		displayName: 'Power Twisted Plains'
	},
	'bl_ice.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Severe Cold',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Severe Cold'
	},
	'hero_dun1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'PvP Dungeon',
			subTitle: 'Sanctuary Herosria'
		},
		notifyEnter: true,
		displayName: '圣域希罗斯里亚PvP密穴'
	},
	'jor_nest.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: "Snake's Nest",
			subTitle: 'Rgan Hideout'
		},
		notifyEnter: true,
		displayName: "Snake's Nest"
	},
	'in_moc_16.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Sograt Desert',
			subTitle: 'Assassin Guild'
		},
		notifyEnter: true,
		displayName: '刺客 公会'
	},
	've_in02.rsw': {
		displayName: '伯仁斯 内部'
	},
	'gef_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Geffenia',
			subTitle: 'Geffen'
		},
		notifyEnter: true,
		displayName: '吉芬 地下密穴 3层'
	},
	'job3_rang02.rsw': {
		displayName: '游侠转职考场'
	},
	'1@jorlab.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Bagot Lab'
		},
		notifyEnter: true,
		displayName: '巴格的研究室'
	},
	'bossnia_02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: '波斯尼亚'
	},
	'verus04.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Residential Building-HOPE',
			subTitle: 'Verus - Excavation Site'
		},
		notifyEnter: true,
		displayName: '贝鲁兹考古地'
	},
	'job3_arch03.rsw': {
		displayName: '大主教转职等候室'
	},
	'ra_fild13.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Shore of Tears'
		},
		notifyEnter: true,
		displayName: '拉赫 眼泪海岸'
	},
	'gefg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Eeyorbriggar Castle',
			subTitle: 'Britoniah'
		},
		notifyEnter: true,
		displayName: '咘哩妥利亚 公会'
	},
	'job3_gen01.rsw': {
		displayName: '基因学者研究所'
	},
	'izlude_b.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Izlude',
			subTitle: 'Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '卫星都市 依斯鲁得'
	},
	'herosria.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Jewel Room',
			subTitle: 'Sanctuary Herosria'
		},
		notifyEnter: true,
		displayName: '圣域希罗斯里亚宝石之室'
	},
	'man_in01.rsw': {
		displayName: '马努克 内部'
	},
	'mosk_dun02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Temny Forest',
			subTitle: 'Moscovia'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚 森林深处'
	},
	'xmas_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Toy Monitoring Room',
			subTitle: 'Lutie'
		},
		notifyEnter: true,
		displayName: '姜饼城 玩具分类场'
	},
	'vis_h01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Investigation Corridor F1'
		},
		notifyEnter: true,
		displayName: 'Investigation Corridor F1'
	},
	'prt_fild08c.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'South Field of Prontera'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'te_prtcas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Geoborg Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Geoborg Castle'
	},
	'1@cash.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Octopus Cave'
		},
		notifyEnter: true,
		displayName: '章鱼洞穴'
	},
	'cave.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Cave Village'
		},
		notifyEnter: true,
		displayName: '洞穴村'
	},
	'1@vrac2.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Critura Academy 2nd Floor',
			subTitle: 'Fantasy Series'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series - Academy 2nd Floor'
	},
	'gef_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'silk_lair.rsw': {
		notifyEnter: true,
		displayName: "Python's Lair"
	},
	'xmas_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Lutie Field'
		},
		notifyEnter: true,
		displayName: '姜饼城 旷野'
	},
	'1@ma_h.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bangungot Hospital F2'
		},
		notifyEnter: true,
		displayName: '噩梦医院 2层'
	},
	'c_tower2_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower F2',
			subTitle: 'The Twisted Time'
		},
		notifyEnter: true,
		displayName: '梦魇钟塔 2层'
	},
	'que_qaru01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'1@drdo.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Legend of Dorado'
		},
		notifyEnter: true,
		displayName: 'Legend of Dorado'
	},
	'alde_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower B1',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰钟塔 地下1层'
	},
	'new_2-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'1@slw.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Central Room',
			subTitle: 'Werner Research Institute'
		},
		notifyEnter: true,
		displayName: '维尔纳研究所中枢室'
	},
	'hero_out3.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Bastitarium',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚沙漠之域'
	},
	'dic_in01.rsw': {
		displayName: '迪卡斯特内部'
	},
	'gl_knt02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Chivalry F1',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 骑士团2层'
	},
	'alb_ship.rsw': {
		displayName: '艾尔贝塔 船舶内部'
	},
	'gefg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Mersetzdeitz Castle',
			subTitle: 'Britoniah'
		},
		notifyEnter: true,
		displayName: '咘哩妥利亚 公会'
	},
	'mag_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Nogg Road F2'
		},
		notifyEnter: true,
		displayName: '朱诺 诺可罗德2层'
	},
	'arug_que01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Morestone Prairie'
		},
		notifyEnter: true,
		displayName: '莫尔斯敦草地'
	},
	'turbo_n_1.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'schg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Andlangr Castle',
			subTitle: 'Nidhoggur '
		},
		notifyEnter: true,
		displayName: '尼它堆公会'
	},
	'pvp_y_5-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'schg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Skidbladnir Castle',
			subTitle: 'Nidhoggur'
		},
		notifyEnter: true,
		displayName: '尼它堆公会'
	},
	'treasure02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sunken Ship B2',
			subTitle: 'Alberta'
		},
		notifyEnter: true,
		displayName: '艾尔贝塔沉船 2层'
	},
	'bl_depth1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Depth 1st Floor',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Depth 1st Floor'
	},
	'1@gef.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffen Magic Tournament'
		},
		notifyEnter: true,
		displayName: '吉芬魔法大赛'
	},
	'airport.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Airport'
		},
		notifyEnter: true,
		displayName: '艾音布罗克机场'
	},
	'lasa_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Dragon Nest F2'
		},
		notifyEnter: true,
		displayName: '龙巢穴'
	},
	'gld_dun03_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon Underground F2',
			subTitle: 'Valkyrie Realm'
		},
		notifyEnter: true,
		displayName: '公会地下密穴 2层'
	},
	'schg_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Schwartzwald'
		},
		notifyEnter: true,
		displayName: '公会地下密穴'
	},
	'ordeal_1-3.rsw': {
		displayName: '团体战斗模式'
	},
	'hu_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Hugel Field'
		},
		notifyEnter: true,
		displayName: '毁葛 旷野'
	},
	'thor_v03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Thor Volcano Dungeon 3F'
		},
		notifyEnter: true,
		displayName: '伯仁斯托尔火山 洞穴3层'
	},
	'1@4win.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Luluca Deep Forest'
		},
		notifyEnter: true,
		displayName: '噜噜卡森林'
	},
	'mjo_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Dead Pit F3',
			subTitle: 'North of Mt. Mjolnir'
		},
		notifyEnter: true,
		displayName: '妙勒尼废弃矿场 3层'
	},
	'pvp_n_2-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'pvp_y_2-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'1@ge_st.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffen Magic Tournament'
		},
		notifyEnter: true,
		displayName: '吉芬魔法大赛'
	},
	'1@nyd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Nidhoggr's Nest"
		},
		notifyEnter: true,
		displayName: "Nidhoggr's Nest"
	},
	'2@nyd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Nidhoggr's Nest"
		},
		notifyEnter: true,
		displayName: "Nidhoggr's Nest"
	},
	'pay_arche.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Archer Village',
			subTitle: 'Payon'
		},
		notifyEnter: true,
		displayName: '山岳之都 斐扬'
	},
	'ra_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Audumla Grassland'
		},
		notifyEnter: true,
		displayName: '拉赫 奥顿拉草原'
	},
	'new_3-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'tha_t03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Abandoned Place',
			subTitle: 'Thanatos Tower'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 下层 废弃空间'
	},
	'1@mcd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Charleston Factory'
		},
		notifyEnter: true,
		displayName: '查尔斯顿工厂'
	},
	'star_in.rsw': {
		displayName: '流星林 室内'
	},
	'pvp_y_4-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'arug_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Horn Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: '发菲依雅公会'
	},
	'manuk.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Manuk',
			subTitle: "Yotunheim Sapha's Mining Village"
		},
		notifyEnter: true,
		displayName: '矿山村庄 马努克'
	},
	'que_hugel.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Odin Shrine's Underground"
		},
		notifyEnter: true,
		displayName: "Odin Shrine's Underground"
	},
	'treasure_n2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Izlude Shipwreck B2'
		},
		notifyEnter: true,
		displayName: '依斯鲁得遇难船 2层'
	},
	'ma_zif05.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'jor_root2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Snake God's Root 2F"
		},
		notifyEnter: true,
		displayName: "Snake God's Root 2F"
	},
	'ice_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Rachel Ice Cave 2F'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞穴 2层'
	},
	'mosk_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Moscovia Field'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚 旷野'
	},
	'itemmall.rsw': {
		displayName: '道具商店'
	},
	'new_2-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'pay_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Payon Cave F4',
			subTitle: 'Payon Archer Village'
		},
		notifyEnter: true,
		displayName: '斐扬洞穴 4层（废弃村落）'
	},
	'lhz_cube.rsw': {
		displayName: '正立方体房间'
	},
	'prt_q.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Invaded Prontera'
		},
		notifyEnter: true,
		displayName: '被侵略的普隆德拉'
	},
	've_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	'un_bk_q.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Underground Bunker'
		},
		notifyEnter: true,
		displayName: '地下碉堡'
	},
	'1@jtb.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Dream and Shadow'
		},
		notifyEnter: true,
		displayName: '梦与影子'
	},
	'prt_arena01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Arena'
		},
		notifyEnter: true,
		displayName: '竞技场'
	},
	'gefg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Yesnelph Castle',
			subTitle: 'Britoniah'
		},
		notifyEnter: true,
		displayName: '咘哩妥利亚 公会'
	},
	'gef_fild13.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Britoniah',
			subTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '怖立特离亚'
	},
	'iz_ac01_d.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F1'
		},
		notifyEnter: true,
		displayName: '魔法学院 1层'
	},
	'oz_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Oz's Labyrinth 2F"
		},
		notifyEnter: true,
		displayName: "Oz's Labyrinth 2F"
	},
	'iz_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B3',
			subTitle: 'Baylan Island'
		},
		notifyEnter: true,
		displayName: '依斯鲁得海底洞穴 3层'
	},
	'ecl_in01.rsw': {
		displayName: '埃克拉珠 内部'
	},
	'que_qaru05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'sp_rudus2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Rudus F2',
			subTitle: 'Experiment Waste Disposal'
		},
		notifyEnter: true,
		displayName: '实验体废弃场 鲁杜斯 2层'
	},
	'new_1-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'vis_h04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Investigation Corridor F4'
		},
		notifyEnter: true,
		displayName: 'Investigation Corridor F4'
	},
	'pay_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'hu_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Royal Hunting Grounds'
		},
		notifyEnter: true,
		displayName: '狩猎场'
	},
	'pvp_n_7-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'nameless_n.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Nameless Island Entrance'
		},
		notifyEnter: true,
		displayName: '无名岛'
	},
	'1@4mst.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Euperos Central VT'
		},
		notifyEnter: true,
		displayName: '优配擂斯中心部VT'
	},
	'prt_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'mid_camp.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Midgard Expedition Camp',
			subTitle: 'Yotunheim'
		},
		notifyEnter: true,
		displayName: '米德加尔特联合驻地'
	},
	'te_alde_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: "Kafra's Den",
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: "Kafra's Den"
	},
	'conch_in.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Inside Conch',
			subTitle: 'Port Town Lasagne'
		},
		notifyEnter: true,
		displayName: '康-奇丽娜号内部'
	},
	'new_5-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'turbo_e_4.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'job3_guil01.rsw': {
		displayName: '秘密酒店'
	},
	'paramk.rsw': {
		displayName: '乐园团集市'
	},
	'gef_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'moc_pryd05.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid B1',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 地下1层'
	},
	'un_bunker.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Underground Bunker'
		},
		notifyEnter: true,
		displayName: '地下碉堡'
	},
	'1@air1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Airship'
		},
		notifyEnter: true,
		displayName: '飞空艇'
	},
	'sp_rudus3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Rudus F3',
			subTitle: 'Experiment Waste Disposal'
		},
		notifyEnter: true,
		displayName: '实验体废弃场 鲁杜斯 3层'
	},
	'mal_in01.rsw': {
		displayName: '绵绵岛 内部'
	},
	'2@mir.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Ritual Room'
		},
		notifyEnter: true,
		displayName: '仪式的房间'
	},
	'1@mir.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Ritual Room'
		},
		notifyEnter: true,
		displayName: '仪式的房间'
	},
	'ma_zif03.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'dicastes02.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Broomeveld Forest',
			subTitle: 'El Dicastes'
		},
		notifyEnter: true,
		displayName: '布伦贝德·约尔希森林'
	},
	'rag_fes.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'RAG-FES Exhibition Hall',
			subTitle: 'Ragnarok Festival'
		},
		notifyEnter: true,
		displayName: 'RAG-FES Exhibition Hall'
	},
	'prtg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Fadhgridh Castle',
			subTitle: 'Valkyrie Realm'
		},
		notifyEnter: true,
		displayName: '瓦尔基里雷恩 公会'
	},
	'izlude_d.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Izlude',
			subTitle: 'Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '卫星都市 依斯鲁得'
	},
	'in_sphinx1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Morocc Sphinx B1',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '梦罗克史芬克斯 地下1层'
	},
	'lhz_in01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Rekenber Corporation Headquarters'
		},
		notifyEnter: true,
		displayName: '雷根贝勒总部'
	},
	'lasa_fild02.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Ravioli Forest'
		},
		notifyEnter: true,
		displayName: '罗比奥森林'
	},
	'1@spa.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Ghost Palace'
		},
		notifyEnter: true,
		displayName: '幽灵皇宫'
	},
	'yuno_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'El Mes Plateau'
		},
		notifyEnter: true,
		displayName: '尔迈斯 瀑雷德'
	},
	'ordeal_2-3.rsw': {
		displayName: '团体战斗模式'
	},
	'jawaii.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Jawaii',
			subTitle: 'Honeymoon Island'
		},
		notifyEnter: true,
		displayName: '蜜月岛 爪哇咿'
	},
	'iz_ac01_a.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F1'
		},
		notifyEnter: true,
		displayName: '魔法学院 1层'
	},
	'new_4-3.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'pvp_y_5-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'gl_cas02_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Castle F2',
			subTitle: 'Glastheim Castle'
		},
		notifyEnter: true,
		displayName: 'Glastheim Castle F2'
	},
	'dewata.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Dewata'
		},
		notifyEnter: true,
		displayName: '德瓦他'
	},
	'1@4igd.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'The Battlefield of Justice'
		},
		notifyEnter: true,
		displayName: '正义擂台'
	},
	'iz_int01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: '新手地图'
	},
	'force_2-3.rsw': {
		displayName: '限时激斗模式'
	},
	'ein_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Einbech Mine 3F'
		},
		notifyEnter: true,
		displayName: '艾音贝赫矿山 3层'
	},
	'prt_evt_in.rsw': {
		displayName: '狩猎场小木屋'
	},
	'tha_t06.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层'
	},
	'1@dth3.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bios Island'
		},
		notifyEnter: true,
		displayName: '拜欧斯岛'
	},
	'monk_in.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Inside St. Abbey'
		},
		notifyEnter: true,
		displayName: '圣●卡毕利那修道院 内部'
	},
	'turbo_e_8.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'cmd_in01.rsw': {
		displayName: '克魔岛 内部'
	},
	'ein_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'arug_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Banadis Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: '发菲依雅公会'
	},
	'gl_chyard.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Churchyard',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下公墓'
	},
	'pvp_y_7-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'pvp_n_7-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'ba_pw01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '1st Power Plant'
		},
		notifyEnter: true,
		displayName: '第一魔力发电厂'
	},
	'lhz_airport.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Lighthalzen Airport'
		},
		notifyEnter: true,
		displayName: '里希塔乐镇机场'
	},
	'ein_d02_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Nasarin Empire',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: '罗斯里安帝国'
	},
	'arena_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Waiting room'
		},
		notifyEnter: true,
		displayName: '竞技场 等候室'
	},
	'job4_bio.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Secret Garden'
		},
		notifyEnter: true,
		displayName: '秘密花园'
	},
	'pvp_y_3-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'yggdrasil01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Hvergelmir's Fountain"
		},
		notifyEnter: true,
		displayName: "Hvergelmir's Fountain (Trunk of Yggdrasil)"
	},
	'ama_in02.rsw': {
		displayName: '天水阁 内部'
	},
	'jor_ab01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Abandoned Pit 1st Floor'
		},
		notifyEnter: true,
		displayName: '废弃坑洞1层'
	},
	'mjolnir_05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 北边地区'
	},
	'que_bingo.rsw': {
		displayName: '冰窟竞赛场'
	},
	'1@4drk.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: "Dragon's Trail"
		},
		notifyEnter: true,
		displayName: "Dragon's Trail"
	},
	'gld_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: '公会地下密穴'
	},
	'vr_bob.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: "Today's Table",
			subTitle: 'Fantasy Series-006'
		},
		notifyEnter: true,
		displayName: "Fantasy Series - Today's Table"
	},
	'jor_back3.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Glacier'
		},
		notifyEnter: true,
		displayName: '冰鳞冰川'
	},
	'louyang.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Louyang',
			subTitle: 'Highland'
		},
		notifyEnter: true,
		displayName: '古都 龙之城'
	},
	'iz_ac02_c.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F2'
		},
		notifyEnter: true,
		displayName: '魔法学院 2层'
	},
	'ra_san04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary South Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: '拉赫 神殿圣域1层 南边地区'
	},
	'beach_dun3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Mao, the East Cave',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 东边洞穴 马吾'
	},
	'pub_cat.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Cat on a Bullet',
			subTitle: 'Einbroch Rebellion Pub'
		},
		notifyEnter: true,
		displayName: '喵星人子弹酒吧'
	},
	'1@herbs.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Hidden Flower Garden'
		},
		notifyEnter: true,
		displayName: '秘密花园'
	},
	'prt_lib_q.rsw': {
		displayName: '过去王室的记忆'
	},
	'ma_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Forest',
			subTitle: 'Port Malaya'
		},
		notifyEnter: true,
		displayName: '普勒斯特'
	},
	'pvp_y_3-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'1@exse.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Galactic Celestial Branch'
		},
		notifyEnter: true,
		displayName: '银河天界分所'
	},
	'bat_b01.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Flavian',
			subTitle: 'Battleground'
		},
		notifyEnter: true,
		displayName: '普拉比乌斯'
	},
	'ein_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'sp_os.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'OS',
			subTitle: 'Special Border Area'
		},
		notifyEnter: true,
		displayName: '特殊警戒区欧斯'
	},
	'prt_in.rsw': {
		displayName: '卢恩米德加兹王国 首都 普隆德拉'
	},
	'moc_ruins.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Morocc Ruins'
		},
		notifyEnter: true,
		displayName: '沙漠之都 梦罗克'
	},
	'arug_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Gefn Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: '发菲依雅公会'
	},
	'ama_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Amatsu Underground Shrine'
		},
		notifyEnter: true,
		displayName: '樱花城 地下神社'
	},
	'yuno_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'El Mes Plateau'
		},
		notifyEnter: true,
		displayName: '尔迈斯 瀑雷德'
	},
	'moc_fild22b.rsw': {
		backgroundBmp: 'field2',
		signName: {
			mainTitle: 'Dimension Crack',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠 次元裂缝'
	},
	'hu_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Hugel Abyss Lake'
		},
		notifyEnter: true,
		displayName: '毁葛 深渊湖水'
	},
	'gl_sew03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Waterway B3',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下水道3层'
	},
	'hero_ent1.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: "1st Hero's Gateway",
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: "Herosria 1st Hero's Gateway"
	},
	'payg_cas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Bamboo Grove Hill',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '青林湖泊 公会'
	},
	'prt_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'1@adv.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'High Priest Villa'
		},
		notifyEnter: true,
		displayName: '大神官的别墅'
	},
	'ein_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'jor_safty1.rsw': {
		backgroundBmp: 'field2_s1',
		signName: {
			subTitle: 'Safe Place'
		},
		notifyEnter: true,
		displayName: 'Safe Place'
	},
	'prt_sewb3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Culvert F3',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉地下水道 3层'
	},
	'tha_t07.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Angel',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层 天使之房'
	},
	'tha_t05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层'
	},
	'turbo_n_16.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'alde_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower B2',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰钟塔 地下2层'
	},
	'1@pop3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sky Garden',
			subTitle: 'Half Moon in the Daylight'
		},
		notifyEnter: true,
		displayName: '天空庭院'
	},
	'har_in01.rsw': {
		displayName: '洛克里奇'
	},
	'new_2-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'prt_castle.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Prontera Castle'
		},
		notifyEnter: true,
		displayName: '普隆德拉城 内部'
	},
	'gl_cas02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Glastheim Castle F2',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地上2层'
	},
	'que_swat.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Heart Hunter Military Base'
		},
		notifyEnter: true,
		displayName: '邪心猎人军事基地'
	},
	'1@4cdn.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Cave of the Last Ordeal Vision'
		},
		notifyEnter: true,
		displayName: '最后试炼之幻影洞穴'
	},
	'tra_fild.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Outer Training Grounds'
		},
		notifyEnter: true,
		displayName: '普隆德拉郊外训练场'
	},
	'tha_t04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Abandoned Place',
			subTitle: 'Thanatos Tower'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 下层 废弃空间'
	},
	'iz_ac02_b.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F2'
		},
		notifyEnter: true,
		displayName: '魔法学院 2层'
	},
	'abbey02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Cursed Abbey Dungeon B2',
			subTitle: 'Nameless Island'
		},
		notifyEnter: true,
		displayName: '无名岛修道院 地下1层'
	},
	'turbo_n_8.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'vis_h03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Investigation Corridor F3'
		},
		notifyEnter: true,
		displayName: 'Investigation Corridor F3'
	},
	'1@md_gef.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Friday Memorial'
		},
		notifyEnter: true,
		displayName: '周五副本'
	},
	'lasa_sea.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Lasagna Cave'
		},
		notifyEnter: true,
		displayName: 'Lasagna Cave'
	},
	'odin_tem03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: "Odin's Temple North Area"
		},
		notifyEnter: true,
		displayName: "Odin's Temple North Area"
	},
	'quiz_test.rsw': {
		displayName: '益智考场'
	},
	'c_tower2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower F2',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰钟塔 地上3层'
	},
	'2@gl_k.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Chivalry F2',
			subTitle: 'Old Glastheim'
		},
		notifyEnter: true,
		displayName: 'Old Glastheim Chivalry F2'
	},
	'ecl_hub01.rsw': {
		displayName: 'Eclage Perimeter'
	},
	'1@gl_k.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Chivalry F1',
			subTitle: 'Old Glastheim'
		},
		notifyEnter: true,
		displayName: 'Old Glastheim Chivalry F1'
	},
	'1@gef_in.rsw': {
		displayName: '吉芬魔法大赛'
	},
	'lasa_dun_q.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Dragon Nest'
		},
		notifyEnter: true,
		displayName: '龙巢穴'
	},
	'schg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Vidblainn Castle',
			subTitle: 'Nidhoggur'
		},
		notifyEnter: true,
		displayName: '尼它堆公会'
	},
	'hero_out4.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Labinarium',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚冰雪之域'
	},
	'alde_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Luina',
			subTitle: 'Satellite of Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰 卫星都市 露依纳'
	},
	'prt_fild08b.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'South Field of Prontera'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'yuno_fild12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Border Checkpoint'
		},
		notifyEnter: true,
		displayName: '秀发兹发德 国境检查站'
	},
	'lhz_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Lighthalzen Field'
		},
		notifyEnter: true,
		displayName: '里希塔乐镇 旷野'
	},
	'pvp_n_7-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'yuno_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'El Mes Plateau'
		},
		notifyEnter: true,
		displayName: '尔迈斯 瀑雷德'
	},
	'pvp_n_5-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'job_wiz.rsw': {
		displayName: '巫师转职考场'
	},
	'gon_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Hermit's Checkerboard",
			subTitle: 'Gonryun'
		},
		notifyEnter: true,
		displayName: "Hermit's Checkerboard"
	},
	'int_land.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Remote Island'
		},
		notifyEnter: true,
		displayName: 'Remote Island'
	},
	'aldeba_in.rsw': {
		displayName: '运河之都 艾尔帕兰'
	},
	've_in.rsw': {
		displayName: '伯仁斯 内部'
	},
	'que_qsch05.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'ma_zif07.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'1@tcamp.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Thor Volcano Military Base'
		},
		notifyEnter: true,
		displayName: '托尔火山军事基地'
	},
	'prt_fild08d.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'South Field of Prontera'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'job_prist.rsw': {
		displayName: '牧师转职考场'
	},
	'nyd_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Yggdrasil Root F1'
		},
		notifyEnter: true,
		displayName: '辉煌残暴者的伤口 1层'
	},
	'kh_kiehl02.rsw': {
		displayName: "Kiel's Room"
	},
	'in_sphinx2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Morocc Sphinx B2',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '梦罗克史芬克斯 地下2层'
	},
	'icas_in.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Inside the Ice Castle'
		},
		notifyEnter: true,
		displayName: '冰封之城内部'
	},
	'iz_ac02.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F2'
		},
		notifyEnter: true,
		displayName: '魔法学院 2层'
	},
	'bl_soul.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Soul',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Soul'
	},
	'mjolnir_12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Foothills'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 北边山麓'
	},
	'alde_alche.rsw': {
		displayName: '炼金术师转职所'
	},
	'payg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Scarlet Palace Castle',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '青林湖泊 公会'
	},
	'gefenia02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffenia'
		},
		notifyEnter: true,
		displayName: '葛帔尼亚'
	},
	'force_3-2.rsw': {
		displayName: '限时激斗模式'
	},
	'izlude_c.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Izlude',
			subTitle: 'Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '卫星都市 依斯鲁得'
	},
	's_atelier.rsw': {
		displayName: '影子工坊'
	},
	'1@20cn2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Canyon Exploration'
		},
		notifyEnter: true,
		displayName: 'Canyon Exploration'
	},
	'pvp_y_1-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'spl_in02.rsw': {
		displayName: '辉煌领域 内部'
	},
	'1@4mag.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Magic Fountain'
		},
		notifyEnter: true,
		displayName: '魔力之泉'
	},
	'quiz_00.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Quiz Revolution'
		},
		notifyEnter: true,
		displayName: 'OX益智游戏竞赛场'
	},
	'1@vrclo.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Mirror Monastery',
			subTitle: 'Fantasy Series-005'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series - Mirror Monastery'
	},
	'rockrdg2.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Kiwawa Desert',
			subTitle: 'Rockridge'
		},
		notifyEnter: true,
		displayName: '契瓦瓦沙漠'
	},
	'2@vrclo.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'All those moments',
			subTitle: 'Fantasy Series-005'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series - All those moments'
	},
	'iz_int02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: '新手地图'
	},
	'yuno_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Border Posts'
		},
		notifyEnter: true,
		displayName: '秀发兹发德国境检查站'
	},
	'1@spa2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Tomb of Regret'
		},
		notifyEnter: true,
		displayName: 'Tomb of Regret'
	},
	'ma_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Baryo Mahiwaga',
			subTitle: 'Port Malaya'
		},
		notifyEnter: true,
		displayName: '巴尔尤 马西瓦加'
	},
	'poring_w01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Poring War Waiting Room'
		},
		notifyEnter: true,
		displayName: '波利大战 等待室'
	},
	'ecl_tdun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bifrost Tower 1F'
		},
		notifyEnter: true,
		displayName: '彩虹桥高塔 1层'
	},
	'jupe_area2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos, Restricted Zone'
		},
		notifyEnter: true,
		displayName: '优配擂斯保安旷野'
	},
	'gef_fild05.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Gypsy Village',
			subTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'ra_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Audumla Grassland'
		},
		notifyEnter: true,
		displayName: '拉赫 奥顿拉草原'
	},
	'izlude_a.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Izlude',
			subTitle: 'Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '卫星都市 依斯鲁得'
	},
	'jupe_core2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Center of Juperos'
		},
		notifyEnter: true,
		displayName: '优配擂斯中央'
	},
	'force_1-2.rsw': {
		displayName: '限时激斗模式'
	},
	'lasa_in01.rsw': {
		displayName: '罗札纳内部'
	},
	'jor_que.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Abandoned Snake God's Warmth"
		},
		notifyEnter: true,
		displayName: "Abandoned Snake God's Warmth"
	},
	'ordeal_3-4.rsw': {
		displayName: '团体战斗模式'
	},
	'sch_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Nidhoggur',
			subTitle: 'Yuno'
		},
		notifyEnter: true,
		displayName: '尼它堆'
	},
	'oz_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Oz's Labyrinth 1F"
		},
		notifyEnter: true,
		displayName: "Oz's Labyrinth 1F"
	},
	'iz_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B2',
			subTitle: 'Baylan Island'
		},
		notifyEnter: true,
		displayName: '依斯鲁得海底洞穴 2层'
	},
	'prt_cas.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Central Palace',
			subTitle: 'Prontera Castle'
		},
		notifyEnter: true,
		displayName: '普隆德拉中央宫'
	},
	'jupe_core.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Center of Juperos'
		},
		notifyEnter: true,
		displayName: '优配擂斯中心部'
	},
	'rockmi2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Rockridge Mine F2'
		},
		notifyEnter: true,
		displayName: '洛克里奇矿山'
	},
	'prt_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Valkyrie Realm',
			subTitle: 'Prontera'
		},
		notifyEnter: true,
		displayName: '瓦尔基里雷恩'
	},
	'iz_d04_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Deep Sea Cave'
		},
		notifyEnter: true,
		displayName: '深渊海底洞穴上层'
	},
	'amatsu.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Amatsu',
			subTitle: 'Land of Destiny'
		},
		notifyEnter: true,
		displayName: '天水之国 樱花城'
	},
	'pay_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Payon Cave F2',
			subTitle: 'Payon Archer Village'
		},
		notifyEnter: true,
		displayName: '斐扬洞穴 2层'
	},
	'gl_cas01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Glastheim Castle F1',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地上1层'
	},
	'te_prtcas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Heine Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Heine Castle'
	},
	'1@vrpo.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Poring Terra',
			subTitle: 'Fantasy Series-007'
		},
		notifyEnter: true,
		displayName: 'Fantasy Series - Poring Terra'
	},
	'ra_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Ida Plains'
		},
		notifyEnter: true,
		displayName: '拉赫 伊达平原'
	},
	'2@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Endless Tower'
		},
		notifyEnter: true,
		displayName: '无尽塔'
	},
	'3@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Endless Tower'
		},
		notifyEnter: true,
		displayName: '无尽塔'
	},
	'4@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Endless Tower'
		},
		notifyEnter: true,
		displayName: '无尽塔'
	},
	'prt_cas_q.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Star Palace',
			subTitle: 'Prontera Castle'
		},
		notifyEnter: true,
		displayName: '普隆德拉别宫'
	},
	'6@tower.rsw': {
		displayName: '无尽塔'
	},
	'yuno_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: "Kiel Hyre's Cottage"
		},
		notifyEnter: true,
		displayName: "Kiel Hyre's Cottage"
	},
	'juperos_02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Inside the Juperos Ruins'
		},
		notifyEnter: true,
		displayName: '优配擂斯废墟 内部'
	},
	'prt_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'1@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Endless Tower'
		},
		notifyEnter: true,
		displayName: '无尽塔'
	},
	'lhz_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Somatology Laboratory F1'
		},
		notifyEnter: true,
		displayName: '生物体试验研究所 地下1层'
	},
	'ma_zif01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'bif_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Northern Bifrost'
		},
		notifyEnter: true,
		displayName: '彩虹桥北部'
	},
	'jor_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Snake God's Warmth 2nd Floor"
		},
		notifyEnter: true,
		displayName: "Snake God's Warmth 2nd Floor"
	},
	'gl_chyard_.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Monastery Churchyard',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: 'Monastery Churchyard'
	},
	'ecl_in04.rsw': {
		displayName: '埃克拉珠 内部'
	},
	've_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	'sec_in02.rsw': {
		displayName: '巴哈拉宫 内部'
	},
	'hunter_1-1.rsw': {
		displayName: '猎人转职所'
	},
	'nif_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Skellington, a Solitary Village',
			subTitle: 'Niflheim'
		},
		notifyEnter: true,
		displayName: '尼芙菲姆 偏远村落 斯凯领顿'
	},
	'que_god02.rsw': {
		displayName: '任务地图'
	},
	'ecl_tdun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bifrost Tower 2F'
		},
		notifyEnter: true,
		displayName: '彩虹桥高塔 2层'
	},
	'thor_v02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Thor Volcano Dungeon 2F'
		},
		notifyEnter: true,
		displayName: '伯仁斯托尔火山 洞穴2层'
	},
	'bif_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Southern Bifrost'
		},
		notifyEnter: true,
		displayName: '彩虹桥南部'
	},
	'1@advs.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Deception Villa'
		},
		notifyEnter: true,
		displayName: '欺瞒别墅'
	},
	'dicastes01.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'El Dicastes',
			subTitle: 'Jotunheim Sapha Capital'
		},
		notifyEnter: true,
		displayName: '沙帕首都 埃迪斯特斯'
	},
	'brasilis.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Brasilis'
		},
		notifyEnter: true,
		displayName: '巴西'
	},
	'1@oz.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Oz's Labyrinth"
		},
		notifyEnter: true,
		displayName: "Oz's Labyrinth"
	},
	'abyss_04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Cave 4F',
			subTitle: 'Abyss Lake'
		},
		notifyEnter: true,
		displayName: '毁葛深渊湖水 地下洞穴 4层'
	},
	'c_tower3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower F3',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰 钟塔上层 3层'
	},
	'bl_temple.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Temple',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Temple'
	},
	'pay_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'hu_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'In front of Thanatos Tower'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔'
	},
	'int_land03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Remote Island'
		},
		notifyEnter: true,
		displayName: 'Remote Island'
	},
	'1@uns.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'The Last room'
		},
		notifyEnter: true,
		displayName: '最后房间'
	},
	'1@20cn1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Canyon Exploration'
		},
		notifyEnter: true,
		displayName: 'Canyon Exploration'
	},
	'quiz_02.rsw': {
		displayName: 'OX益智游戏竞赛场'
	},
	'int_land04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Remote Island'
		},
		notifyEnter: true,
		displayName: 'Remote Island'
	},
	'ice_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Rachel Ice Cave 1F'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞穴 1层'
	},
	'2@nyr.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Heart Storage',
			subTitle: 'Sanctuary Sesrumnir'
		},
		notifyEnter: true,
		displayName: '圣域瑟斯隆尼勒 心脏保管所'
	},
	'1@nyr.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Sanctuary Sesrumnir Garden'
		},
		notifyEnter: true,
		displayName: '圣域瑟斯隆尼勒庭院'
	},
	'moc_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'pvp_n_1-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'prt_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'bl_grass.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Specimen Environment - Grassland',
			subTitle: "Varmundt's Biosphere"
		},
		notifyEnter: true,
		displayName: 'Biosphere Specimen Environment - Grassland'
	},
	'ba_pw03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: '2nd Power Plant'
		},
		notifyEnter: true,
		displayName: '第二魔力发电厂'
	},
	'p_track01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Monster Race Arena'
		},
		notifyEnter: true,
		displayName: '魔物赛跑 竞赛场'
	},
	'ice_d03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Frozen Memory',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: '冰冻记忆'
	},
	'ice_dun04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Rachel Ice Cave - Sealed Space'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞穴 封印的空间'
	},
	'x_lhz.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Lighthalzen',
			subTitle: 'Beyond Dimension'
		},
		notifyEnter: true,
		displayName: '次元外的里希塔乐镇'
	},
	'jor_back1.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Hill'
		},
		notifyEnter: true,
		displayName: '冰鳞山丘'
	},
	'mjo_wst01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Mjolnir Underground Cave'
		},
		notifyEnter: true,
		displayName: 'Mjolnir Underground Cave'
	},
	've_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Veins Field'
		},
		notifyEnter: true,
		displayName: '伯仁斯 旷野'
	},
	'evt_bomb.rsw': {
		displayName: 'Labyrinth Event'
	},
	'mjo_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Dead Pit F1',
			subTitle: 'North of Mt. Mjolnir'
		},
		notifyEnter: true,
		displayName: '妙勒尼废弃矿场 1层'
	},
	'te_aldecas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Defolty Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Defolty Castle'
	},
	'rgsr_in.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Reckenberg Research Institute'
		},
		notifyEnter: true,
		displayName: '雷根修芦附设研究所'
	},
	'1@twig.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Twig's Nest"
		},
		notifyEnter: true,
		displayName: "Twig's Nest"
	},
	'1@ch_u.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Sunken Tower',
			subTitle: 'Old Endless Tower Erosion'
		},
		notifyEnter: true,
		displayName: '沉没之塔'
	},
	'jor_root1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Snake God's Root 1F"
		},
		notifyEnter: true,
		displayName: "Snake God's Root 1F"
	},
	'gld2_pay.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Ancient Wind',
			subTitle: 'Greenwood Lake Abyss Corridor'
		},
		notifyEnter: true,
		displayName: '深渊回廊 : 太古之风'
	},
	'tha_t10.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Sorrow',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层 悲哀之房'
	},
	'veins.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Veins',
			subTitle: 'Arunafeltz Canyon Village'
		},
		notifyEnter: true,
		displayName: '峡谷村落 伯仁斯'
	},
	'alde_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower B3',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰钟塔 地下3层'
	},
	'arug_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Cyr Castle',
			subTitle: 'Valfreyja'
		},
		notifyEnter: true,
		displayName: '发菲依雅公会'
	},
	'xmas_in.rsw': {
		displayName: '姜饼城 内部'
	},
	'1@face.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Faceworm's Nest"
		},
		notifyEnter: true,
		displayName: "Faceworm's Nest"
	},
	'jor_sanct.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Sacred Root',
			subTitle: 'Rgan Hideout'
		},
		notifyEnter: true,
		displayName: 'Sacred Root'
	},
	'odin_past.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Ancient Odin Temple'
		},
		notifyEnter: true,
		displayName: '古代奥丁神殿'
	},
	'malangdo.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Malangdo'
		},
		notifyEnter: true,
		displayName: '绵绵岛'
	},
	'ma_zif08.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'in_sphinx4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Morocc Sphinx B4',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '梦罗克史芬克斯 地下4层'
	},
	'que_thor.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Thor Volcano Dungeon'
		},
		notifyEnter: true,
		displayName: '伯仁斯托尔火山洞穴'
	},
	'pvp_y_4-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'te_aldecas05.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'W Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'W Castle'
	},
	'bra_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Beyond the Waterfall',
			subTitle: 'Brasilis'
		},
		notifyEnter: true,
		displayName: '巴西瀑布里 洞穴入口'
	},
	'gld2_prt.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Warrior's Way",
			subTitle: 'Valkyrie Realm Abyss Corridor'
		},
		notifyEnter: true,
		displayName: "Corridor of the Abyss: Warrior's Way"
	},
	'1@begi.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Poring Village'
		},
		notifyEnter: true,
		displayName: 'Poring Village'
	},
	'prt_church.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'The Sanctuary'
		},
		notifyEnter: true,
		displayName: '普隆德拉 圣堂内部'
	},
	'1@whl.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Inside Unprocessed Wile (1)',
			subTitle: "Varmundt's Aircraft Collection No.3"
		},
		notifyEnter: true,
		displayName: '飞空艇瓦尔(1)号内部'
	},
	'iz_ac01_c.rsw': {
		backgroundBmp: 'noname_s1',
		signName: {
			subTitle: 'Criatura Academy F1'
		},
		notifyEnter: true,
		displayName: '魔法学院 1层'
	},
	'ama_test.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Momotaro Experience Place'
		},
		notifyEnter: true,
		displayName: '樱花城 摩摩塔乐体验所'
	},
	'gefenia03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffenia'
		},
		notifyEnter: true,
		displayName: '葛帔尼亚'
	},
	'1@twas.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Separated Sanctuary'
		},
		notifyEnter: true,
		displayName: 'Separated Sanctuary'
	},
	'airplane_01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Airship'
		},
		notifyEnter: true,
		displayName: '飞空艇'
	},
	'orcsdun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Orc Dungeon F1',
			subTitle: 'Orc Village'
		},
		notifyEnter: true,
		displayName: '吉芬 兽人地下洞穴 1层'
	},
	'1@4tro.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: "Kvashir's Ship"
		},
		notifyEnter: true,
		displayName: "Kvashir's Ship"
	},
	'e_tower.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Misty Island'
		},
		notifyEnter: true,
		displayName: '密斯提岛'
	},
	'gef_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffen Dungeon B3'
		},
		notifyEnter: true,
		displayName: '吉芬 地下密穴 2层'
	},
	'spl_in01.rsw': {
		displayName: '辉煌领域野战司令部 内部'
	},
	'ayothaya.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Ayothaya'
		},
		notifyEnter: true,
		displayName: '哎哟泰雅'
	},
	'hero_out1.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Silvarium',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚森林之域'
	},
	'pvp_y_8-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'pvp_y_7-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'pvp_y_6-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'un_myst.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Underground Tunnel'
		},
		notifyEnter: true,
		displayName: '地下隧道'
	},
	'que_job01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Private Pub'
		},
		notifyEnter: true,
		displayName: '秘密酒店'
	},
	'pvp_y_4-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'yuno_fild07.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'El Mes Gorge',
			subTitle: 'Valley of Abyss'
		},
		notifyEnter: true,
		displayName: '尔迈斯 峡谷(深渊的峡谷)'
	},
	'new_2-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'pvp_y_3-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'moc_prydn1.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Pyramid B1'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 地下1层(梦魇)'
	},
	'moc_pryd06.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid B2',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 地下2层'
	},
	'lou_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'The Royal Tomb'
		},
		notifyEnter: true,
		displayName: '龙之城王陵'
	},
	'pvp_y_2-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'mag_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Nogg Road F1'
		},
		notifyEnter: true,
		displayName: '朱诺 诺可罗德1层'
	},
	'pvp_y_6-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'pvp_y_5-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'iz_int.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: '新手地图'
	},
	'aldeg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Wuerzburg Castle',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: '露依纳公会'
	},
	'teg_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Underground Dungeon',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Guild Underground Dungeon'
	},
	'pvp_y_8-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'pvp_y_7-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'hero_in4.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Winter Garden',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚冬季庭园'
	},
	'ma_scene01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Bakonawa Lake',
			subTitle: 'Port Malaya'
		},
		notifyEnter: true,
		displayName: '食月者之湖'
	},
	'pvp_y_6-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'nif_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Collapsed Opera House',
			subTitle: 'Niflheim Dungeon - 2nd Floor'
		},
		notifyEnter: true,
		displayName: '尼芙菲姆密穴二层 崩塌的歌剧院'
	},
	'pvp_y_5-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'iz_int04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Stranded Passenger Ship'
		},
		notifyEnter: true,
		displayName: '新手地图'
	},
	'yuno_in04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Republic Library'
		},
		notifyEnter: true,
		displayName: '朱诺 内部'
	},
	'ra_san01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary North Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: '拉赫 神殿圣域1层 北边地区'
	},
	'pvp_n_3-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'dali.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Dimensional Rift'
		},
		notifyEnter: true,
		displayName: '次元裂缝'
	},
	'pvp_y_1-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'new_1-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'pvp_y_3-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'pvp_y_8-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'pvp_y_7-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'ice_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Rachel Ice Cave 3F'
		},
		notifyEnter: true,
		displayName: '拉赫冰洞穴 3层'
	},
	'moc_pryd01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid F1',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 1层'
	},
	'beach_dun.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Karu, the West Cave',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 西边洞穴 加露'
	},
	'pvp_n_6-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'pvp_n_5-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'ba_go.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Water Map (Palmist battlefield)'
		},
		notifyEnter: true,
		displayName: '手相战场'
	},
	'ba_lib.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Memory Corridor',
			subTitle: 'Library'
		},
		notifyEnter: true,
		displayName: '图书馆记忆回廊'
	},
	'pvp_n_4-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'pvp_n_3-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'alb2trea.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Alberta Island',
			subTitle: 'Alberta'
		},
		notifyEnter: true,
		displayName: '沉船附近的岛屿'
	},
	'pvp_n_8-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'pvp_n_7-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'pvp_n_6-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'pvp_n_4-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'pvp_n_2-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Undercross'
		},
		notifyEnter: true,
		displayName: 'PvP : 反十字 房间'
	},
	'cmd_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Beacon Island, Pharos'
		},
		notifyEnter: true,
		displayName: '发乐斯 灯塔岛'
	},
	'pvp_n_7-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'um_fild04.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Hoomga Jungle',
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: '汶巴拉 沪家丛林'
	},
	'pvp_n_6-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'pvp_n_5-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'pvp_n_8-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'payon.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Payon',
			subTitle: 'Mountain City in the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '山岳之都 斐扬'
	},
	'prt_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'job3_rune01.rsw': {
		displayName: '符文骑士团 内部'
	},
	'pvp_n_8-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'moc_fild16.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'pvp_n_4-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'pvp_n_2-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'jor_back2.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Plains'
		},
		notifyEnter: true,
		displayName: '冰鳞平原'
	},
	'memohall.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Dimensional Guardian Memorial'
		},
		notifyEnter: true,
		displayName: 'Dimensional Guardian Memorial'
	},
	'comodo.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Comodo',
			subTitle: 'Beach Town in the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '海边之都 克魔岛'
	},
	'knight_2-1.rsw': {
		displayName: '骑士转职所'
	},
	'que_qsch02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'pvp_y_4-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Payon'
		},
		notifyEnter: true,
		displayName: 'PvP : 斐扬'
	},
	'lhz_que01.rsw': {
		displayName: '里希塔乐镇 内部'
	},
	'mjolnir_07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir South Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 南边地区'
	},
	'new_3-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'ein_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'gl_step.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Staircase Dungeon',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 层梯密穴'
	},
	'jor_safty2.rsw': {
		backgroundBmp: 'dungeon_s1',
		signName: {
			subTitle: 'Safe Place'
		},
		notifyEnter: true,
		displayName: 'Safe Place'
	},
	'gl_sew04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Waterway B4',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下水道4层'
	},
	'ordeal_2-4.rsw': {
		displayName: '团体战斗模式'
	},
	'um_in.rsw': {
		displayName: '汶巴拉内部'
	},
	'kh_rossi.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "The Rosimier's Mansion"
		},
		notifyEnter: true,
		displayName: "The Rosimier's Mansion"
	},
	'ein_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'moc_fild22.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Dimensional Rift',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠 次元裂缝'
	},
	'ordeal_3-1.rsw': {
		displayName: '团体战斗模式'
	},
	'force_2-2.rsw': {
		displayName: '限时激斗模式'
	},
	'gl_church.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Monastery',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 修道院'
	},
	'gef_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'1@pump.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Culvert'
		},
		notifyEnter: true,
		displayName: '排水沟'
	},
	'2@pump.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Culvert'
		},
		notifyEnter: true,
		displayName: '排水沟'
	},
	'job3_guil02.rsw': {
		displayName: '破旧的仓库 内部'
	},
	'umbala.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Umbala',
			subTitle: "Wootan Tribe's Village"
		},
		notifyEnter: true,
		displayName: "Wootan Tribe's Village, Umbala"
	},
	'prt_are_in.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Waiting room'
		},
		notifyEnter: true,
		displayName: '竞技场 等候室'
	},
	'thana_step.rsw': {
		signName: {
			mainTitle: 'Thanatos Tower Upper Level - Stairs'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层层梯'
	},
	'izlu2dun.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Baylan Island',
			subTitle: 'Izlude'
		},
		notifyEnter: true,
		displayName: '卫星都市 依斯鲁得'
	},
	'izlude.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Izlude',
			subTitle: 'Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '卫星都市 依斯鲁得'
	},
	'payon_in02.rsw': {
		displayName: '山岳之都 斐扬'
	},
	'payon_in01.rsw': {
		displayName: '山岳之都 斐扬'
	},
	'pvp_n_3-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'1@twbs.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Separated Sanctuary'
		},
		notifyEnter: true,
		displayName: 'Separated Sanctuary'
	},
	'yuno.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Yuno',
			subTitle: 'Capital of Schwartzwald Republic'
		},
		notifyEnter: true,
		displayName: '秀发兹发德 共和国 首都 朱诺'
	},
	'morocc.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Morroc',
			subTitle: 'Desert City in the Rune-Midgarts Kingdom'
		},
		notifyEnter: true,
		displayName: '沙漠之都 梦罗克'
	},
	'geffen_in.rsw': {
		displayName: '吉芬 内部'
	},
	'gef_tower.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Geffen Tower',
			subTitle: 'Geffen'
		},
		notifyEnter: true,
		displayName: '吉芬 中央塔'
	},
	'pvp_n_1-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Copass'
		},
		notifyEnter: true,
		displayName: 'PvP : 罗盘 房间'
	},
	'gl_prison1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Prison B2',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 地下监狱2层'
	},
	'1@sara.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Sara's Memory"
		},
		notifyEnter: true,
		displayName: "Sara's Memory"
	},
	'yuno_in02.rsw': {
		displayName: '贤者 城堡内部'
	},
	'ordeal_1-4.rsw': {
		displayName: '团体战斗模式'
	},
	'hu_in01.rsw': {
		displayName: '毁葛 内部'
	},
	'ordeal_3-3.rsw': {
		displayName: '团体战斗模式'
	},
	'gef_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'abbey03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Cursed Abbey Dungeon B3',
			subTitle: 'Nameless Island'
		},
		notifyEnter: true,
		displayName: '无名岛修道院 地下2层'
	},
	'abbey01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Cursed Abbey Dungeon B1',
			subTitle: 'Nameless Island'
		},
		notifyEnter: true,
		displayName: '无名岛修道院 1层'
	},
	'ordeal_3-2.rsw': {
		displayName: '团体战斗模式'
	},
	'gl_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'The Lowest Cave in Glastheim B2',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 最下层 地下洞穴2层 '
	},
	'ordeal_2-1.rsw': {
		displayName: '团体战斗模式'
	},
	'ordeal_1-1.rsw': {
		displayName: '团体战斗模式'
	},
	'pvp_y_8-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Izlude'
		},
		notifyEnter: true,
		displayName: 'PvP : 依斯鲁得'
	},
	'lhz_dun04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Somatology Laboratory 4th Basement'
		},
		notifyEnter: true,
		displayName: '生物体试验研究所 地下4层'
	},
	'force_1-3.rsw': {
		displayName: '限时激斗模式'
	},
	'um_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Luluka Forest',
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: '汶巴拉 噜噜卡森林'
	},
	'gl_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'The Lowest Cave in Glastheim B1',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 最下层 地下洞穴1层 '
	},
	'force_3-1.rsw': {
		displayName: '限时激斗模式'
	},
	'force_2-1.rsw': {
		displayName: '限时激斗模式'
	},
	'force_1-1.rsw': {
		displayName: '限时激斗模式'
	},
	'wizard_3-1.rsw': {
		displayName: '巫师转职所'
	},
	'prt_mz03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Twisted Labyrinth Forest',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: '扭曲的迷藏森林'
	},
	'ba_pw02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Sewage Treatment Plant'
		},
		notifyEnter: true,
		displayName: '污水处理厂'
	},
	'wizard_1-1.rsw': {
		displayName: '巫师转职所'
	},
	'kh_mansion.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Kiel Hyre's Mansion"
		},
		notifyEnter: true,
		displayName: "Kiel Hyre's Mansion"
	},
	'sword_3-1.rsw': {
		displayName: '剑士转职所'
	},
	'in_orcs01.rsw': {
		displayName: '兽人村落 室内'
	},
	'int_land02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Remote Island'
		},
		notifyEnter: true,
		displayName: 'Remote Island'
	},
	'knight_1-1.rsw': {
		displayName: '骑士转职所'
	},
	'in_hunter.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Hunter Guild'
		},
		notifyEnter: true,
		displayName: '猎人转职所'
	},
	'hunter_3-1.rsw': {
		displayName: '猎人转职所'
	},
	'1@slug.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Sticky Sea'
		},
		notifyEnter: true,
		displayName: 'Sticky Sea'
	},
	'hunter_2-1.rsw': {
		displayName: '猎人转职所'
	},
	'um_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Passage to a Foreign World',
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: '汶巴拉 树木里的异界通路'
	},
	'nameless_in.rsw': {
		displayName: '无名岛 内部'
	},
	'prt_sewb1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Culvert F1',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉地下水道 1层'
	},
	'prt_maze01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Labyrinth Forest F1',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉北部森林 密穴1层'
	},
	'lhz_d_n2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Void of Vicious Mind'
		},
		notifyEnter: true,
		displayName: 'Void of Vicious Mind'
	},
	'pay_dun04.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Payon Cave F5',
			subTitle: 'Payon Archer Village'
		},
		notifyEnter: true,
		displayName: '斐扬洞穴 5层（废弃村落）'
	},
	'pay_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Payon Cave F3',
			subTitle: 'Payon Archer Village'
		},
		notifyEnter: true,
		displayName: '斐扬洞穴 3层'
	},
	'mjo_dun02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Dead Pit F2',
			subTitle: 'North of Mt. Mjolnir'
		},
		notifyEnter: true,
		displayName: '妙勒尼废弃矿场 2层'
	},
	'moc_prydb1.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Thief Guild',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '盗贼公会'
	},
	'moc_pryd02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Pyramid F2',
			subTitle: 'Morroc'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 2层'
	},
	'job_duncer.rsw': {
		displayName: '克魔岛 小剧场'
	},
	'sp_cor.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Cor',
			subTitle: 'Special Border Area'
		},
		notifyEnter: true,
		displayName: '特殊警戒区柯尔'
	},
	'bat_c03.rsw': {
		notifyEnter: true,
		displayName: '克里格·冯·米德加尔特'
	},
	'in_sphinx3.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Morocc Sphinx B3',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '梦罗克史芬克斯 地下3层'
	},
	'iz_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B4',
			subTitle: 'Baylan Island'
		},
		notifyEnter: true,
		displayName: '依斯鲁得海底洞穴 4层'
	},
	'moc_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'p_track02.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Monster Race Arena'
		},
		notifyEnter: true,
		displayName: '魔物赛跑 竞赛场'
	},
	'1@air2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Airship'
		},
		notifyEnter: true,
		displayName: '飞空艇'
	},
	'yuno_in01.rsw': {
		displayName: '朱诺 内部'
	},
	'gef_dun00.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffen Dungeon B1'
		},
		notifyEnter: true,
		displayName: '吉芬 地下密穴'
	},
	'anthell02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Ant Hell Dungeon F2',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '蚂蚁地狱密穴 2层'
	},
	'new_4-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'1@pop2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Way Back Home',
			subTitle: 'Half Moon in the Daylight'
		},
		notifyEnter: true,
		displayName: '回家的路上'
	},
	'dic_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Kamidal Tunnel',
			subTitle: 'Jotunheim'
		},
		notifyEnter: true,
		displayName: '卡米达隧道'
	},
	'new_3-4.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'force_3-3.rsw': {
		displayName: '限时激斗模式'
	},
	'um_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Hoomga Forest',
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: '汶巴拉 沪家森林'
	},
	'new_3-2.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'lou_in02.rsw': {
		displayName: '龙之城 内部'
	},
	'pvp_n_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Waiting Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 等候室'
	},
	'pay_fild10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'cmd_fild04.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Kokomo Beach',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 海边'
	},
	'ayo_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Ayothaya Field'
		},
		notifyEnter: true,
		displayName: '哎哟泰雅 旷野'
	},
	'yuno_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Yuno Field'
		},
		notifyEnter: true,
		displayName: '朱诺 旷野'
	},
	'tur_d04_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Bleak Turtle Palace',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: 'Bleak Turtle Palace'
	},
	'pay_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'bat_b02.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Flavian',
			subTitle: 'Battleground'
		},
		notifyEnter: true,
		displayName: '普拉比乌斯'
	},
	'pvp_n_5-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'aldeg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Neuschwanstein Castle',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: '露依纳公会'
	},
	'ba_maison.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Varmundt's Mansion Garden"
		},
		notifyEnter: true,
		displayName: "Varmundt's Mansion Garden"
	},
	'moc_fild12.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'cmd_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Fortress Saint Darmain (East)'
		},
		notifyEnter: true,
		displayName: '要塞都市 山特乐曼 东边地区'
	},
	'moc_fild11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'moc_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'jupe_ele_r.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos Elevator Room'
		},
		notifyEnter: true,
		displayName: '优配擂斯电梯室'
	},
	'moc_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'x_prt.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Prontera',
			subTitle: 'Beyond Dimension'
		},
		notifyEnter: true,
		displayName: '次元外的普隆德拉'
	},
	'c_tower1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Clock Tower F1',
			subTitle: 'Aldebaran'
		},
		notifyEnter: true,
		displayName: '艾尔帕兰钟塔 地上1层'
	},
	'priest_3-1.rsw': {
		displayName: '牧师转职所'
	},
	'gef_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'gef_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'gef_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'gef_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Geffen Field'
		},
		notifyEnter: true,
		displayName: '吉芬 旷野'
	},
	'prt_fild10.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'pvp_n_2-2.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Rock On'
		},
		notifyEnter: true,
		displayName: 'PvP : 雷达锁定 房间'
	},
	'prt_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'prt_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'e_hugel.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Invaded Hugel'
		},
		notifyEnter: true,
		displayName: 'Invaded Hugel'
	},
	'ein_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Einbroch Mine F1'
		},
		notifyEnter: true,
		displayName: '艾音贝赫矿山 1层'
	},
	'prt_fild00.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'ba_bath.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Large Bath Meditathio'
		},
		notifyEnter: true,
		displayName: '冥想大浴池'
	},
	'mjolnir_02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 北边地区'
	},
	'x_ra.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Rachel',
			subTitle: 'Beyond Dimension'
		},
		notifyEnter: true,
		displayName: '次元外的拉赫'
	},
	'mjolnir_11.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir South Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 南边地区'
	},
	'mjolnir_09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir South Foothills'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 南边山麓'
	},
	'mjolnir_08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir South Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 南边地区'
	},
	'mjolnir_03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Mt.Mjolnir North Area'
		},
		notifyEnter: true,
		displayName: '妙勒尼山脉 北边地区'
	},
	'pvp_n_8-3.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Four Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 4通道 房间'
	},
	'cmd_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Fortress Saint Darmain (West)'
		},
		notifyEnter: true,
		displayName: '要塞都市 山特乐曼 西边地区'
	},
	'pay_fild09.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'cmd_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Papuchicha Forest',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 巴不其卡森林'
	},
	'beach_dun2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Luanda, the North Cave',
			subTitle: 'Comodo'
		},
		notifyEnter: true,
		displayName: '克魔岛 北边洞穴 卢安达'
	},
	'1@gl_he.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Contaminated Dimension',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: 'Contaminated Dimension'
	},
	'pvp_y_6-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Prontera'
		},
		notifyEnter: true,
		displayName: 'PvP : 普隆德拉'
	},
	'cmd_in02.rsw': {
		displayName: '克魔岛 内部'
	},
	'quiz_01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Quiz Revolution'
		},
		notifyEnter: true,
		displayName: 'OX益智游戏竞赛场'
	},
	'guild_vs1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Guild Arena'
		},
		notifyEnter: true,
		displayName: '公会对抗竞技场'
	},
	'guild_vs4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Guild Arena'
		},
		notifyEnter: true,
		displayName: '公会对抗竞技场'
	},
	'guild_vs5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Guild Arena'
		},
		notifyEnter: true,
		displayName: '公会对抗竞技场'
	},
	'rebel_in.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Clana Nemieri'
		},
		notifyEnter: true,
		displayName: '克莱纳 奈米艾利'
	},
	'tur_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Turtle Village'
		},
		notifyEnter: true,
		displayName: '乌龟岛  密穴'
	},
	'tur_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Turtle Island Dungeon'
		},
		notifyEnter: true,
		displayName: '乌龟岛  密穴'
	},
	'thor_v01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Thor Volcano Dungeon 1F'
		},
		notifyEnter: true,
		displayName: '伯仁斯托尔火山 洞穴1层'
	},
	'tur_dun01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Turtle Island'
		},
		notifyEnter: true,
		displayName: '乌龟岛'
	},
	'lighthalzen.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Lighthalzen',
			subTitle: 'City-State of Prosperity of the Schwartzwald Republic'
		},
		notifyEnter: true,
		displayName: '企业之都 里希塔乐镇'
	},
	'bat_a02.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Tierra Valley',
			subTitle: 'Battleground'
		},
		notifyEnter: true,
		displayName: '提耶拉峡谷'
	},
	'prtg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Kriemhild Castle',
			subTitle: 'Valkyrie Realm'
		},
		notifyEnter: true,
		displayName: '瓦尔基里雷恩 公会'
	},
	'lhz_dun_n.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Tomb of the Fallen'
		},
		notifyEnter: true,
		displayName: '战死者坟墓'
	},
	'1@mjo2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Forgotten Cavity',
			subTitle: 'Mjolnir Mountains'
		},
		notifyEnter: true,
		displayName: 'Mjolnir Mountains - Forgotten Cavity'
	},
	'aldeg_cas02.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Hohenschwangau Castle',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: '露依纳公会'
	},
	'aldeg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Nuernberg Castle',
			subTitle: 'Luina'
		},
		notifyEnter: true,
		displayName: '露依纳公会'
	},
	'pvp_y_1-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'dew_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Volcanic Island of Krakatoa',
			subTitle: 'Dewata'
		},
		notifyEnter: true,
		displayName: '喀拉喀托火山岛'
	},
	'payg_cas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Sacred Altar Castle',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '青林湖泊 公会'
	},
	'job_hunte.rsw': {
		displayName: '猎人转职考场'
	},
	'gld_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Baldur'
		},
		notifyEnter: true,
		displayName: '公会地下密穴'
	},
	'ba_chess.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Checkmate'
		},
		notifyEnter: true,
		displayName: '将死宫'
	},
	'gld_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Valkyrie'
		},
		notifyEnter: true,
		displayName: '公会地下密穴'
	},
	'morocc_in.rsw': {
		displayName: '梦罗克 内部'
	},
	'sp_rudus.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Rudus F1',
			subTitle: 'Experiment Waste Disposal'
		},
		notifyEnter: true,
		displayName: '实验体废弃场 鲁杜斯 1层'
	},
	'pvp_y_1-5.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Morocc'
		},
		notifyEnter: true,
		displayName: 'PvP : 梦罗克'
	},
	'in_rogue.rsw': {
		displayName: '流氓公会 内部'
	},
	'monk_test.rsw': {
		displayName: '圣●卡毕利那修道院'
	},
	'moro_cav.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Flame Cave'
		},
		notifyEnter: true,
		displayName: '火焰洞穴'
	},
	'in_sphinx5.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Morocc Sphinx B5',
			subTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '梦罗克史芬克斯 地下5层'
	},
	'pvp_n_1-1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Sandwich'
		},
		notifyEnter: true,
		displayName: 'PvP : 3明治 房间'
	},
	'gl_in01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Inside Glastheim',
			subTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城 室内'
	},
	'sec_pri.rsw': {
		displayName: '巴哈拉宫 反省的房间(监狱)'
	},
	'tha_t02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Museum',
			subTitle: 'Thanatos Tower'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 下层 博物馆'
	},
	'ecl_in02.rsw': {
		displayName: '埃克拉珠 内部'
	},
	'ama_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Tatami Maze'
		},
		notifyEnter: true,
		displayName: '樱花城 榻榻米迷宫'
	},
	'gon_in.rsw': {
		displayName: '昆仑内部'
	},
	'gon_fild01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Gonryun Field'
		},
		notifyEnter: true,
		displayName: '昆仑旷野'
	},
	'gon_dun03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'The Peach Blossom Land',
			subTitle: 'Gonryun'
		},
		notifyEnter: true,
		displayName: '昆仑 武陵道院'
	},
	'gon_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Temple of the Western Queen',
			subTitle: 'Gonryun'
		},
		notifyEnter: true,
		displayName: '昆仑 西王母神殿'
	},
	'prt_are01.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Arena'
		},
		notifyEnter: true,
		displayName: '竞技场'
	},
	'um_fild03.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Kalala Swamp',
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: '汶巴拉 卡拉拉森林'
	},
	'thana_scene01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Thanatos Tower Entrance'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 前部旷野'
	},
	'ama_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Amatsu Field'
		},
		notifyEnter: true,
		displayName: '樱花城 旷野'
	},
	'prt_sewb2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Culvert F2',
			subTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉地下水道 2层'
	},
	'nif_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Valley',
			subTitle: 'Niflheim'
		},
		notifyEnter: true,
		displayName: '尼芙菲姆 鬼之峡谷'
	},
	'nif_in.rsw': {
		displayName: '尼芙菲姆 内部'
	},
	'valkyrie.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Valkyrie Hall',
			subTitle: 'Hall of Honor'
		},
		notifyEnter: true,
		displayName: '瓦尔基里神殿(伟大战士们的殿堂)'
	},
	'y_airport.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Yuno Airport'
		},
		notifyEnter: true,
		displayName: '朱诺机场'
	},
	'lou_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Louyang Field'
		},
		notifyEnter: true,
		displayName: '龙之城 旷野'
	},
	'hu_fild06.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Hugel Field'
		},
		notifyEnter: true,
		displayName: '毁葛 旷野'
	},
	'lou_in01.rsw': {
		displayName: '龙之城 内部'
	},
	'new_4-1.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Training Ground'
		},
		notifyEnter: true,
		displayName: '初学者修练场'
	},
	'jawaii_in.rsw': {
		displayName: '爪哇咿 内部'
	},
	'gefenia01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffenia'
		},
		notifyEnter: true,
		displayName: '葛帔尼亚'
	},
	'gefenia04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffenia'
		},
		notifyEnter: true,
		displayName: '葛帔尼亚'
	},
	'que_god01.rsw': {
		displayName: '任务地图'
	},
	'ayo_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Ayothaya Field'
		},
		notifyEnter: true,
		displayName: '哎哟泰雅 旷野'
	},
	'ayo_dun01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Ancient Shrine Maze'
		},
		notifyEnter: true,
		displayName: '哎哟泰雅 古代神殿密穴'
	},
	'pay_d03_i.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Nightmare of Moonlight',
			subTitle: 'Illusion'
		},
		notifyEnter: true,
		displayName: '月夜猫的噩梦'
	},
	'yuno_fild08.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: "Kiel Hyre's Academy"
		},
		notifyEnter: true,
		displayName: "Kiel Hyre's Academy"
	},
	'pay_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'um_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Carpenter's Shop",
			subTitle: 'Umbala'
		},
		notifyEnter: true,
		displayName: "Carpenter's Shop in the Tree"
	},
	'turbo_n_4.rsw': {
		displayName: '竞速场地 竞赛场'
	},
	'einbroch.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Einbroch',
			subTitle: 'City of Steel in the Schwartzwald Republic'
		},
		notifyEnter: true,
		displayName: '钢铁之都 艾音布罗克'
	},
	'ein_in01.rsw': {
		displayName: '室内'
	},
	'airplane.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Airship'
		},
		notifyEnter: true,
		displayName: '飞空艇'
	},
	'job_star.rsw': {
		displayName: '太阳和月亮和星辰之地'
	},
	'ein_fild07.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'prt_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Prontera Field'
		},
		notifyEnter: true,
		displayName: '普隆德拉 旷野'
	},
	'ba_lost.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Lost Farm Valley'
		},
		notifyEnter: true,
		displayName: '失落的山谷饲养场'
	},
	'pvp_y_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Waiting Room'
		},
		notifyEnter: true,
		displayName: 'PvP : 等待室'
	},
	'bat_c01.rsw': {
		notifyEnter: true,
		displayName: '克里格·冯·米德加尔特'
	},
	'lhz_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Lighthalzen Field'
		},
		notifyEnter: true,
		displayName: '里希塔乐镇 旷野'
	},
	'hero_ent2.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: "2nd Hero's Gateway",
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: "Herosria 2nd Hero's Gateway"
	},
	'job3_guil03.rsw': {
		displayName: '偏僻的住宅'
	},
	'yuno_pre.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Schwartzwald Government Buildings'
		},
		notifyEnter: true,
		displayName: '秀发兹发德 政府厅舍'
	},
	'lhz_dun03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Somatology Laboratory F3'
		},
		notifyEnter: true,
		displayName: '生物体试验研究所 地下3层'
	},
	'lhz_dun02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Somatology Laboratory F2'
		},
		notifyEnter: true,
		displayName: '生物体试验研究所 地下2层'
	},
	'jupe_ele.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos Elevator'
		},
		notifyEnter: true,
		displayName: '优配擂斯电梯'
	},
	'ver_tunn.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Tunnel Outskirts',
			subTitle: 'Verus'
		},
		notifyEnter: true,
		displayName: '贝鲁兹外围隧道'
	},
	'jupe_area1.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos, Restricted Zone'
		},
		notifyEnter: true,
		displayName: '优配擂斯保安旷野'
	},
	'juperos_01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Outside of the Juperos Ruins'
		},
		notifyEnter: true,
		displayName: '优配擂斯废墟 外部'
	},
	'odin_tem01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: "Odin's Temple West Area"
		},
		notifyEnter: true,
		displayName: "Odin's Temple West Area"
	},
	'tha_t12.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Room of Hatred',
			subTitle: 'Thanatos Tower Upper Level'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 上层 憎恨之房'
	},
	'gld2_ald.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Tears of Hero',
			subTitle: 'Louis Abyss Corridor'
		},
		notifyEnter: true,
		displayName: '深渊回廊 : 英雄之泪'
	},
	'1@pop1.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: "Pope's Office",
			subTitle: 'Half Moon in the Daylight'
		},
		notifyEnter: true,
		displayName: "Pope's Office"
	},
	'tha_t01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Museum Entrance',
			subTitle: 'Thanatos Tower'
		},
		notifyEnter: true,
		displayName: '达纳托斯之塔 下层 博物馆入口'
	},
	'abyss_03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Cave 3F',
			subTitle: 'Abyss Lake'
		},
		notifyEnter: true,
		displayName: '毁葛深渊湖水 地下洞穴3层'
	},
	'abyss_01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Underground Cave 1F',
			subTitle: 'Abyss Lake'
		},
		notifyEnter: true,
		displayName: '毀葛深渊湖水 地下洞穴1层'
	},
	'ba_2whs01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Upper Floor of Tartaros Storage'
		},
		notifyEnter: true,
		displayName: '塔尔塔罗斯储藏室上层'
	},
	'mal_in02.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Inside the Ship',
			subTitle: 'Malangdo'
		},
		notifyEnter: true,
		displayName: '船 内部'
	},
	'auction_01.rsw': {
		displayName: '拍卖场'
	},
	'hero_out2.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Lacusarium',
			subTitle: 'Herosria'
		},
		notifyEnter: true,
		displayName: '希罗斯里亚海城之域'
	},
	'1@crd.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Volcano Island Corodo'
		},
		notifyEnter: true,
		displayName: 'Volcano Island Corodo'
	},
	'kh_vila.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Kiel Hyre's Cottage"
		},
		notifyEnter: true,
		displayName: "Kiel Hyre's Cottage"
	},
	'kh_kiehl01.rsw': {
		displayName: "Kiel's Room"
	},
	'ein_fild05.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'ein_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Einbroch Field'
		},
		notifyEnter: true,
		displayName: '艾音布罗克 旷野'
	},
	'jupe_cave.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Juperos Dungeon Entrance'
		},
		notifyEnter: true,
		displayName: '优配擂斯洞穴入口'
	},
	'arug_dun01.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon',
			subTitle: 'Arunafeltz'
		},
		notifyEnter: true,
		displayName: '公会地下密穴'
	},
	'iz_dun00.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B1',
			subTitle: 'Baylan Island'
		},
		notifyEnter: true,
		displayName: '依斯鲁得海底洞穴 1层'
	},
	'prt_lib.rsw': {
		backgroundBmp: 'noname',
		signName: {
			mainTitle: 'Memorial of Royal Family',
			subTitle: 'Prontera Royal Palace'
		},
		notifyEnter: true,
		displayName: '王室的记忆'
	},
	'hugel.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Hugel',
			subTitle: 'Quaint Garden Village'
		},
		notifyEnter: true,
		displayName: '田园都市 毁葛'
	},
	'ra_san03.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sanctuary East Area 1F',
			subTitle: 'Rachel Temple'
		},
		notifyEnter: true,
		displayName: '拉赫 神殿圣域1层 东边地区'
	},
	'1@glast.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Past Glastheim'
		},
		notifyEnter: true,
		displayName: '过去的克雷斯特汉姆古城'
	},
	'ra_fild04.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Audumla Grassland'
		},
		notifyEnter: true,
		displayName: '拉赫 奥顿拉草原'
	},
	'ra_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Od Canyon'
		},
		notifyEnter: true,
		displayName: '拉赫欧兹峡谷'
	},
	'bossnia_01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: '波斯尼亚'
	},
	'1@iwp.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: 'Frozen Scale Hill'
		},
		notifyEnter: true,
		displayName: '冰鳞山丘'
	},
	'ra_temple.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Sesilmir',
			subTitle: "Freya's Grand Temple"
		},
		notifyEnter: true,
		displayName: "Freya's Grand Temple (Sesilmir)"
	},
	'int_land01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Remote Island'
		},
		notifyEnter: true,
		displayName: 'Remote Island'
	},
	'ra_in01.rsw': {
		displayName: '拉赫 内部'
	},
	'grademk.rsw': {
		backgroundBmp: 'village_s1',
		signName: {
			subTitle: 'Grade Enhancer'
		},
		notifyEnter: true,
		displayName: '阶级强化所'
	},
	'1@tnm2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: "Demon's Tower - Top floor"
		},
		notifyEnter: true,
		displayName: "Demon's Tower - Top floor"
	},
	'turbo_room.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Waiting Room'
		},
		notifyEnter: true,
		displayName: '竞速场地 等待室'
	},
	'bossnia_03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bossnia'
		},
		notifyEnter: true,
		displayName: '波斯尼亚'
	},
	'1@ma_c.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Buwaya Cave'
		},
		notifyEnter: true,
		displayName: '宝箱巨鳄洞穴'
	},
	'schg_cas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Himinn Castle',
			subTitle: 'Nidhoggur'
		},
		notifyEnter: true,
		displayName: '尼它堆公会'
	},
	'mosk_dun03.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Dremuci Forest',
			subTitle: 'Moscovia'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚 深渊森林'
	},
	'mosk_dun01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Les Forest'
		},
		notifyEnter: true,
		displayName: '莫斯科比亚 森林'
	},
	'te_prt_gld.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Gloria',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Gloria'
	},
	'que_qaru03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'que_qsch04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'dic_fild02.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Bottom of Kamidal Mountain',
			subTitle: 'Jotunheim'
		},
		notifyEnter: true,
		displayName: '卡米达山麓'
	},
	'te_aldecas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Sorin Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Sorin Castle'
	},
	'que_qsch03.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'te_aldecas04.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Bennit Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Bennit Castle'
	},
	'moc_fild17.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Sograt Desert'
		},
		notifyEnter: true,
		displayName: '苏克拉特沙漠'
	},
	'5@tower.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Endless Tower'
		},
		notifyEnter: true,
		displayName: '无尽塔'
	},
	'que_dan02.rsw': {
		displayName: '朱诺 废弃屋内部'
	},
	'jor_dun03.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: "Inside the Snake's Nest"
		},
		notifyEnter: true,
		displayName: "Inside the Snake's Nest"
	},
	'spl_fild03.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Splendide Field'
		},
		notifyEnter: true,
		displayName: '辉煌领域'
	},
	'spl_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Splendide Field'
		},
		notifyEnter: true,
		displayName: '辉煌领域'
	},
	'mid_campin.rsw': {
		displayName: '米德加尔特联合驻地 内部'
	},
	'spl_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Splendide Field'
		},
		notifyEnter: true,
		displayName: '辉煌领域'
	},
	'splendide.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Splendide',
			subTitle: 'Yotunheim Lapine Base'
		},
		notifyEnter: true,
		displayName: '守护精灵前线阵地辉煌领域'
	},
	'job3_war02.rsw': {
		displayName: '大法师转职考场'
	},
	'job3_war01.rsw': {
		displayName: '大法师转职考场'
	},
	'1@def02.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Sky',
			subTitle: 'Wave Dungeon'
		},
		notifyEnter: true,
		displayName: 'Wave Dungeon - Sky'
	},
	'glast_01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆古城'
	},
	'jor_ab02.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Abandoned Pit 2nd Floor'
		},
		notifyEnter: true,
		displayName: '废弃坑洞2层'
	},
	'gld_dun02_2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Guild Dungeon Underground F2',
			subTitle: 'Louisa'
		},
		notifyEnter: true,
		displayName: '公会地下密穴 2层'
	},
	'mora.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Mora',
			subTitle: 'Bifrost Raffle Village'
		},
		notifyEnter: true,
		displayName: '草精族 穆拉村'
	},
	'payg_cas03.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Holy Shadow Castle',
			subTitle: 'Greenwood Lake'
		},
		notifyEnter: true,
		displayName: '青林湖泊 公会'
	},
	'que_house_s.rsw': {
		displayName: '诡异的屋'
	},
	'iz_dun05.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Undersea Tunnel B6',
			subTitle: 'Izlude'
		},
		notifyEnter: true,
		displayName: '依斯鲁得海底洞穴 6层'
	},
	'que_ng.rsw': {
		displayName: 'Unknown Place'
	},
	'que_lhz.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Somatology Laboratory 4th Basement'
		},
		notifyEnter: true,
		displayName: '生物体试验研究所 地下4层'
	},
	'gld2_gef.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Dead Man Hill',
			subTitle: 'Brittoria Abyss Corridor'
		},
		notifyEnter: true,
		displayName: '深渊回廊 : 亡者之丘'
	},
	'bra_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Brasilis Field'
		},
		notifyEnter: true,
		displayName: '巴西平原'
	},
	'job_ko.rsw': {
		displayName: '隐蔽居所'
	},
	'ma_zif04.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'Jeepney'
		},
		notifyEnter: true,
		displayName: '吉普尼车 内部'
	},
	'que_avan01.rsw': {
		displayName: "Avant's Laboratory"
	},
	'ecl_tdun04.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bifrost Tower 4F'
		},
		notifyEnter: true,
		displayName: '彩虹桥高塔 4层'
	},
	'rachel.rsw': {
		backgroundBmp: 'village',
		signName: {
			mainTitle: 'Rachel',
			subTitle: 'Capital of Arunafelz, the Study Nation'
		},
		notifyEnter: true,
		displayName: '阿卢纳贝兹 教国首都 拉赫'
	},
	'job3_rang01.rsw': {
		displayName: '游侠转职等候室'
	},
	'moc_prydn2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Pyramid B2'
		},
		notifyEnter: true,
		displayName: '梦罗克金字塔 地下2层(梦魇)'
	},
	'iz_ng01.rsw': {
		displayName: '忍者新手教学地图'
	},
	'que_qsch01.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Fallacious Okolnir'
		},
		notifyEnter: true,
		displayName: '虚幻的奥克尼尔'
	},
	'te_aldecas01.rsw': {
		backgroundBmp: 'siege',
		signName: {
			mainTitle: 'Glaris Castle',
			subTitle: 'Rune-Midgarts'
		},
		notifyEnter: true,
		displayName: 'Rune-Midgarts'
	},
	'mosk_fild01.rsw': {
		backgroundBmp: 'field',
		signName: {
			mainTitle: 'Whale Island',
			subTitle: 'Moscovia'
		},
		notifyEnter: true,
		displayName: '鲸鱼岛'
	},
	'ecl_in03.rsw': {
		displayName: '埃克拉珠 内部'
	},
	'1@ecl.rsw': {
		displayName: '埃克拉珠内部'
	},
	'1@xm_d.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Horror Toy Factory'
		},
		notifyEnter: true,
		displayName: '恐怖玩具工厂'
	},
	'1@dth2.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Bios Island'
		},
		notifyEnter: true,
		displayName: '拜欧斯岛'
	},
	'moro_vol.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Flame Basin'
		},
		notifyEnter: true,
		displayName: '火焰盆地'
	},
	'ver_eju.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'East Ruins',
			subTitle: 'Juperos'
		},
		notifyEnter: true,
		displayName: '优配擂斯 东边废墟'
	},
	'1@lab.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Central Laboratory'
		},
		notifyEnter: true,
		displayName: '中央实验室'
	},
	'prt_pri00.rsw': {
		displayName: '普隆德拉监狱'
	},
	'job4_tro.rsw': {
		backgroundBmp: 'field2_s2',
		signName: {
			mainTitle: "Empty Kvashir's Ship"
		},
		notifyEnter: true,
		displayName: "Empty Kvashir's Ship"
	},
	'pvp_y_3-4.rsw': {
		backgroundBmp: 'noname_s2',
		signName: {
			mainTitle: 'PvP Room Alberta'
		},
		notifyEnter: true,
		displayName: 'PvP : 艾尔贝塔'
	},
	'tur_dun06.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Underground Swamp Zone'
		},
		notifyEnter: true,
		displayName: '地下沼泽区'
	},
	'1@gl_k2.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Chivalry F1',
			subTitle: 'Old Glastheim'
		},
		notifyEnter: true,
		displayName: 'Old Glastheim Chivalry F1'
	},
	'1@gl_prq.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'The Fall of Glastheim'
		},
		notifyEnter: true,
		displayName: '克雷斯特汉姆的没落'
	},
	'pay_fild02.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Payon Forest'
		},
		notifyEnter: true,
		displayName: '斐扬树林'
	},
	'1@gl_kh.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Chivalry F1',
			subTitle: 'Old Glastheim'
		},
		notifyEnter: true,
		displayName: 'Old Glastheim Chivalry F2'
	},
	'2@gl_kh.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Chivalry F2',
			subTitle: 'Old Glastheim'
		},
		notifyEnter: true,
		displayName: 'Old Glastheim Chivalry F2'
	},
	'1@sthb.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Air Fortress - Inside'
		},
		notifyEnter: true,
		displayName: '空中要塞内部'
	},
	'sp_rudus4.rsw': {
		backgroundBmp: 'dungeon',
		signName: {
			mainTitle: 'Rudus F4',
			subTitle: 'Experiment Waste Disposal'
		},
		notifyEnter: true,
		displayName: '实验体废弃场 鲁杜斯 4层'
	},
	'1@ge_sn.rsw': {
		backgroundBmp: 'dungeon_s2',
		signName: {
			mainTitle: 'Geffen Night Arena'
		},
		notifyEnter: true,
		displayName: 'Geffen Night Arena'
	},
	'gw_fild01.rsw': {
		backgroundBmp: 'field_s2',
		signName: {
			mainTitle: 'Gray Wolf Forest'
		},
		notifyEnter: true,
		displayName: '灰狼森林'
	},
	'moc_para01.rsw': {
		backgroundBmp: 'village_s2',
		signName: {
			mainTitle: 'Paradise'
		},
		notifyEnter: true,
		displayName: '梦罗克乐园团 内部'
	},
	'que_dan01.rsw': {
		displayName: '毁葛 旷野'
	}
};

export default MapInfo;
