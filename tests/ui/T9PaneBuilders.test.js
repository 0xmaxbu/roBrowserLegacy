import { describe, it, expect, vi } from 'vitest';

// T9 诊断：四页签构建器逐个实例化，定位「药水设定起往后空白」的抛异常点。
// mock 全部游戏重型依赖（builder 只用 DOM + this.* 字段 + 少量模块函数）。
vi.mock('Network/NetworkManager.js', () => ({
	default: {
		sendPacket: vi.fn(),
		registerPacket: vi.fn(),
		hookPacket: vi.fn()
	}
}));
vi.mock('Network/PacketStructure.js', () => ({
	default: {
		CZ: { REQUEST_MOVE2: class {}, REQUEST_ACT2: class {} },
		ZC: { MSG_STATE_CHANGE: 0x196 }
	}
}));
vi.mock('Network/PacketLength.js', () => ({ default: {} }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { GID: 0, Entity: null } }));
vi.mock('Utils/BinaryWriter.js', () => ({ default: class {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: {
		getUI: () => ({ getItemById: () => null }),
		addItem: vi.fn()
	}
}));
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({
	default: { onUseSkillToId: vi.fn() }
}));
vi.mock('UI/Components/StatusIcons/StatusIcons.js', () => ({ default: { update: vi.fn() } }));
vi.mock('Renderer/EntityManager.js', () => ({
	default: {
		forEach: vi.fn(),
		get: vi.fn(),
		getClosestEntity: vi.fn(),
		getFocusEntity: vi.fn(),
		setFocusEntity: vi.fn()
	}
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
vi.mock('Renderer/MapRenderer.js', () => ({ default: { loading: false, currentMap: 'prontera' } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { getCellType: vi.fn(), TYPE: { WALKABLE: 0 } } }));
vi.mock('Utils/PathFinding.js', () => ({ default: { search: vi.fn() } }));
vi.mock('DB/Skills/SkillInfo.js', () => ({ default: { 28: { Name: 'AL_TELEPORT', SkillName: 'Teleport', SpAmount: [10, 10] } } }));
vi.mock('DB/Skills/SkillConst.js', () => ({ default: { AL_TELEPORT: 28 } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: 20191223 }));
vi.mock('UI/Components/SkillList/SkillList.js', () => ({ default: { getUI: () => null } }));
vi.mock('Loaders/Sprite.js', () => ({ default: class {} }));
vi.mock('Loaders/Action.js', () => ({ default: class {} }));
vi.mock('UI/CursorManager.js', () => ({
	// 游戏内光标：测试只需记录 setType 调用（真实模块依赖渲染器/canvas）
	default: { ACTION: { DEFAULT: 0, CLICK: 2 }, setType: vi.fn(), getActualType: () => 0 }
}));
vi.mock('UI/GUIComponent.js', () => ({
	default: class GuiComponentStub {
		constructor(name, css) {
			this.name = name;
			this._shadow = document.createElement('div');
			this._host = document.createElement('div');
		}
		draggable() {}
		append() {}
		remove() {}
	}
}));

import BotAutoHuntInit from '../../src/Plugins/BotAutoHunt/BotAutoHunt.js';

describe('T9 回归：四页签构建器全部可实例化（无异常）', () => {
	// 回归背景：2026-11-08 玩家报「药水设定起往后全空白」——_buildMoveTabContent 中
	// ttpRow 笔误（定义 rtRow 使用 ttpRow）抛 ReferenceError，_openSettings 同步块
	// 中断导致后续页签不渲染。本测试逐个实例化全部构建器防回归。
	it('逐个调用 _buildXxxTabContent，定位抛异常的构建器', () => {
		BotAutoHuntInit(); // PluginManager 同款入口：new BotAutoHunt() 挂 window.botAutoHunt
		const plugin = window.botAutoHunt;
		expect(plugin).toBeTruthy();
		const builders = [
			['skill', () => plugin._buildSkillTabContent()],
			['basic(0)', () => plugin._buildBasicTabContent()],
			['mob', () => plugin._buildMobTabContent('prontera')],
			['potion(0)', () => plugin._buildPotionTabContent(0)],
			['potion(1)', () => plugin._buildPotionTabContent(1)],
			['item', () => plugin._buildItemTabContent()], // T9.1: 道具设定页（官方 PDF 第 7 页）
			['move', () => plugin._buildMoveTabContent()],
			['loot', () => plugin._buildLootTabContent()],
			['service', () => plugin._buildServiceTabContent()]
		];
		const failures = [];
		for (const [name, fn] of builders) {
			try {
				const el = fn();
				if (!el || !el.appendChild) failures.push(name + ': 返回非 DOM 元素');
			} catch (e) {
				failures.push(name + ': ' + e.constructor.name + ': ' + e.message);
			}
		}
		expect(failures, '抛异常/非法返回的构建器：\n' + failures.join('\n')).toEqual([]);
	});
});
