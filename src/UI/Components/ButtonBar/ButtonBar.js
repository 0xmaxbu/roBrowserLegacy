/**
 * UI/Components/ButtonBar/ButtonBar.js
 *
 * Bottom-right button bar (D-06.4, D-25). 5 common buttons with RO-original
 * BMP icons + Chinese labels (D-08), plus a toggle button that opens a
 * self-contained popup (BLOCK-2: standalone, no legacy popup-menu dependency)
 * listing the remaining BasicInfoV4 window actions (MED-5: full 15-case).
 *
 * Phase 12-04 (REVIEWS.md BLOCK-2/MED-4/MED-5 addressed).
 *
 * Case identifiers mirror BasicInfoV4.js:104-159 exactly (MED-4) — note the
 * upstream typo `'achievment'` is preserved to match the V4 switch.
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import UILayoutStore from 'UI/UILayoutStore.js';
// V4 window-manager imports (copied from BasicInfoV4.js:11-34).
import Inventory from 'UI/Components/Inventory/Inventory.js';
import Equipment from 'UI/Components/Equipment/Equipment.js';
import SkillList from 'UI/Components/SkillList/SkillList.js';
import WinStats from 'UI/Components/WinStats/WinStats.js';
import Escape from 'UI/Components/Escape/Escape.js';
import PartyFriends from 'UI/Components/PartyFriends/PartyFriends.js';
import Guild from 'UI/Components/Guild/Guild.js';
import Quest from 'UI/Components/Quest/Quest.js';
import Bank from 'UI/Components/Bank/Bank.js';
import WorldMap from 'UI/Components/WorldMap/WorldMap.js';
import Navigation from 'UI/Components/Navigation/Navigation.js';
import CheckAttendance from 'UI/Components/CheckAttendance/CheckAttendance.js';
import Rodex from 'UI/Components/Rodex/Rodex.js';
import Achievement from 'UI/Components/Achievement/Achievement.js';
import PACKETVER from 'Network/PacketVerManager.js';
import Configs from 'Core/Configs.js';
import htmlText from './ButtonBar.html?raw';
import cssText from './ButtonBar.css?raw';

// BLOCK-3-style object-on-instance pattern (matches BasicInfoV4.js:42 + :423).
const ButtonBar = new GUIComponent('ButtonBar', cssText);
ButtonBar.render = () => htmlText;

// D-09 BMP icon mapping (GRF path prefix). MED-4: ids match BasicInfoV4.js switch cases.
const ICON_BASE = 'data/texture/';
const COMMON_ICONS = {
    item:   'menu_icon/bt_item.bmp',
    skill:  'menu_icon/bt_skill.bmp',
    info:   'menu_icon/bt_status.bmp',
    equip:  'menu_icon/bt_equip.bmp',
    toggle: 'menu_icon/bt_menu_normal.bmp'
};

// MED-5: FULL 15-case popup list (verified against BasicInfoV4.js:104-159).
// Excludes the 5 common buttons (item/skill/info/equip/bot) which are already on the bar.
// 'battle' is NOT in BasicInfoV4 switch — correctly omitted.
const POPUP_ITEMS = [
    { id: 'party',       label: '队伍', icon: 'menu_icon/bt_party.bmp' },
    { id: 'guild',       label: '公会', icon: 'menu_icon/bt_guild.bmp' },
    { id: 'quest',       label: '任务', icon: 'menu_icon/bt_quest.bmp' },
    { id: 'map',         label: '地图', icon: 'menu_icon/bt_map.bmp' },
    { id: 'option',      label: '设置', icon: 'menu_icon/bt_option.bmp' },
    { id: 'bank',        label: '银行', icon: 'menu_icon/bt_bank.bmp' },
    { id: 'mail',        label: '邮件', icon: 'menu_icon/bt_mail.bmp' },
    { id: 'navigation',  label: '导航', icon: 'menu_icon/bt_navigation.bmp' },
    { id: 'attendance',  label: '签到', icon: 'menu_icon/bt_attendance.bmp' },
    { id: 'achievment',  label: '成就', icon: 'menu_icon/bt_achievment.bmp' }
];

ButtonBar.init = function init() { /* one-time setup */ };

// D-28: load icons + bind clicks HERE (re-bound each append).
ButtonBar.onAppend = function onAppend() {
    this._loadIcons();
    this._bindClicks();
    if (UILayoutStore.isEnabled()) {
        this.draggable('.bb-root');
        this.onDragEnd = () => UILayoutStore.save('ButtonBar', { left: this._host.offsetLeft, top: this._host.offsetTop });
        const saved = UILayoutStore.restore('ButtonBar');
        if (saved) {
            this._host.style.left = saved.left + 'px';
            this._host.style.top = saved.top + 'px';
        }
    }
};

ButtonBar.onRemove = function onRemove() {
    this._closePopup();
};

ButtonBar._loadIcons = function _loadIcons() {
    const root = this._shadow || this._host;
    for (const [action, iconPath] of Object.entries(COMMON_ICONS)) {
        Client.loadFile(ICON_BASE + iconPath, (url) => {
            const img = root.querySelector(`.bb-btn[data-action="${action}"] .bb-icon`);
            if (img) img.src = url;
        });
    }
};

ButtonBar._bindClicks = function _bindClicks() {
    const root = this._shadow || this._host;
    root.querySelectorAll('.bb-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this._onAction(btn.dataset.action);
        });
    });
};

// MED-4 + MED-5: cases are the EXACT BasicInfoV4.js:104-159 identifiers.
// Cross-checked against source: item:105 / info:108 / equip:111 / skill:114 /
// option:117 / party:120 / guild:123 / quest:126 / map:129 / bank:132 /
// attendance:135-138 / mail:140 / navigation:143 / achievment:146-149 / bot:151-158.
ButtonBar._onAction = function _onAction(action) {
    if (action === 'toggle') { this._togglePopup(); return; }
    switch (action) {
        case 'item':       Inventory.getUI().toggle(); break;     // BasicInfoV4.js:105
        case 'info':       WinStats.getUI().toggle(); break;      // BasicInfoV4.js:108 (NOT 'stat'!)
        case 'equip':      Equipment.getUI().toggle(); break;     // :111
        case 'skill':      SkillList.getUI().toggle(); break;     // :114
        case 'option':     Escape.ui.toggle(); break;             // :117
        case 'party':      PartyFriends.getUI().toggle(); break;  // :120
        case 'guild':      Guild.toggle(); break;                 // :123
        case 'quest':      Quest.getUI().toggle(); break;         // :126
        case 'map':        WorldMap.toggle(); break;              // :129
        case 'bank':       Bank.toggle(); break;                  // :132
        case 'attendance':
            if (Configs.get('enableCheckAttendance') && PACKETVER.value >= 20180307) {
                CheckAttendance.toggle();                         // :135-138
            }
            break;
        case 'mail':       Rodex.toggle(); break;                 // :140
        case 'navigation': Navigation.toggle(); break;            // :143
        case 'achievment':
            if (Configs.get('enableAchievements') && PACKETVER.value >= 20150513) {
                Achievement.toggle();                             // :146-149
            }
            break;
        case 'bot':
            // BasicInfoV4.js:151-158 — Phase 11-02 BotAutoHunt plugin bridge.
            if (window.botAutoHunt && typeof window.botAutoHunt.toggle === 'function') {
                window.botAutoHunt.toggle();
            }
            break;
        default: break;
    }
    this._closePopup(); // close popup after any action
};

// BLOCK-2: Self-contained popup (standalone div, no legacy popup-menu reuse).
// The legacy popup-menu component was rejected: its onAppend positions the
// inner menu div from Mouse.screen.x/y (no public override); the host overlay
// is full-screen fixed, so setting top/left on it moves the overlay, not the
// menu div. We position our own popup div directly via getBoundingClientRect.
ButtonBar._togglePopup = function _togglePopup() {
    const root = this._shadow || this._host;
    const popup = root.querySelector('.bb-popup');
    if (popup.style.display !== 'none') { this._closePopup(); return; }
    // Build popup items (cheap; rebuild each open in case icons need re-resolving)
    popup.innerHTML = '';
    for (const item of POPUP_ITEMS) {
        const btn = document.createElement('button');
        btn.className = 'bb-popup-item';
        btn.dataset.action = item.id;
        btn.innerHTML = `<img class="bb-icon" alt=""><span class="bb-label">${item.label}</span>`;
        btn.addEventListener('click', (e) => { e.stopPropagation(); this._onAction(item.id); });
        popup.appendChild(btn);
        // Load item icon
        Client.loadFile(ICON_BASE + item.icon, (url) => {
            const img = btn.querySelector('.bb-icon');
            if (img) img.src = url;
        });
    }
    // Position ABOVE the toggle button (BLOCK-2: rect-based, not Mouse.screen)
    const toggleBtn = root.querySelector('.bb-btn.bb-toggle');
    const rect = toggleBtn.getBoundingClientRect();
    popup.style.left = rect.left + 'px';
    // Place above the bar (popup grows upward); clamp to viewport.
    const popupHeight = 220; // estimate; refined after first show
    popup.style.top = Math.max(0, rect.top - popupHeight) + 'px';
    popup.style.display = 'grid';
    // Refine top after layout
    requestAnimationFrame(() => {
        const actualHeight = popup.offsetHeight;
        popup.style.top = Math.max(0, rect.top - actualHeight) + 'px';
    });
    // Outside-click closes popup (added async to avoid the opening click itself)
    this._popupOutsideHandler = (ev) => {
        if (!popup.contains(ev.target) && !toggleBtn.contains(ev.target)) this._closePopup();
    };
    setTimeout(() => document.addEventListener('click', this._popupOutsideHandler), 0);
};

ButtonBar._closePopup = function _closePopup() {
    const root = this._shadow || this._host;
    const popup = root.querySelector('.bb-popup');
    if (popup) popup.style.display = 'none';
    if (this._popupOutsideHandler) {
        document.removeEventListener('click', this._popupOutsideHandler);
        this._popupOutsideHandler = null;
    }
};

// BLOCK-3-style export (matches BasicInfoV4.js:423).
export default UIManager.addComponent(ButtonBar);
