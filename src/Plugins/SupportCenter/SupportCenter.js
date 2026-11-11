// ============================================================
// src/Plugins/SupportCenter/SupportCenter.js — 游戏内客服中心
// ============================================================
// P1 玩家自助（ADR-0002）：工单提交/查询 + 充值订单自查，
// 入口在状态栏「客服」按钮（BasicInfoV4）与 ButtonBar（V6 UI）。
//
// 视觉：完全复用内挂 BotAutoHunt 设置窗口的官方《RO乐园》现代蓝色
// UI 体系（Plugins/BotAutoHunt/settings/SettingsWindow.js 同款）——
// BMP 标题栏（titlebar_mid + sys_base/sys_close，data-* 由
// GUIComponent 自动接线）+ 装备栏同款页签 + 白色圆角面板 +
// 渐变底部按钮。
//
// 通信：HTTP 同源相对路径 /ticket/*（nginx 反代 → rAthena web-server
// ticket_controller），鉴权复用登录 WebToken（ShortCut.js 同链路）。
// ============================================================

import PACKETVER from 'Network/PacketVerManager.js';
import Session from 'Engine/SessionStorage.js';
import GUIComponent from 'UI/GUIComponent.js';

/** 窗口 CSS —— 与 BotAutoHunt SettingsWindow.css 同体系（配色/结构照抄，前缀 sc-） */
const CSS_TEXT = `
:host {
	width: 420px;
	height: 340px;
	top: 110px;
	left: 36%;
	min-width: 400px;
}

.ui-component-root {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: linear-gradient(to bottom, #e8f0f7, #dce8f2);
	border: 1px solid #7f9fc0;
	border-radius: 6px;
	font-family: "Microsoft JhengHei", Gulim, Dotum, sans-serif;
	font-size: 12px;
	color: #1a3a5c;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	box-shadow: 0 4px 14px rgba(30, 60, 100, 0.35);
}

/* 頂部标题栏：titlebar_mid 位图平铺 + sys_base/sys_close（GUIComponent data-* 自动接线） */
.sc-top {
	flex: 0 0 auto;
	height: 17px;
	background-color: #a9c4dc;
	background-repeat: repeat-x;
	border-bottom: 1px solid #7f9fc0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 3px;
	cursor: move;
}

.sc-sysbtn {
	width: 11px;
	height: 11px;
	background-repeat: no-repeat;
	cursor: pointer;
}

.sc-top-left {
	display: flex;
	align-items: center;
	gap: 3px;
}

.sc-top-text {
	font-size: 11px;
	font-weight: bold;
	color: #1a3a5c;
	text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.85);
	line-height: 1;
	white-space: nowrap;
}

.sc-top-right { display: flex; }

/* 頁籤列：装备栏 EquipmentV4 同款 */
.sc-tabbar {
	flex: 0 0 auto;
	display: flex;
	height: 15px;
	padding: 0 6px;
}

.sc-tab {
	flex: 1 1 auto;
	height: 100%;
	line-height: 15px;
	padding: 0 2px;
	cursor: pointer;
	border: 1px solid #c9c3ba;
	border-bottom: none;
	border-radius: 3px 3px 0 0;
	color: #42454a;
	font-size: 12px;
	font-family: inherit;
	text-align: center;
	white-space: nowrap;
	background-color: transparent;
	user-select: none;
}

.sc-tab.active {
	color: #000;
	font-weight: bold;
	background-color: white;
	border-bottom: 1px solid white;
	position: relative;
	z-index: 100;
}

/* 白色圓角內容面板 */
.sc-panel {
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	margin: 0 6px 6px;
	background: #ffffff;
	border: 1px solid #b8cde0;
	border-top: 1px solid #9db8d2;
	border-radius: 8px;
	overflow: hidden;
}

.sc-panewrap {
	flex: 1 1 auto;
	overflow-y: auto;
	background: #ffffff;
	padding: 6px 10px;
	text-align: left;
	color: #1a3a5c;
	line-height: 1.3;
}

/* 藍色節標題條（面板内分组标题） */
.sc-section {
	margin: 2px -10px 6px;
	padding: 3px 10px;
	background: linear-gradient(to bottom, #d5e2ee, #c4d8ea);
	border-bottom: 1px solid #9db8d2;
	font-weight: bold;
	font-size: 11px;
}

/* 工单列表项：白底卡片，浅蓝边 */
.sc-item {
	border: 1px solid #b8cde0;
	border-radius: 5px;
	padding: 5px 8px;
	margin-bottom: 6px;
	background: #fbfdff;
	cursor: pointer;
}

.sc-item:hover { background: #eef5fb; }

.sc-item .t {
	display: flex;
	align-items: center;
	gap: 5px;
	font-weight: bold;
	color: #1a3a5c;
}

/* 状态徽章：官方蓝系配色 */
.sc-badge {
	font-size: 10px;
	padding: 1px 6px;
	border-radius: 8px;
	border: 1px solid;
	white-space: nowrap;
}

.sc-badge.open { background: #fdf3e7; border-color: #d9a765; color: #8a5a17; }
.sc-badge.answered { background: #e8f0f7; border-color: #9db8d2; color: #1a3a5c; }
.sc-badge.closed { background: #f0f0f0; border-color: #c0c0c0; color: #666; }

.sc-preview {
	color: #5a7a9c;
	margin-top: 3px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 11px;
}

/* 对话消息：玩家浅蓝、客服白底蓝框 */
.sc-msg {
	border-radius: 5px;
	padding: 4px 8px;
	margin-bottom: 5px;
	white-space: pre-wrap;
	word-break: break-all;
	font-size: 11px;
}

.sc-msg.player { background: #eef5fb; border: 1px solid #c9dcee; }
.sc-msg.staff { background: #ffffff; border: 1px solid #9db8d2; }
.sc-msg .meta { font-size: 10px; color: #5a7a9c; margin-bottom: 2px; }

/* 输入控件：官方蓝边白底 */
.sc-input, .sc-textarea {
	width: 100%;
	box-sizing: border-box;
	padding: 4px 6px;
	margin-bottom: 6px;
	border-radius: 4px;
	border: 1px solid #9db8d2;
	background: #ffffff;
	color: #1a3a5c;
	font-size: 12px;
	font-family: inherit;
}

.sc-textarea { height: 76px; resize: none; }

.sc-backlink {
	display: inline-block;
	margin-bottom: 6px;
	cursor: pointer;
	color: #4a7ab5;
	font-size: 11px;
}

.sc-backlink:hover { color: #1a3a5c; text-decoration: underline; }

.sc-empty { text-align: center; color: #5a7a9c; padding: 28px 0; }

/* 底部按钮条（同 botsw-footer） */
.sc-footer {
	flex: 0 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 4px 8px;
}

.sc-footer button {
	padding: 2px 12px;
	font-size: 12px;
	font-family: inherit;
	color: #1a3a5c;
	background: linear-gradient(to bottom, #ffffff, #d5e2ee);
	border: 1px solid #9db8d2;
	border-radius: 3px;
	cursor: pointer;
}

.sc-footer button:hover { background: linear-gradient(to bottom, #ffffff, #c4d8ea); }
.sc-footer button:disabled { opacity: .5; cursor: default; }
`;

/** 表单 POST（同源相对路径；WebToken 链路同 ShortCut.js） */
function postForm(path, extra) {
	return new Promise((resolve, reject) => {
		if (PACKETVER.value < 20170315 || !Session.WebToken) {
			reject(new Error('当前登录会话不支持客服中心（缺少 WebToken）'));
			return;
		}
		const fd = new FormData();
		fd.append('AID', Session.AID);
		fd.append('WorldName', Session.ServerName);
		fd.append('AuthToken', Session.WebToken);
		if (Session.Character) {
			fd.append('CID', Session.Character.cid);
			fd.append('CharName', Session.Character.name);
		}
		for (const [k, v] of Object.entries(extra || {})) fd.append(k, v);
		const xhr = new XMLHttpRequest();
		xhr.open('POST', path, true);
		xhr.onload = () => {
			try { resolve({ status: xhr.status, json: JSON.parse(xhr.responseText) }); }
			catch (e) { reject(new Error('服务返回异常（' + xhr.status + '）')); }
		};
		xhr.onerror = () => reject(new Error('网络错误'));
		xhr.send(fd);
	});
}

const STATUS_TEXT = { open: '待处理', answered: '已回复', closed: '已关闭' };
const ORDER_TEXT = { pending: '待确认', paid: '已到账', cancelled: '已取消', refunded: '已退款' };

let Component = null;

function ensureComponent() {
	if (Component) return Component;
	Component = new GUIComponent('SupportCenter', CSS_TEXT);
	Component.persistent = true;
	Component.render = () =>
		'<div class="sc-top" data-background="basic_interface/titlebar_mid.bmp">'
		+ '<div class="sc-top-left">'
		+ '<div class="sc-sysbtn sc-btn-base" data-background="basic_interface/sys_base_off.bmp" data-hover="basic_interface/sys_base_on.bmp"></div>'
		+ '<span class="sc-top-text">客服中心</span>'
		+ '</div>'
		+ '<div class="sc-top-right">'
		+ '<div class="sc-sysbtn sc-btn-close" data-background="basic_interface/sys_close_off.bmp" data-hover="basic_interface/sys_close_on.bmp"></div>'
		+ '</div>'
		+ '</div>'
		+ '<div class="sc-tabbar">'
		+ '<button class="sc-tab active" data-tab="tickets">我的工单</button>'
		+ '<button class="sc-tab" data-tab="orders">充值订单</button>'
		+ '</div>'
		+ '<div class="sc-panel"><div class="sc-panewrap"></div></div>'
		+ '<div class="sc-footer">'
		+ '<button class="sc-new">提交工单</button>'
		+ '<button class="sc-close">关闭</button>'
		+ '</div>';
	Component.init = function () {
		const root = this._shadow;
		this.draggable(root.querySelector('.sc-top'));
		root.querySelector('.sc-btn-close').addEventListener('click', () => this.remove());
		root.querySelector('.sc-close').addEventListener('click', () => this.remove());
		root.querySelector('.sc-new').addEventListener('click', () => showView('new'));
		root.querySelectorAll('.sc-tab').forEach((tab) => {
			tab.addEventListener('click', () => {
				root.querySelectorAll('.sc-tab').forEach((t) => t.classList.remove('active'));
				tab.classList.add('active');
				showView(tab.getAttribute('data-tab') === 'orders' ? 'orders' : 'tickets');
			});
		});
		showView('tickets');
	};
	return Component;
}

function body() { return Component._shadow.querySelector('.sc-panewrap'); }

function esc(s) {
	return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
	}[c]));
}

function loading(text) { body().innerHTML = '<div class="sc-empty">' + esc(text || '加载中…') + '</div>'; }

async function showView(view, arg) {
	const el = body();
	if (view === 'tickets') {
		loading();
		try {
			const { json } = await postForm('/ticket/list');
			if (!Array.isArray(json) || json.length === 0) {
				el.innerHTML = '<div class="sc-section">工单列表</div><div class="sc-empty">还没有工单<br/>点击下方「提交工单」开始</div>';
			} else {
				el.innerHTML = '<div class="sc-section">工单列表</div>' + json.map((t) =>
					'<div class="sc-item" data-id="' + t.id + '">'
					+ '<div class="t"><span class="sc-badge ' + t.status + '">' + STATUS_TEXT[t.status] + '</span>' + esc(t.subject) + '</div>'
					+ '<div class="sc-preview">' + esc(t.preview) + '</div></div>'
				).join('');
			}
			el.querySelectorAll('.sc-item').forEach((n) => n.addEventListener('click', () => showView('detail', Number(n.getAttribute('data-id')))));
		} catch (e) { el.innerHTML = '<div class="sc-empty">' + esc(e.message) + '</div>'; }
		return;
	}

	if (view === 'detail') {
		loading();
		try {
			const { json } = await postForm('/ticket/detail', { ticket_id: arg });
			el.innerHTML = '<span class="sc-backlink">← 返回列表</span>'
				+ '<div class="sc-section">对话记录 <span class="sc-badge ' + json.status + '">' + STATUS_TEXT[json.status] + '</span></div>'
				+ (json.messages || []).map((m) =>
					'<div class="sc-msg ' + m.sender + '"><div class="meta">'
					+ (m.sender === 'player' ? '我' : '客服') + ' · ' + esc(m.created_at) + '</div>'
					+ esc(m.message) + '</div>').join('')
				+ (json.status !== 'closed'
					? '<textarea class="sc-textarea" placeholder="补充说明…"></textarea>'
					+ '<div style="text-align:center"><button class="sc-replybtn" style="padding:2px 12px;font-size:12px;font-family:inherit;color:#1a3a5c;background:linear-gradient(to bottom,#ffffff,#d5e2ee);border:1px solid #9db8d2;border-radius:3px;cursor:pointer">回复</button>'
					+ ' <button class="sc-closebtn" style="padding:2px 12px;font-size:12px;font-family:inherit;color:#1a3a5c;background:linear-gradient(to bottom,#ffffff,#d5e2ee);border:1px solid #9db8d2;border-radius:3px;cursor:pointer">关闭工单</button></div>'
					: '');
			el.querySelector('.sc-backlink').addEventListener('click', () => showView('tickets'));
			const replyBtn = el.querySelector('.sc-replybtn');
			if (replyBtn) {
				replyBtn.addEventListener('click', async () => {
					const text = el.querySelector('.sc-textarea').value.trim();
					if (!text) return;
					loading('提交中…');
					try {
						await postForm('/ticket/reply', { ticket_id: arg, message: text });
						showView('detail', arg);
					} catch (e) { loading(e.message); }
				});
				el.querySelector('.sc-closebtn').addEventListener('click', async () => {
					loading('关闭中…');
					try { await postForm('/ticket/close', { ticket_id: arg }); showView('tickets'); }
					catch (e) { loading(e.message); }
				});
			}
		} catch (e) { el.innerHTML = '<div class="sc-empty">' + esc(e.message) + '</div>'; }
		return;
	}

	if (view === 'new') {
		el.innerHTML = '<div class="sc-section">提交新工单</div>'
			+ '<input class="sc-input" maxlength="60" placeholder="标题（如：物品丢失、充值未到账）"/>'
			+ '<textarea class="sc-textarea" maxlength="1000" placeholder="详细描述：发生了什么、时间、涉及物品或金额。客服会在后台处理后回复。"></textarea>'
			+ '<div style="text-align:center"><button class="sc-submitbtn" style="padding:2px 16px;font-size:12px;font-family:inherit;color:#1a3a5c;background:linear-gradient(to bottom,#ffffff,#d5e2ee);border:1px solid #9db8d2;border-radius:3px;cursor:pointer">提交工单</button>'
			+ ' <button class="sc-cancelbtn" style="padding:2px 12px;font-size:12px;font-family:inherit;color:#1a3a5c;background:linear-gradient(to bottom,#ffffff,#d5e2ee);border:1px solid #9db8d2;border-radius:3px;cursor:pointer">取消</button></div>';
		el.querySelector('.sc-cancelbtn').addEventListener('click', () => showView('tickets'));
		el.querySelector('.sc-submitbtn').addEventListener('click', async () => {
			const subject = el.querySelector('.sc-input').value.trim();
			const message = el.querySelector('.sc-textarea').value.trim();
			if (!subject || !message) return;
			loading('提交中…');
			try {
				const { status, json } = await postForm('/ticket/create', { subject, message });
				if (status === 400 && json && json.error === 'limit') {
					loading('未关闭的工单已超过 3 个，请先等待处理或关闭旧工单');
					return;
				}
				if (status >= 400) { loading('提交失败，请稍后再试'); return; }
				showView('detail', json.id);
			} catch (e) { loading(e.message); }
		});
		return;
	}

	if (view === 'orders') {
		loading();
		try {
			const { json } = await postForm('/ticket/orders');
			if (!Array.isArray(json) || json.length === 0) {
				el.innerHTML = '<div class="sc-section">充值订单</div><div class="sc-empty">暂无充值订单</div>';
				return;
			}
			el.innerHTML = '<div class="sc-section">充值订单</div>' + json.map((o) =>
				'<div class="sc-item" style="cursor:default"><div class="t">'
				+ '¥' + o.amount + '（' + esc(o.channel) + '）'
				+ '<span class="sc-badge ' + (o.status === 'paid' ? 'answered' : o.status === 'pending' ? 'open' : 'closed') + '">'
				+ (ORDER_TEXT[o.status] || o.status) + '</span></div>'
				+ '<div class="sc-preview">' + esc(o.created_at)
				+ (o.paid_at ? ' · 到账 ' + esc(o.paid_at) : '') + '</div></div>').join('');
		} catch (e) { el.innerHTML = '<div class="sc-empty">' + esc(e.message) + '</div>'; }
	}
}

export default function SupportCenterInit() {
	window.supportCenter = {
		toggle() {
			const comp = ensureComponent();
			if (comp.ui && comp.ui.is(':visible')) comp.remove();
			else comp.append();
		},
	};
	return true;
}
