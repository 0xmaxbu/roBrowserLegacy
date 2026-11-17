/**
 * UI/Components/AccountRegister/AccountRegister.js
 *
 * 游戏内账号注册窗（验证码邮箱验证）
 *
 * 流程：填帐号/邮箱/密码/确认密码/性别 -> 获取验证码（60s 重发冷却，
 * 每 IP 每小时 5 次，服务端限制）-> 填验证码 -> 注册。
 * 提交走 remote-client api/register.php（HTTP POST，直写 login 表），
 * 不经 rAthena 登录协议。注册成功回调 onRegisterSuccess(username, password)
 * 由 WinLoginCommon 接管实现自动登录。
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Renderer from 'Renderer/Renderer.js';
import KEYS from 'Controls/KeyEventHandler.js';
import Configs from 'Core/Configs.js';
import UIManager from 'UI/UIManager.js';
import UIComponent from 'UI/UIComponent.js';
import htmlText from './AccountRegister.html?raw';
import cssText from './AccountRegister.css?raw';

const AccountRegister = new UIComponent('AccountRegister', htmlText, cssText);

const USERNAME_RE = /^[A-Za-z0-9]{4,23}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_COOLDOWN = 60;

let _timer = null;
let _seconds = 0;

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
 * api/register.php 端点（与资源服务同源）
 */
function apiURL() {
	const base = (Configs.get('remoteClient') || '').replace(/\/+$/, '');
	return base + '/api/register.php';
}

function post(action, data, cb) {
	fetch(apiURL(), {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(Object.assign({ action: action }, data)).toString()
	})
		.then(res => res.json())
		.then(res => cb(res))
		.catch(() => cb({ ok: false, err: '网络错误，请稍后再试' }));
}

/**
 * Initialize UI
 */
AccountRegister.init = function init() {
	const ui = this.ui;
	const get = name => ui.find('input[name=' + name + ']');
	const msg = text => {
		const el = ui.find('.msg');
		el.toggleClass('ok', /^注册成功/.test(text));
		el.text(text);
	};

	this.ui.css({
		top: Math.max(16, Math.floor((Renderer.height - 250) / 2)),
		left: Math.floor((Renderer.width - 340) / 2)
	});

	// 仅标题栏可拖（游戏内窗口行为）
	this.draggable(this.ui.find('.titlebar'));

	// 标题栏关闭钮（sys_close 位图，data-* 由 parseHTML 处理）
	this.ui.find('.titlebar .close').on('click', () => closeWindow());

	// 性别选择（单选）
	this.ui.find('.sexbtn').on('click', function () {
		ui.find('.sexbtn').removeClass('active');
		this.classList.add('active');
	});

	// 发送验证码（60s 冷却由服务端+客户端双重限制）
	this.ui.find('.send').on('click', () => {
		const sendBtn = ui.find('.send');
		if (sendBtn.prop('disabled')) return;
		const username = get('username').val().trim();
		const email = get('email').val().trim();
		if (!USERNAME_RE.test(username)) return msg('帐号须为 4-23 位字母或数字');
		if (!EMAIL_RE.test(email)) return msg('邮箱格式不正确');
		if (!/^.{6,23}$/.test(get('password').val())) return msg('密码须为 6-23 位');
		if (get('password').val() !== get('password2').val()) return msg('两次输入的密码不一致');

		msg('正在发送验证码…');
		sendBtn.prop('disabled', true).addClass('disabled');
		post('send', { username: username, email: email }, res => {
			if (!res.ok) {
				msg(res.err || '发送失败');
				sendBtn.prop('disabled', false).removeClass('disabled');
				ui.find('.cdtext').text('');
				if (res.retryAfter) startCountdown(res.retryAfter);
				return;
			}
			msg('验证码已发送至邮箱，10 分钟内有效');
			startCountdown(SEND_COOLDOWN);
		});
	});

	// 注册提交
	this.ui.find('.register').on('click', () => {
		const username = get('username').val().trim();
		const email = get('email').val().trim();
		const password = get('password').val();
		const password2 = get('password2').val();
		const code = get('code').val().trim();
		const sex = ui.find('.sexbtn.female').hasClass('active') ? 'F' : 'M';

		if (!USERNAME_RE.test(username)) return msg('帐号须为 4-23 位字母或数字');
		if (!EMAIL_RE.test(email)) return msg('邮箱格式不正确');
		if (!/^.{6,23}$/.test(password)) return msg('密码须为 6-23 位');
		if (password !== password2) return msg('两次输入的密码不一致');
		if (!/^\d{6}$/.test(code)) return msg('请输入 6 位验证码');

		msg('正在提交…');
		post(
			'submit',
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
	this.ui.find('.cancel').on('click', () => closeWindow());
};

/**
 * 重发倒计时
 * 按钮是位图（btn_ok），无文字层：禁用态用变灰滤镜 + 右侧秒数小字表达
 */
function startCountdown(seconds) {
	const btn = AccountRegister.ui.find('.send');
	_seconds = seconds;
	btn.prop('disabled', true).addClass('disabled');
	if (_timer) clearInterval(_timer);
	_timer = setInterval(() => updateCountdown(btn), 1000);
	updateCountdown(btn);
}

function updateCountdown(btn) {
	const cdtext = AccountRegister.ui.find('.cdtext');
	if (_seconds <= 0) {
		btn.prop('disabled', false).removeClass('disabled');
		cdtext.text('');
		if (_timer) {
			clearInterval(_timer);
			_timer = null;
		}
		return;
	}
	cdtext.text(_seconds + 's');
	_seconds--;
}

/**
 * Once append to body
 */
AccountRegister.onAppend = function onAppend() {
	this.ui.find('input[name=username]').val('').focus();
	this.ui.find('.msg').text('');
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
	if ((event.which === KEYS.ESCAPE || event.key === 'Escape') && this.ui.is(':visible')) {
		event.stopImmediatePropagation();
		closeWindow();
		return false;
	}
	return true;
};

export default UIManager.addComponent(AccountRegister);
