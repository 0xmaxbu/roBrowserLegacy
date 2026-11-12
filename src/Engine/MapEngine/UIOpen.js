/**
 * Engine/MapEngine/UIOpen.js
 *
 * Manage some UI open when requested by server
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

/**
 * Load dependencies
 */
import Configs from 'Core/Configs.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import CheckAttendance from 'UI/Components/CheckAttendance/CheckAttendance.js';
import EnchantGradeUI from 'UI/Components/EnchantGrade/EnchantGrade.js';
import EnchantUI from 'UI/Components/Enchant/Enchant.js';

/**
 * @var {boolean} 玩家是否已入图（由全局生命周期事件 robrowser-mapentered 驱动，
 * MapEngine 入场 UI 追加序列完成后派发）。
 * 服务端入场推送的 UI_OPEN 可能先于地图渲染完成到达（签到 ZC_UI_OPEN(7) 在
 * pc_sc_data_received 即发出），此时暂存，入图后统一开窗——对齐官方客户端
 * "进图后才弹窗"的行为；游戏内主动触发（地图已进入）则即时打开。
 */
let _mapEntered = false;
let _pendingAttendance = null;

/**
 * Open attendance window (shared by immediate & deferred paths)
 */
function openCheckAttendance(data) {
	CheckAttendance.prepare();
	CheckAttendance.setData(data);
	CheckAttendance.cleanUI();
	CheckAttendance.append();
	CheckAttendance.ui.show();
	CheckAttendance.ui.focus();
}

/**
 * robrowser-mapentered 订阅：置位 + 冲刷待开队列
 */
function onMapEntered() {
	_mapEntered = true;
	const pending = _pendingAttendance;
	_pendingAttendance = null;
	if (pending) {
		try {
			openCheckAttendance(pending.data);
		} catch (e) {
			console.error('[UIOpen] deferred attendance open failed, skipped:', e);
		}
	}
}

/**
 * Received data and request to open a specific UI
 *
 * @param {object} pkt - PACKET.ZC.UI_OPEN
 */
function onUIOpen(pkt) {
	// Opens an UI window of the given type and initializes it with the given data
	// 0AE2 <type>.B <data>.L
	// type:
	//    0 = BANK_UI
	//    1 = STYLIST_UI
	//    2 = CAPTCHA_UI
	//    3 = MACRO_UI
	//    4 = UI_UNUSED
	//    5 = TIPBOX_UI
	//    6 = RENEWQUEST_UI
	//    7 = ATTENDANCE_UI
	//    8 = ENCHANTGRADE_UI
	//    9 = CHANGE_MATERIAL_UI
	//    10 = ENCHANT_UI
	//
	// 2026-11-11 签到黑屏加固：本 handler 在地图入场封包链内同步执行，服务端活动
	// 生效后每次入场都会推送（如 ZC_UI_OPEN(7)）。装饰性 UI 的任何异常都不允许
	// 炸掉入场序列（曾因 CheckAttendance.prepare 缺失 TypeError 致加载完成即黑屏）。
	try {
		switch (pkt.ui_type) {
			case 7:
				if (Configs.get('enableCheckAttendance') && PACKETVER.value >= 20180307) {
					// 2026-11-12：未入图时只存数据，视觉开窗延迟到 robrowser-mapentered
					// （官方行为：进图后才弹窗；此前在加载画面上就弹）
					if (_mapEntered) {
						openCheckAttendance(pkt.data);
					} else {
						_pendingAttendance = pkt;
					}
				}
				break;
			case 8:
				if (PACKETVER.value >= 20200724) {
					EnchantGradeUI.prepare();
					EnchantGradeUI.onOpenEnchantGradeUI();
				}
				break;
			case 10:
				if (PACKETVER.value >= 20211103) {
					EnchantUI.prepare();
					EnchantUI.onOpenEnchantUI(pkt.data);
				}
				break;
			default:
				console.error(`[PACKET.ZC.UI_OPEN] not implemented (${pkt.ui_type})`);
		}
	} catch (e) {
		console.error('[PACKET.ZC.UI_OPEN] UI open failed, skipped to protect map entry:', e);
	}
}

/**
 * Initialize
 */
export default function MainEngine() {
	Network.hookPacket(PACKET.ZC.UI_OPEN, onUIOpen);
	Network.hookPacket(PACKET.ZC.UI_OPEN_V3, onUIOpen);
	// 重连 map 服务器（换线/选角重入）时复位：下次入场前的推送重新走延迟队列。
	// addEventListener 同函数引用去重，重复 init 不会叠加订阅
	_mapEntered = false;
	window.addEventListener('robrowser-mapentered', onMapEntered);
}
