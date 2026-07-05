import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock heavy dependencies — readCashShopItems only touches CashShop.cashShopListItem
vi.mock('DB/DBManager.js', () => ({ default: {} }));
vi.mock('Core/Client.js', () => ({ default: {} }));
vi.mock('Utils/jquery.js', () => ({
	default: function () {
		return { css: () => {}, on: () => {}, find: () => [], height: () => 0, width: () => 0 };
	},
	fn: {}
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
vi.mock('UI/UIComponent.js', () => ({
	default: class UIComponent {
		constructor() {
			return {};
		}
	}
}));

import CashShop from 'UI/Components/CashShop/CashShop.js';

describe('CashShop.readCashShopItems', () => {
	beforeEach(() => {
		CashShop.cashShopListItem = [];
	});

	it('should clear old items before pushing new data (no accumulation)', () => {
		const items1 = { count: 1, items: [{ itemId: 501, price: 100 }], tabNum: 0 };
		CashShop.readCashShopItems(items1);
		expect(CashShop.cashShopListItem).toHaveLength(1);

		// Second call simulates a reload — should NOT accumulate
		const items2 = { count: 1, items: [{ itemId: 502, price: 200 }], tabNum: 0 };
		CashShop.readCashShopItems(items2);
		expect(CashShop.cashShopListItem).toHaveLength(1);
		expect(CashShop.cashShopListItem[0].items[0].itemId).toBe(502);
	});

	it('should correctly store count, items, and tabNum', () => {
		const items = { count: 3, items: [{ itemId: 501 }, { itemId: 502 }, { itemId: 503 }], tabNum: 2 };
		CashShop.readCashShopItems(items);
		expect(CashShop.cashShopListItem[0].count).toBe(3);
		expect(CashShop.cashShopListItem[0].tabNum).toBe(2);
		expect(CashShop.cashShopListItem[0].items).toHaveLength(3);
	});
});
