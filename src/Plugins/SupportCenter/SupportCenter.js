// ============================================================
// src/Plugins/SupportCenter/SupportCenter.js — 游戏内客服中心
// ============================================================
// P1 玩家自助（ADR-0002）：工单提交/查询 + 充值订单自查，
// 入口在 BasicInfoV4 状态栏"客服"按钮（与内挂 Bot 按钮同款）。
//
// 通信：HTTP 同源相对路径 /ticket/*（nginx 反代 → rAthena web-server
// ticket_controller），鉴权复用登录 WebToken（与快捷键云同步
// ShortCut.js 完全同链路：AID + WorldName + AuthToken 表单字段）。
//
// UI：GUIComponent shadow DOM（仿 BotAutoHunt 设置窗口先例），
// persistent = true 防止引擎周期性清除。
// ============================================================

import PACKETVER from 'Network/PacketVerManager.js';
import Session from 'Engine/SessionStorage.js';
import GUIComponent from 'UI/GUIComponent.js';

const CSS_TEXT = `
	.sc-host { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
		z-index: 900; font-family: inherit; }
	.sc-win { width: 380px; max-height: 420px; display: flex; flex-direction: column;
		background: linear-gradient(#2e4a6b, #1d3350); border: 1px solid #5b8bc4;
		border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,.5); color: #dfe9f5; overflow: hidden; }
	.sc-top { display: flex; align-items: center; gap: 8px; padding: 8px 12px;
		background: rgba(255,255,255,.06); cursor: move; user-select: none;
		border-bottom: 1px solid rgba(255,255,255,.12); font-weight: bold; }
	.sc-top .sc-x { margin-left: auto; cursor: pointer; padding: 0 6px; color: #9db8d4; }
	.sc-top .sc-x:hover { color: #fff; }
	.sc-tabs { display: flex; gap: 4px; padding: 8px 12px 0; }
	.sc-tab { flex: 1; text-align: center; padding: 5px 0; font-size: 12px; cursor: pointer;
		border: 1px solid rgba(255,255,255,.18); border-bottom: none; border-radius: 6px 6px 0 0;
		background: rgba(255,255,255,.04); color: #9db8d4; }
	.sc-tab.active { background: rgba(255,255,255,.14); color: #fff; font-weight: bold; }
	.sc-body { padding: 12px; overflow-y: auto; min-height: 200px; max-height: 300px; font-size: 12px; }
	.sc-item { border: 1px solid rgba(255,255,255,.14); border-radius: 6px; padding: 8px 10px;
		margin-bottom: 8px; background: rgba(255,255,255,.05); cursor: pointer; }
	.sc-item:hover { background: rgba(255,255,255,.1); }
	.sc-item .t { display: flex; align-items: center; gap: 6px; font-weight: bold; }
	.sc-badge { font-size: 10px; padding: 1px 6px; border-radius: 8px; }
	.sc-badge.open { background: #a05a17; color: #fff; }
	.sc-badge.answered { background: #1f5fa8; color: #fff; }
	.sc-badge.closed { background: #55606e; color: #ccd; }
	.sc-preview { color: #9db8d4; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.sc-msg { border-radius: 6px; padding: 6px 10px; margin-bottom: 6px; white-space: pre-wrap; word-break: break-all; }
	.sc-msg.player { background: rgba(255,255,255,.07); }
	.sc-msg.staff { background: rgba(31,95,168,.25); border: 1px solid rgba(91,139,196,.5); }
	.sc-msg .meta { font-size: 10px; color: #9db8d4; margin-bottom: 2px; }
	.sc-input, .sc-textarea, .sc-select { width: 100%; box-sizing: border-box; padding: 6px 8px; margin-bottom: 8px;
		border-radius: 5px; border: 1px solid #5b8bc4; background: rgba(0,0,0,.25); color: #dfe9f5; font-size: 12px; }
	.sc-textarea { height: 84px; resize: none; }
	.sc-btn { display: inline-block; padding: 6px 18px; border-radius: 6px; cursor: pointer;
		background: #2f6db5; border: 1px solid #6ba3e0; color: #fff; font-size: 12px; }
	.sc-btn:hover { background: #3a80cf; }
	.sc-btn.ghost { background: transparent; border-color: #557; color: #9db8d4; margin-left: 6px; }
	.sc-btn:disabled { opacity: .45; cursor: default; }
	.sc-empty { text-align: center; color: #9db8d4; padding: 32px 0; }
	.sc-back { margin-bottom: 8px; display: inline-block; cursor: pointer; color: #9db8d4; }
	.sc-back:hover { color: #fff; }
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
	Component.render = () => '<div class="sc-win"><div class="sc-top">客服中心<span class="sc-x">✕</span></div>'
		+ '<div class="sc-tabs"><div class="sc-tab active" data-tab="tickets">我的工单</div>'
		+ '<div class="sc-tab" data-tab="orders">充值订单</div></div>'
		+ '<div class="sc-body"></div></div>';
	Component.init = function () {
		const root = this._shadow;
		this.draggable(root.querySelector('.sc-top'));
		root.querySelector('.sc-x').addEventListener('click', () => this.remove());
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

function body() { return Component._shadow.querySelector('.sc-body'); }

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
				el.innerHTML = '<div class="sc-empty">还没有工单</div>'
					+ '<div style="text-align:center"><span class="sc-btn" data-act="new">提交新工单</span></div>';
			} else {
				el.innerHTML = json.map((t) =>
					'<div class="sc-item" data-id="' + t.id + '">'
					+ '<div class="t"><span class="sc-badge ' + t.status + '">' + STATUS_TEXT[t.status] + '</span>' + esc(t.subject) + '</div>'
					+ '<div class="sc-preview">' + esc(t.preview) + '</div></div>'
				).join('')
				+ '<div style="text-align:center"><span class="sc-btn" data-act="new">提交新工单</span></div>';
			}
			el.querySelectorAll('.sc-item').forEach((n) => n.addEventListener('click', () => showView('detail', Number(n.getAttribute('data-id')))));
			const btn = el.querySelector('[data-act="new"]');
			if (btn) btn.addEventListener('click', () => showView('new'));
		} catch (e) { el.innerHTML = '<div class="sc-empty">' + esc(e.message) + '</div>'; }
		return;
	}

	if (view === 'detail') {
		loading();
		try {
			const { json } = await postForm('/ticket/detail', { ticket_id: arg });
			el.innerHTML = '<span class="sc-back">← 返回列表</span>'
				+ '<div style="margin-bottom:8px"><span class="sc-badge ' + json.status + '">' + STATUS_TEXT[json.status] + '</span></div>'
				+ (json.messages || []).map((m) =>
					'<div class="sc-msg ' + m.sender + '"><div class="meta">'
					+ (m.sender === 'player' ? '我' : '客服') + ' · ' + esc(m.created_at) + '</div>'
					+ esc(m.message) + '</div>').join('')
				+ (json.status !== 'closed'
					? '<textarea class="sc-textarea" placeholder="补充说明…"></textarea>'
					+ '<div><span class="sc-btn" data-act="reply">回复</span>'
					+ '<span class="sc-btn ghost" data-act="close">关闭工单</span></div>'
					: '');
			el.querySelector('.sc-back').addEventListener('click', () => showView('tickets'));
			const replyBtn = el.querySelector('[data-act="reply"]');
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
				el.querySelector('[data-act="close"]').addEventListener('click', async () => {
					loading('关闭中…');
					try { await postForm('/ticket/close', { ticket_id: arg }); showView('tickets'); }
					catch (e) { loading(e.message); }
				});
			}
		} catch (e) { el.innerHTML = '<div class="sc-empty">' + esc(e.message) + '</div>'; }
		return;
	}

	if (view === 'new') {
		el.innerHTML = '<span class="sc-back">← 返回列表</span>'
			+ '<input class="sc-input" maxlength="60" placeholder="标题（如：物品丢失、充值未到账）"/>'
			+ '<textarea class="sc-textarea" maxlength="1000" placeholder="详细描述：发生了什么、时间、涉及物品/金额。客服会在后台处理后回复。"></textarea>'
			+ '<div><span class="sc-btn" data-act="submit">提交工单</span></div>';
		el.querySelector('.sc-back').addEventListener('click', () => showView('tickets'));
		el.querySelector('[data-act="submit"]').addEventListener('click', async () => {
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
				el.innerHTML = '<div class="sc-empty">暂无充值订单</div>';
				return;
			}
			el.innerHTML = json.map((o) =>
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
