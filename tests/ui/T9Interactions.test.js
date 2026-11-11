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
vi.mock('DB/Skills/SkillInfo.js', () => ({
	default: {
		5: { Name: 'Bash', SkillName: '狂击', MaxLevel: 10 },
		26: { Name: 'AL_TELEPORT', SkillName: 'Teleport' }
	}
}));
vi.mock('DB/Skills/SkillConst.js', () => ({ default: { AL_TELEPORT: 26 } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: 20191223 }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({
	// 可变数据源：用例内注入已学技能清单（SkillList.getList 同形状）
	default: {
		getUI: () => ({
			getList: () => [
				{ SKID: 5, level: 5, type: 1, spcost: 20 }
			]
		})
	}
}));
vi.mock('Loaders/Sprite.js', () => ({ default: class {} }));
vi.mock('Loaders/Action.js', () => ({ default: class {} }));
vi.mock('UI/CursorManager.js', () => ({
	// 游戏内光标：测试只需记录 setType 调用（真实模块依赖渲染器）
	default: { ACTION: { DEFAULT: 0, CLICK: 2 }, setType: vi.fn(), getActualType: () => 0 }
}));
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
import Session from 'Engine/SessionStorage.js';
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

describe('T9.2 交互回归：技能下拉选择全链路（玩家报「无法选择技能」）', () => {

	it('点击技能格 → 下拉列出已学技能 → 选择后写槽+持久化+重绘', () => {
		const plugin = getPlugin();
		const wrap = plugin._buildSkillTabContent();
		const cell = wrap.querySelector('.skilltab-cell');
		expect(cell).toBeTruthy();
		click(cell);
		const dd = Array.from(document.body.children).find(el => el.querySelector && el.querySelector('.dd-item'));
		expect(dd).toBeTruthy();
		const row = Array.from(dd.querySelectorAll('.dd-item')).find(el => el.textContent.includes('狂击'));
		expect(row).toBeTruthy();
		click(row);
		expect(plugin.skillList[0] && plugin.skillList[0].id).toBe(5);
		expect(plugin.skillList[0].type).toBe('attack');
		const saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.skills[0] && saved.skills[0].id).toBe(5);
		// 下拉已关闭
		expect(Array.from(document.body.children).some(el => el.querySelector && el.querySelector('.dd-item'))).toBe(false);
	});

	it('下拉内点击不穿透到 window（防护 MapControl 的 window 级 mousedown/mouseup）', () => {
		const plugin = getPlugin();
		const events = [];
		const spy = e => events.push(e.target);
		window.addEventListener('click', spy);
		window.addEventListener('mousedown', spy);
		try {
			// 技能下拉（_bindDropdownEvents 原生拦截，对照组）
			let wrap = plugin._buildSkillTabContent();
			click(wrap.querySelector('.skilltab-cell'));
			let dd = Array.from(document.body.children).find(el => el.querySelector && el.querySelector('.dd-item'));
			expect(dd).toBeTruthy();
			click(dd.querySelector('.dd-item'));
			// 药水下拉
			Inventory.__setInventory([{ ITID: 501, type: 0, count: 5, index: 0 }]);
			wrap = plugin._buildPotionTabContent(0);
			click(wrap.querySelector('[title="点击登记道具"]'));
			dd = Array.from(document.body.children).find(el => el.textContent.includes('选择 HP 恢复道具'));
			expect(dd).toBeTruthy();
			click(dd);
			// BUFF 道具下拉
			Inventory.__setInventory([{ ITID: 645, type: 2, count: 2, index: 0 }]);
			wrap = plugin._buildItemTabContent();
			click(wrap.querySelector('[title="点击登记道具"]'));
			dd = Array.from(document.body.children).find(el => el.textContent.includes('选择 BUFF 道具'));
			expect(dd).toBeTruthy();
			click(dd);
			// 移动页道具下拉
			wrap = plugin._buildMoveTabContent();
			click(wrap.querySelector('[title="点击登记道具"]'));
			dd = Array.from(document.body.children).find(el => el.textContent.includes('选择移动道具'));
			expect(dd).toBeTruthy();
			click(dd);
			expect(events).toEqual([]); // window 层未收到任何来自下拉内部的点击
		} finally {
			window.removeEventListener('click', spy);
			window.removeEventListener('mousedown', spy);
		}
	});
});

describe('T9.2 交互回归：悬停手型（游戏内光标白名单只认 button/input 等元素）', () => {
	it('药水页 ON/OFF 开关容器、道具格、技能格均为 BUTTON 元素', () => {
		const plugin = getPlugin();
		Inventory.__setInventory([]);
		// 开关：OFF span 的最近 button 祖先 = 开关容器
		const potion = plugin._buildPotionTabContent(0);
		const offSpan = Array.from(potion.querySelectorAll('span')).find(s => s.textContent === 'OFF');
		expect(offSpan.closest('button')).toBeTruthy();
		// 道具格（药水/移动/道具页共用 _officialItemSlot）
		const slot = potion.querySelector('[title="点击登记道具"]');
		expect(slot && slot.tagName).toBe('BUTTON');
		// 技能格
		const cell = plugin._buildSkillTabContent().querySelector('.skilltab-cell');
		expect(cell && cell.tagName).toBe('BUTTON');
	});
});

describe('T9.3 walking 绑定（上游 PR #607 卡死态自恢复）', () => {
	it('action=WALK 但 walk.total=0 → 不视为行走中（引擎恢复决策重发移动）；路由非空 → 行走中', () => {
		const plugin = getPlugin();
		const fake = {
			GID: 1,
			isDead: () => false,
			position: [50, 50],
			action: 2, // ACTION.WALK
			ACTION: { WALK: 2, IDLE: 0 },
			walk: { total: 0 }, // 卡死态：路由空
			life: { hp: 100, hp_max: 100, sp: 50, sp_max: 100 },
			amotionTick: 0
		};
		Session.Entity = fake;
		try {
			expect(plugin.engine.bindings.self().walking).toBe(false);
			// 卡死态出现时给玩家一次性 toast 提示（60s 抑制）
			const toast = document.getElementById('bot-float-toast');
			expect(toast && toast.textContent).toContain('检测到移动状态异常');
			Session.Entity.walk.total = 120; // 正常行走路由
			expect(plugin.engine.bindings.self().walking).toBe(true);
		} finally {
			Session.Entity = null;
		}
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

	it('延迟输入以「分」为单位：显示分钟、存储秒（30 分 → 1800 秒持久化）', () => {
		const plugin = getPlugin();
		// 预存 1800 秒 → 显示 30 分
		plugin.auxDelays[0] = 1800;
		const wrap = plugin._buildItemTabContent();
		const input = wrap.querySelector('input[type="number"]');
		expect(input.value).toBe('30');
		// 输入框后有「分」单位
		expect(input.parentElement.textContent).toContain('分');
		// 30 分 → 存 1800 秒
		input.value = '30';
		input.dispatchEvent(new Event('change', { bubbles: true }));
		expect(plugin.auxDelays[0]).toBe(1800);
		let saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.auxDelays[0]).toBe(1800);
		// 超上限夹取：999999 分 → 1440 分 = 86400 秒
		input.value = '999999';
		input.dispatchEvent(new Event('change', { bubbles: true }));
		expect(plugin.auxDelays[0]).toBe(86400);
		saved = JSON.parse(localStorage.getItem(plugin._getStorageKey()));
		expect(saved.auxDelays[0]).toBe(86400);
	});

	it('T9.4 全界面数字输入框统一样式：左右 2px 内边距 + 右对齐（道具/技能/捡拾/基本页）', () => {
		const plugin = getPlugin();
		Inventory.__setInventory([]);
		const cssChecks = input => {
			expect(input.style.padding).toBe('0px 2px');
			expect(input.style.textAlign).toBe('right');
			expect(input.style.boxSizing).toBe('border-box');
		};
		cssChecks(plugin._buildItemTabContent().querySelector('input[type="number"]'));
		cssChecks(plugin._buildSkillTabContent().querySelector('input[type="number"]'));
		cssChecks(plugin._buildLootTabContent().querySelector('input[type="number"]'));
		cssChecks(plugin._buildBasicTabContent().querySelector('input[type="number"]'));
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

describe('T9.14 分页器翻页滚动复位', () => {
	it('_switchPotionPage 翻页后调用 resetScroll（共用滚动层残留归零）', () => {
		const plugin = getPlugin();
		const resetScroll = vi.fn();
		const pane = document.createElement('div');
		plugin._settingsComp = {
			getPane: () => pane,
			setPager: vi.fn(),
			resetScroll: resetScroll
		};
		plugin._potionPage = 0;
		plugin._switchPotionPage(1);
		expect(plugin._potionPage).toBe(1);
		expect(resetScroll).toHaveBeenCalledTimes(1);
	});
});
