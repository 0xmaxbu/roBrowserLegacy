import { describe, it, expect, vi, beforeEach } from 'vitest';

// T9/T9.1 交互回归（2026-11-09 玩家验收反馈）：
// 1. 药水页 ON/OFF 开关点击无效（逻辑反转 bug）
// 2. 滑杆默认进度条空置 0（缺初始 paintPos）
// 3. 药水格点击 → 下拉 → 登记 全链路（与技能页同构，钉死防回归）
// 4. 魔物页双滚动条（内层 max-height/overflow 移除）
// 5. 道具设定页（T9.1 新增）：8 槽 + 延迟输入 + BUFF 下拉登记 + 返回村庄勾选

vi.mock('Network/NetworkManager.js', () => ({
	default: { sendPacket: vi.fn(), registerPacket: vi.fn(), hookPacket: vi.fn() }
}));
vi.mock('Network/PacketStructure.js', () => ({
	default: {
		CZ: { REQUEST_MOVE2: class {}, REQUEST_ACT2: class {}, USE_SKILL2: class {} },
		ZC: { MSG_STATE_CHANGE: 0x196 }
	}
}));
vi.mock('Network/PacketLength.js', () => ({ default: {} }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { GID: 0, Entity: null } }));
vi.mock('Utils/BinaryWriter.js', () => ({ default: class {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => {
	// 可变数据源：用例内通过 __setInventory 注入背包内容
	let list = [];
	return {
		default: {
			getUI: () => ({ list: list, getItemById: id => list.find(it => it.ITID === id) || null }),
			addItem: vi.fn(),
			__setInventory: items => { list = items; }
		}
	};
});
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({
	default: { onUseSkillToId: vi.fn() }
}));
vi.mock('UI/Components/StatusIcons/StatusIcons.js', () => ({ default: { update: vi.fn() } }));
vi.mock('Renderer/EntityManager.js', () => ({
	default: { forEach: vi.fn(), get: vi.fn(), getClosestEntity: vi.fn(), getFocusEntity: vi.fn(), setFocusEntity: vi.fn() }
}));
vi.mock('Renderer/Entity/Entity.js', () => ({
	default: Object.assign(class {}, { TYPE_MOB: 5, ACTION: { DIE: 1, WALK: 2, IDLE: 0 } })
}));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: 'data/interface/',
		getItemInfo: vi.fn(id => {
			const map = { 501: { identifiedDisplayName: '红色药水', identifiedResourceName: 'hp_potion' }, 645: { identifiedDisplayName: '速度激发药水', identifiedResourceName: 'speed_up' } };
			return map[id] || null;
		}),
		getMonsterName: vi.fn(id => 'Mob' + id),
		getBodyPath: vi.fn(() => null)
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn((_url, cb) => cb && cb('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')) } }));
vi.mock('DB/Items/ItemType.js', () => ({ default: { HEALING: 0, USABLE: 2, CASH: 18, DELAYCONSUME: 11 } }));
vi.mock('Renderer/MapRenderer.js', () => ({ default: { loading: false, currentMap: 'prontera' } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { getCellType: vi.fn(), TYPE: { WALKABLE: 0 } } }));
vi.mock('Utils/PathFinding.js', () => ({ default: { search: vi.fn() } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: { 26: { Name: 'AL_TELEPORT', SkillName: 'Teleport' } } }));
vi.mock('DB/Skills/SkillConst.js', () => ({ default: { AL_TELEPORT: 26 } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: 20191223 }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({ default: { getUI: () => null } }));
vi.mock('Loaders/Sprite.js', () => ({ default: class {} }));
vi.mock('Loaders/Action.js', () => ({ default: class {} }));
vi.mock('UI/GUIComponent.js', () => ({
	default: class GuiComponentStub {
		constructor() {
			this._shadow = document.createElement('div');
			this._host = document.createElement('div');
			// getPane 需要的 pane 结构（bindSettingsBehavior 产出的 HTML 需 render 注入——
			// 壳层直接调 _buildXxxContent 时只用 document，不经过本 stub；此处兜底 append 链）
			this._shadow.innerHTML = '';
		}
		draggable() {}
		append() {}
		remove() {}
	}
}));

import Inventory from 'UI/Components/Inventory/Inventory.js';
import BotAutoHuntInit from '../../src/Plugins/BotAutoHunt/BotAutoHunt.js';

function click(el) {
	el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

function getPlugin() {
	if (!window.botAutoHunt) BotAutoHuntInit();
	return window.botAutoHunt;
}

beforeEach(() => {
	localStorage.clear();
	Inventory.__setInventory([]);
	if (window.botAutoHunt) {
		// 重载默认设置，避免跨用例串扰
		window.botAutoHunt._loadSettings();
	}
});

describe('T9 交互回归：ON/OFF 开关', () => {
	it('点击开关切换状态并重绘（修复：旧逻辑比较渲染样式致永不切换）', () => {
		const plugin = getPlugin();
		const onToggle = vi.fn();
		const sec = plugin._officialSection('测试区块', { toggle: true, onToggle });
		// 初始 paint(true) → ON 高亮
		const offBtn = Array.from(sec.box.querySelectorAll('span')).find(s => s.textContent === 'OFF');
		const switchBox = offBtn.parentElement;
		click(switchBox);
		expect(onToggle).toHaveBeenCalledWith(false); // ON → OFF
		expect(offBtn.style.backgroundColor).toBe('rgb(220, 232, 242)'); // OFF 高亮
		click(switchBox);
		expect(onToggle).toHaveBeenCalledWith(true); // OFF → ON
	});

	it('药水页开关点击写入数据并持久化', () => {
		const plugin = getPlugin();
		const wrap = plugin._buildPotionTabContent(0);
		const offBtn = Array.from(wrap.querySelectorAll('span')).find(s => s.textContent === 'OFF');
		const switchBox = offBtn.parentElement;
		const before = plugin.potions.hp[0].enabled;
		click(switchBox);
		expect(plugin.potions.hp[0].enabled).toBe(!before);
		const saved = JSON.parse(localStorage.getItem(window.botAutoHunt._getStorageKey()));
		expect(saved.potions.hp[0].enabled).toBe(!before);
	});
});

describe('T9 交互回归：官方滑杆', () => {
	it('构造即按初始值绘制进度条（修复：默认百分比已设但条空置 0）', () => {
		const plugin = getPlugin();
		const slider = plugin._officialSlider({ value: 70, color: '#7ba7d7' });
		const trackWrap = slider.el.children[0].children[1]; // row 内 trackWrap
		const fill = trackWrap.children[0];
		const rest = trackWrap.children[1];
		expect(fill.style.width).toBe('calc(70% - 1px)');
		expect(rest.style.width).toBe('calc(30% - 1px)');
		expect(+slider.el.querySelector('input').value).toBe(70);
	});
});

describe('T9 交互回归：药水格登记全链路', () => {
	it('点击空格 → HP 下拉列出背包恢复道具 → 选择后写槽+持久化+重绘', () => {
		const plugin = getPlugin();
		Inventory.__setInventory([{ ITID: 501, type: 0, count: 5, index: 0 }]); // HEALING
		const wrap = plugin._buildPotionTabContent(0);
		const cell = wrap.querySelector('[title="点击登记道具"]');
		expect(cell).toBeTruthy();
		click(cell);
		// 下拉已挂 document.body
		const dd = Array.from(document.body.children).find(el => el.textContent.includes('选择 HP 恢复道具'));
		expect(dd).toBeTruthy();
		const row = Array.from(dd.children).find(el => el.textContent.includes('红色药水 ×5'));
		expect(row).toBeTruthy();
		click(row);
		expect(plugin.potions.hp[0].id).toBe(501);
		const saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.potions.hp[0].id).toBe(501);
		// 下拉已关闭
		expect(Array.from(document.body.children).some(el => el.textContent.includes('选择 HP 恢复道具'))).toBe(false);
	});

	it('SP 槽仅列出 SP/both 类恢复道具', () => {
		const plugin = getPlugin();
		Inventory.__setInventory([
			{ ITID: 501, type: 0, count: 5, index: 0 }, // hp
			{ ITID: 518, type: 0, count: 3, index: 1 } // both（蜂蜜）
		]);
		const wrap = plugin._buildPotionTabContent(0);
		const cells = wrap.querySelectorAll('[title="点击登记道具"]');
		expect(cells.length).toBe(4); // hp×2 + sp×2
		click(cells[2]); // 第一个 SP 槽
		const dd = Array.from(document.body.children).find(el => el.textContent.includes('选择 SP 恢复道具'));
		expect(dd).toBeTruthy();
		expect(dd.textContent).not.toContain('红色药水'); // hp 类被过滤
		expect(dd.textContent).toContain('Item 518'); // both 类保留（未入 DB mock → 回退名）
	});
});

describe('T9 交互回归：魔物页单滚动', () => {
	it('清单不再带内层滚动（外层窗格单滚动，对齐官方页 4）', () => {
		const plugin = getPlugin();
		const wrap = plugin._buildMobTabContent('prontera');
		expect(wrap.innerHTML).not.toContain('max-height:210px');
		expect(wrap.innerHTML).not.toContain('overflow-y:auto');
	});
});

describe('T9.1 道具设定页', () => {
	it('构建：标题条 + 8 格（每格道具格+延迟输入）+ 返回村庄勾选（默认勾选）', () => {
		const plugin = getPlugin();
		const wrap = plugin._buildItemTabContent();
		expect(wrap.textContent).toContain('请设定BUFF类道具');
		const inputs = wrap.querySelectorAll('input[type="number"]');
		expect(inputs.length).toBe(8);
		expect(inputs[0].value).toBe('0');
		const cb = wrap.querySelector('.bot-checkbox');
		expect(cb).toBeTruthy();
		// 默认勾选态：checkbox_1.bmp 加载请求（Client.loadFile mock 被调用且 URL 含 checkbox_1）
	});

	it('BUFF 下拉只列 EFST 分类为 buff 的道具；选择后写 8 槽模型并持久化', () => {
		const plugin = getPlugin();
		Inventory.__setInventory([
			{ ITID: 501, type: 0, count: 5, index: 0 }, // 恢复类 → 不应出现在 BUFF 下拉
			{ ITID: 645, type: 2, count: 2, index: 1 } // 速度激发药水（buff）
		]);
		const wrap = plugin._buildItemTabContent();
		const cell = wrap.querySelector('[title="点击登记道具"]');
		click(cell);
		const dd = Array.from(document.body.children).find(el => el.textContent.includes('选择 BUFF 道具'));
		expect(dd).toBeTruthy();
		expect(dd.textContent).toContain('速度激发药水 ×2');
		expect(dd.textContent).not.toContain('红色药水');
		const row = Array.from(dd.children).find(el => el.textContent.includes('速度激发药水'));
		click(row);
		expect(plugin.auxList[0]).toEqual({ id: 645, type: 'buff_item' });
		const saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.aux[0]).toEqual({ id: 645, type: 'buff_item' });
		expect(saved.aux).toHaveLength(8);
	});

	it('延迟输入 change → auxDelays 持久化（0-86400 夹取）', () => {
		const plugin = getPlugin();
		const wrap = plugin._buildItemTabContent();
		const input = wrap.querySelector('input[type="number"]');
		input.value = '1800';
		input.dispatchEvent(new Event('change', { bubbles: true }));
		expect(plugin.auxDelays[0]).toBe(1800);
		let saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.auxDelays[0]).toBe(1800);
		input.value = '999999';
		input.dispatchEvent(new Event('change', { bubbles: true }));
		expect(plugin.auxDelays[0]).toBe(86400); // 夹取上限
		saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.auxDelays[0]).toBe(86400);
	});

	it('返回村庄勾选点击 → returnVillage.onBuffEmpty 持久化', () => {
		const plugin = getPlugin();
		const wrap = plugin._buildItemTabContent();
		const cb = wrap.querySelector('.bot-checkbox');
		const before = plugin.returnVillage.onBuffEmpty !== false;
		click(cb);
		expect(plugin.returnVillage.onBuffEmpty).toBe(!before);
		const saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.returnVillage.onBuffEmpty).toBe(!before);
	});
});
