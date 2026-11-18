import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock heavy dependencies — readCashShopItems only touches CashShop.cashShopListItem
vi.mock('DB/DBManager.js', () => ({ default: {} }));
vi.mock('Core/Client.js', () => ({ default: {} }));
vi.mock('UI/GUIComponent.js', () => ({
	default: class GUIComponent {
		constructor() {
			return {};
		}
	}
}));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: vi.fn() } }));
vi.mock('Network/PacketStructure.js', () => ({
	default: { CZ: { PC_CASH_POINT_ITEMLIST: function () { return {}; } } }
}));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: {} }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: () => {}, TYPE: {}, FILTER: {} }
}));
vi.mock('Renderer/Renderer.js', () => ({ default: { height: 0, width: 0 } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: () => ({}) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: (c) => c } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

import CashShop from 'UI/Components/CashShop/CashShop.js';

describe('CashShop.readCashShopItems', () => {
	beforeEach(() => {
		CashShop.cashShopListItem = [];
	});

	// 2026-11-19 合并对齐上游 #1531：按 tabNum 稀疏存储，同一 tab 的分包数据追加合并
	it('should merge split packets of the same tab (concat, not replace)', () => {
		const packet1 = { count: 1, items: [{ itemId: 501, price: 100 }], tabNum: 0 };
		CashShop.readCashShopItems(packet1);
		expect(CashShop.cashShopListItem[0].items).toHaveLength(1);

		// Second packet for the same tab — rAthena splits oversized tabs across packets
		const packet2 = { count: 1, items: [{ itemId: 502, price: 200 }], tabNum: 0 };
		CashShop.readCashShopItems(packet2);
		expect(CashShop.cashShopListItem[0].items).toHaveLength(2);
		expect(CashShop.cashShopListItem[0].count).toBe(2);
		expect(CashShop.cashShopListItem[0].items[0].itemId).toBe(501);
		expect(CashShop.cashShopListItem[0].items[1].itemId).toBe(502);
	});

	it('should correctly store count, items, and tabNum', () => {
		const items = { count: 3, items: [{ itemId: 501 }, { itemId: 502 }, { itemId: 503 }], tabNum: 2 };
		CashShop.readCashShopItems(items);
		expect(CashShop.cashShopListItem[2].count).toBe(3);
		expect(CashShop.cashShopListItem[2].tabNum).toBe(2);
		expect(CashShop.cashShopListItem[2].items).toHaveLength(3);
	});

	it('should store different tabs under their own tabNum slots', () => {
		CashShop.readCashShopItems({ count: 1, items: [{ itemId: 501 }], tabNum: 0 });
		CashShop.readCashShopItems({ count: 1, items: [{ itemId: 502 }], tabNum: 1 });
		expect(CashShop.cashShopListItem[0].items[0].itemId).toBe(501);
		expect(CashShop.cashShopListItem[1].items[0].itemId).toBe(502);
	});
});
