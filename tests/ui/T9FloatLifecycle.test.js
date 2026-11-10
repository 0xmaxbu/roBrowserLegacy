import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// T9.3.2 悬浮开关生命周期看门狗回归（2026-11-10）：
// 根因（现场日志锤死）：过图加载期 Renderer.stop + EntityManager 清空使 playerInWorld/z0Canvas
// 必然为 false，冷缓存地图加载 2~8s 远超 2 次防抖（1s），旧逻辑把「过图」误判成「退出游戏」
// 直接 stopAutoHunt()（落地 prt_fild07 后 1s 内被发 CZ_BOT_COMMAND cmd1 + @autoloot 0），
// 过图返回挂机地图逻辑从未执行，角色在新地图永久站立。
// 修复：停止挂机仅限真正回登录（#WinLogin）/选角（#charselect/#CharSelectV2/#CharSelectV3/#CharSelectV4）
// 界面时；MapRenderer.loading 期间双保险；另修正 #WinLoginV2 选择器（从未匹配任何元素）。

vi.mock('Network/NetworkManager.js', () => ({
	default: { sendPacket: vi.fn(), registerPacket: vi.fn(), hookPacket: vi.fn() }
}));
vi.mock('Network/PacketStructure.js', () => ({
	default: {
		CZ: {
			REQUEST_MOVE2: class {},
			REQUEST_ACT2: class {},
			USE_SKILL2: class {},
			BOT_COMMAND: class {},
			REQUEST_CHAT: class {}
		},
		ZC: { MSG_STATE_CHANGE: 0x196 }
	}
}));
vi.mock('Network/PacketLength.js', () => ({ default: {} }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { GID: 0, Entity: null } }));
vi.mock('Utils/BinaryWriter.js', () => ({ default: class {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: { getUI: () => ({ list: [], getItemById: () => null }), addItem: vi.fn() }
}));
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
		getItemInfo: vi.fn(() => null),
		getMonsterName: vi.fn(id => 'Mob' + id),
		getBodyPath: vi.fn(() => null)
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn((_url, cb) => cb && cb('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')) } }));
vi.mock('DB/Items/ItemType.js', () => ({ default: { HEALING: 0, USABLE: 2, CASH: 18, DELAYCONSUME: 11 } }));
vi.mock('Renderer/MapRenderer.js', () => ({ default: { loading: false, currentMap: 'prt_fild08' } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { getCellType: vi.fn(), TYPE: { WALKABLE: 0 } } }));
vi.mock('Utils/PathFinding.js', () => ({ default: { search: vi.fn() } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: {} }));
vi.mock('DB/Skills/SkillConst.js', () => ({ default: {} }));
vi.mock('Network/PacketVerManager.js', () => ({ default: 20191223 }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({
	default: { getUI: () => ({ getList: () => [] }) }
}));
vi.mock('Loaders/Sprite.js', () => ({ default: class {} }));
vi.mock('Loaders/Action.js', () => ({ default: class {} }));
vi.mock('UI/CursorManager.js', () => ({
	default: { ACTION: { DEFAULT: 0, CLICK: 2 }, setType: vi.fn(), getActualType: () => 0 }
}));
vi.mock('UI/GUIComponent.js', () => ({
	default: class GuiComponentStub {
		constructor() {
			this._shadow = document.createElement('div');
			this._host = document.createElement('div');
		}
		draggable() {}
		append() {}
		remove() {}
	}
}));

import Session from 'Engine/SessionStorage.js';
import EntityManager from 'Renderer/EntityManager.js';
import MapRenderer from 'Renderer/MapRenderer.js';
import BotAutoHuntInit from '../../src/Plugins/BotAutoHunt/BotAutoHunt.js';

function getPlugin() {
	if (!window.botAutoHunt) BotAutoHuntInit();
	return window.botAutoHunt;
}

/** 布置世界信号 */
function setupWorld({ entityInManager = false, z0Canvas = false, domMarker = null, mapLoading = false } = {}) {
	document.body.innerHTML = '';
	if (z0Canvas) {
		const c = document.createElement('canvas');
		c.style.zIndex = '0';
		document.body.appendChild(c);
	}
	if (domMarker) {
		const el = document.createElement('div');
		el.id = domMarker;
		document.body.appendChild(el);
	}
	Session.GID = 123;
	Session.Entity = { GID: 123 };
	EntityManager.get.mockReset();
	if (entityInManager) EntityManager.get.mockReturnValue({ GID: 123 });
	MapRenderer.loading = mapLoading;
}

describe('T9.3.2 悬浮开关生命周期看门狗（过图误停机修复）', function () {
	let plugin;
	let stopSpy;

	beforeEach(function () {
		vi.useFakeTimers();
		plugin = getPlugin();
		plugin.engine.active = true; // active 是只读代理（委托引擎），测试直接置引擎标志
		plugin._floatMiss = 0;
		plugin._floatHit = 0;
		plugin._floatBtn = document.createElement('button');
		plugin._floatBtn.style.display = '';
		plugin._floatBtn.style.display = ''; // visible
		MapRenderer.loading = false;
		stopSpy = vi.spyOn(plugin, 'stopAutoHunt').mockImplementation(() => {});
	});

	afterEach(function () {
		if (stopSpy) stopSpy.mockRestore();
		vi.useRealTimers();
		document.body.innerHTML = '';
	});

	it('过图加载期（实体清空+无画布+MapRenderer.loading=true）连续多次未命中 → 不停止挂机', function () {
		setupWorld({ entityInManager: false, z0Canvas: false, mapLoading: true });
		plugin._floatLifecycleTick();
		plugin._floatLifecycleTick();
		plugin._floatLifecycleTick();
		expect(stopSpy).not.toHaveBeenCalled();
		expect(plugin.active).toBe(true);
		// 按钮隐藏行为保留（纯视觉）
		expect(plugin._floatBtn.style.display).toBe('none');
	});

	it('加载刚完成（loading=false 但实体尚未恢复）→ 仍不停止挂机（返回落地初期不误杀）', function () {
		setupWorld({ entityInManager: false, z0Canvas: false, mapLoading: false });
		plugin._floatLifecycleTick();
		plugin._floatLifecycleTick();
		plugin._floatLifecycleTick();
		expect(stopSpy).not.toHaveBeenCalled();
		expect(plugin.active).toBe(true);
	});

	it('真正回选角界面（#CharSelectV3 在 DOM）2 次未命中 → 停止挂机', function () {
		setupWorld({ entityInManager: false, z0Canvas: false, domMarker: 'CharSelectV3', mapLoading: false });
		plugin._floatLifecycleTick();
		expect(stopSpy).not.toHaveBeenCalled(); // 防抖第 1 次
		plugin._floatLifecycleTick();
		expect(stopSpy).toHaveBeenCalledTimes(1); // 防抖第 2 次触发
	});

	it('回登录界面（#WinLogin，修正后的选择器）→ 停止挂机', function () {
		setupWorld({ entityInManager: false, z0Canvas: false, domMarker: 'WinLogin', mapLoading: false });
		plugin._floatLifecycleTick();
		plugin._floatLifecycleTick();
		expect(stopSpy).toHaveBeenCalledTimes(1);
	});

	it('游戏内正常态（实体在管理器 + z0 画布）→ inGame 命中，不停止且按钮显示', function () {
		setupWorld({ entityInManager: true, z0Canvas: true });
		plugin._floatBtn.style.display = 'none'; // 初始隐藏，验证恢复显示
		plugin._floatLifecycleTick();
		plugin._floatLifecycleTick();
		expect(stopSpy).not.toHaveBeenCalled();
		expect(plugin._floatBtn.style.display).toBe('');
		expect(plugin._lastSignal.inGame).toBe(true);
	});

	it('探针 _lastSignal 含 charSelect/mapLoading 分量（时序排查用）', function () {
		setupWorld({ entityInManager: false, z0Canvas: false, domMarker: null, mapLoading: true });
		plugin._floatLifecycleTick();
		expect(plugin._lastSignal.charSelect).toBe(false);
		expect(plugin._lastSignal.winLogin).toBe(false);
		expect(plugin._lastSignal.mapLoading).toBe(true);
		expect(plugin._lastSignal.playerInWorld).toBe(false);
	});
});
