/**
 * UI/Components/AccountRegister/AccountRegister.js
 *
 * 游戏内账号注册窗（验证码邮箱验证）
 *
 * 流程：填帐号/邮箱/密码/确认密码/性别 -> 获取验证码（60s 重发冷却，
 * 每 IP 每小时 5 次，服务端限制）-> 填验证码 -> 注册。
 *
 * 通信（ADR-0004 玩家 HTTP 端点单一 seam，同源相对路径，不经登录协议）：
 *   - /api/register/send   → nginx 反代 remote-client 邮件 adapter
 *     （占用只读检查 + 验证码签发/限频；对 login 表只读，永不写入）
 *   - /api/register/submit → nginx 反代 web-server register_controller
 *     （验码 + 账号创建唯一写者；密码 user_salt+MD5 落库）
 * submit 错误返回错误码（ticket 惯例），中文文案本地映射。
 * 注册成功回调 onRegisterSuccess(username, password)
 * 由 WinLoginCommon 接管实现自动登录。
 *
 * 2026-11-19: 迁移到新 GUIComponent 基类（上游 #1591 删除了旧 UIComponent）。
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Renderer from 'Renderer/Renderer.js';
import KEYS from 'Controls/KeyEventHandler.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import htmlText from './AccountRegister.html?raw';
import cssText from './AccountRegister.css?raw';

const AccountRegister = new GUIComponent('AccountRegister', cssText);

AccountRegister.render = () => htmlText;

const USERNAME_RE = /^[A-Za-z0-9]{4,23}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_COOLDOWN = 60;

let _timer = null;
let _seconds = 0;

/** 根元素查询快捷方式（Shadow DOM 内） */
function q(selector) {
	return AccountRegister.getRoot().querySelector(selector);
}
function qAll(selector) {
	return AccountRegister.getRoot().querySelectorAll(selector);
}

/**
 * 注册成功回调：function (username, password)
 * 由 WinLoginCommon 注入到组件属性（实现自动登录）
 */
AccountRegister.onRegisterSuccess = function onRegisterSuccess() {};

/**
 * 关闭回调（取消/ESC/注册成功后都会触发一次，
 * 由 WinLoginCommon 注入用于恢复登录窗显示）
 */
AccountRegister.onClose = function onClose() {};

function closeWindow() {
	const cb = AccountRegister.onClose;
	AccountRegister.onClose = null;
	if (cb) cb();
	AccountRegister.remove();
}

/**
 * submit 错误码 → 中文文案（web-server register_controller 返回的 error code）
 */
const ERR_TEXT = {
	bad_username:     '帐号须为 4-23 位字母或数字',
	bad_email:        '邮箱格式不正确',
	bad_password:     '密码须为 6-23 位',
	password_mismatch: '两次输入的密码不一致',
	bad_sex:          '请选择性别',
	bad_code:         '验证码须为 6 位数字',
	no_code:          '请先获取验证码',
	code_expired:     '验证码已过期，请重新获取',
	code_locked:      '验证码错误次数过多，请重新获取',
	code_wrong:       '验证码错误',
	username_taken:   '该帐号已被注册',
	email_taken:      '该邮箱已被注册',
	register_failed:  '注册失败（帐号可能刚被注册），请更换帐号重试'
};

/**
 * 同源 POST（ADR-0004：路径即接口，后端选择是 nginx 内部细节）
 * 统一 multipart（FormData，与 SupportCenter/web-server 全部 controller 同约定；
 * cpp-httplib 仅从 multipart parts 取字段，PHP $_POST 两种都解析）
 * send（PHP）响应 {ok, err}；submit（C++）2xx + {ok:true} 或 4xx + {error:code}
 */
function postForm(path, data, cb) {
	const fd = new FormData();
	for (const [k, v] of Object.entries(data)) fd.append(k, v);
	fetch(path, { method: 'POST', body: fd })
		.then(res => res.json().then(body => ({ status: res.status, body })))
		.then(({ status, body }) => {
			if (status >= 200 && status < 300 && body.ok !== false) {
				cb({ ok: true, data: body });
			} else {
				cb({
					ok: false,
					err: (body.error && ERR_TEXT[body.error]) || body.err || '操作失败，请稍后再试',
					retryAfter: body.retryAfter
				});
			}
		})
		.catch(() => cb({ ok: false, err: '网络错误，请稍后再试' }));
}

/**
 * Initialize UI
 */
AccountRegister.init = function init() {
	const get = name => q('input[name=' + name + ']');
	const msg = text => {
		const el = q('.msg');
		if (!el) return;
		el.classList.toggle('ok', /^注册成功/.test(text));
		el.textContent = text;
	};

	// 窗口居中（Shadow DOM host 定位）
	this._host.style.top = Math.max(16, Math.floor((Renderer.height - 272) / 2)) + 'px';
	this._host.style.left = Math.floor((Renderer.width - 280) / 2) + 'px';

	// 仅标题栏可拖（游戏内窗口行为）
	this.draggable('.titlebar');

	// 标题栏关闭钮（sys_close 位图，data-* 由 DataAttrs 处理）
	q('.titlebar .close').addEventListener('click', () => closeWindow());

	// 性别选择（单选）
	qAll('.sexbtn').forEach(btn => {
		btn.addEventListener('click', function () {
			qAll('.sexbtn').forEach(b => b.classList.remove('active'));
			this.classList.add('active');
		});
	});

	// 发送验证码：验证码发往邮箱，优先校验邮箱（是否输入/格式），其次帐号（服务端发码需要）；
	// 不校验密码——用户可先发码后填密码
	q('.send').addEventListener('click', () => {
		const sendBtn = q('.send');
		if (sendBtn.disabled) return;
		const email = get('email').value.trim();
		const username = get('username').value.trim();
		if (!email) return msg('请输入邮箱');
		if (!EMAIL_RE.test(email)) return msg('邮箱格式不正确');
		if (!username) return msg('请输入帐号');
		if (!USERNAME_RE.test(username)) return msg('帐号须为 4-23 位字母或数字');

		msg('正在发送验证码…');
		sendBtn.disabled = true;
		sendBtn.classList.add('disabled');
		postForm('/api/register/send', { username: username, email: email }, res => {
			if (!res.ok) {
				msg(res.err || '发送失败');
				sendBtn.disabled = false;
				sendBtn.classList.remove('disabled');
				if (res.retryAfter) startCountdown(res.retryAfter);
				return;
			}
			msg('验证码已发送至邮箱，10 分钟内有效');
			startCountdown(SEND_COOLDOWN);
		});
	});

	// 注册提交：本地初步验证（空值 → 格式 → 一致性 → 验证码），全部通过才发请求
	q('.register').addEventListener('click', () => {
		const username = get('username').value.trim();
		const email = get('email').value.trim();
		const password = get('password').value;
		const password2 = get('password2').value;
		const code = get('code').value.trim();
		const sex = q('.sexbtn.female').classList.contains('active') ? 'F' : 'M';

		if (!username) return msg('请输入帐号');
		if (!USERNAME_RE.test(username)) return msg('帐号须为 4-23 位字母或数字');
		if (!email) return msg('请输入邮箱');
		if (!EMAIL_RE.test(email)) return msg('邮箱格式不正确');
		if (!password) return msg('请输入密码');
		if (!/^.{6,23}$/.test(password)) return msg('密码须为 6-23 位');
		if (!password2) return msg('请再次输入密码');
		if (password !== password2) return msg('两次输入的密码不一致');
		if (!code) return msg('请输入验证码');
		if (!/^\d{6}$/.test(code)) return msg('验证码须为 6 位数字');

		msg('正在提交…');
		postForm(
			'/api/register/submit',
			{ username: username, email: email, password: password, password2: password2, sex: sex, code: code },
			res => {
				if (!res.ok) return msg(res.err || '注册失败');
				msg('注册成功，正在登录…');
				const cb = AccountRegister.onRegisterSuccess;
				closeWindow();
				if (cb) cb(username, password);
			}
		);
	});

	// 取消
	q('.cancel').addEventListener('click', () => closeWindow());
};

/**
 * 重发倒计时
 * 按钮是位图（btn_ok），无文字层：禁用态用灰阶滤镜表达，冷却结束恢复
 */
function startCountdown(seconds) {
	const btn = q('.send');
	_seconds = seconds;
	btn.disabled = true;
	btn.classList.add('disabled');
	if (_timer) clearInterval(_timer);
	_timer = setInterval(() => updateCountdown(btn), 1000);
	updateCountdown(btn);
}

function updateCountdown(btn) {
	if (_seconds <= 0) {
		btn.disabled = false;
		btn.classList.remove('disabled');
		if (_timer) {
			clearInterval(_timer);
			_timer = null;
		}
		return;
	}
	_seconds--;
}

/**
 * Once append to body
 */
AccountRegister.onAppend = function onAppend() {
	const username = q('input[name=username]');
	if (username) {
		username.value = '';
		username.focus();
	}
	const msgEl = q('.msg');
	if (msgEl) msgEl.textContent = '';
};

/**
 * Remove component from HTML
 */
AccountRegister.onRemove = function onRemove() {
	if (_timer) {
		clearInterval(_timer);
		_timer = null;
		_seconds = 0;
	}
};

/**
 * Key Handler: ESC 关闭
 */
AccountRegister.onKeyDown = function onKeyDown(event) {
	const visible = !!this._host && this._host.getClientRects().length > 0;
	if ((event.which === KEYS.ESCAPE || event.key === 'Escape') && visible) {
		event.stopImmediatePropagation();
		closeWindow();
		return false;
	}
	return true;
};

export default UIManager.addComponent(AccountRegister);
