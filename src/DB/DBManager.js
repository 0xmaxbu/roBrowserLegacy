/**
 * DB/DBManager.js
 *
 * Manage and load DB files
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import Client from 'Core/Client.js';
import Configs from 'Core/Configs.js';
import Session from 'Engine/SessionStorage.js';
import TextEncoding from 'Utils/CodepageManager.js';
import FileManager from 'Core/FileManager.js';
import CLua from 'Vendors/wasmoon-lua5.1.js';
import JobId from './Jobs/JobConst.js';
import ClassTable from './Jobs/JobNameTable.js';
import PaletteTable from './Jobs/PalNameTable.js';
import WeaponAction from './Jobs/WeaponAction.js';
import WeaponJobTable from './Jobs/WeaponJobTable.js';
import BabyTable from './Jobs/BabyTable.js';
import HairIndexTable from './Jobs/HairIndexTable.js';
import MonsterTable from './Monsters/MonsterTable.js';
import MonsterNameTable from './Monsters/MonsterNameTable.js';
import PetIllustration from './Pets/PetIllustration.js';
import PetAction from './Pets/PetAction.js';
import ItemTable from './Items/ItemTable.js';
import HatTable from './Items/HatTable.js';
import ShieldTable from './Items/ShieldTable.js';
import WeaponTable from './Items/WeaponTable.js';
import WeaponType from './Items/WeaponType.js';
import WeaponTypeExpansion from './Items/WeaponTypeExpansion.js';
import WeaponSoundTable from './Items/WeaponSoundTable.js';
import WeaponHitSoundTable from './Items/WeaponHitSoundTable.js';
import RobeTable from './Items/RobeTable.js';
import LangOverlay from 'DB/LangOverlay.js';
import RandomOption from 'DB/Items/ItemRandomOptionTable.js';
import WorldMap from './Map/WorldMap.js';
import SKID from './Skills/SkillConst.js';
import SkillInfo from './Skills/SkillInfo.js';
import SkillTreeView from './Skills/SkillTreeView.js';
import JobHitSoundTable from './Jobs/JobHitSoundTable.js';
import WeaponTrailTable from './Items/WeaponTrailTable.js';
import TownInfo from './TownInfo.js';
import StatusInfo from './Status/StatusInfo.js';
import SC from './Status/StatusConst.js';
import XmlParse from 'Vendors/xmlparse.js';
import Base62 from 'Utils/Base62.js';
import { BSON } from 'bson';
import PetEmotionTable from './Pets/PetEmotionTable.js';
import PetHungryState from './Pets/PetHungryState.js';
import PetFriendlyState from './Pets/PetFriendlyState.js';
import PetMessageConst from './Pets/PetMessageConst.js';
import MapInfo from './Map/MapTable.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import wasmUrl from 'Vendors/liblua5.1.wasm?url';
import MemoryManager from 'Core/MemoryManager.js';

//Pet
//MapName

/**
 * @type {Object} lua instance
 */
let lua;
let HO_AI;
let MER_AI;
let default_HO_AI;
let default_MER_AI;

/**
 * @const {Array} message string
 */
const MsgStringTable = [];

/**
 * @const {Array} message string
 */
const JokeTable = [];

/**
 * @const {Array} message string
 */
const ScreamTable = [];

/**
 * @const {Array} map table
 * struct { string name; string mp3; object fog }
 */
const MapTable = {};

/**
 * @type {Object} SkillDescription Table
 */
let SkillDescription = {};

/**
 * @const {Array} ASCII sex
 */
const SexTable = ['\xbf\xa9', '\xb3\xb2'];

/**
 * @type {Object} Pet Talk json object
 */
let PetTalkTable = {};

/**
 * @const {Object} CheckAttendanceTable Attendance config
 * T-签2 多周期：Periods 由 InsertCheckAttendanceConfig/Reward 填充（每期一组），
 * loadAttendanceFile 执行完 main() 后按 UTC 今天选期，摊平成单期 Config/Rewards
 * （签到窗口组件消费的数据形状不变）。与服务端 pc_attendance_period 的运行时查表对称。
 */
const CheckAttendanceTable = { Config: {}, Rewards: [], Periods: [] };

/**
 * @const {Array} buyingStoreItemList Table
 */
const buyingStoreItemList = new Array();
import { createDBServices } from 'DB/DBServices.js';

import * as JobClassification from 'DB/Jobs/JobClassification.js';
import { createJobGroups } from 'DB/Jobs/JobGroups.js';

import { getMonsterName } from 'DB/Monsters/MonsterDatabase.js';

import { getSkillName, getSkillDescription } from 'DB/Skills/SkillDescriptions.js';

import { getHatResource } from 'DB/Effects/HatEffectLoader.js';
import mergeEz2Effects from 'DB/Effects/Ez2EffectMerge.js';

import { createItemLink, parseItemLink, getItemNameFromLink } from 'DB/Items/ItemLink.js';
import { formatUnixDate, formatMsgToHtml } from 'DB/System/Formatting.js';

/**
 * @type {Object} SignBoard Table
 */
let SignBoardTable = {};

/**
 * @const {Object} NaviMap Table
 */
const NaviMapTable = {};

/**
 * @const {Object} NaviMob Table
 */
const NaviMobTable = {};

/**
 * @const {Object} NaviNpc Table
 */
const NaviNpcTable = {};

/**
 * @const {Object} NaviLink Table
 */
const NaviLinkTable = {};

/**
 * @const {Object} NaviLinkDistance Table
 */
const NaviLinkDistanceTable = {};

/**
 * @const {Object} NaviNpcDistance Table
 */
const NaviNpcDistanceTable = {};

/**
 * @const {Object} QuestInfo Table
 */
const QuestInfo = {};

/**
 * @const {Object} Title Table
 */
const TitleTable = {};

/**
 * @type {Object} PetDBTable
 */
let PetDBTable = {};
let EggIDToJobID = {};

/**
 * @const {Object} Reputation Table
 */
const ReputeGroup = {};
const ReputeInfo = {};

/**
 * @const {Object} Achievement Table
 */
const AchievementTable = {};

/**
 * @const {Object} Achievement i18n Table — 来自 achievement_list.lub 的
 * achievement_tbl_i18n（ops 后台维护的多语言文案，按 lang 分组）
 */
const AchievementI18nTable = {};

/**
 * @const {Object} CSV Tables
 */
const MsgEmotionCSV = {};

/**
 * @const {Object} Hat Effect Tables
 */
const HatEffectID = {};
const HatEffectInfo = {};
const FootPrintEffectInfo = {};

/**
 * @const {Array} CashShopBanner Table
 */
const CashShopBannerTable = [];

/**
 * @const {Object} Ez2streffect Table
 */
const Ez2streffect = {};

const unknownItem = {
	unidentifiedDisplayName: 'Unknown Item',
	unidentifiedResourceName: '\xbb\xe7\xb0\xfa',
	unidentifiedDescriptionName: ['...'],
	identifiedDisplayName: 'Unknown Item',
	identifiedResourceName: '\xbb\xe7\xb0\xfa',
	identifiedDescriptionName: ['...'],
	slotCount: 0,
	ClassNum: 0
};

/**
 * @const {Array} User charpage init
 */
const servers = Configs.get('servers', []);
const langType = servers[0] && servers[0].langtype ? parseInt(servers[0].langtype, 0) : 0;

// setup default encoding
const userCharpage = TextEncoding.detectEncodingByLangtype(langType, Configs.get('disableKorean'));
const grfCharpage = 'windows-1252';
	TextEncoding.setCharset(grfCharpage);
// Sex-specific asset path components.

// setup default encoding

// create decoders

/**
 * DB NameSpace
 */
// 喵喵宠物精灵名表（pet 职业号 → data/sprite/펫/ 下文件名，与 server pet_db import 同号）
const MEOW_PET_TABLE = {
	21602: 'meow_white',
	21603: 'meow_blue',
	21604: 'meow_tabby',
	21605: 'meow_black',
	21606: 'meow_gray',
	21607: 'meow_cow',
	21608: 'meow_orange'
};
let initialJobGroups = createJobGroups();

function loadTable(filename, separator, size, callback, onEnd, useCharPage = false) {
	Client.loadFile(
		filename,
		function (buffer) {
			console.log('Loading file "' + filename + '"...');

			let data = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
			data = TextEncoding.decode(data, useCharPage ? userCharpage : null);

			// Remove commented lines
			const content = ('\n' + data).replace(/\n(\/\/[^\n]+)/g, '');
			const elements = content.split(separator);
			const count = elements.length;
			const args = new Array(size + 1);

			for (let i = 0; i < count; i++) {
				if (i % size === 0) {
					if (i) {
						callback.apply(null, args);
					}
					args[i % size] = i;
				}

				args[(i % size) + 1] = elements[i].replace(/^\s+|\s+$/g, ''); // trim
			}

			onEnd();
		},
		onEnd
	);
}
function loadCSV(filename, targetTable, keyIndex, valueIndex, onEnd) {
	Client.loadFile(
		filename,
		function (data) {
			console.log('Loading file "' + filename + '"...');

			const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
			let text = '';
			let isBase64 = true;

			// Convert buffer to a raw "binary string".
			// This prevents atob() from throwing "outside latin1 range" errors.
			for (let i = 0, count = bytes.length; i < count; i++) {
				text += String.fromCharCode(bytes[i]);
			}

			// Check if the file is Base64 encoded
			if (!text.trimEnd().endsWith('=')) {
				text = TextEncoding.decode(bytes, 'utf-8');
				isBase64 = false;
			}

			// Split lines
			const lines = text.split(/\r?\n/);
			let index = 0;
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i].trim();
				if (!line || line.startsWith('//')) {
					continue;
				}

				const parts = isBase64 ? line.split(',') : line.split('\t');
				if (parts.length <= Math.max(keyIndex, valueIndex)) {
					continue;
				}

				try {
					// Decode columns from Base64
					const value = isBase64 ? base64DecodeUtf8(parts[valueIndex].trim()) : parts[valueIndex].trim();
					targetTable[index] = value;
					index++;
				} catch (e) {
					console.error('Base64 decode failed on line', i + 1, ':', line, e);
				}
			}
			if (typeof onEnd === 'function') {
				onEnd();
			}
		},
		onEnd
	);
}
function loadXMLFile(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			console.log('Loading file "' + filename + '"...');
			let xml = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
			xml = TextEncoding.decode(xml, userCharpage);
			xml = xml.replace(/^.*<\?xml/, '<?xml');
			const parser = new DOMParser();
			const parsedXML = parser.parseFromString(xml, 'application/xml');
			const json = XmlParse.xml2json(parsedXML);
			callback.call(null, json);
			onEnd();
		},
		onEnd
	);
}
function loadBSONFile(filename, targetTable, onEnd) {
	Client.loadFile(
		filename,
		function (arrayBuffer) {
			try {
				console.log('Loading file "' + filename + '"...');

				const bytes = new Uint8Array(arrayBuffer);
				let offset = 0;

				const docs = [];

				while (offset < bytes.length) {
					const size =
						bytes[offset] |
						(bytes[offset + 1] << 8) |
						(bytes[offset + 2] << 16) |
						(bytes[offset + 3] << 24);

					const slice = bytes.slice(offset, offset + size);
					docs.push(BSON.deserialize(slice));

					offset += size;
				}

				// ---- AS-IS TABLE HANDLING ----

				let data;
				if (docs.length === 1) {
					data = docs[0]; // single root document
				} else {
					data = docs; // true multi-doc BSON
				}

				// Clear target table
				for (const k in targetTable) {
					delete targetTable[k];
				}

				// If root has exactly ONE key, unwrap it
				if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 1) {
					const rootKey = Object.keys(data)[0];
					data = data[rootKey];
				}

				// Copy AS-IS
				Object.assign(targetTable, data);
			} catch (e) {
				console.error('BSON parse error:', e);
			} finally {
				if (onEnd) {
					onEnd();
				}
			}
		},
		onEnd
	);
}
function getSystemAliases(basePath) {
	basePath = basePath.replace(/\.(lub|lua)$/i, ''); // Prevents extension been passed

	const suffixes = ['', '_true', '_sak', '_Sakray']; // Priority order
	const extensions = ['.lub', '.lua'];
	const fileList = [];

	for (let s = 0; s < suffixes.length; s++) {
		for (let e = 0; e < extensions.length; e++) {
			fileList.push(basePath + suffixes[s] + extensions[e]);
		}
	}
	return fileList;
}
function loadMoveInfoTable(onEnd) {
	Client.loadFile(
		'data/ItemMoveInfoV5.txt',
		function (file) {
			console.log('Loading file "ItemMoveInfoV5.txt"...');

			let data = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
			data = TextEncoding.decode(data, userCharpage);
			const lines = data.split(/\r?\n/);

			for (let line of lines) {
				line = line.trim();
				if (!line || line.startsWith('//')) {
					continue;
				}

				// Remove inline comments
				const commentIndex = line.indexOf('//');
				if (commentIndex !== -1) {
					line = line.slice(0, commentIndex).trim();
				}

				const cols = line.split(/\s+/);
				if (cols.length < 9) {
					console.warn('Invalid ItemMoveInfo line:', line);
					continue;
				}

				const [key, drop, exchange, storage, cart, npcSale, mail, auction, guildStorage] = cols;

				const item = ItemTable[key] || (ItemTable[key] = {});

				item.moveInfo = {
					Drop: drop === '1',
					Exchange: exchange === '1',
					Storage: storage === '1',
					Cart: cart === '1',
					NPCSale: npcSale === '1',
					Mail: mail === '1',
					Auction: auction === '1',
					GuildStorage: guildStorage === '1'
				};
			}
			onEnd();
		},
		onEnd
	);
}
async function startLua() {
	lua = await CLua.Lua.create({ customWasmUri: wasmUrl });
	HO_AI = await CLua.Lua.create({ customWasmUri: wasmUrl });
	MER_AI = await CLua.Lua.create({ customWasmUri: wasmUrl });
	default_HO_AI = await CLua.Lua.create({ customWasmUri: wasmUrl });
	default_MER_AI = await CLua.Lua.create({ customWasmUri: wasmUrl });
}

const userStringDecoder = TextEncoding;
const ItemDBNameTbl = {};
const ItemReformTable = { ReformInfo: {}, ReformItemList: {} };
let EnchantListTable = {};
const LaphineSysTable = [];
const LaphineUpgTable = [];
const SignBoardTranslatedTable = {};
function base64DecodeUtf8(str) {
	try {
		const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
		return TextEncoding.decode(bytes, 'utf-8');
	} catch (e) {
		console.warn('Base64 UTF-8 decode failed:', str, e);
		return str;
	}
}

class DB {
	/**
	 * @type {Object} file alias list
	 */
	static mapalias = {};

	/**
	 * @type {Object} CharName by GID list
	 */
	static CNameTable = {};

	/**
	 * @type {string} interface path
	 */
	static INTERFACE_PATH = 'data/texture/\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/';

	/**
	 * @type {string} lua path
	 */
	static LUA_PATH = 'data/luafiles514/lua files/';

	/**
	 * @type {Object} UpdateOwnerName Table
	 */
	static UpdateOwnerName = {};

	static isLoaded = false;
	static count = 0;
	static index = 0;
	static lazyInit() {
		// Lua 运行时（HOAI/MERAI 宠物 AI）异步初始化；延迟到 lazyInit 保证模块导入零副作用（上游测试环境要求）
		startLua();
		console.log('Loading DB files...');
		// Callback
		DB.index = 0;
		DB.count = 0;
		function onLoad() {
			DB.count++;
			return function OnLoadClosure() {
				DB.index++;

				if (DB.onProgress) {
					DB.onProgress(DB.index, DB.count);
				}

				if (DB.index === DB.count) {
					DB.isLoaded = true;
					// Force cleanup of DB file data (lua, txt, csv, bson blobs) that are no longer needed
					// gl is null here because we may not have a WebGL context yet during lazy loading
					MemoryManager.forceClean(null, /\.(lub|lua|txt|csv|bson)$/i);
				}
			};
		}

		// CSV Tables - Client Date is not sure since when they were added
		if (PACKETVER.value >= 20230302) {
			loadCSV('data/simplemsg/msg_emotion.csv', MsgEmotionCSV, 0, 2, onLoad());
		}
		// TODO: load these load files by PACKETVER
		if (Configs.get('loadLua')) {
			// Item
			let iteminfoNames = [];
			const customII = Configs.get('customItemInfo', []);

			if (Array.isArray(customII) && customII.length > 0) {
				// add custom client info table
				iteminfoNames = iteminfoNames.concat(customII);
				tryLoadLuaAliases(loadItemInfo, iteminfoNames, null, onLoad(), true);
			} else {
				iteminfoNames = iteminfoNames.concat(getSystemAliases('System/itemInfo.lub'));
				tryLoadLuaAliases(loadItemInfo, iteminfoNames, null, onLoad());
			}

			loadLuaTable(
				[DB.LUA_PATH + 'datainfo/accessoryid.lub', DB.LUA_PATH + 'datainfo/accname.lub'],
				'AccNameTable',
				function (json) {
					Object.assign(HatTable, json);
				},
				onLoad()
			);
			loadLuaTable(
				[DB.LUA_PATH + 'datainfo/spriterobeid.lub', DB.LUA_PATH + 'datainfo/spriterobename.lub'],
				'RobeNameTable',
				function (json) {
					Object.assign(RobeTable, json);
				},
				onLoad()
			);

			if (PACKETVER.value >= 20141008) {
				loadLuaTable(
					[DB.LUA_PATH + 'datainfo/npcidentity.lub', DB.LUA_PATH + 'datainfo/jobname.lub'],
					'JobNameTable',
					function (json) {
						Object.assign(MonsterTable, json);
					},
					onLoad(),
					function () {
						loadPetInfo(DB.LUA_PATH + 'datainfo/petinfo.lub', null, function () {
							tryLoadLuaAliases(
								loadPetEvolution,
								getSystemAliases('System/PetEvolutionCln.lub'),
								null,
								onLoad()
							);
						});
					}
				);
			} else {
				loadLuaTable(
					[DB.LUA_PATH + 'datainfo/npcidentity.lub', DB.LUA_PATH + 'datainfo/jobname.lub'],
					'JobNameTable',
					function (json) {
						Object.assign(MonsterTable, json);
					},
					onLoad()
				);
			}

			loadLuaTable(
				[DB.LUA_PATH + 'datainfo/enumvar.lub', DB.LUA_PATH + 'datainfo/addrandomoptionnametable.lub'],
				'NameTable_VAR',
				function (json) {
					Object.assign(RandomOption, json);
				},
				onLoad()
			);
			loadItemDBTable(DB.LUA_PATH + 'ItemDBNameTbl.lub', null, onLoad());

			// Weapon tables
			loadWeaponTable(DB.LUA_PATH + 'datainfo/weapontable.lub', null, onLoad());

			// Title tables
			if (PACKETVER.value >= 20170208) {
				loadTitleTable(DB.LUA_PATH + 'datainfo/titletable.lub', null, onLoad());
			}

			// Skill - load skillid.lub to populate SKID, then load description
			const onSkillEnd = onLoad();
			loadLuaValue(DB.LUA_PATH + 'skillinfoz/skillid.lub', 'SKID', json => {
				if (json && typeof json === 'object') {
					// Validate and merge entries into SKID
					for (const k in json) {
						if (Object.prototype.hasOwnProperty.call(json, k)) {
							const value = json[k];
							if (typeof value === 'number' && value > 0) {
								SKID[k] = value;
							}
						}
					}
				}
				// Load description - skillid.lub is re-executed harmlessly (Lua just repopulates globals)
				loadLuaTable(
					[DB.LUA_PATH + 'skillinfoz/skillid.lub', DB.LUA_PATH + 'skillinfoz/skilldescript.lub'],
					'SKILL_DESCRIPT',
					_json => {
						SkillDescription = _json;
					},
					() => {
						// Calls after skillids and descs been populated
						loadSkillInfoList(DB.LUA_PATH + 'skillinfoz/skillinfolist.lub', null, () => {
							loadSkillTreeView(DB.LUA_PATH + 'skillinfoz/skilltreeview.lub', null, () => {
								// Load ez2streffect, PACKETVER unknown when the while has been added, tied to default PACKETVER of rathena for 4th job
								if (PACKETVER.value >= 20211103) {
									const bsonOnLoad = onLoad();
									loadBSONFile('data/contentdata/effectdata/ez2streffect.bson', Ez2streffect, () => {
										Promise.all([
											import('DB/Effects/EffectTable.js'),
											import('DB/Skills/SkillEffect.js')
										]).then(([EffectTable, SkillEffect]) => {
											mergeEz2Effects(EffectTable.default, SkillEffect.default);
											bsonOnLoad();
										});
									});
								}
								// Skill Lua finished
								onSkillEnd();
							});
						});
					}
				);
			});

			// Status
			loadStateIconInfo(DB.LUA_PATH + 'stateicon/', null, onLoad());

			// Legacy Navigation
			if (PACKETVER.value >= 20111010) {
				loadLuaValue(
					DB.LUA_PATH + 'navigation/navi_map_krpri.lub',
					'Navi_Map',
					function (json) {
						Object.assign(NaviMapTable, json);
					},
					onLoad()
				);
				loadLuaValue(
					DB.LUA_PATH + 'navigation/navi_mob_krpri.lub',
					'Navi_Mob',
					function (json) {
						Object.assign(NaviMobTable, json);
					},
					onLoad()
				);
				loadLuaValue(
					DB.LUA_PATH + 'navigation/navi_npc_krpri.lub',
					'Navi_Npc',
					function (json) {
						Object.assign(NaviNpcTable, json);
					},
					onLoad()
				);
				loadLuaValue(
					DB.LUA_PATH + 'navigation/navi_link_krpri.lub',
					'Navi_Link',
					function (json) {
						Object.assign(NaviLinkTable, json);
					},
					onLoad()
				);
				loadLuaValue(
					DB.LUA_PATH + 'navigation/navi_linkdistance_krpri.lub',
					'Navi_Distance',
					function (json) {
						Object.assign(NaviLinkDistanceTable, json);
					},
					onLoad()
				);
				loadLuaValue(
					DB.LUA_PATH + 'navigation/navi_npcdistance_krpri.lub',
					'Navi_NpcDistance',
					function (json) {
						Object.assign(NaviNpcDistanceTable, json);
					},
					onLoad()
				);
			}

			// HatEffect
			if (PACKETVER.value >= 20150507) {
				loadHatEffectInfo(onLoad());
			}

			// LaphineSys
			if (PACKETVER.value >= 20160601) {
				loadLaphineSysFile(DB.LUA_PATH + 'datainfo/lapineddukddakbox.lub', null, onLoad());
			}

			// LaphineUpg
			if (PACKETVER.value >= 20170726) {
				loadLaphineUpgFile(DB.LUA_PATH + 'datainfo/lapineupgradebox.lub', null, onLoad());
			}

			// ItemReform
			if (PACKETVER.value >= 20200916) {
				loadItemReformFile(DB.LUA_PATH + 'ItemReform/ItemReformSystem.lub', null, onLoad());
			}

			// EnchantList
			if (PACKETVER.value >= 20211103) {
				loadEnchantListFile(DB.LUA_PATH + 'Enchant/EnchantList', onLoad());
			}

			// MapName
			if (Configs.get('enableMapName') /*PACKETVER.value >= 20190605*/) {
				// We allow this feature to be enabled on any version due to popular demand
				tryLoadLuaAliases(
					loadMapTbl,
					getSystemAliases('System/mapInfo.lub'),
					function (json) {
						for (const key in json) {
							if (json.hasOwnProperty(key)) {
								MapInfo[key] = json[key];
							}
						}
						updateMapTable();
					},
					onLoad()
				);
			}

			// EntitySignBoard
			const onSignBoardEnd = onLoad();
			loadSignBoardList(DB.LUA_PATH + 'SignBoardList.lub', null, () => {
				// this is not official, its a translation file
				loadSignBoardData('SystemEN/Sign_Data.lub', null, onSignBoardEnd);
			});

			// Quest
			const onQuestEnd = onLoad();
			tryLoadLuaAliases(loadQuestInfo, getSystemAliases('System/OngoingQuestInfoList.lub'), null, () => {
				// this is not official, its a translation file
				loadQuestInfo('SystemEN/OngoingQuests.lub', null, onQuestEnd);
			});

			// TODO: System/RecommendedQuests.lub

			// Cash Shop Banner - implemented early 2018
			if (Configs.get('enableCashShop') && PACKETVER.value >= 20180000) {
				loadCashShopBanner(DB.LUA_PATH + 'datainfo/tb_cashshop_banner.lub', null, onLoad());
			}
		} else {
			// Item
			loadTable(
				'data/num2itemdisplaynametable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).unidentifiedDisplayName = val.replace(/_/g, ' ');
				},
				onLoad(),
				true
			);
			loadTable(
				'data/num2itemresnametable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).unidentifiedResourceName = val;
				},
				onLoad(),
				true
			);
			loadTable(
				'data/num2itemdesctable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).unidentifiedDescriptionName = val.split('\n');
				},
				onLoad(),
				true
			);
			loadTable(
				'data/idnum2itemdisplaynametable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).identifiedDisplayName = val.replace(/_/g, ' ');
				},
				onLoad(),
				true
			);
			loadTable(
				'data/idnum2itemresnametable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).identifiedResourceName = val;
				},
				onLoad(),
				true
			);
			loadTable(
				'data/idnum2itemdesctable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).identifiedDescriptionName = val.split('\n');
				},
				onLoad(),
				true
			);
			loadTable(
				'data/itemslotcounttable.txt',
				'#',
				2,
				function (_index, key, val) {
					(ItemTable[key] || (ItemTable[key] = {})).slotCount = val;
				},
				onLoad()
			);

			// 头饰外观表：kRO accname.lub 离线解码的 txt 回退（2026-11-16）。
			// loadLua:false 时 HatTable 原本只能由 datainfo/accname.lub 填充（在 loadLua
			// 门控内，永不加载）→ 所有头饰/时装头饰装备后无外观。本表为唯一 HatTable
			// 来源，键 = View ID，值 = 精灵名（CP949，与 accname.lub 解码结果一致）。
			// 文件经 remote-client overlay 层投放（tools 外部生成，见
			// dev-logs/2026-11-16-gacha-restyle-palette.md §渲染修复）。
			loadTable(
				'data/accessorytable.txt',
				'#',
				2,
				function (_index, key, val) {
					HatTable[key] = val;
				},
				onLoad(),
				true
			);

			// Skill
			loadTable(
				'data/skilldesctable.txt',
				'#',
				2,
				function (_index, key, val) {
					SkillDescription[SKID[key]] = val.replace('\r\n', '\n');
				},
				onLoad(),
				true
			);
			// TODO: data/skillnametable.txt	- ?
			// TODO: data/skilltreeview.txt	- Replaces DB/Skills/SkillTreeView.js
			// TODO: data/leveluseskillspamount.txt	- Replaces DB/Skills/SkillInfo.js -> SkillInfo.SpAmount

			// Quest
			loadTable('data/questid2display.txt', '#', 6, parseQuestEntry, onLoad(), true);
		}

		// CheckAttendance
		// 2026-11-12 修复：调用点原位于上方 loadLua 块内——本部署 loadLua:false（kRO 2019
		// GRF 缺 lua 集，开 true 登录卡死 97%），整块跳过 → loadAttendanceFile 从未执行 →
		// 签到窗口空壳。上游 MrAntares master（DBLoadPlan.js）同样埋在块内，且上游全部默认
		// 部署配置（api.js/pwa/builder-web/GitHub Pages 演示）均 loadLua:false，属上游潜伏
		// 缺陷，rebase 上游时需重放本修复。本 lub 由本地 data 目录自供（不依赖 GRF lua 集），
		// 加载器走主线程直连 fetch，故移出块外仅由 enableCheckAttendance 门控。
		// UI 使用门控在 MapEngine/UIOpen（enableCheckAttendance + PACKETVER，彼时值已就绪）。
		if (Configs.get('enableCheckAttendance')) {
			loadAttendanceFile('System/CheckAttendance.lub', null, onLoad());
		}

		// Load ItemMoveInfo and attach to ItemTable
		if (PACKETVER.value >= 20150422) {
			loadMoveInfoTable(onLoad());
		}

		// WoldMap
		loadWorldMapInfo(DB.LUA_PATH + 'worldviewdata/', onLoad());
		// Town Info
		const onTownInfoEnd = onLoad();
		loadTownInfoFile('System/Towninfo.lub', null, () => {
			// this is not official, its a translation file
			loadTownInfoFile('SystemEN/Towninfo.lub', null, onTownInfoEnd);
		});

		// Achievements — 不受 loadLua 门控（本项目 loadLua:false 走 txt 模式，
		// 但成就 LUB 由 ops 后台生成投放在 overlay，必须独立加载；
		// 详见 ro-platform docs/achievement-system.md）
		if (Configs.get('enableAchievements') && PACKETVER.value >= 20150513) {
			const onAchievementEnd = onLoad();
			loadLuaValue(
				'System/achievement_list.lub',
				'achievement_tbl',
				function (json) {
					if (json) {
						Object.assign(AchievementTable, json);
					}
				},
				() => {
					// 同一文件的第二个变量：多语言文案（zh 覆盖层，见 getAchievementInfo）
					loadLuaValue(
						'System/achievement_list.lub',
						'achievement_tbl_i18n',
						function (json) {
							if (json) {
								Object.assign(AchievementI18nTable, json);
							}
						},
						onAchievementEnd
					);
				}
			);
		}

		// Forging/Creation
		loadTable(
			'data/metalprocessitemlist.txt',
			'#',
			2,
			function (_index, key, val) {
				(ItemTable[key] || (ItemTable[key] = {})).processitemlist = val.split('\n');
			},
			onLoad(),
			true
		);

		// Card
		loadTable(
			'data/num2cardillustnametable.txt',
			'#',
			2,
			function (_index, key, val) {
				(ItemTable[key] || (ItemTable[key] = {})).illustResourcesName = val;
			},
			onLoad()
		);
		loadTable(
			'data/cardprefixnametable.txt',
			'#',
			2,
			function (_index, key, val) {
				(ItemTable[key] || (ItemTable[key] = {})).prefixName = val;
			},
			onLoad(),
			true
		);
		loadTable(
			'data/cardpostfixnametable.txt',
			'#',
			1,
			function (_index, key) {
				(ItemTable[key] || (ItemTable[key] = {})).isPostfix = true;
			},
			onLoad(),
			true
		);

		// EtcMapData
		loadTable('data/fogparametertable.txt', '#', 5, parseFogEntry, onLoad());
		loadTable('data/indoorrswtable.txt', '#', 1, parseIndoorEntry, onLoad());

		// Frost/Scream
		loadTable(
			'data/ba_frostjoke.txt',
			'\t',
			1,
			function (_index, val) {
				JokeTable[_index] = val;
			},
			onLoad(),
			true
		);
		loadTable(
			'data/dc_scream.txt',
			'\t',
			1,
			function (_index, val) {
				ScreamTable[_index] = val;
			},
			onLoad(),
			true
		);

		// Tips
		// TODO: /tipoftheday.txt
		// TODO: /GuildTip.txt

		loadXMLFile(
			'data/pettalktable.xml',
			function (json) {
				PetTalkTable = json['monster_talk_table'];
			},
			onLoad()
		);

		if (PACKETVER.value >= 20100427) {
			loadTable(
				'data/buyingstoreitemlist.txt',
				'#',
				1,
				function (_index, key) {
					buyingStoreItemList.push(parseInt(key, 10));
				},
				onLoad()
			);
		}

		// Reputation
		if (PACKETVER.value >= 20220330) {
			loadBSONFile('data/contentdata/repute/reputegroupdata.bson', ReputeGroup, function () {});
			loadBSONFile('data/contentdata/repute/reputeinfodata.bson', ReputeInfo, function () {});
		}

		Network.hookPacket(PACKET.ZC.ACK_REQNAME_BYGID, onUpdateOwnerName);
		Network.hookPacket(PACKET.ZC.ACK_REQNAME_BYGID2, onUpdateOwnerName);

		const onAIDriverLoaded = onLoad();
		import('Core/AIDriver.js').then(module => {
			module.default.initAI(onAIDriverLoaded);
		});
	}
	static getHOAI_VM() {
		return HO_AI;
	}

	static getMERAI_VM() {
		return MER_AI;
	}

	static getDefaultHOAI_VM() {
		return default_HO_AI;
	}

	static getDefaultMERAI_VM() {
		return default_MER_AI;
	}

	static getAllTitles() {
		return systemDatabase.SystemDatabase.getAllTitles(...arguments);
	}

	static getAchievementTable() {
		return systemDatabase.SystemDatabase.getAchievementTable(...arguments);
	}

	/**
	 * 成就展示信息（按 Session.PlayerLang 应用多语言覆盖层，LangOverlay 同款模式）。
	 * 基线为 LUB 内 achievement_tbl（英文 Name）；zh 覆盖来自 achievement_tbl_i18n。
	 * 未命中语言覆盖或条目不存在时回退基线 / 返回 null。
	 */
	static getAchievementInfo(achId) {
		const base = AchievementTable[achId];
		if (!base) {
			return null;
		}
		if (Session.PlayerLang !== 'zh') {
			return base;
		}
		const zh = AchievementI18nTable.zh && AchievementI18nTable.zh[achId];
		if (!zh) {
			return base;
		}
		return {
			...base,
			title: zh.title !== undefined ? zh.title : base.title,
			content: {
				summary: (zh.content && zh.content.summary) || (base.content && base.content.summary) || '',
				details: (zh.content && zh.content.details) || (base.content && base.content.details) || ''
			}
		};
	}

	static getTitleString(titleID) {
		return systemDatabase.SystemDatabase.getTitleString(...arguments);
	}

	static getSkillName(skillID) {
		return getSkillName(skillID);
	}

	/**
	 * Actor Type checks
	 *
	 * @param {number} jobid
	 */
	static isNPC(jobid) {
		return JobClassification.isNPC.call(this, jobid);
	}

	static isMercenary(jobid) {
		return JobClassification.isMercenary.call(this, jobid);
	}

	static isHomunculus(jobid) {
		return JobClassification.isHomunculus.call(this, jobid);
	}

	static isMonster(jobid) {
		return JobClassification.isMonster.call(this, jobid);
	}

	static isPlayer(jobid) {
		return JobClassification.isPlayer.call(this, jobid);
	}

	static isDoram(jobid) {
		return JobClassification.isDoram.call(this, jobid);
	}

	/**
	 * Is character id a baby ?
	 *
	 * @param {number} job id
	 * @return {boolean} is baby
	 */
	static isBaby(jobid) {
		return JobClassification.isBaby.call(this, jobid);
	}

	/**
	 * Is character a Assassin class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_ASSASSIN = initialJobGroups.S_JOBS_ASSASSIN;

	static isAssassin(jobid) {
		return JobClassification.isAssassin.call(this, jobid);
	}

	/**
	 * Is character a Hunter class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_HUNTER = initialJobGroups.S_JOBS_HUNTER;

	static isHunter(jobid) {
		return JobClassification.isHunter.call(this, jobid);
	}

	/**
	 * Is character a Monk class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_MONK = initialJobGroups.S_JOBS_MONK;

	static isMonk(jobid) {
		return JobClassification.isMonk.call(this, jobid);
	}

	/**
	 * Is character a SN class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_SN = initialJobGroups.S_JOBS_SN;

	static isSuperNovice(jobid) {
		return JobClassification.isSuperNovice.call(this, jobid);
	}

	/**
	 * Is character a TaeKwon class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_TAEKWON = initialJobGroups.S_JOBS_TAEKWON;

	static isTaeKwon(jobid) {
		return JobClassification.isTaeKwon.call(this, jobid);
	}

	/**
	 * Is character a Gunslinger class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_GS = initialJobGroups.S_JOBS_GS;

	static isGunslinger(jobid) {
		return JobClassification.isGunslinger.call(this, jobid);
	}

	/**
	 * Is character a Royal Guard class
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_RG = initialJobGroups.S_JOBS_RG;

	static isRoyalGuard(jobid) {
		return JobClassification.isRoyalGuard.call(this, jobid);
	}

	/**
	 * Is character using Madogear
	 *
	 * @param {number} jobid
	 * @return {boolean}
	 */
	static S_JOBS_MADO = initialJobGroups.S_JOBS_MADO;

	static isMadogear(jobid) {
		return JobClassification.isMadogear.call(this, jobid);
	}

	static isElem(jobid) {
		return JobClassification.isElem.call(this, jobid);
	}

	static isAbr(jobid) {
		return JobClassification.isAbr.call(this, jobid);
	}

	static isBionic(jobid) {
		return JobClassification.isBionic.call(this, jobid);
	}

	static isWarp(jobid) {
		return JobClassification.isWarp.call(this, jobid);
	}

	/**
	 * @return {string} path to body sprite/action
	 * @param {number} id entity
	 * @param {boolean} sex
	 * @param {number} alternative sprite
	 * @return {string}
	 */
	static getBodyPath(id, sex, alternative = -1, cashMountCostume = false) {
		// TODO: Warp STR file
		if (id === 45) {
			return null;
		}

		// Not visible sprite
		if (id === 111 || id === 139 || id == 2337) {
			return null;
		}

		// 喵喵宠物（自定义蛋宠物 21602-21608，mob id 区段 20020-31999）：预合成单文件精灵，
		// 宠物渲染不走头部/身体分层，毛色已烘焙进精灵（data/sprite/펫/meow_*.spr/.act）
		if (MEOW_PET_TABLE[id]) {
			return 'data/sprite/\xc6\xea/' + MEOW_PET_TABLE[id];
		}

		// PC
		if (DB.isPlayer(id)) {
			// DORAM
			let result = DB.isDoram(id)
				? 'data/sprite/\xb5\xb5\xb6\xf7\xc1\xb7/\xb8\xf6\xc5\xeb/'
				: 'data/sprite/\xc0\xce\xb0\xa3\xc1\xb7/\xb8\xf6\xc5\xeb/';
			result += SexTable[sex] + '/';

			if (PACKETVER.value > 20141022 && alternative > 0 && id !== alternative) {
				const use_costume =
					alternative > JobId.COSTUME_SECOND_JOB_START && alternative < JobId.COSTUME_SECOND_JOB_END;

				if (use_costume) {
					result += 'costume_1/';
				}

				result += (cashMountCostume ? ClassTable[id] : ClassTable[alternative]) || ClassTable[0];

				result += '_' + SexTable[sex];

				if (use_costume) {
					result += '_1';
				}
				return result;
			}

			result += ClassTable[id] || ClassTable[0];
			result += '_' + SexTable[sex];

			return result;
		}

		// NPC
		if (DB.isNPC(id)) {
			return 'data/sprite/npc/' + (MonsterTable[id] || MonsterTable[46]).toLowerCase();
		}

		// MERC
		if (DB.isMercenary(id)) {
			// archer - female path | lancer and swordman - male path
			// mercenary entry on monster table have sex path included
			return 'data/sprite/\xc0\xce\xb0\xa3\xc1\xb7/\xb8\xf6\xc5\xeb/' + MonsterTable[id];
		}

		// HOMUN
		if (DB.isHomunculus(id)) {
			return 'data/sprite/homun/' + (MonsterTable[id] || MonsterTable[1002]).toLowerCase();
		}

		//
		// OTHER ACTORS
		//
		switch (id) {
			case '11_FALCON':
			case '4034_FALCON':
				// 2nd
				return 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/\xb8\xc5';
			case '4012_FALCON':
				// rebirth
				return 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/\xb8\xc5\x32';
			case '4056_FALCON':
			case '4062_FALCON':
			case '4098_FALCON':
				// 3rd
				return 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/owl';
			case '4257_FALCON':
			case '4270_FALCON':
			case '4278_FALCON':
				// 4th
				return 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/windhawk_hawk';
			case '4056_WUG':
			case '4062_WUG':
			case '4098_WUG':
				// 3rd
				return 'data/sprite/\xb8\xf3\xbd\xba\xc5\xcd/\xbf\xf6\xb1\xd7';
			case '4257_WUG':
				// 4th
				return 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/windhawk_wolf';
			default:
				if (typeof id === 'string') {
					// default for gm or customs
					if (id.includes('_FALCON')) {
						return 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/\xb8\xc5';
					} else if (id.includes('_WUG')) {
						return 'data/sprite/\xb8\xf3\xbd\xba\xc5\xcd/\xbf\xf6\xb1\xd7';
					}
				}
				break;
		}

		// MONSTER
		return 'data/sprite/\xb8\xf3\xbd\xba\xc5\xcd/' + (MonsterTable[id] || MonsterTable[1001]).toLowerCase();
	}

	/**
	 * @return {string} path of admin clothes
	 * @param {boolean} sex
	 */
	static getAdminPath(sex) {
		return ActorResourcePaths.getAdminPath(...arguments);
	}

	/**
	 * Whether the archive ships the halter-lead mounts' own palettes, read off
	 * a file only those archives have: asked once per archive.
	 *
	 * @param {function} onAnswer - called once the archive answers, if it has not yet
	 * @return {boolean|undefined} undefined until the archive answers
	 */
	static hasMountPalettes(onAnswer) {
		return bootstrap.hasMountPalettes(...arguments);
	}

	/**
	 * @return {string} path to body palette
	 * @param {number} id entity
	 * @param {number} pal
	 * @param {boolean} sex
	 */
	static getBodyPalPath(id, pal, sex) {
		return ActorResourcePaths.getBodyPalPath(...arguments);
	}

	/**
	 * @return {string} path to head sprite/action
	 * @param {number} id hair style
	 * @param {number} job job id
	 * @param {boolean} sex
	 * @param {boolean} orcish
	 */
	static getHeadPath(id, job, sex, orcish) {
		return ActorResourcePaths.getHeadPath(...arguments);
	}

	/**
	 * @return {string} path to head palette
	 * @param {number} id hair style
	 * @param {number} pal id
	 * @param {number} job job id
	 * @param {boolean} sex
	 */
	static getHeadPalPath(id, pal, job, sex) {
		return ActorResourcePaths.getHeadPalPath(...arguments);
	}

	/**
	 * @return {string} path to hat
	 * @param {number} id hair style
	 * @param {boolean} sex
	 */
	static getHatPath(id, sex) {
		return ActorResourcePaths.getHatPath(...arguments);
	}

	/**
	 * @return {string} path to Robe
	 * @param {number} id robe id
	 * @param {number} job class
	 * @param {boolean} sex
	 */
	static getRobePath(id, job, sex) {
		return ActorResourcePaths.getRobePath(...arguments);
	}

	/**
	 * @return {string} path to spr robe on costume root folder
	 * @param {number} id robe id
	 * @param {number} job class
	 * @param {boolean} sex
	 */
	static getRobePathNoSex(id, job, sex) {
		return ActorResourcePaths.getRobePathNoSex(...arguments);
	}

	/**
	 * @return {string} Path to pets equipements
	 * @param {number} id (pets)
	 */
	static getPetEquipPath(id) {
		return ActorResourcePaths.getPetEquipPath(...arguments);
	}

	/**
	 * @return {string} Path to pets equipements
	 * @param {number} id (pets)
	 */
	static getPetIllustPath(id) {
		return ActorResourcePaths.getPetIllustPath(...arguments);
	}

	/**
	 * Is the item ID a shield item?
	 * Only checks inventory item IDs, never view IDs.
	 *
	 * @param {integer} id item id
	 * @return {boolean}
	 */
	static isShieldItem(id) {
		return EquipmentRules.isShieldItem(...arguments);
	}

	/**
	 * is shield checking
	 *
	 * The left-hand slot can hold either an item ID or a view ID (ClassNum, <= 500).
	 * Shield views and weapon views share the same numeric range (1-500).
	 *
	 * When reliable offhand information is known (isOffhandWeapon === true/false),
	 * that flag distinguishes weapons from shields.
	 * When explicitly marked (isOffhandWeapon is true/false), that classification is honored.
	 * When unknown (isOffhandWeapon === undefined), ambiguous view IDs (<= 500) are preserved
	 * as shields unless reliable weapon evidence is present (e.g. item ID > 500), rather than
	 * assuming every assassin's shield view is a weapon.
	 *
	 * @param {integer} id item id or view id
	 * @param {integer} [job] job id of the owner
	 * @param {boolean} [isOffhandWeapon] explicitly marks whether the equipment is an offhand weapon
	 * @return {boolean} is shield?
	 *
	 * @author MrUnzO
	 */
	static isShield(id, job, isOffhandWeapon) {
		return EquipmentRules.isShield(...arguments);
	}

	/**
	 * Whether the reference client has a shield sprite for this job/view pair.
	 * The original check uses custom item sprites for IDs above 2000 and fixed
	 * job/view support for the four generic shield sprites.
	 * @param {number} job
	 * @param {number} shieldView shield item ID or generic shield view
	 * @returns {boolean}
	 */
	static hasJobShieldSprite(job, shieldView) {
		return EquipmentRules.hasJobShieldSprite(...arguments);
	}

	static getPCAttackMotion(job, sex, itemID, isDualWeapon) {
		return EquipmentRules.getPCAttackMotion(...arguments);
	}

	static isDualWeapon(job, sex, weaponType) {
		return EquipmentRules.isDualWeapon(...arguments);
	}

	static getWeaponType(itemID, realType = false, considerDualHandIds = false) {
		return EquipmentRules.getWeaponType(...arguments);
	}

	/**
	 * @return {string} Path to shield
	 * @param {number} id shield
	 * @param {number} job class
	 * @param {boolean} sex
	 */
	static getShieldPath(id, job, sex, isMounted = false) {
		return EquipmentRules.getShieldPath(...arguments);
	}

	/**
	 * Convert an equipped shield item ID to the view value used by the generic
	 * shield resource fallback. Packet view IDs are already in this form.
	 * @param {number} id item ID or view ID
	 * @returns {number}
	 */
	static getShieldViewID(id) {
		return EquipmentRules.getShieldViewID(...arguments);
	}

	/**
	 * @return {string} Path to weapon
	 * @param {number} id weapon
	 * @param {number} job class
	 * @param {boolean} sex
	 */
	static getWeaponPath(id, job, sex, leftid = false) {
		return EquipmentRules.getWeaponPath(...arguments);
	}

	/**
	 * @return {string} Path to weapon trail
	 * @param {number} id weapon
	 * @param {number} job class
	 * @param {boolean} sex
	 */
	static getWeaponTrail(id, job, sex) {
		return EquipmentRules.getWeaponTrail(...arguments);
	}

	/**
	 * Resolve the generic weapon-effect sprite used by ACT layer 6 in the
	 * reference client. `id` is a weapon item/view ID; -1 selects a class-only
	 * effect name (used by special job effects).
	 * @param {number} id weapon item or view ID, or -1 for class-only effects
	 * @param {number} job class
	 * @param {number} sex
	 * @param {number} effect 0 = weapon glow, 1 = class aura
	 * @returns {string|null}
	 */
	static getWeaponEffectPath(id, job, sex, effect = 0) {
		return EquipmentRules.getWeaponEffectPath(...arguments);
	}

	/**
	 * @param {number} cart id
	 */
	static getCartPath(num) {
		return EquipmentRules.getCartPath(...arguments);
	}

	/**
	 * @return {string} Path to weapon sound
	 * @param {number} weapon id
	 */
	static getWeaponSound(id) {
		return EquipmentRules.getWeaponSound(...arguments);
	}

	/**
	 * @return {string} Path to eapon sound
	 * @param {number} weapon id
	 */
	static getWeaponHitSound(id) {
		return EquipmentRules.getWeaponHitSound(...arguments);
	}

	/**
	 * @return {string} Path to eapon sound [MrUnzO]
	 * @param {number} weapon id
	 */
	static getJobHitSound(job_id) {
		return EquipmentRules.getJobHitSound(...arguments);
	}

	/**
	 * @return {number} weapon viewid
	 * @param {number} id weapon
	 */
	static getWeaponViewID(id) {
		return EquipmentRules.getWeaponViewID(...arguments);
	}

	/**
	 * @return {number} weapon action frame
	 * @param {number} id weapon
	 * @param {number} job
	 * @param {number} sex
	 */
	static getWeaponAction(id, job, sex) {
		return EquipmentRules.getWeaponAction(...arguments);
	}

	/**
	 * @return {{frame: number, length: number}|null} attack slice for jobs with combined action sheets
	 * @param {number} job
	 * @param {number} weapon
	 */
	static getAttackSlice(job, weapon) {
		return EquipmentRules.getAttackSlice(...arguments);
	}

	/**
	 * Resolve Assassin-family dual-wield categories from the original item ID ranges.
	 * The client uses these ranges in CPc::GetDualWieldWeaponType (RVA 0x00DAB460).
	 */
	static getDualWieldWeaponType(firstItemId, secondItemId) {
		return EquipmentRules.getDualWieldWeaponType(...arguments);
	}

	static mountWeapon(weaponID, shieldID) {
		return EquipmentRules.mountWeapon(...arguments);
	}

	static isBow(weaponType) {
		return EquipmentRules.isBow(...arguments);
	}

	static isKatar(weaponType) {
		return EquipmentRules.isKatar(...arguments);
	}

	/**
	 * Get back informations from id
	 *
	 * @param {number} item id
	 * @return {object} item
	 */
	static getItemInfo(itemid) {
		const item = ItemTable[itemid] || unknownItem;

		if (!item._decoded) {
			item.identifiedDescriptionName =
				item.identifiedDescriptionName instanceof Array
					? item.identifiedDescriptionName.join('\n')
					: item.identifiedDescriptionName;
			item.unidentifiedDescriptionName =
				item.unidentifiedDescriptionName instanceof Array
					? item.unidentifiedDescriptionName.join('\n')
					: item.unidentifiedDescriptionName;
			item.prefixName = item.prefixName || '';
			item.isPostfix = item.isPostfix || false;
			item.processitemlist =
				item.processitemlist && item.processitemlist instanceof Array ? item.processitemlist.join('\n') : '';
			item._decoded = true;
		}

		// Phase 14: 覆盖层下发前覆盖物品名（PlayerLang!=='zh' 时 LangOverlay 直接回退 fallback，无副作用）
		item.identifiedDisplayName = LangOverlay.getItemName(itemid, item.identifiedDisplayName);

		return item;
	}

	/**
	 * Get back item path
	 *
	 * @param {number} item id
	 * @param {boolean} is identify
	 * @return {string} path
	 */
	static getItemPath(itemid, identify) {
		return itemDatabase.ItemDatabase.getItemPath(...arguments);
	}

	/**
	 * Get full item name
	 *
	 * @param {object} item - The item object containing details about the item.
	 * @param {object} [options] - Optional parameters to customize the output.
	 * @param {boolean} [options.showItemRefine=true] - Whether to show the refining level of the item.
	 * @param {boolean} [options.showItemGrade=true] - Whether to show the grade of the item.
	 * @param {boolean} [options.showItemSlots=true] - Whether to show the number of slots on the item.
	 * @param {boolean} [options.showItemPrefix=true] - Whether to show the prefix of the item.
	 * @param {boolean} [options.showItemPostfix=true] - Whether to show the postfix of the item.
	 * @param {boolean} [options.showItemOptions=true] - Whether to show the number of options on the item.
	 * @return {string} - The full name of the item with all applicable details.
	 */
	static getItemName(item, options = {}) {
		return itemDatabase.ItemDatabase.getItemName(...arguments);
	}

	/**
	 * Get random option name
	 *
	 * @param {integer} id
	 * @return {string} item full name
	 */
	static getOptionName(id) {
		if (!(id in RandomOption)) {
			// 词条 ID 无效（双侧表均未收录）时的错误提示也走 i18n（msgstringtable 自定义段 6503）
			return this.getMessage(6503, 'UNKNOWN RANDOM OPTION');
		}
		// zh 语言走覆盖层（台服官方译名简体化），未收录/其它语言回退英文原表
		return LangOverlay.getOptionName(id, RandomOption[id]);
	}

	/**
	 * Prontera 词条系统：千分比精度词条（值单位 0.1%）的显示值换算。
	 * 值 15 → 显示 "1.5"；普通词条原值返回。
	 */
	static getOptionValueDisplay(id, value) {
		if (id >= 1000 && id <= 1015) {
			return (value / 10).toFixed(1);
		}
		return value;
	}
	/**
	 * Get a message from msgstringtable
	 *
	 * @param {number} message id
	 * @param {string} optional string to show if the text isn't defined
	 * @return {string} message
	 */
	static getMessage(id, defaultText) {
		// Phase 14: 覆盖层优先（zh 命中翻译），未命中回退 MsgStringTable，再回退 defaultText / NO MSG
		const overlaid = LangOverlay.getMessage(id, MsgStringTable[id]);
		return overlaid ?? (defaultText !== undefined ? defaultText : 'NO MSG ' + id);
	}

	/**
	 * Get a message string from the MsgEmotionCSV
	 *
	 * @param {string} key - The key to search for
	 * @return {string|null} - The value associated with the given key, or null if not found.
	 */
	static getMessageEmotionCSV(keyOrIndex) {
		return systemDatabase.SystemDatabase.getMessageEmotionCSV(...arguments);
	}

	/**
	 * Get Skill Description from DB
	 *
	 * @param {number} skill id
	 */
	static getSkillDescription(id) {
		// Phase 14: 技能描述用独立的 skillDescription 覆盖表（技能ID空间），不复用 message 表（msgstringtable ID 空间，避免 ID 撞车）
		return LangOverlay.getSkillDescription(id, SkillDescription[id]) ?? SkillDescription[id] ?? '...';
	}

	/**
	 * @param {string} filename
	 * @return {object}
	 */
	static getMap(mapname) {
		return mapDatabase.MapDatabase.getMap(...arguments);
	}

	/**
	 * Get a message from msgstringtable
	 *
	 * @param {string} mapname
	 * @param {string} default name if not found
	 * @return {string} map location
	 */
	static getMapName(mapname, defaultName) {
		return mapDatabase.MapDatabase.getMapName(...arguments);
	}

	/**
	 * Get monster name
	 *
	 * @param {number} job id
	 */
	static getMonsterName(job) {
		// Phase 14: 覆盖层优先（zh 命中中文），未命中回退 MonsterNameTable（D-11）
		return LangOverlay.getMonsterName(job, MonsterNameTable[job]) ?? 'Unknown';
	}

	/**
	 * Get back town information by mapname
	 * @param {number} efst id
	 */
	static getTownInfo(mapname) {
		return mapDatabase.MapDatabase.getTownInfo(mapname);
	}

	/**
	 * Get back map information by mapname
	 * @param {number} efst id
	 */
	static getMapInfo(mapname) {
		return mapDatabase.MapDatabase.getMapInfo(...arguments);
	}

	/**
	 * Get the whole Laphine Synthesis Table
	 * @returns LaphineSysTable
	 */
	static getLaphineSysList() {
		return itemDatabase.ItemDatabase.getLaphineSysList(...arguments);
	}

	/**
	 * Get Laphine Synthesis information by itemId
	 * @param {number} itemId
	 * @returns LaphineSysTable[key] if itemId found
	 */
	static getLaphineSysInfoById(itemId) {
		return itemDatabase.ItemDatabase.getLaphineSysInfoById(...arguments);
	}

	/**
	 * Retrieves the Laphine Upgrade Table.
	 *
	 * @return {Object} The Laphine Upgrade Table.
	 */
	static getLaphineUpgList() {
		return itemDatabase.ItemDatabase.getLaphineUpgList(...arguments);
	}

	/**
	 * Retrieves the Laphine Upgrade information by the given item ID.
	 *
	 * @param {number} itemId - The ID of the item to search for.
	 * @return {Object|null} The Laphine Upgrade information if found, or null if not found.
	 */
	static getLaphineUpgInfoById(itemId) {
		return itemDatabase.ItemDatabase.getLaphineUpgInfoById(...arguments);
	}

	/**
	 * Retrieves the Enchant group info by the given group ID.
	 *
	 * @param {number} groupId - The Enchant group ID.
	 * @return {Object|null} The Enchant group info if found, or null.
	 */
	static getEnchantGroup(groupId) {
		return itemDatabase.ItemDatabase.getEnchantGroup(...arguments);
	}

	/**
	 * Retrieves all Enchant groups.
	 *
	 * @return {Object} Enchant group table.
	 */
	static getEnchantGroups() {
		return itemDatabase.ItemDatabase.getEnchantGroups(...arguments);
	}

	/**
	 * Retrieves Enchant slot info by group and slot.
	 *
	 * @param {number} groupId - The Enchant group ID.
	 * @param {number} slotNum - Slot index.
	 * @return {Object|null} Enchant slot info if found.
	 */
	static getEnchantSlot(groupId, slotNum) {
		return itemDatabase.ItemDatabase.getEnchantSlot(...arguments);
	}

	/**
	 * Returns the item ID associated with a given base item.
	 *
	 * @param {string} baseItem - The base item to get the ID for.
	 * @return {number} The item ID associated with the base item.
	 */
	static getItemIdfromBase(baseItem) {
		return itemDatabase.ItemDatabase.getItemIdfromBase(...arguments);
	}

	/**
	 * Retrieves the base item associated with a given item ID.
	 *
	 * @param {number} itemId - The ID of the item to search for.
	 * @return {string|null} The base item associated with the item ID, or null if not found.
	 */
	static getBasefromItemID(itemId) {
		return itemDatabase.ItemDatabase.getBasefromItemID(...arguments);
	}

	/**
	 * Finds the reform list associated with a given item ID.
	 *
	 * @param {number} itemId - The ID of the item to search for.
	 * @return {Object|null} The reform list associated with the item ID, or null if not found.
	 */
	static findReformListByItemID(itemId) {
		return itemDatabase.ItemDatabase.findReformListByItemID(...arguments);
	}

	/**
	 * Retrieves the reform information for a given reform ID.
	 *
	 * @param {string} reformId - The ID of the reform to retrieve information for.
	 * @return {Object|null} The reform information object if found, or null if not found.
	 */
	static getReformInfo(reformId) {
		return itemDatabase.ItemDatabase.getReformInfo(...arguments);
	}

	/**
	 * Retrieves information for all reform IDs in the provided array.
	 *
	 * @param {Array} reformIds - An array of reform IDs to retrieve information for.
	 * @return {Array} An array of reform information objects.
	 */
	static getAllReformInfos(reformIds) {
		return itemDatabase.ItemDatabase.getAllReformInfos(...arguments);
	}

	/**
	 * Finds a signboard in the given map based on the provided coordinates.
	 *
	 * @param {string} mapname - The name of the map to search in.
	 * @param {number} x - The x-coordinate of the signboard.
	 * @param {number} y - The y-coordinate of the signboard.
	 * @param {number} [tolerance=1] - The tolerance value for matching coordinates.
	 * @return {Object|null} The signboard object if found, or null if not found.
	 */
	static findSignboard(mapname, x, y, tolerance = 1) {
		return signBoards.SignBoardDatabase.findSignboard(...arguments);
	}

	/**
	 * Get all signboards for a specific map
	 * @param {string} mapname - Map name
	 * @return {Object} Signboard data for the map
	 */
	static getAllSignboardsForMap(mapname) {
		return signBoards.SignBoardDatabase.getAllSignboardsForMap(...arguments);
	}

	/**
	 * Retrieves the translated signboard description based on the provided description.
	 *
	 * @param {string} description - The description of the signboard.
	 * @return {string} The translated signboard description if found, otherwise the original description.
	 */
	static getTranslatedSignBoard(description) {
		return signBoards.SignBoardDatabase.getTranslatedSignBoard(...arguments);
	}

	static getRandomJoke() {
		return systemDatabase.SystemDatabase.getRandomJoke(...arguments);
	}

	static getRandomScream() {
		return systemDatabase.SystemDatabase.getRandomScream(...arguments);
	}

	/**
	 * @type {Object<number, Function[]>} Pending name-resolution callbacks keyed by GID
	 * @private
	 */
	static _nameCallbacks = {};

	/**
	 * @type {Object<number, ReturnType<typeof setTimeout>>} Per-GID TTL timers
	 * @private
	 */
	static _nameCallbackTimers = {};

	/**
	 * Request a character name by GID from the server.
	 * Returns a Promise that resolves with the name once the server responds.
	 * If the name is already cached, resolves immediately.
	 * If a request is already in-flight, piggybacks on the pending response.
	 *
	 * If the server never responds within `ttl` milliseconds the pending
	 * callbacks are resolved with 'Unknown', the CNameTable entry is cleared
	 * (so the next caller can retry), and all references are freed.
	 *
	 * @param {number} GID
	 * @param {number} [ttl=8000] - Milliseconds before treating the request as timed-out
	 * @returns {Promise<string>} resolves with the character name
	 */
	static getNameByGID(GID, ttl = 8000) {
		return ownerNames.OwnerNameResolver.getNameByGID(...arguments);
	}

	/**
	 * Notify all pending name-resolution callbacks for a GID.
	 * Called internally when a name response packet arrives.
	 *
	 * @param {number} GID
	 * @param {string} name
	 * @private
	 */
	static _resolveNameCallbacks(GID, name) {
		return ownerNames.OwnerNameResolver._resolveNameCallbacks(...arguments);
	}

	/**
	 * Get Pet talk message
	 *
	 * @param {integer} message data combined with mob id, hungryState, actionState
	 * @return {string} pet telk sentence
	 *
	 * @author MrUnzO
	 */
	static getPetTalk(data) {
		return PetDatabase.getPetTalk(...arguments);
	}

	/**
	 * Get Pet Hungry state
	 *
	 * @param {integer} hunger
	 * @return {integer} hunger state
	 *
	 * @author MrUnzO
	 */
	static getPetHungryState(hunger) {
		return PetDatabase.getPetHungryState(...arguments);
	}

	/**
	 * Get Pet Friendly state
	 *
	 * @param {integer} friendly
	 * @return {integer} friendly state
	 *
	 * @author MrUnzO
	 */
	static getPetFriendlyState(friendly) {
		return PetDatabase.getPetFriendlyState(...arguments);
	}

	/**
	 * Get Pet Action text
	 *
	 * @param {integer} action
	 * @return {string} action string
	 *
	 * @author MrUnzO
	 */
	static getPetActText(action) {
		return PetDatabase.getPetActText(...arguments);
	}

	/**
	 * Get Pet Hungry state text
	 *
	 * @param {integer} hungry state
	 * @return {String} hungry state text
	 *
	 * @author MrUnzO
	 */
	static getPetHungryText(state) {
		return PetDatabase.getPetHungryText(...arguments);
	}

	/**
	 * Get Pet Emotion ID
	 *
	 * @param {integer} hungry state
	 * @param {integer} friendly state
	 * @param {integer} action
	 * @return {integer} emotion id
	 *
	 * @author MrUnzO
	 */
	static getPetEmotion(hunger, friendly, act) {
		return PetDatabase.getPetEmotion(...arguments);
	}

	/**
	 * Get Pet talk number message (for send to server to distribute)
	 *
	 * @param {integer} job (mob id)
	 * @param {integer} action
	 * @param {integer} hungry state
	 * @return {integer} message data
	 *
	 * @author MrUnzO
	 */
	static getPetTalkNumber(job, act, hungry) {
		return PetDatabase.getPetTalkNumber(...arguments);
	}

	/**
	 * Indoor checking
	 *
	 * @param {string} map name
	 * @return {boolean} is indoor?
	 *
	 * @author MrUnzO
	 */
	static isIndoor(mapname) {
		return mapDatabase.MapDatabase.isIndoor(...arguments);
	}

	/**
	 * Get Quest Info by ID
	 *
	 * @param {integer} questID (quest id)
	 *
	 * @author alisonrag
	 */
	static getQuestInfo(questID) {
		return (
			QuestInfo[questID] || {
				// i18n: msgstringtable 6011（zh 覆盖见 LangOverlayData）
				Title: DB.getMessage(6011, 'Unknown Quest'),
				Description: [],
				Summary: DB.getMessage(6011, 'Unknown Quest'),
				IconName: '',
				NpcSpr: null,
				NpcNavi: null,
				NpcPosX: null,
				NpcPosY: null,
				RewardItemList: [],
				RewardEXP: 0,
				RewardJEXP: 0
			}
		);
	}

	static getCheckAttendanceInfo() {
		return systemDatabase.SystemDatabase.getCheckAttendanceInfo(...arguments);
	}

	static getBuyingStoreItemList() {
		return itemDatabase.ItemDatabase.getBuyingStoreItemList(...arguments);
	}

	static isBuyable(id) {
		return itemDatabase.ItemDatabase.isBuyable(...arguments);
	}

	/**
	 * Is item id a pet egg?
	 *
	 * Used for older versions,
	 * because item type PETEGG didn't exist back then
	 * and type ARMOR was used with equip location 0,
	 * but this is not usable in vending since location
	 * is not received with packet...
	 *
	 * @param {integer} id
	 * @returns {boolean}
	 */
	static isPetEgg(id) {
		return itemDatabase.ItemDatabase.isPetEgg(...arguments);
	}

	/**
	 * Get Job Class Category
	 *
	 * @param {integer} JobId
	 *
	 */
	static getJobClass(job) {
		return JobClassification.getJobClass(job);
	}

	/**
	 * Load Clan Emblem file
	 * Icons for group reads from texture/유저인터페이스/clan_system/...
	 *
	 * @param {integer} clanId
	 * @param {function} callback to run once the file is loaded
	 *
	 * @author alisonrag
	 */
	static loadClanEmblem(clanId, callback) {
		return emblemLoader.loadClanEmblem(...arguments);
	}

	/**
	 * Load Group Emblem file
	 * Icons for group reads from texture/유저인터페이스/group/...
	 *
	 * @param {integer} groupId
	 * @param {function} callback to run once the file is loaded
	 *
	 * @author alisonrag
	 */
	static loadGroupEmblem(groupId, callback) {
		return emblemLoader.loadGroupEmblem(...arguments);
	}

	/**
	 * Load Mob Type file
	 * Icons for Miniboss and MVP from texture/À¯ÀúÀÎÅÍÆäÀÌ½º/montype_...bmp
	 *
	 * @param {integer} mobType
	 * @param {function} callback to run once the file is loaded
	 *
	 */
	static loadMobEmblem(mobType, callback) {
		return emblemLoader.loadMobEmblem(...arguments);
	}
	/**
	 * Get grouped monster entries for a single navigation map.
	 *
	 * @param {string} mapName
	 * @returns {Array<Object>} grouped monsters in that map
	 */
	static getNavigationMapMonsters(mapName) {
		return NavigationSystem.getNavigationMapMonsters(...arguments);
	}

	/**
	 * Search for NPCs or MOBs in the navigation tables
	 *
	 * @param {string} query - The search query
	 * @param {string} type - The type of search (ALL, NPC, MOB)
	 * @returns {Array} Array of search results
	 */
	static searchNavigation(query, type) {
		return NavigationSystem.searchNavigation(...arguments);
	}

	/**
	 * Get the default navigation point for a map.
	 * Used by the World Map and MAP search results to route to a map even
	 * when there is no exact NPC/monster coordinate.
	 *
	 * @param {string} mapName
	 * @returns {{x:number,y:number}|null}
	 */
	static getNaviMapPoint(mapName) {
		return NavigationSystem.getNaviMapPoint(...arguments);
	}

	/**
	 * Get a readable navigation map name when available.
	 *
	 * @param {string} mapName
	 * @returns {string}
	 */
	static getNaviMapDisplayName(mapName) {
		return NavigationSystem.getNaviMapDisplayName(...arguments);
	}

	/**
	 * Get the NaviLinkTable
	 *
	 * @returns {Array} The NaviLinkTable
	 */
	static getNaviLinkTable() {
		return NavigationSystem.getNaviLinkTable(...arguments);
	}

	/**
	 * Get the NaviLinkDistanceTable
	 *
	 * @returns {Array} The NaviLinkDistanceTable
	 */
	static getNaviLinkDistanceTable() {
		return NavigationSystem.getNaviLinkDistanceTable(...arguments);
	}

	/**
	 * Get the NaviNpcDistanceTable
	 *
	 * @returns {Array} The NaviNpcDistanceTable
	 */
	static getNaviNpcDistanceTable() {
		return NavigationSystem.getNaviNpcDistanceTable(...arguments);
	}

	static createItemLink(item) {
		return createItemLink(item);
	}

	static parseItemLink(itemLink) {
		return parseItemLink(itemLink, item => DB.getItemName(item));
	}

	static getItemNameFromLink(itemLink) {
		return getItemNameFromLink(itemLink, item => DB.parseItemLink(item));
	}

	/**
	 * Format a Unix timestamp (seconds) into MM/DD HH:mm
	 *
	 * @param {number} unixTimestamp - Unix time in seconds
	 * @returns {string} Formatted date string (MM/DD HH:mm)
	 */
	static formatUnixDate(unixTimestamp) {
		return formatUnixDate(unixTimestamp);
	}

	/**
	 * Convert RO color codes (^RRGGBB) to HTML spans
	 *
	 * @param {string} msg - Message with RO color codes
	 * @returns {string} Message formatted to HTML
	 */
	static formatMsgToHtml(msg) {
		return formatMsgToHtml(msg);
	}

	/**
	 * Get pet data by job ID
	 *
	 * @param {number} jobID - Job ID
	 * @returns {?Object} Pet data or null if not found
	 */
	static getPetByJobID(jobID) {
		return PetDatabase.getPetByJobID(...arguments);
	}

	/**
	 * Get pet evolution data by job ID
	 *
	 * @param {number} jobID - Job ID
	 * @returns {?Object} Pet evolution data or null if not found
	 */
	static getPetEvolutionByJob(jobID) {
		return PetDatabase.getPetEvolutionByJob(...arguments);
	}

	/**
	 * Get pet data by pet egg ID
	 *
	 * @param {number|string} eggID - Pet egg ID
	 * @returns {?Object} Pet data or null if not found
	 */
	static getPetByEggID(eggID) {
		return PetDatabase.getPetByEggID(...arguments);
	}

	/**
	 * Get the entire reputation group list
	 *
	 * @returns {Object} Reputation group list
	 */
	static getReputeGroup() {
		return systemDatabase.SystemDatabase.getReputeGroup(...arguments);
	}

	/**
	 * Get the reputation group list for a given group id
	 *
	 * @param {string} repute_group - Reputation group id
	 * @returns {?Object} Reputation group list or null if not found
	 */
	static getReputeGroupList(repute_group) {
		return systemDatabase.SystemDatabase.getReputeGroupList(...arguments);
	}

	/**
	 * Get the entire reputation information list
	 *
	 * @returns {Object} Reputation information list
	 */
	static getReputeInfo() {
		return systemDatabase.SystemDatabase.getReputeInfo(...arguments);
	}

	/**
	 * Get the reputation data for a given reputation ID
	 *
	 * @param {number|string} repute_id - Reputation ID
	 * @returns {?Object} Reputation data or null if not found
	 */
	static getReputeData(repute_id) {
		return systemDatabase.SystemDatabase.getReputeData(...arguments);
	}

	/**
	 * Get a Hateffect Info by ID
	 * @param {number} id - Hateffect ID
	 * @returns {Object|null} Hateffect info or null if not found
	 */
	static getHatResource(id) {
		return getHatResource(id);
	}

	/**
	 * Get the CashShopBannerTable
	 *
	 * @returns {Array} CashShopBannerTable
	 */
	static getCashShopBannerTable() {
		return systemDatabase.SystemDatabase.getCashShopBannerTable(...arguments);
	}
}

initialJobGroups = null;

const {
	EquipmentRules,
	NavigationSystem,
	ActorResourcePaths,
	PetDatabase,
	signBoards,
	systemDatabase,
	itemDatabase,
	mapDatabase,
	ownerNames,
	emblemLoader,
	bootstrap
} = createDBServices(DB);


/**
 * Load CheckAttendance file to object
 *
 * @param {string} filename to load
 * @param {function} onEnd to run once the file is loaded
 *
 * @author alisonrag
 */
function loadAttendanceFile(filename, callback, onEnd) {
	// 2026-11-11 签到修复：主线程直接 fetch（绕过 Thread/worker 管道——实测该管道
	// 会静默丢弃本文件的请求，remote-client 日志无任何网络记录），lua 执行
	// （wasmoon, wasm 内联主线程）行为不变；成功/失败路径都保证 onEnd 触发。
	// FileManager.remoteClient 仅在 worker 实例中被 SET_HOST 赋值，主线程恒为空串——
	// 改读 Configs（remoteClient = 'http://<host>:8080/'，见 Config.local.js）
	const url = (Configs.get('remoteClient') || '') + filename.replace(/\\/g, '/');
	fetch(url)
		.then(function (response) {
			if (!response.ok) {
				throw new Error('HTTP ' + response.status);
			}
			return response.arrayBuffer();
		})
		.then(async function (buffer) {
			try {
				const bytes = new Uint8Array(buffer);
				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;
				// T-签2：重入防护——重载文件时先清空旧数据，避免重复加载叠加周期
				CheckAttendanceTable.Periods = [];
				CheckAttendanceTable.Config = {};
				CheckAttendanceTable.Rewards = [];
				// create CheckAttendance required functions in context
				// T-签2 多周期：每次 Config 调用开启新一期，其后的 Reward 归入该期
				ctx.InsertCheckAttendanceConfig = (EvendOnOff, StartDate, EndDate) => {
					CheckAttendanceTable.Periods.push({ StartDate: StartDate, EndDate: EndDate, Rewards: [] });
					return 1;
				};
				ctx.InsertCheckAttendanceReward = (day, item_id, quantity) => {
					const period = CheckAttendanceTable.Periods[CheckAttendanceTable.Periods.length - 1];
					const reward = { day: day, item_id: item_id, quantity: quantity || 1 };
					if (period) {
						period.Rewards[day - 1] = reward;
					} else {
						// 兼容异常文件（无 Config 先出现 Reward）：退回旧单期形状
						CheckAttendanceTable.Rewards[day - 1] = reward;
					}
				};
				// mount file
				lua.mountFile('CheckAttendance.lub', bytes);
				// execute file
				await lua.doFile('CheckAttendance.lub');
				// execute main lua function
				lua.doStringSync('main()');
				// T-签2：按 UTC 今天选当前期摊平（与 map-server 的时钟一致）
				selectAttendancePeriod();
			} catch (error) {
				console.error('[loadAttendanceFile] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('CheckAttendance.lub');
				// call onEnd
				onEnd();
			}
		})
		.catch(function (error) {
			console.error('[loadAttendanceFile] Fetch failed: ', error);
			onEnd();
		});
}

/**
 * T-签2 多周期选期：优先命中"Start <= UTC今天 <= End"的期；
 * 无生效期则取最近的未来期（预览）；全过期取最后一期。
 * 选中后摊平为窗口组件消费的单期形状（Config + Rewards[day-1]）。
 */
function selectAttendancePeriod() {
	const periods = CheckAttendanceTable.Periods;
	if (!periods || periods.length === 0) {
		return;
	}
	const now = new Date();
	const today = now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
	let chosen = null;
	for (const p of periods) {
		if (p.StartDate <= today && today <= p.EndDate) {
			chosen = p;
			break;
		}
	}
	if (!chosen) {
		const future = periods.filter((p) => p.StartDate > today).sort((a, b) => a.StartDate - b.StartDate);
		chosen = future[0] || periods.slice().sort((a, b) => b.EndDate - a.EndDate)[0];
	}
	CheckAttendanceTable.Config = { StartDate: chosen.StartDate, EndDate: chosen.EndDate };
	CheckAttendanceTable.Rewards = chosen.Rewards;
}

/**
 * Loads WorldMap data from Lua files (Language, List, and Table)
 * Replaces DB/Map/WorldMap.js
 *
 * @param {string} basePath - Path to the directory containing worldviewdata files
 * @param {function} onEnd - Function to run when done
 */
function loadWorldMapInfo(basePath, onEnd) {
	const files = ['worldviewdata_language.lub', 'worldviewdata_list.lub', 'worldviewdata_table.lub'];

	const dirPath = basePath.endsWith('/') ? basePath : basePath + '/';
	const loadedBuffers = [];

	// Recursive loader to ensure sequential loading
	function loadNext(index) {
		if (index >= files.length) {
			processWorldMapLua();
			return;
		}

		const fullPath = dirPath + files[index];
		console.log('Loading file "' + fullPath + '"...');

		Client.loadFile(
			fullPath,
			function (data) {
				loadedBuffers.push({ name: files[index], data: data });
				loadNext(index + 1);
			},
			function () {
				console.error('[loadWorldMapInfo] - Failed to load ' + fullPath);
				// If a file fails, we might not be able to generate the map, but we continue to avoid hanging
				if (onEnd) {
					onEnd();
				}
			}
		);
	}

	async function processWorldMapLua() {
		try {
			const ctx = lua.ctx;

			// Function to add a World Category (e.g., Midgard)
			ctx.AddWorldMapCategory = (id, name, tableKey) => {
			const decodedName = userStringDecoder.decode(name, 'gbk');
			const decodedId = userStringDecoder.decode(id);
				const decodedTableKey = userStringDecoder.decode(tableKey);

				WorldMap.push({
					id: decodedId || decodedTableKey, // fallback to table name if id missing
					ep_from: 0,
					ep_to: 99,
					name: decodedName,
					maps: [],
					_tableKey: decodedTableKey // Internal use for mapping maps to this world
				});
				return 1;
			};

			// Function to add a Map to a specific World
			ctx.AddMapToWorld = (
				dgIndex,
				worldTableKey,
				rswName,
				left,
				top,
				right,
				bottom,
				nameDisplay,
				level,
				mapType
			) => {
				const decodedTableKey = userStringDecoder.decode(worldTableKey);
				let decodedRsw = userStringDecoder.decode(rswName);
				const decodedName = userStringDecoder.decode(nameDisplay, 'gbk');
				const decodedLevel = level ? userStringDecoder.decode(level) : '';

				// Find the world this map belongs to
				const world = WorldMap.find(w => w._tableKey === decodedTableKey);

				if (mapType === 1) {
					const originalMap = world.maps.find(m => m.index === dgIndex && m.type === 0);
					if (originalMap) {
						decodedRsw = originalMap.id;
					} // Copy rsw name
				}

				if (world) {
					// clean .rsw extension for ID
					const mapId = decodedRsw.toLowerCase().replace('.rsw', '').replace('.gat', '');

					world.maps.push({
						index: dgIndex,
						id: mapId,
						ep_from: 0,
						ep_to: 99,
						name: decodedName,
						top: top,
						left: left,
						width: right - left, // Calculate width
						height: bottom - top, // Calculate height
						moblevel: decodedLevel,
						type: mapType
					});
				}
				return 1;
			};

			// Mount and execute all files
			for (let i = 0; i < loadedBuffers.length; i++) {
				const f = loadedBuffers[i];
				const buffer = f.data instanceof ArrayBuffer ? new Uint8Array(f.data) : f.data;
				lua.mountFile(f.name, buffer);
				await lua.doFile(f.name);
			}

			// Clean Hardcoded DB Safely
			WorldMap.splice(0, WorldMap.length);

			// Execute the processing script
			// Logic: Iterate over World_List -> Get Table Name -> Iterate over that Table -> Extract Data
			lua.doStringSync(`
					function main_worldmap_process()
						if World_List == nil then return end

						for _, worldData in ipairs(World_List) do
							-- worldData structure: { Name, MainTableName, DungeonTableName, BgImage }
							local worldName = worldData[1]
							local mainTableStr = worldData[2]
							local dgTableStr = worldData[3]
							local resourceStr = worldData[4]

							-- Add the world category
							AddWorldMapCategory(resourceStr, worldName, mainTableStr)

							-- Fetch the actual table using the string name (global variable)
							local mapTable = _G[mainTableStr]

							if mapTable ~= nil then
								for _, mapEntry in ipairs(mapTable) do
									-- mapEntry structure: { Index, "map.rsw", left, top, right, bottom, LocalizedName, ... }
									local index = mapEntry[1]
									local rswName = mapEntry[2]
									local left = mapEntry[3]
									local top = mapEntry[4]
									local right = mapEntry[5]
									local bottom = mapEntry[6]
									local nameDisplay = mapEntry[7] or "" -- This is resolved from WORLD_MSGID by Lua automatically
									local level = mapEntry[8] or 0

									AddMapToWorld(index, mainTableStr, rswName, left, top, right, bottom, nameDisplay, level, 0)
								end
							end

							mapTable = _G[dgTableStr]

							if mapTable ~= nil then
								for _, mapEntry in ipairs(mapTable) do
									local index = mapEntry[1]
									local left = mapEntry[2]
									local top = mapEntry[3]
									local right = mapEntry[4]
									local bottom = mapEntry[5]
									local nameDisplay = mapEntry[6] or ""
									local level = mapEntry[7] or 0

									AddMapToWorld(index, mainTableStr, "", left, top, right, bottom, nameDisplay, level, 1)
								end
							end

						end
					end
					main_worldmap_process()
				`);

			// Clean up internal keys
			WorldMap.forEach(w => delete w._tableKey);
		} catch (e) {
			console.error('[loadWorldMapInfo] Lua Error:', e);
		} finally {
			// Unmount files
			loadedBuffers.forEach(f => lua.unmountFile(f.name));
			if (onEnd) {
				onEnd();
			}
		}
	}

	// Start the chain
	loadNext(0);
}

function loadTitleTable(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				const ctx = lua.ctx;

				ctx.AddTitle = function (titleID, titleName) {
					TitleTable[titleID] = userStringDecoder.decode(titleName, userCharpage);
					return 1;
				};

				lua.mountFile(filename, buffer);
				await lua.doFile(filename);

				lua.doStringSync(`  
						function main_title()  
							if title_tbl then  
								for titleID, titleName in pairs(title_tbl) do  
									result, msg = AddTitle(titleID, titleName)  
									if not result then  
										return false, msg  
									end  
								end  
							end  
						return true, "success"  
						end
						main_title()  
					`);
			} catch (error) {
				console.error('[loadTitleTable] Error: ', error);
			} finally {
				lua.unmountFile(filename);
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Load Town Info file
 *
 * @param {string} filename - relative file path (e.g., 'System/Towninfo.lub')
 * @param {function} callback - (Unused/Legacy)
 * @param {function} onEnd - Function to run when done
 */
function loadTownInfoFile(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			console.log('Loading file "' + filename + '"...');
			try {
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create AddTownInfo required functions in context
				ctx.AddTownInfo = function AddTownInfo(mapName, name, X, Y, TYPE) {
					mapName = userStringDecoder.decode(mapName);
					TownInfo[mapName] = [];
					TownInfo[mapName].push({
						Name: userStringDecoder.decode(name, userCharpage),
						X: X,
						Y: Y,
						Type: TYPE
					});
				};
				// mount file
				lua.mountFile(filename, buffer);
				// execute file
				await lua.doFile(filename);
				// execute main lua function
				lua.doStringSync('main()');
			} catch (error) {
				console.error('[loadTownInfoFile] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile(filename);
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

function loadQuestInfo(filename, callback, onEnd) {
	const loadPromise = new Promise((resolve, reject) => {
		Client.loadFile(filename, resolve, reject);
	});

	loadPromise
		.then(async file => {
			console.log('Loading file "' + filename + '"...');

			try {
				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context

				// add quest info
				ctx.AddQuestInfo = (
					QuestID,
					Title,
					Summary,
					IconName,
					NpcSpr,
					NpcNavi,
					NpcPosX,
					NpcPosY,
					RewardEXP,
					RewardJEXP
				) => {
					QuestInfo[QuestID] = {
						Title: userStringDecoder.decode(Title, userCharpage),
						Summary: userStringDecoder.decode(Summary, userCharpage),
						IconName: userStringDecoder.decode(IconName),
						Description: [],
						NpcSpr: NpcSpr instanceof Uint8Array ? userStringDecoder.decode(NpcSpr) : null,
						NpcNavi: NpcNavi instanceof Uint8Array ? userStringDecoder.decode(NpcNavi) : null,
						NpcPosX: NpcPosX,
						NpcPosY: NpcPosY,
						RewardItemList: [],
						RewardEXP: RewardEXP,
						RewardJEXP: RewardJEXP
					};

					return 1;
				};

				// add quest description
				ctx.AddQuestDescription = (QuestID, QuestDescription) => {
					QuestInfo[QuestID].Description.push(userStringDecoder.decode(QuestDescription, userCharpage));
					return 1;
				};

				// add quest reward item
				ctx.AddQuestRewardItem = (QuestID, ItemID, ItemNum) => {
					QuestInfo[QuestID].RewardItemList.push({ ItemID: ItemID, ItemNum: ItemNum });
					return 1;
				};

				// mount file
				lua.mountFile(filename, buffer);
				// execute file
				await lua.doFile(filename);

				// create and execute our own main function
				lua.doStringSync(`
					function main_quest()
					-- Check if QuestInfoList is a table and not nil
					if type(QuestInfoList) ~= "table" or QuestInfoList == nil then
						return false, "Error: Quest table is nil or not a table"
					end

					for QuestID, DESC in pairs(QuestInfoList) do
						-- Ensure DESC is a table, use empty table if nil
						DESC = type(DESC) == "table" and DESC or {}

						-- Provide default values for DESC fields if they are nil
						local questData = {
							Title = DESC.Title or "Unknown Quest",
							Summary = DESC.Summary or "Unknown Quest",
							IconName = DESC.IconName or "",
							NpcSpr = DESC.NpcSpr or "",
							NpcNavi = DESC.NpcNavi or "",
							NpcPosX = DESC.NpcPosX or 0,
							NpcPosY = DESC.NpcPosY or 0,
							RewardItemList = DESC.RewardItemList or {},
							RewardEXP = tonumber(DESC.RewardEXP) or 0,
							RewardJEXP = tonumber(DESC.RewardJEXP) or 0,

							Description = type(DESC.Description) == "table" and DESC.Description or {}
						}

						result, msg = AddQuestInfo(QuestID, questData.Title, questData.Summary, questData.IconName, 
												questData.NpcSpr, questData.NpcNavi, questData.NpcPosX, 
												questData.NpcPosY, questData.RewardEXP, 
												questData.RewardJEXP)
						if not result then
							return false, msg
						end

						-- Iterate over RewardItemList table, use empty table if nil
						for k, v in pairs(questData.RewardItemList) do
							result, msg = AddQuestRewardItem(QuestID, v.ItemID, v.ItemNum)
							if not result then
								return false, msg
							end
						end

						-- Iterate over Description table, use empty table if nil
						for k, v in pairs(questData.Description) do
							result, msg = AddQuestDescription(QuestID, v or "No description available")
							if not result then
								return false, msg
							end
						end
					end
					return true, "good"
				end

				main_quest()
					`);
			} catch (error) {
				console.error('[loadQuestInfo] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile(filename);
				// call onEnd
				onEnd(true);
			}
		})
		.catch(error => {
			if (typeof onEnd === 'function') {
				onEnd(false);
			}
		});
}

/**
 * Attempt to load files sequentially (Recursive - Fallback).
 * Stop immediately on the first success.
 *
 * @param {Function} loaderFunc
 * @param {Array<String>} file name aliases array.
 * @param {Function} dataCallback - Callback to process the loaded data (the original `callback`, e.g., the one that receives the `json` from mapInfo).
 * @param {Function} onEnd - Called when the entire process finishes (success or total failure).
 * @param {Bool} try load all aliases
 */
function tryLoadLuaAliases(rFunc, files, callBack, onEnd, loadAll = false) {
	const totalFiles = files.length;
	if (totalFiles === 0) {
		if (typeof onEnd === 'function') {
			onEnd();
		}
		return;
	}

	let finishedCount = 0;
	let failedCount = 0;
	const trackedOnEnd = isSuccess => {
		finishedCount++;
		if (!isSuccess) {
			failedCount++;
		}

		if (finishedCount === totalFiles || (isSuccess && !loadAll)) {
			if (failedCount === totalFiles) {
				console.error(
					`[tryLoadLuaAliases] ERROR: All ${totalFiles} tryes to find ${files[0]} failed. Verify your ${files[0]} filename.`
				);
			}
			if (typeof onEnd === 'function') {
				onEnd();
			}
		}
	};

	function tryNext(index) {
		if (index >= totalFiles) {
			return;
		}

		if (
			files[index].indexOf('System/') !== 0 &&
			files[index].indexOf('SystemEN/') !== 0 &&
			files[index].indexOf('System\\') !== 0 &&
			files[index].indexOf('SystemEN\\') !== 0
		) {
			files[index] = 'System/' + files[index];
		}

		rFunc(files[index], callBack, isSuccess => {
			trackedOnEnd(isSuccess); //await last lua parsing
			if ((isSuccess && loadAll) || !isSuccess) {
				tryNext(index + 1);
			}
		});
	}
	tryNext(0);
}

/* Load ItemInfo file to object
 *
 * @param {string} filename to load
 * @param {function} onEnd to run once the file is loaded
 *
 * @author alisonrag
 */
function loadItemInfo(filename, callback, onEnd) {
	const loadPromise = new Promise((resolve, reject) => {
		Client.loadFile(filename, resolve, reject);
	});

	loadPromise
		.then(async file => {
			let wasSuccessful = false;
			try {
				console.log('Loading file "' + filename + '"...');
				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create itemInfo required functions in context
				ctx.AddItem = (
					ItemID,
					unidentifiedDisplayName,
					unidentifiedResourceName,
					identifiedDisplayName,
					identifiedResourceName,
					slotCount,
					ClassNum
				) => {
					ItemTable[ItemID] = {
						...(typeof ItemTable[ItemID] === 'object' && ItemTable[ItemID]),
						unidentifiedDisplayName: userStringDecoder.decode(unidentifiedDisplayName, userCharpage),
						unidentifiedResourceName: userStringDecoder.decode(unidentifiedResourceName, userCharpage),
						identifiedDisplayName: userStringDecoder.decode(identifiedDisplayName, userCharpage),
						identifiedResourceName: userStringDecoder.decode(identifiedResourceName, userCharpage),
						unidentifiedDescriptionName: [],
						identifiedDescriptionName: [],
						EffectID: null,
						costume: null,
						PackageID: null,
						slotCount: slotCount,
						ClassNum: ClassNum
					};
					return 1;
				};
				ctx.AddItemUnidentifiedDesc = (ItemID, v) => {
					ItemTable[ItemID].unidentifiedDescriptionName.push(userStringDecoder.decode(v, userCharpage));
					return 1;
				};
				ctx.AddItemIdentifiedDesc = (ItemID, v) => {
					ItemTable[ItemID].identifiedDescriptionName.push(userStringDecoder.decode(v, userCharpage));
					return 1;
				};
				ctx.AddItemEffectInfo = (ItemID, EffectID) => {
					ItemTable[ItemID].EffectID = EffectID;
					return 1;
				};
				ctx.AddItemIsCostume = (ItemID, costume) => {
					ItemTable[ItemID].costume = costume;
					return 1;
				};
				ctx.AddItemPackageID = (ItemID, PackageID) => {
					ItemTable[ItemID].PackageID = PackageID;
					return 1;
				};
				// mount file
				lua.mountFile(filename, buffer);
				// execute file
				await lua.doFile(filename);
				// create and execute our own main function
				// this is necessary because some servers has main function on itemInfo.lub and others load it from itemInfo_f.lub
				// doing this way we avoid to have to load the other file
				// on my tests dont care if the main() is on itemInfo.lub or itemInfo_f.lub the content is always the same
				lua.doStringSync(`
						function main_item()
							_processedItems = _processedItems or {} 
							for ItemID, DESC in pairs(tbl) do
								if not _processedItems[ItemID] and #DESC.identifiedDescriptionName > 0 then
									_processedItems[ItemID] = true 
									result, msg = AddItem(ItemID, DESC.unidentifiedDisplayName, DESC.unidentifiedResourceName, DESC.identifiedDisplayName, DESC.identifiedResourceName, DESC.slotCount, DESC.ClassNum)
									if not result then
										return false, msg
									end
									for k, v in pairs(DESC.unidentifiedDescriptionName) do
										result, msg = AddItemUnidentifiedDesc(ItemID, v)
										if not result then
											return false, msg
										end
									end
									for k, v in pairs(DESC.identifiedDescriptionName) do
										result, msg = AddItemIdentifiedDesc(ItemID, v)
										if not result then
											return false, msg
										end
									end
									if nil ~= DESC.EffectID then
										result, msg = AddItemEffectInfo(ItemID, DESC.EffectID)
										if not result then
											return false, msg
										end
									end
									if nil ~= DESC.costume then
										result, msg = AddItemIsCostume(ItemID, DESC.costume)
										if not result then
											return false, msg
										end
									end
									if nil ~= DESC.PackageID then
										result, msg = AddItemPackageID(ItemID, DESC.PackageID)
										if not result then
											return false, msg
										end
									end
								end
							end
							return true, "good"
							end
						main_item()
						`);
				wasSuccessful = true;
			} catch (error) {
				console.error('[loadItemInfo] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile(filename);
				// call onEnd
				onEnd(wasSuccessful);
			}
		})
		.catch(error => {
			if (typeof onEnd === 'function') {
				onEnd(false);
			}
		});
}

/**
 * load lapineddukddakbox.lub to array
 *
 * @param {string} filename to load
 * @param {function} callback to run once the file is loaded
 * @param {function} onEnd to run after the callback
 *
 */
function loadLaphineSysFile(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddLaphineSysItem = (key, ItemID, NeedCount, NeedRefineMin, NeedRefineMax, NeedSource_String) => {
					const decoded_key = key && key.length > 1 ? userStringDecoder.decode(key) : null;
					const decoded_NeedSource_String =
						NeedSource_String && NeedSource_String.length > 1
							? userStringDecoder.decode(NeedSource_String, userCharpage)
							: '';
					LaphineSysTable[decoded_key] = {
						ItemID: ItemID,
						NeedCount: NeedCount,
						NeedRefineMin: NeedRefineMin,
						NeedRefineMax: NeedRefineMax,
						SourceItems: new Array(),
						NeedSource_String: decoded_NeedSource_String
					};
					return 1;
				};

				ctx.AddLaphineSysSourceItem = (key, name, count, ItemID) => {
					const decoded_key = key && key.length > 1 ? userStringDecoder.decode(key) : null;
					const decoded_name = name && name.length > 1 ? userStringDecoder.decode(name) : '';
					LaphineSysTable[decoded_key].SourceItems.push({
						name: decoded_name,
						count: count,
						id: ItemID
					});
					return 1;
				};

				// mount file
				lua.mountFile('lapineddukddakbox.lub', buffer);

				// execute file
				await lua.doFile('lapineddukddakbox.lub');

				// create and execute our own main function
				lua.doStringSync(`
						function main_laphynesys()
                            for key, value in pairs(tblLapineDdukddakBox.sources) do
                                result, msg = AddLaphineSysItem(key, value.ItemID, value.NeedCount, value.NeedRefineMin, value.NeedRefineMax, value.NeedSource_String)
                                if not result then
                                    return false, msg
                                end
                                for _, item in ipairs(value.SourceItems) do
                                    result, msg = AddLaphineSysSourceItem(key, item[1], item[2], item[3])
                                    if not result then
                                        return false, msg
                                    end

                                end
                            end
                        end
                        main_laphynesys()
					`);
			} catch (error) {
				console.error('[loadLaphineSysFile] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('lapineddukddakbox.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 *  load LapineUpgradeBox.lub to json object
 *
 * @param {string} filename to load
 * @param {function} callback to run once the file is loaded
 * @param {function} onEnd to run after the callback
 *
 */
function loadLaphineUpgFile(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddLaphineUpgradeItem = (
					key,
					ItemID,
					NeedCount,
					NeedRefineMin,
					NeedRefineMax,
					NeedSource_String,
					NeedOptionNumMin,
					NotSocketEnchantItem
				) => {
					const decoded_key = key && key.length > 1 ? userStringDecoder.decode(key) : null;
					const decoded_NeedSource_String =
						NeedSource_String && NeedSource_String.length > 1
							? userStringDecoder.decode(NeedSource_String, userCharpage)
							: '';

					LaphineUpgTable[decoded_key] = {
						ItemID: ItemID,
						NeedCount: NeedCount,
						NeedRefineMin: NeedRefineMin,
						NeedRefineMax: NeedRefineMax,
						NeedOptionNumMin: NeedOptionNumMin,
						NotSocketEnchantItem: NotSocketEnchantItem,
						TargetItems: new Array(),
						NeedSource_String: decoded_NeedSource_String
					};
					return 1;
				};

				ctx.AddLaphineUpgradeTargetItem = (key, name, ItemID) => {
					const decoded_key = key && key.length > 1 ? userStringDecoder.decode(key) : null;
					const decoded_name = name && name.length > 1 ? userStringDecoder.decode(name) : '';
					LaphineUpgTable[decoded_key].TargetItems.push({
						name: decoded_name,
						id: ItemID
					});
					return 1;
				};

				// mount file
				lua.mountFile('lapineupgradebox.lub', buffer);

				// execute file
				await lua.doFile('lapineupgradebox.lub');

				// create and execute our own main function
				lua.doStringSync(`
						function main_laphyneupg()
                            for key, value in pairs(tblLapineUpgradeBox.targets) do
                                result, msg = AddLaphineUpgradeItem(key, value.ItemID, value.NeedCount, value.NeedRefineMin, value.NeedRefineMax, value.NeedSource_String, value.NeedOptionNumMin, value.NotSocketEnchantItem)
                                if not result then
                                    return false, msg
                                end
                                for _, item in ipairs(value.TargetItems) do
                                    result, msg = AddLaphineUpgradeTargetItem(key, item[1], item[2])
                                    if not result then
                                        return false, msg
                                    end

                                end
                            end
                        end
                        main_laphyneupg()
					`);
			} catch (error) {
				console.error('[loadLaphineUpgFile] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('lapineupgradebox.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads ItemDBNameTbl.lub which is used in newer UI System (holds ItemDBName and ItemID)
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadItemDBTable(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddDBItemName = (baseItem, itemID) => {
					const decoded_baseItem =
						baseItem && baseItem.length > 1 ? userStringDecoder.decode(baseItem) : null;
					ItemDBNameTbl[decoded_baseItem] = itemID;
					return 1;
				};

				// mount file
				lua.mountFile('ItemDBNameTbl.lub', buffer);

				// execute file
				await lua.doFile('ItemDBNameTbl.lub');

				// create and execute our own main function
				lua.doStringSync(`
						function main_itemDBTable()
                            for key, value in pairs(ItemDBNameTbl) do
                                result, msg = AddDBItemName(key, value)
                                if not result then
                                    return false, msg
                                end
                        	end
						end
                        main_itemDBTable()
					`);
			} catch (error) {
				console.error('[loadItemDBTable] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('ItemDBNameTbl.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads ItemReformSystem.lub file into json content.
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to call with the processed data.
 * @param {function} onEnd - The function to call when the loading is complete.
 * @return {void}
 */
function loadItemReformFile(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddReformInfo = (
					key,
					BaseItem,
					ResultItem,
					NeedRefineMin,
					NeedRefineMax,
					NeedOptionNumMin,
					IsEmptySocket,
					ChangeRefineValue,
					RandomOptionCode,
					PreserveSocketItem,
					PreserveGrade
				) => {
					const decoded_BaseItem =
						BaseItem && BaseItem.length > 1 ? userStringDecoder.decode(BaseItem) : null;
					const decoded_ResultItem =
						ResultItem && ResultItem.length > 1 ? userStringDecoder.decode(ResultItem) : null;
					const decoded_RandomOptionCode =
						RandomOptionCode && RandomOptionCode.length > 1
							? userStringDecoder.decode(RandomOptionCode)
							: null;

					ItemReformTable.ReformInfo[key] = {
						BaseItem: decoded_BaseItem,
						BaseItemId: DB.getItemIdfromBase(decoded_BaseItem),
						ResultItem: decoded_ResultItem,
						ResultItemId: DB.getItemIdfromBase(decoded_ResultItem),
						NeedRefineMin: NeedRefineMin,
						NeedRefineMax: NeedRefineMax,
						NeedOptionNumMin: NeedOptionNumMin,
						IsEmptySocket: IsEmptySocket,
						ChangeRefineValue: ChangeRefineValue,
						RandomOptionCode: decoded_RandomOptionCode,
						PreserveSocketItem: PreserveSocketItem,
						PreserveGrade: PreserveGrade,
						Materials: [],
						InformationString: []
					};
					return 1;
				};

				ctx.ReformInfoAddInformationString = (key, string) => {
					const decoded_string =
						string && string.length > 1 ? userStringDecoder.decode(string, userCharpage) : null;
					ItemReformTable.ReformInfo[key].InformationString.push(decoded_string);
					return 1;
				};

				ctx.ReformInfoAddMaterial = (key, Material, Amount) => {
					const decoded_Material =
						Material && Material.length > 1 ? userStringDecoder.decode(Material) : null;
					ItemReformTable.ReformInfo[key].Materials.push({
						Material: decoded_Material,
						Amount: Amount,
						MaterialItemID: DB.getItemIdfromBase(decoded_Material)
					});
					return 1;
				};

				ctx.AddReformItem = (baseItem, itemID) => {
					const decoded_baseItem =
						baseItem && baseItem.length > 1 ? userStringDecoder.decode(baseItem) : null;
					if (!ItemReformTable.ReformItemList[decoded_baseItem]) {
						ItemReformTable.ReformItemList[decoded_baseItem] = [];
					}
					ItemReformTable.ReformItemList[decoded_baseItem].push(itemID);
					return 1;
				};

				// mount file
				lua.mountFile('ItemReformSystem.lub', buffer);

				// execute file
				await lua.doFile('ItemReformSystem.lub');

				// create and execute our own main function
				lua.doStringSync(`
						function main_itemReform()
							for key, value in pairs(ReformInfo) do
								result, msg = AddReformInfo(key, value.BaseItem, value.ResultItem, value.NeedRefineMin, value.NeedRefineMax, value.NeedOptionNumMin, value.IsEmptySocket, value.ChangeRefineValue, value.RandomOptionCode, value.PreserveSocketItem, value.PreserveGrade)
								if not result then
									return false, msg
								end
								if type(value.InformationString) == "table" then
									for _, info in pairs(value.InformationString) do
										result, msg = ReformInfoAddInformationString(key, info)
										if not result then
											return false, msg
										end
									end
								end
								if type(value.Material) == "table" then
									for material, quantity in pairs(value.Material) do
										result, msg = ReformInfoAddMaterial(key, material, quantity)
										if not result then
											return false, msg
										end
									end
								end
							end
							for key, itemList in pairs(ReformItemList) do
								for index, value in ipairs(itemList) do
									result, msg = AddReformItem(key, value)
									if not result then
										return false, msg
									end
								end
							end
						end
                        main_itemReform()
					`);
			} catch (error) {
				console.error('[loadItemReformFile] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('ItemReformSystem.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads Enchant/EnchantList(_f).lub and parses it into EnchantListTable.
 *
 * @param {string} basePath - Base path without suffix (e.g., '.../Enchant/EnchantList')
 * @param {function} callback - Optional callback after load
 * @param {function} onEnd - The function to call when the loading is complete.
 * @return {void}
 */
function loadEnchantListFile(basePath, onEnd) {
	const normalizedBase = basePath.replace(/\.(lub|lua)$/i, '');
	const defFile = normalizedBase + '_f.lub';
	const listFile = normalizedBase + '.lub';

	Client.loadFile(
		defFile,
		async function (file) {
			try {
				console.log('Loading file "' + defFile + '"...');

				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
				const ctx = lua.ctx;

				EnchantListTable = {};

				const decodeLuaString = value => {
					if (value == null) {
						return null;
					}
					if (typeof value === 'string') {
						return value;
					}
					if (value instanceof Uint8Array) {
						return userStringDecoder.decode(value);
					}
					if (value instanceof ArrayBuffer) {
						return userStringDecoder.decode(new Uint8Array(value));
					}
					return String(value);
				};

				const resolveItem = baseName => ({
					base: baseName,
					id: DB.getItemIdfromBase(baseName) || 0
				});

				const ensureGroup = id => {
					const key = Number(id);
					if (!EnchantListTable[key]) {
						EnchantListTable[key] = {
							id: key,
							slotOrder: [],
							targetItems: [],
							condition: { minRefine: 0, minGrade: 0 },
							allowRandomOption: true,
							reset: { enabled: false, rate: 0, zeny: 0, materials: [] },
							caution: '',
							slots: {}
						};
					}
					return EnchantListTable[key];
				};

				const ensureSlot = (group, slotNum) => {
					const key = Number(slotNum);
					if (!group.slots[key]) {
						group.slots[key] = {
							slot: key,
							require: { zeny: 0, materials: [] },
							successRate: 0,
							gradeBonus: {},
							random: {},
							perfect: {},
							upgrade: {}
						};
					}
					return group.slots[key];
				};

				ctx.MessageBox = message => {
					console.error('[loadEnchantListFile] ' + decodeLuaString(message));
					return 1;
				};

				ctx.C_GetSlotCount = itemDb => {
					const baseName = decodeLuaString(itemDb);
					const itemId = DB.getItemIdfromBase(baseName);
					const item = itemId ? ItemTable[itemId] : null;
					return item && item.slotCount ? Number(item.slotCount) : 0;
				};

				ctx.MAX_SLOT_NUM = 4;
				ctx.MAX_MATERIAL_NUM = 10;
				ctx.MAX_REFINE_LEVEL = 20;
				ctx.MAX_GRADE_LEVEL = 4;
				ctx.IS_CLIENT = true;

				ctx.AddEnchantGroup = enchantId => {
					ensureGroup(enchantId);
					return 1;
				};
				ctx.AddEnchantSlotOrder = (enchantId, slotNum) => {
					const group = ensureGroup(enchantId);
					group.slotOrder.push(Number(slotNum));
					return 1;
				};
				ctx.AddEnchantTargetItem = (enchantId, itemDb) => {
					const group = ensureGroup(enchantId);
					const baseName = decodeLuaString(itemDb);
					group.targetItems.push(resolveItem(baseName));
					return 1;
				};
				ctx.SetEnchantCondition = (enchantId, minRefine, minGrade) => {
					const group = ensureGroup(enchantId);
					group.condition = { minRefine: minRefine, minGrade: minGrade };
					return 1;
				};
				ctx.SetEnchantRandomOption = (enchantId, allow) => {
					const group = ensureGroup(enchantId);
					group.allowRandomOption = !!allow;
					return 1;
				};
				ctx.SetEnchantReset = (enchantId, enabled, rate, zeny) => {
					const group = ensureGroup(enchantId);
					group.reset = { enabled: !!enabled, rate: rate, zeny: zeny, materials: [] };
					return 1;
				};
				ctx.SetEnchantCaution = (enchantId, message) => {
					const group = ensureGroup(enchantId);
					group.caution = userStringDecoder.decode(message, userCharpage);
					return 1;
				};
				ctx.AddEnchantResetMaterial = (enchantId, itemDb, count) => {
					const group = ensureGroup(enchantId);
					const baseName = decodeLuaString(itemDb);
					if (!group.reset) {
						group.reset = { enabled: false, rate: 0, zeny: 0, materials: [] };
					}
					group.reset.materials.push({ ...resolveItem(baseName), count: count });
					return 1;
				};
				ctx.AddEnchantSlot = (enchantId, slotNum) => {
					const group = ensureGroup(enchantId);
					ensureSlot(group, slotNum);
					return 1;
				};
				ctx.SetEnchantRequire = (enchantId, slotNum, zeny) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					slot.require = { zeny: zeny, materials: [] };
					return 1;
				};
				ctx.AddEnchantRequireMaterial = (enchantId, slotNum, itemDb, count) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					const baseName = decodeLuaString(itemDb);
					slot.require.materials.push({ ...resolveItem(baseName), count: count });
					return 1;
				};
				ctx.SetEnchantSuccessRate = (enchantId, slotNum, rate) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					slot.successRate = rate;
					return 1;
				};
				ctx.AddEnchantGradeBonus = (enchantId, slotNum, grade, bonus) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					slot.gradeBonus[grade] = bonus;
					return 1;
				};
				ctx.AddEnchantRate = (enchantId, slotNum, grade, itemDb, rate) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					const baseName = decodeLuaString(itemDb);
					if (!slot.random[grade]) {
						slot.random[grade] = [];
					}
					slot.random[grade].push({ ...resolveItem(baseName), rate: rate });
					return 1;
				};
				ctx.AddPerfectEnchant = (enchantId, slotNum, itemDb, zeny) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					const baseName = decodeLuaString(itemDb);
					slot.perfect[baseName] = { ...resolveItem(baseName), zeny: zeny, materials: [] };
					return 1;
				};
				ctx.AddPerfectEnchantMaterial = (enchantId, slotNum, itemDb, matDb, count) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					const baseName = decodeLuaString(itemDb);
					const matName = decodeLuaString(matDb);
					if (!slot.perfect[baseName]) {
						slot.perfect[baseName] = { ...resolveItem(baseName), zeny: 0, materials: [] };
					}
					slot.perfect[baseName].materials.push({ ...resolveItem(matName), count: count });
					return 1;
				};
				ctx.AddUpgradeEnchant = (enchantId, slotNum, itemDb, resultDb, zeny) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					const baseName = decodeLuaString(itemDb);
					const resultName = decodeLuaString(resultDb);
					slot.upgrade[baseName] = {
						...resolveItem(baseName),
						result: resolveItem(resultName),
						zeny: zeny,
						materials: []
					};
					return 1;
				};
				ctx.AddUpgradeEnchantMaterial = (enchantId, slotNum, itemDb, matDb, count) => {
					const group = ensureGroup(enchantId);
					const slot = ensureSlot(group, slotNum);
					const baseName = decodeLuaString(itemDb);
					const matName = decodeLuaString(matDb);
					if (!slot.upgrade[baseName]) {
						slot.upgrade[baseName] = {
							...resolveItem(baseName),
							result: resolveItem(baseName),
							zeny: 0,
							materials: []
						};
					}
					slot.upgrade[baseName].materials.push({ ...resolveItem(matName), count: count });
					return 1;
				};

				lua.mountFile('EnchantList_f.lub', buffer);
				await lua.doFile('EnchantList_f.lub');

				Client.loadFile(
					listFile,
					async function (fileList) {
						try {
							console.log('Loading file "' + listFile + '"...');

							const listBuffer = fileList instanceof ArrayBuffer ? new Uint8Array(fileList) : fileList;
							lua.mountFile('EnchantList.lub', listBuffer);
							await lua.doFile('EnchantList.lub');

							lua.doStringSync(`
									function main_enchantlist()
										for enchantNum, info in pairs(Table) do
											AddEnchantGroup(enchantNum)
											if info.SlotOrder ~= nil then
												for _, slotNum in ipairs(info.SlotOrder) do
													AddEnchantSlotOrder(enchantNum, slotNum)
												end
											end
											if info.TargetItemTbl ~= nil then
												for _, itemDb in ipairs(info.TargetItemTbl) do
													AddEnchantTargetItem(enchantNum, itemDb)
												end
											end
											if info.Condition ~= nil then
												SetEnchantCondition(enchantNum, info.Condition.MinRefine, info.Condition.MinGrade)
											end
											if info.bApproveRandomOpt ~= nil then
												SetEnchantRandomOption(enchantNum, info.bApproveRandomOpt)
											end
											if info.Reset ~= nil then
												SetEnchantReset(enchantNum, info.Reset.bReset, info.Reset.Rate, info.Reset.Zeny)
												if info.Reset.MatTbl ~= nil then
													for matItem, matCount in pairs(info.Reset.MatTbl) do
														AddEnchantResetMaterial(enchantNum, matItem, matCount)
													end
												end
											end
											if info.CautionMsg ~= nil then
												SetEnchantCaution(enchantNum, info.CautionMsg)
											end
											if info.Slot ~= nil then
												for slotNum, slotInfo in pairs(info.Slot) do
													AddEnchantSlot(enchantNum, slotNum)
													if slotInfo.RequireTbl ~= nil then
														SetEnchantRequire(enchantNum, slotNum, slotInfo.RequireTbl.Zeny)
														if slotInfo.RequireTbl.MatTbl ~= nil then
															for matItem, matCount in pairs(slotInfo.RequireTbl.MatTbl) do
																AddEnchantRequireMaterial(enchantNum, slotNum, matItem, matCount)
															end
														end
													end
													if slotInfo.SuccessRate ~= nil then
														SetEnchantSuccessRate(enchantNum, slotNum, slotInfo.SuccessRate)
													end
													if slotInfo.GradeBonusTbl ~= nil then
														for grade, bonus in pairs(slotInfo.GradeBonusTbl) do
															AddEnchantGradeBonus(enchantNum, slotNum, grade, bonus)
														end
													end
													if slotInfo.EnchantRateTbl ~= nil then
														for grade, rateTbl in pairs(slotInfo.EnchantRateTbl) do
															for itemDb, rate in pairs(rateTbl) do
																AddEnchantRate(enchantNum, slotNum, grade, itemDb, rate)
															end
														end
													end
													if slotInfo.PerfectECTbl ~= nil then
														for itemDb, perfect in pairs(slotInfo.PerfectECTbl) do
															AddPerfectEnchant(enchantNum, slotNum, itemDb, perfect.Zeny)
															if perfect.MatTbl ~= nil then
																for matItem, matCount in pairs(perfect.MatTbl) do
																	AddPerfectEnchantMaterial(enchantNum, slotNum, itemDb, matItem, matCount)
																end
															end
														end
													end
													if slotInfo.UpgradeECTbl ~= nil then
														for itemDb, upgrade in pairs(slotInfo.UpgradeECTbl) do
															AddUpgradeEnchant(enchantNum, slotNum, itemDb, upgrade.ResultItemDB, upgrade.Zeny)
															if upgrade.MatTbl ~= nil then
																for matItem, matCount in pairs(upgrade.MatTbl) do
																	AddUpgradeEnchantMaterial(enchantNum, slotNum, itemDb, matItem, matCount)
																end
															end
														end
													end
												end
											end
										end
									end
									main_enchantlist()
								`);
						} catch (error) {
							console.error('[loadEnchantListFile] Error: ', error);
						} finally {
							lua.unmountFile('EnchantList.lub');
							lua.unmountFile('EnchantList_f.lub');
							onEnd();
						}
					},
					function () {
						console.error('[loadEnchantListFile] Missing file: ' + listFile);
						lua.unmountFile('EnchantList_f.lub');
						onEnd();
					}
				);
			} catch (error) {
				console.error('[loadEnchantListFile] Error: ', error);
				lua.unmountFile('EnchantList_f.lub');
				onEnd();
			}
		},
		function () {
			console.error('[loadEnchantListFile] Missing file: ' + defFile);
			onEnd();
		}
	);
}

/**
 * Loads lub files for Hateffects & Footprints
 */
function loadHatEffectInfo(onEnd) {
	const basePath = DB.LUA_PATH + 'hateffectinfo/';
	const idFile = basePath + 'hateffectids.lub';
	const infoFile = basePath + 'hateffectinfo.lub';

	Client.loadFile(
		idFile,
		async function (idBuf) {
			const ctx = lua.ctx;

			ctx.MessageBox = function (msg) {
				console.warn('[HatEffect] ' + msg);
				return 1;
			};

			function decodeLuaString(v) {
				return userStringDecoder.decode(v);
			}

			ctx.__js_hat_effect_id = function (key, value) {
				HatEffectID[decodeLuaString(key)] = Number(value);
				return 1;
			};

			ctx.__js_hat_effect_info = function (id, info) {
				id = Number(id);

				HatEffectInfo[id] = {
					resourceFileName: info.resourceFileName ? decodeLuaString(info.resourceFileName) : null,

					hatEffectID: info.hatEffectID ? Number(info.hatEffectID) : 0,
					hatEffectPos: info.hatEffectPos || 0,
					hatEffectPosX: info.hatEffectPosX || 0,

					isAttachedHead: !!info.isAttachedHead,
					isIgnoreRiding: !!info.isIgnoreRiding,
					isRenderBeforeCharacter: !!info.isRenderBeforeCharacter,

					isAdjustPositionWhenShrinkState: !!info.isAdjustPositionWhenShrinkState,
					isAdjustSizeWhenShrinkState: !!info.isAdjustSizeWhenShrinkState,

					footprint: !!info.footprint
				};
				return 1;
			};

			ctx.__js_footprint_effect_info = function (id, info) {
				id = Number(id);

				FootPrintEffectInfo[id] = {
					type: info.Type || 0,

					pngLeft: info.PngFile_Left ? decodeLuaString(info.PngFile_Left) : null,
					pngRight: info.PngFile_Right ? decodeLuaString(info.PngFile_Right) : null,

					strBottomLeft: info.StrFile_Bottom_Left ? decodeLuaString(info.StrFile_Bottom_Left) : null,
					strBottomRight: info.StrFile_Bottom_Right ? decodeLuaString(info.StrFile_Bottom_Right) : null,

					strTopLeft: info.StrFile_Top_Left ? decodeLuaString(info.StrFile_Top_Left) : null,
					strTopRight: info.StrFile_Top_Right ? decodeLuaString(info.StrFile_Top_Right) : null,

					scaleBottom: info.Scale_Bottom ?? 0,
					scaleTop: info.Scale_Top ?? 0,
					heightTop: info.Height_Top ?? 0,

					stride: info.Stride ?? 50,
					gap: info.Gap ?? 2,
					isAdjustAngle: !!info.IsAdjustAngle
				};

				return 1;
			};

			// Load INFO file (AFTER IDs)
			async function LoadHatEffectInfo() {
				return Client.loadFile(infoFile, async function (infoBuf) {
					try {
						lua.mountFile(
							'hateffectinfo.lub',
							infoBuf instanceof ArrayBuffer ? new Uint8Array(infoBuf) : infoBuf
						);
						await lua.doFile('hateffectinfo.lub');
						await lua.doString(`
							if hatEffectTable ~= nil then
								for id, info in pairs(hatEffectTable) do
									__js_hat_effect_info(id, info)
								end
							end
						`);
						await LoadFootPrint();
					} catch (e) {
						console.error('[HatEffect] Info load error', e);
					} finally {
						lua.unmountFile('hateffectinfo.lub');
					}
				});
			}

			// Load FOOTPRINT file (AFTER Info)
			async function LoadFootPrint() {
				return Client.loadFile(basePath + 'footprinteffectinfo.lub', async function (buf) {
					try {
						lua.mountFile(
							'footprinteffectinfo.lub',
							buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf
						);
						await lua.doFile('footprinteffectinfo.lub');
						await lua.doString(`
							if FootPrintEffectTable ~= nil then
								for id, info in pairs(FootPrintEffectTable) do
									__js_footprint_effect_info(id, info)
								end
							end
						`);
					} catch (e) {
						console.error('[FootPrintEffect] load error', e);
					} finally {
						lua.unmountFile('footprinteffectinfo.lub');
					}
				});
			}

			try {
				lua.mountFile('hateffectids.lub', idBuf instanceof ArrayBuffer ? new Uint8Array(idBuf) : idBuf);
				await lua.doFile('hateffectids.lub');
				await lua.doString(`
					if HatEFID ~= nil then
						for k, v in pairs(HatEFID) do
							__js_hat_effect_id(k, v)
						end
					end
				`);

				await LoadHatEffectInfo();
			} catch (e) {
				console.error('[HatEffect] ID load error', e);
				return;
			} finally {
				lua.unmountFile('hateffectids.lub');
			}

			// All files loaded
			if (typeof onEnd === 'function') {
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads the System/Sign_Data_EN.lub to json object.
 *
 * @param {string} filename - The name of the Lua file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadSignBoardData(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddSignBoardData = (key, translation) => {
					const decoded_key = key && key.length > 1 ? userStringDecoder.decode(key) : null;
					const decoded_translation =
						translation && translation.length > 1 ? userStringDecoder.decode(translation) : null;
					SignBoardTranslatedTable[decoded_key] = decoded_translation;
					return 1;
				};

				// mount file
				lua.mountFile('Sign_Data.lub', buffer);

				// execute file
				await lua.doFile('Sign_Data.lub');

				// create and execute our own main function
				lua.doStringSync(`
						function main_SignBoardData()
                            for key, value in pairs(SignBoardData) do
                                result, msg = AddSignBoardData(key, value)
                                if not result then
                                    return false, msg
                                end
                        	end
						end
                        main_SignBoardData()
					`);
			} catch (error) {
				console.error('[loadSignBoardData] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('Sign_Data.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Load SignBoardList.lub to JSON object
 *
 * @param {string} filename - The name of the Lua file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadSignBoardList(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// create signboard list
				const signBoardList = [];

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddSignBoard = (mapname, x, y, height, type, icon_location, description, color) => {
					const decoded_mapname = mapname && mapname.length > 1 ? userStringDecoder.decode(mapname) : null;
					const decoded_icon_location =
						icon_location && icon_location.length > 1 ? userStringDecoder.decode(icon_location) : null;
					const decoded_description =
						description && description.length > 1
							? userStringDecoder.decode(description, userCharpage)
							: null;
					const decoded_color = color && color.length > 1 ? userStringDecoder.decode(color) : null;

					signBoardList.push({
						mapname: decoded_mapname,
						x: x,
						y: y,
						height: height,
						type: type,
						icon_location: decoded_icon_location,
						description: decoded_description,
						color: decoded_color
					});

					return 1;
				};

				// mount file
				lua.mountFile('SignBoardList.lub', buffer);

				// execute file
				await lua.doFile('SignBoardList.lub');

				// create and execute our own main function
				lua.doStringSync(`
						function main_SignBoardList()
                            for key, value in pairs(SignBoardList) do
								local description = "";
								local color = "";
								if value[7] ~= nil then
									description = value[7];
								end
								if value[8] ~= nil then
									color = value[8];
								end
                                result, msg = AddSignBoard(value[1], value[2], value[3], value[4], value[5], value[6], description, color)
                                if not result then
                                    return false, msg
                                end
                        	end
						end
                        main_SignBoardList()
					`);

				SignBoardTable = preprocessSignboardData(signBoardList);
			} catch (error) {
				console.error('[loadSignBoardList] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile('SignBoardList.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Preprocesses an array of signboard objects and organizes them into a nested dictionary.
 *
 * @param {Array} signboardArray - The array of signboard objects.
 * @return {Object} The nested dictionary containing the preprocessed signboard data.
 */
function preprocessSignboardData(signboardArray) {
	const signboardDict = {};

	for (const signboard of signboardArray) {
		const { mapname, x, y } = signboard;
		if (!signboardDict[mapname]) {
			signboardDict[mapname] = {};
		}
		if (!signboardDict[mapname][x]) {
			signboardDict[mapname][x] = {};
		}
		signboardDict[mapname][x][y] = signboard;
	}

	return signboardDict;
}

/**
 * Load weapontable.lub to WeaponTable and WeaponHitSoundTable
 *
 * @param {string} filename to load
 * @param {function} callback to run once the file is loaded
 * @param {function} onEnd to run after the callback
 */
function loadWeaponTable(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create required functions in context
				ctx.AddWeaponName = (weaponID, weaponName) => {
					const decoded_weaponName =
						weaponName && weaponName.length > 0 ? userStringDecoder.decode(weaponName) : '';
					WeaponTable[weaponID] = decoded_weaponName;
					return 1;
				};

				ctx.AddWeaponHitSound = (weaponID, soundFile) => {
					const decoded_soundFile =
						soundFile && soundFile.length > 0 ? userStringDecoder.decode(soundFile) : '';
					WeaponHitSoundTable[weaponID] = decoded_soundFile;
					return 1;
				};

				ctx.AddExpansionWeapon = (weaponID, expansionWeaponID) => {
					WeaponTypeExpansion[weaponID] = expansionWeaponID;
					return 1;
				};

				// mount file
				lua.mountFile('weapontable.lub', buffer);

				// execute file
				await lua.doFile('weapontable.lub');

				// create and execute our own main function
				lua.doStringSync(`  
						function main_weapontable()  
							-- Process WeaponNameTable  
							if type(WeaponNameTable) == "table" then  
								for weaponID, weaponName in pairs(WeaponNameTable) do  
									result, msg = AddWeaponName(weaponID, weaponName)  
									if not result then  
										return false, msg  
									end  
								end  
							end  
							
							-- Process WeaponHitWaveNameTable  (seems like gravity is still using the hardcoded sound files)
							-- uncomment this if you want to use the custom sound files
							--if type(WeaponHitWaveNameTable) == "table" then  
							--	for weaponID, soundFile in pairs(WeaponHitWaveNameTable) do  
							--		result, msg = AddWeaponHitSound(weaponID, soundFile)  
							--		if not result then  
							--			return false, msg  
							--		end  
							--	end  
							--end  

							-- Process WeaponTypeExpansionTable
							if type(Expansion_Weapon_IDs) == "table" then  
								for weaponID, expansionWeaponID in pairs(Expansion_Weapon_IDs) do  
									result, msg = AddExpansionWeapon(weaponID, expansionWeaponID)  
									if not result then  
										return false, msg  
									end  
								end  
							end  
							
							return true, "success"  
						end  
						main_weapontable()  
					`);
			} catch (error) {
				console.error('[loadWeaponTable] Error: ', error);
			} finally {
				// release file from memory
				lua.unmountFile('weapontable.lub');

				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads skillinfolist.lub which replaces part of DB/Skills/SkillInfo.js
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadSkillInfoList(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// Create automatic JT_ mappings
				const jobIdWithJT = { ...JobId };
				for (const [key, value] of Object.entries(JobId)) {
					jobIdWithJT[`JT_${key}`] = value;
				}
				ctx.JOBID = jobIdWithJT;
				await lua.doString(`
						if JOBID then
							__JOBID_ORIGINAL = JOBID
							JOBID = setmetatable({}, {
								__index = function(t, k)
									local id = __JOBID_ORIGINAL[k]
									return id ~= nil and id or 0
								end
							})
						end
					`);

				// create required functions in context
				ctx.AddSkillInfo = (
					skillId,
					resName,
					skillName,
					maxLv,
					spAmount,
					bSeperateLv,
					attackRange,
					skillScale
				) => {
					// Convert to format expected by SkillInfo.js
					const toArray = v => {
						if (Array.isArray(v)) {
							return v;
						}
						if (typeof v === 'object' && v !== null) {
							return Object.keys(v)
								.map(Number)
								.sort((a, b) => a - b)
								.map(k => v[k]);
						}
						return [];
					};
					SkillInfo[skillId] = {
						Name: userStringDecoder.decode(resName),
						SkillName: userStringDecoder.decode(skillName, userCharpage),
						MaxLv: maxLv,
						SpAmount: toArray(spAmount),
						bSeperateLv: bSeperateLv,
						AttackRange: toArray(attackRange),
						SkillScale: skillScale,
						NeedSkillList: {},
						_NeedSkillList: []
					};

					return 1;
				};

				ctx.AddSkillRequirement = (skillId, requiredSkillId, requiredLevel) => {
					SkillInfo[skillId]._NeedSkillList.push([requiredSkillId, requiredLevel]);
					return 1;
				};

				ctx.AddJobSkillRequirement = (skillId, jobId, requiredSkillId, requiredLevel) => {
					if (!SkillInfo[skillId].NeedSkillList[jobId]) {
						SkillInfo[skillId].NeedSkillList[jobId] = [];
					}
					SkillInfo[skillId].NeedSkillList[jobId].push([requiredSkillId, requiredLevel]);
					return 1;
				};

				ctx.SKID = SKID;
				await lua.doString(`
						if SKID then
							__SKID_ORIGINAL = SKID 

							SKID = setmetatable({}, {
								__index = function(t, k)
								local id = __SKID_ORIGINAL[k]
								return id ~= nil and id or 0 
								end
							})
						end
					`);

				// mount file
				lua.mountFile('skillinfolist.lub', buffer);

				// execute file
				await lua.doFile('skillinfolist.lub');

				// create and execute our own main function
				lua.doStringSync(`  
						function main_skillInfoList()  
							if not SKILL_INFO_LIST then  
								return false, "Error: SKILL_INFO_LIST is nil or not a table"  
							end  
						
							for skillId, skillData in pairs(SKILL_INFO_LIST) do 
								local resName = skillData[1] or "" 
								local skillName = skillData.SkillName or ""  
								local maxLv = skillData.MaxLv or 1  
								local spAmount = skillData.SpAmount or {}  
								local bSeperateLv = skillData.bSeperateLv or false  
								local attackRange = skillData.AttackRange or {}  
								local skillScale = skillData.SkillScale or {}  

								result, msg = AddSkillInfo(skillId, resName, skillName, maxLv, spAmount, bSeperateLv, attackRange, skillScale)  
								if not result then  
									return false, msg  
								end
								
								if skillData._NeedSkillList then  
									for _, req in ipairs(skillData._NeedSkillList) do  
										if req[1] and req[2] then  
											AddSkillRequirement(skillId, req[1], req[2])  
										end  
									end  
								end  
								
								if skillData.NeedSkillList then  
									for jobId, reqList in pairs(skillData.NeedSkillList) do  
										if reqList then  
											for _, req in ipairs(reqList) do  
												if req[1] and req[2] then  
													AddJobSkillRequirement(skillId, jobId, req[1], req[2])  
												end  
											end  
										end  
									end  
								end 

							end  
							return true, "good"  
							end
						main_skillInfoList()  
					`);
			// D-08: 技能名访问点分散（Entity.js/Skill.js/ShortCut.js 等直接读 SkillName），
			// 故在加载后原地改写 SkillInfo[].SkillName，统一覆盖（Phase 14）
			for (const id in SkillInfo) {
				if (SkillInfo[id] && SkillInfo[id].SkillName) {
					if (SkillInfo[id]._origSkillName === undefined) {
						SkillInfo[id]._origSkillName = SkillInfo[id].SkillName;
					}
					SkillInfo[id].SkillName = LangOverlay.getSkillName(parseInt(id, 10), SkillInfo[id]._origSkillName);
				}
			}
		} catch (error) {
			console.error('[loadSkillInfoList] Error: ', error);
			} finally {
				// release file from memory
				lua.unmountFile('skillinfolist.lub');
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads jobinheritlist.lub and skilltreeview.lub which replaces DB/Skills/SkillTreeView.js
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadSkillTreeView(filename, callback, onEnd) {
	// First load jobinheritlist.lub
	Client.loadFile(
		DB.LUA_PATH + 'skillinfoz/jobinheritlist.lub',
		async function (file) {
			try {
				console.log(`Loading file "${DB.LUA_PATH}skillinfoz/jobinheritlist.lub"...`);
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// Mount and execute jobinheritlist.lub
				lua.mountFile('jobinheritlist.lub', buffer);
				await lua.doFile('jobinheritlist.lub');

				// Now load skilltreeview.lub
				loadSkillTreeViewData(filename, callback, onEnd);
			} catch (error) {
				console.error('[loadSkillTreeView - jobinheritlist] Error: ', error);
				onEnd();
			}
		},
		onEnd
	);
}

function loadSkillTreeViewData(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
				const ctx = lua.ctx;
				// Create automatic JT_ mappings
				const jobIdWithJT = { ...JobId };
				for (const [key, value] of Object.entries(JobId)) {
					jobIdWithJT[`JT_${key}`] = value;
				}
				ctx.JOBID = jobIdWithJT;

				// Function to add skill tree data using job hierarchy from jobinheritlist.lub
				ctx.AddSkillTreeView = function (jobId, beforeJob) {
					// Calculate list and beforeJob from inheritance chain
					let list = 1;
					// TODO: Find another way to do that
					if (jobId === JobId.NOVICE) {
						list = 1;
					} else if (
						jobId < JobId.KNIGHT ||
						jobId === JobId.TAEKWON ||
						(jobId >= JobId.SUPERNOVICE && jobId <= JobId.NINJA) ||
						jobId == JobId.DO_SUMMONER ||
						jobId == JobId.DRUID
					) {
						list = 1;
					} else if (
						jobId < JobId.NOVICE_H ||
						jobId == JobId.STAR ||
						jobId == JobId.LINKER ||
						(jobId >= JobId.KAGEROU && jobId <= JobId.REBELLION) ||
						jobId == JobId.SUPERNOVICE2 ||
						jobId == JobId.SPIRIT_HANDLER ||
						jobId == JobId.KARNOS
					) {
						list = 2;
					} else if (
						(jobId <= JobId.THIEF_H && jobId >= JobId.NOVICE_H) ||
						(jobId >= JobId.NOVICE_B && jobId <= JobId.THIEF_B) ||
						jobId == JobId.DO_SUMMONER_B ||
						jobId == JobId.NINJA_B ||
						jobId == JobId.TAEKWON_B ||
						jobId == JobId.GUNSLINGER_B
					) {
						list = 1;
					} else if (
						jobId < JobId.RUNE_KNIGHT ||
						(jobId >= JobId.KNIGHT_B && jobId <= JobId.DANCER_B) ||
						(jobId >= JobId.KAGEROU_B && jobId <= JobId.REBELLION_B)
					) {
						list = 2;
					} else if (
						jobId < JobId.DRAGON_KNIGHT ||
						jobId == JobId.STAR_EMPEROR ||
						jobId == JobId.SOUL_REAPER ||
						(jobId >= JobId.RUNE_KNIGHT_B && jobId <= JobId.SHADOW_CHASER_B) ||
						jobId === JobId.EMPEROR_B ||
						jobId === JobId.REAPER_B ||
						jobId == JobId.ALITEA
					) {
						list = 3;
					} else if (jobId <= JobId.TROUVERE || (jobId >= JobId.SKY_EMPEROR && jobId <= JobId.HYPER_NOVICE)) {
						list = 4;
					} else {
						list = 1;
						console.error(`[loadSkillTreeViewData] Failed to find inherith list job: (${jobId})`);
					}
					// Create the skill tree entry
					const entry = {
						list: list,
						beforeJob: beforeJob
					};

					SkillTreeView[jobId] = entry;
					return 1;
				};

				ctx.AddSkillToJob = function (jobId, pos, skillId) {
					if (SkillTreeView[jobId]) {
						SkillTreeView[jobId][skillId] = Number(pos);
					}
					return 1;
				};

				lua.doStringSync(`
						JobSkillTab = {}
					
						function JobSkillTab.ChangeSkillTabName(in_job, in_1sttab, in_2ndtab, in_3rdtab, in_4thtab)
							local tbl = {
								job = in_job,
								TabName1st = in_1sttab,
								TabName2nd = in_2ndtab,
								TabName3rd = in_3rdtab,
								TabName4th = in_4thtab
							}
							JobSkillTab[#JobSkillTab + 1] = tbl
							return true
						end
					`);

				ctx.SKID = SKID;
				await lua.doString(`
						if SKID then
							__SKID_ORIGINAL = SKID 

							SKID = setmetatable({}, {
								__index = function(t, k)
								local id = __SKID_ORIGINAL[k]
								return id ~= nil and id or 0 
								end
							})
						end
					`);

				lua.mountFile('skilltreeview.lub', buffer);
				await lua.doFile('skilltreeview.lub');

				lua.doStringSync(`    
						function main_skillTreeView()    
							if not SKILL_TREEVIEW_FOR_JOB then    
								return false, "Error: SKILL_TREEVIEW_FOR_JOB is nil or not a table"    
							end    
					
							for jobId, skillData in pairs(SKILL_TREEVIEW_FOR_JOB) do      
								local beforeJob = JOB_INHERIT_LIST[jobId] or nil  
								result, msg = AddSkillTreeView(jobId, beforeJob)      
								if not result then      
									return false, msg      
								end   
								
								for pos, skillId in pairs(skillData) do    
									result, msg = AddSkillToJob(jobId, pos, skillId)    
									if not result then    
										return false, msg    
									end    
								end  
							end    
							return true, "good"    
						end    
						
						main_skillTreeView()    
					`);
			} catch (error) {
				console.error('[loadSkillTreeView] Error: ', error);
			} finally {
				lua.unmountFile('skilltreeview.lub');
				lua.unmountFile('jobinheritlist.lub');
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Load State Icon Info (StatusInfo) from Lua files
 * Loads efstids.lub, stateiconimginfo.lub, and stateiconinfo.lub sequentially,
 * synchronizing EFST_IDs with StatusConst and populating the StatusInfo table.
 *
 * @param {string} basePath - Directory path (e.g., DB.LUA_PATH + 'stateicon/')
 * @param {function} callback - (Unused/Legacy)
 * @param {function} onEnd - Function to run when done
 */
function loadStateIconInfo(basePath, callback, onEnd) {
	const files = ['efstids.lub', 'stateiconimginfo.lub', 'stateiconinfo.lub'];

	const loadedBuffers = [];

	const dirPath = basePath.endsWith('/') ? basePath : basePath + '/';

	function loadNext(index) {
		if (index >= files.length) {
			processLuaData();
			return;
		}

		const fullPath = dirPath + files[index];
		console.log('Loading file "' + fullPath + '"...');

		Client.loadFile(
			fullPath,
			function (data) {
				loadedBuffers.push({ name: files[index], data: data });
				loadNext(index + 1);
			},
			function () {
				console.error('[loadStateIconInfo] - Failed to load ' + fullPath);
				if (onEnd) {
					onEnd();
				}
			}
		);
	}

	async function processLuaData() {
		try {
			const ctx = lua.ctx;

			ctx.mergeSC = (key, value) => {
				// Keys might be passed as Uint8Array from Lua by Wasmoon
				const safeKey =
					typeof key === 'string' ? key : key instanceof Uint8Array ? userStringDecoder.decode(key) : key;

				if (
					typeof safeKey === 'string' &&
					typeof value === 'number' &&
					value >= 0 &&
					safeKey.startsWith('EFST_')
				) {
					const jsKey = safeKey.replace('EFST_', '');
					SC[jsKey] = value;
				}

				// Add BLANK back if it was cleared and not defined in LUB
				if (!SC.BLANK) {
					SC.BLANK = -1;
				}
				return 1;
			};

			ctx.SetStatusInfo = (id, haveTimeLimit, posTimeLimitStr) => {
				if (!StatusInfo[id]) {
					StatusInfo[id] = {};
				}
				StatusInfo[id].haveTimeLimit = haveTimeLimit;
				StatusInfo[id].posTimeLimitStr = posTimeLimitStr;
				StatusInfo[id].descript = [];
				return 1;
			};

			ctx.AddStatusDesc = (id, desc, r, g, b) => {
				if (!StatusInfo[id]) {
					return 0;
				}
				const text = userStringDecoder.decode(desc, userCharpage);
				let color = null;
				if (r >= 0 && g >= 0 && b >= 0) {
					color = `rgb(${r}, ${g}, ${b})`;
				}
				StatusInfo[id].descript.push([text, color]);
				return 1;
			};

			ctx.SetStatusIcon = (id, iconName) => {
				const icon = userStringDecoder.decode(iconName);
				if (!StatusInfo[id]) {
					StatusInfo[id] = { descript: [] };
				}
				StatusInfo[id].icon = icon;
				return 1;
			};

			for (let i = 0; i < loadedBuffers.length; i++) {
				const f = loadedBuffers[i];
				const buffer = f.data instanceof ArrayBuffer ? new Uint8Array(f.data) : f.data;
				lua.mountFile(f.name, buffer);
				await lua.doFile(f.name);

				// This prevents the 'table index is nil' crash in stateiconimginfo.lub.
				// return SC.BLANK on nil
				if (f.name === 'efstids.lub') {
					await lua.doString(`
							if EFST_IDs then
								__EFST_IDS_ORIGINAL = EFST_IDs 

								EFST_IDs = setmetatable({}, {
									__index = function(t, k)
										local id = __EFST_IDS_ORIGINAL[k]
										return id ~= nil and id or -1
									end
								})
							end
						`);
				}
			}

			lua.doStringSync(`
					function extract_status_info()
						-- Sync StatusConst (SC) with the full list of EFST_IDs from the original table
						if type(__EFST_IDS_ORIGINAL) == "table" then
							for k, v in pairs(__EFST_IDS_ORIGINAL) do
								if type(k) == "string" and type(v) == "number" then
									mergeSC(k, v)
								end
							end
							
							local mt = getmetatable(__EFST_IDS_ORIGINAL)
							if mt and type(mt.__index) == "table" then
								for k, v in pairs(mt.__index) do
									if type(k) == "string" and type(v) == "number" then
										mergeSC(k, v)
									end
								end
							end
						end

						-- Process Basic Info & Descriptions
						if StateIconList ~= nil then
							for id, info in pairs(StateIconList) do
								SetStatusInfo(id, info.haveTimeLimit, info.posTimeLimitStr)

								if info.descript ~= nil then
									for _, descLine in ipairs(info.descript) do
										local text = descLine[1]
										local colorData = descLine[2]
										local r, g, b = -1, -1, -1

										if type(colorData) == "table" and #colorData >= 3 then
											r = colorData[1]
											g = colorData[2]
											b = colorData[3]
										end

										AddStatusDesc(id, text, r, g, b)
									end
								end
							end
						end

						-- Process Icons 
						if StateIconImgList ~= nil then
							for priorityId, list in pairs(StateIconImgList) do 
								if type(list) == "table" then
									for id, iconName in pairs(list) do
										SetStatusIcon(id, iconName)
									end
								end
							end
						end
					end

					extract_status_info()
				`);
		} catch (e) {
			console.error('[loadStateIconInfo] Lua Error:', e);
		} finally {
			loadedBuffers.forEach(f => lua.unmountFile(f.name));
			if (onEnd) {
				onEnd();
			}
		}
	}

	loadNext(0);
}

/* Load Ragnarok Lua table to object
 * A lot of ragnarok lua tables are splited in 2 files ( 1 - ID table, 2 - Table of values )
 * @param {Array} list of files to be load (must be 2 files)
 * @param {String} name of table in lua file
 * @param {function} callback to run once the file is loaded
 * @param {function} onEnd to run once the file is loaded
 * @param {function?} contextFunc - Function to execute after parsing but before unmounting
 *
 * @author alisonrag
 */
function loadLuaTable(file_list, table_name, callback, onEnd, contextFunc) {
	const id_filename = file_list[0];
	const value_table_filename = file_list[1];

	try {
		console.log('Loading file "' + id_filename + '"...');
		Client.loadFile(id_filename, async function (file) {
			try {
				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
				// mount file
				lua.mountFile(id_filename, buffer);
				// execute file
				await lua.doFile(id_filename);
				loadValueTable();
			} catch (hException) {
				console.error(`(${id_filename}) error: `, hException);
			}
		});

		function loadValueTable() {
			console.log('Loading file "' + value_table_filename + '"...');
			Client.loadFile(value_table_filename, async function (file) {
				try {
					// check if file is ArrayBuffer and convert to Uint8Array if necessary
					const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
					// mount file
					lua.mountFile(value_table_filename, buffer);
					// execute file
					await lua.doFile(value_table_filename);
					parseTable();
				} catch (hException) {
					console.error(`(${value_table_filename}) error: `, hException);
				}
			});
		}

		function parseTable() {
			// declare the table object
			const table = {};

			// get context
			const ctx = lua.ctx;

			// create context function
			ctx.addKeyAndValueToTable = (key, value) => {
				table[key] = userStringDecoder.decode(value, userCharpage);
				return 1;
			};

			// used in some specific cases like skilldescript.lub
			ctx.addKeyAndMoreValuesToTable = (key, value) => {
				if (!table[key]) {
					table[key] = '';
				}
				table[key] += userStringDecoder.decode(value, userCharpage) + '\n';
				return 1;
			};

			// create and execute a wrapper lua code
			// this way we let webassembly handle the code and still can get the table data
			lua.doStringSync(`
						function main_table()
							for key, value in pairs(${table_name}) do
								if type(value) == "table" then
									for k, v in pairs(value) do
										result, msg = addKeyAndMoreValuesToTable(key, v)
									end
								else
									result, msg = addKeyAndValueToTable(key, value)
								end
								if not result then
									return false, msg
								end
							end
							return true, "good"
						end
						main_table()
					`);

			if (typeof contextFunc === 'function') {
				contextFunc();
			}

			// unmount files
			lua.unmountFile(value_table_filename);
			lua.unmountFile(id_filename);

			// return table
			callback.call(null, table);
		}
	} catch (e) {
		console.error('error: ', e);
	} finally {
		onEnd.call();
	}
}

/**
 * Extracts a variable from a Lua file and converts it to a JavaScript value
 * @param {String} file_path - Path to the Lua file
 * @param {String} variable_name - Name of the variable to extract
 * @param {function} callback - Function to run with the extracted value
 * @param {function} onEnd - Function to run once the process is complete
 *
 * @author guicaulada
 */
function loadLuaValue(file_path, variable_name, callback, onEnd) {
	try {
		console.log('Loading file "' + file_path + '"...');
		Client.loadFile(file_path, async function (file) {
			try {
				// Check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// Mount file
				lua.mountFile(file_path, buffer);

				// Execute file
				await lua.doFile(file_path);

				// Get context
				const ctx = lua.ctx;

				// Initialize result variable
				let result = null;

				// Add key-value pairs to objects at any nesting level
				// 显式传 userCharpage（langtype 240 → utf-8）：缺省时 decode 落到
				// userCharset(windows-1252)，UTF-8 中文会成乱码（itemInfo 同款传参先例）
				ctx.extractValue = value => {
					result = JSON.parse(userStringDecoder.decode(value, userCharpage));
				};

				// Create and execute a wrapper Lua code to extract the variable
				lua.doStringSync(
					String.raw`
							local function escape_str(str)
								return str:gsub("\\", "\\\\"):gsub("\"", "\\\"")
							end

							local function to_json(value)
								if type(value) == "boolean" then
									return tostring(value)
								elseif type(value) == "number" then
									return value
								elseif type(value) == "string" then
									return "\"" .. escape_str(value) .. "\""
								elseif type(value) == "table" then
									local is_array = true
									local index = 1
									for k, _ in pairs(value) do
										if type(k) ~= "number" or k ~= index then
											is_array = false
											break
										end
										index = index + 1
									end

									local result = {}
									if is_array then
										for _, v in ipairs(value) do
											table.insert(result, to_json(v))
										end
										return "[" .. table.concat(result, ",") .. "]"
									else
										for k, v in pairs(value) do
											if type(k) == "string" then
												table.insert(result, "\"" .. escape_str(k) .. "\":" .. to_json(v))
											elseif type(k) == "number" then
												table.insert(result, "\"" .. tostring(k) .. "\":" .. to_json(v))
											end
										end
										return "{" .. table.concat(result, ",") .. "}"
									end
								else
									return "null"
								end
							end
						` +
						`
							extractValue(to_json(${variable_name}))
						`
				);

				// Unmount file
				lua.unmountFile(file_path);

				// Return the extracted value
				callback.call(null, result);
			} catch (hException) {
				console.error(`(${file_path}) error: `, hException);
				callback.call(null, null);
			} finally {
				if (onEnd) {
					onEnd.call();
				}
			}
		});
	} catch (e) {
		console.error('error: ', e);
		if (onEnd) {
			onEnd.call();
		}
	}
}

/**
 * Loads System/mapInfo.lub
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to invoke with the parsed data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 */
function loadMapTbl(filename, callback, onEnd) {
	const loadPromise = new Promise((resolve, reject) => {
		Client.loadFile(filename, resolve, reject);
	});

	loadPromise
		.then(async file => {
			try {
				console.log('Loading file "' + filename + '"...');
				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context, a proxy. It will be used to interact with lua conveniently
				const ctx = lua.ctx;

				// create mapInfo required functions in context
				ctx.AddMapDisplayName = (name, displayName, notify_enter) => {
					const decoded_name = userStringDecoder.decode(name);
					MapInfo[decoded_name] = {
						displayName: userStringDecoder.decode(displayName, userCharpage),
						notifyEnter: notify_enter,
						signName: {
							subTitle: null,
							mainTitle: null
						},
						backgroundBmp: null
					};

					return 1;
				};

				ctx.AddMapSignName = (name, subTitle, mainTitle) => {
					const decoded_name = userStringDecoder.decode(name);
					const decoded_subTitle =
						subTitle && subTitle.length > 1 ? userStringDecoder.decode(subTitle, userCharpage) : null;
					const decoded_mainTitle =
						mainTitle && mainTitle.length > 1 ? userStringDecoder.decode(mainTitle, userCharpage) : null;
					MapInfo[decoded_name].signName = {
						subTitle: decoded_subTitle,
						mainTitle: decoded_mainTitle
					};
					return 1;
				};

				ctx.AddMapBackgroundBmp = (name, backgroundBmp) => {
					const decoded_name = userStringDecoder.decode(name);
					MapInfo[decoded_name].backgroundBmp = backgroundBmp
						? userStringDecoder.decode(backgroundBmp)
						: 'field';
					return 1;
				};

				// mount file
				lua.mountFile(filename, buffer);

				// execute file
				await lua.doFile(filename);

				// execute main function
				lua.doStringSync('main()');
			} catch (error) {
				console.error('[loadMapTbl] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile(filename);
				// call onEnd
				onEnd(true);
			}
		})
		.catch(error => {
			onEnd(false);
		});
}

/**
 * Loads datainfo/petInfo.lub and populate PetDBTable
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadPetInfo(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				lua.mountFile(filename, buffer);
				await lua.doFile(filename);

				// Read Lua table
				const readLuaTable = tableName => {
					const result = {};
					const ctx = lua.ctx;

					ctx.__push_kv = (k, v) => {
						const key = k instanceof Uint8Array ? userStringDecoder.decode(k) : k;
						const val = v instanceof Uint8Array ? userStringDecoder.decode(v) : v;
						result[key] = val;
						return 1;
					};

					lua.doStringSync(`
							for k, v in pairs(${tableName}) do
								__push_kv(k, v)
							end
						`);

					return result;
				};

				// Read all pet tables
				const eggMap = readLuaTable('PetEggItemID_PetJobID');
				const petNames = readLuaTable('PetNameTable');
				const petStrings = readLuaTable('PetStringTable');
				const petIllusts = readLuaTable('PetIllustNameTable_Eng');
				const petAccIDs = readLuaTable('PetAccIDs');
				const petAccNames = readLuaTable('PetAccActNameTable');

				PetDBTable = {};

				for (const eggId in eggMap) {
					const jobId = Number(eggMap[eggId]);
					const petName = petNames[jobId] || null;
					const accKey = petName ? `ACC_${petName.toUpperCase()}` : null;
					const accId = accKey ? petAccIDs[accKey] || null : null;

					PetDBTable[jobId] = {
						PetJobID: jobId,
						PetEggID: Number(eggId),
						PetName: petName,
						PetString: petStrings[jobId] || null,
						PetIllust: petIllusts[jobId] || null,
						PetAcc_ID: accId,
						PetAcc_Name: accId ? petAccNames[accId] || null : null
					};
				}

				EggIDToJobID = {};

				for (const jobID in PetDBTable) {
					const pet = PetDBTable[jobID];
					EggIDToJobID[pet.PetEggID] = Number(jobID);
				}
			} catch (error) {
				console.error('[loadPetInfo] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile(filename);
				// call onEnd
				onEnd();
			}
		},
		onEnd
	);
}

/**
 * Loads System/PetEvolutionCLN_true.lub and attach to PetDBTable
 *
 * @param {string} filename - The name of the file to load.
 * @param {function} callback - The function to invoke with the loaded data.
 * @param {function} onEnd - The function to invoke when loading is complete.
 * @return {void}
 */
function loadPetEvolution(filename, callback, onEnd) {
	const loadPromise = new Promise((resolve, reject) => {
		Client.loadFile(filename, resolve, reject);
	});

	loadPromise
		.then(async file => {
			let wasSuccessful = false;
			try {
				console.log('Loading file "' + filename + '"...');
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;
				lua.mountFile(filename, buffer);

				const ctx = lua.ctx;

				// InsertEvolutionRecipeLGU(BaseEggID, TargetEggID, MaterialID, Amount)
				ctx.InsertEvolutionRecipeLGU = (baseEggID, targetEggID, matID, amt) => {
					const baseJobID = EggIDToJobID[baseEggID];
					if (!baseJobID || !PetDBTable[baseJobID]) {
						console.warn(`[PetEvolution] Unknown base EggID ${baseEggID}`);
						return 1;
					}

					const pet = PetDBTable[baseJobID];

					if (!pet.Evolution) {
						pet.Evolution = {};
					}
					if (!pet.Evolution[targetEggID]) {
						pet.Evolution[targetEggID] = [];
					}

					pet.Evolution[targetEggID].push({
						MaterialID: Number(matID),
						Amount: Number(amt)
					});

					return 1;
				};

				// InsertPetAutoFeeding(PetID)
				ctx.InsertPetAutoFeeding = eggID => {
					const jobID = EggIDToJobID[eggID];

					if (!jobID || !PetDBTable[jobID]) {
						console.warn(`[PetAutoFeeding] Unknown EggID ${eggID}`);
						return 1;
					}

					PetDBTable[jobID].AutoFeeding = true;
					return 1;
				};

				// Execute Lua
				await lua.doFile(filename);
				lua.doStringSync('main()');
				wasSuccessful = true;
			} catch (error) {
				console.error('[loadPetEvolutionFile] Error: ', error);
			} finally {
				// release file from memmory
				lua.unmountFile(filename);
				// call onEnd
				onEnd(wasSuccessful);
			}
		})
		.catch(error => {
			if (typeof onEnd === 'function') {
				onEnd(false);
			}
		});
}
/**
 * Fog entry parser
 *
 * @param {number} index
 * @param {mixed} key
 * @param {string} near
 * @param {string} far
 * @param {string} color
 * @param {string} factor
 */
function parseFogEntry(index, key, near, far, color, factor) {
	const int_color = parseInt(color, 16);
	const map = MapTable[key] || (MapTable[key] = {});

	map.fog = {
		near: parseFloat(near),
		far: parseFloat(far),
		color: [(255 & (int_color >> 16)) / 255.0, (255 & (int_color >> 8)) / 255.0, (255 & (int_color >> 0)) / 255.0],
		factor: parseFloat(factor)
	};
}

/**
 * Indoor entry parser
 *
 * @param {number} index
 * @param {mixed} key
 */
function parseIndoorEntry(index, key) {
	key = key.replace('.gat', '.rsw');
	const map = MapTable[key] || (MapTable[key] = {});
	map.indoor = true;
}

/**
 * Quest entry parser
 *
 * @param {number} index
 * @param {string} title
 * @param {string} group
 * @param {string} image
 * @param {string} description
 * @param {string} summary
 */
function parseQuestEntry(index, key, title, group, image, description, summary) {
	const quest = QuestInfo[key] || (QuestInfo[key] = {});

	quest.Title = title;
	quest.Group = group;
	quest.Image = image;
	quest.Description = description;
	quest.Summary = summary;
}

/**
 * Load CashShopBanner file
 *
 * @param {string} filename to load
 * @param {function} callback - (Unused)
 * @param {function} onEnd to run once the file is loaded
 */
function loadCashShopBanner(filename, callback, onEnd) {
	Client.loadFile(
		filename,
		async function (file) {
			try {
				console.log('Loading file "' + filename + '"...');

				// check if file is ArrayBuffer and convert to Uint8Array if necessary
				const buffer = file instanceof ArrayBuffer ? new Uint8Array(file) : file;

				// get context
				const ctx = lua.ctx;

				// Define the function that Lua will call
				// add_cashshop_banner( bitmap_name, url )
				ctx.add_cashshop_banner = function (bitmap_name, url) {
					const decoded_bmp = userStringDecoder.decode(bitmap_name);
					const decoded_url = userStringDecoder.decode(url);

					CashShopBannerTable.push({
						bmp: decoded_bmp,
						url: decoded_url
					});
					return 1;
				};

				// mount file
				lua.mountFile(filename, buffer);

				// execute file to load the table and function definition
				await lua.doFile(filename);

				// execute the main function: set_cashshop_banner()
				lua.doStringSync(`
						if set_cashshop_banner then
							set_cashshop_banner()
						end
					`);
			} catch (error) {
				console.error('[loadCashShopBanner] Error: ', error);
			} finally {
				lua.unmountFile(filename);
				onEnd(true);
			}
		},
		// onError for Client.loadFile
		function () {
			if (onEnd) {
				onEnd(false);
			}
		}
	);
}

function onUpdateOwnerName(pkt) {
	DB.CNameTable[pkt.GID] = pkt.CName;
	DB._resolveNameCallbacks(pkt.GID, pkt.CName);
	DB.UpdateOwnerName[pkt.GID] = pkt;
}

/**
 * Function to update MapTable with MapInfo values
 */
function updateMapTable() {
	for (const key in MapInfo) {
		if (MapInfo.hasOwnProperty(key)) {
			if (MapTable[key]) {
				MapTable[key].name = MapInfo[key].displayName;
			} else {
				MapTable[key] = { name: MapInfo[key].displayName };
			}
		}
	}
}

/**
 * Export
 */

export default DB;
