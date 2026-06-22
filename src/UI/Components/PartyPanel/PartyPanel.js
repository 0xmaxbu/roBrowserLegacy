/**
 * UI/Components/PartyPanel/PartyPanel.js
 *
 * Phase 12-05: Party roster HUD panel below BasicInfo.
 *
 * Reads party roster via PartyFriendsV1.getPartyMembers() (BLOCK-4 reader).
 * Reads HP from EntityManager.getLife() cache (D-17 CORRECTION — never register a
 * packet hook for ZC.NOTIFY_HP_TO_GROUPM; Group.js already populates this cache on
 * every such packet via its own private onMemberLifeUpdate handler).
 *
 * Layout (D-06.3):
 *   - ≤6 members: single-column full style with 32×32 job icon
 *   - >6 members: double-column compact style (no icon)
 *
 * Other decisions:
 *   - D-19: dead/far members grayed via pp-dead/pp-far classes
 *   - D-23: draggable handle when UILayoutStore enabled; position persisted
 *   - D-28: event/draggable registered in onAppend (re-bound each append), cleared in onRemove
 *   - LOW-1: job icon loaded via DB.INTERFACE_PATH (precedent: PartyFriendsV1.js:951)
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import StatusTable from 'DB/Status/StatusInfo.js';
import EntityManager from 'Renderer/EntityManager.js';
import Session from 'Engine/SessionStorage.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import UILayoutStore from 'UI/UILayoutStore.js';
import TargetManager from 'UI/TargetManager.js';
import PartyFriends from 'UI/Components/PartyFriends/PartyFriends.js';

import htmlText from './PartyPanel.html?raw';
import cssText from './PartyPanel.css?raw';

/** D-19 distance gray-out threshold (>15 cells = squared 225). */
const DISTANCE_THRESHOLD_SQ = 15 * 15;

/**
 * WR-01: Escape HTML special characters in untrusted strings before
 * concatenating into innerHTML. Defense-in-depth against DOM XSS via
 * tampered characterName packets (servers validate names, but a custom
 * server with relaxed validation could inject markup into the shadow DOM).
 * @param {string} s
 * @returns {string}
 */
function escapeHtml(s) {
	return String(s).replace(/[&<>"']/g, c => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	}[c]));
}

/**
 * Create component (BLOCK-3 alignment: object-on-instance pattern + UIManager.addComponent export).
 */
const PartyPanel = new GUIComponent('PartyPanel', cssText);

PartyPanel.render = function render() {
	return htmlText;
};

PartyPanel.init = function init() {
	this._rafId = null;
};

PartyPanel.onAppend = function onAppend() {
	// D-28: register poll + draggable here (re-bound every append).
	this._pollRoster(); // immediate first render
	this._rafId = requestAnimationFrame(this._pollLoop.bind(this));

	// D-23: draggable when layout unlocked; persist position on drag end.
	if (UILayoutStore.isEnabled()) {
		this.draggable('.pp-root');
		this.onDragEnd = () => {
			UILayoutStore.save('PartyPanel', {
				left: this._host.offsetLeft,
				top: this._host.offsetTop
			});
		};
		const saved = UILayoutStore.restore('PartyPanel');
		if (saved) {
			this._host.style.left = saved.left + 'px';
			this._host.style.top = saved.top + 'px';
		}
	}
};

PartyPanel.onRemove = function onRemove() {
	if (this._rafId) {
		cancelAnimationFrame(this._rafId);
		this._rafId = null;
	}
};

/**
 * RAF poll loop — re-renders roster each frame from the life cache + roster reader.
 * Cheap (Map lookup + small DOM rebuild). T-12-05-02 mitigation: kept as-is for now.
 * @private
 */
PartyPanel._pollLoop = function _pollLoop() {
	this._pollRoster();
	this._rafId = requestAnimationFrame(this._pollLoop.bind(this));
};

/**
 * Re-render the party roster from the BLOCK-4 reader + EntityManager.getLife cache.
 * Hides the host when there is no party (D-06.3).
 * @private
 */
PartyPanel._pollRoster = function _pollRoster() {
	// BLOCK-4: roster from PartyFriendsV1.getPartyMembers() (added in Task 1).
	// PartyFriends.getUI() returns the active version (PartyFriendsV1 for PACKETVER 20191223).
	const partyUI = PartyFriends.getUI();
	const members = partyUI && partyUI.getPartyMembers ? partyUI.getPartyMembers() : [];

	if (!members || members.length === 0) {
		this._host.style.display = 'none'; // D-06.3: hide when no party
		return;
	}
	this._host.style.display = '';

	const shadow = this._shadow;
	if (!shadow) return;

	const rootEl = shadow.querySelector('.pp-root');
	if (!rootEl) return;

	// D-06.3: ≤6 full style / >6 compact style
	rootEl.classList.toggle('pp-compact', members.length > 6);

	const container = shadow.querySelector('.pp-members');
	if (!container) return;

	container.innerHTML = '';

	const fullStyle = members.length <= 6;
	for (const m of members) {
		const row = document.createElement('div');
		row.className = 'pp-member';

		// D-17: HP from life cache (Group.js storeLife populates it; no packet hook here).
		const life = EntityManager.getLife(m.AID) || { hp: -1, hp_max: -1 };

		// Resolve the live entity for death/distance state. EntityManager.getByCID is the
		// documented alias of getEntityByCID (EntityManager.js:586/126).
		const entity = EntityManager.getByCID(m.AID);

		// D-19: dead/far gray-out. Death is also reflected in member.isDead (PartyFriendsV1
		// tracks it via updateMemberLife/updateMemberDead) as a fallback when entity is out of
		// view. Rule 1 (source-verified): Entity.ACTION is an instance namespace, not a static
		// one — see JoystickUI.js:35, MobileUI.js:564, TargetManager.js:158 precedent.
		const isDead = !!m.isDead || (entity && entity.action === entity.ACTION.DIE);
		if (isDead) row.classList.add('pp-dead');
		if (this._isFar(entity)) row.classList.add('pp-far');

		row.innerHTML = this._renderMember(m, life, fullStyle);

		// Click a member → set as target (D-12 friendly fallthrough: friendlies are selected
		// but attack is ignored by EntityControl.canAttackEntity).
		row.addEventListener('click', () => {
			if (entity) TargetManager.setTarget(entity);
		});

		if (fullStyle) {
			this._loadJobIcon(row, m.job || m.class_ || m.Job || 0);
		}

		// D-19 buff icons per member.
		// CRITICAL: Use instance-level Map (NOT row DOM), because _pollRoster
		// rebuilds all rows each cycle (container.innerHTML = ''). Row-level
		// state (_lastEfstVer on row) would be lost every poll, causing all
		// buff icons to reload via Client.loadFile every frame — O(members ×
		// buffs × fps) redundant async calls.
		if (!this._efstVerCache) this._efstVerCache = new Map();
		const efstVer = (entity && entity._efstVersion) || 0;
		if (efstVer !== this._efstVerCache.get(m.AID)) {
			this._efstVerCache.set(m.AID, efstVer);
			let buffsEl = row.querySelector('.pp-buffs');
			if (!buffsEl) {
				buffsEl = document.createElement('div');
				buffsEl.className = 'pp-buffs';
				row.appendChild(buffsEl);
			}
			buffsEl.innerHTML = '';
			if (entity && entity._efstList && entity._efstList.size > 0) {
				for (const [index, data] of entity._efstList) {
					const info = StatusTable[index];
					if (!info || !info.icon) continue;
					const img = document.createElement('img');
					img.className = 'pp-buff-icon';
					if (info.descript && info.descript[0]) {
						img.title = info.descript[0][0];
					}
					buffsEl.appendChild(img);
					Client.loadFile('data/texture/effect/' + info.icon, url => {
						if (img.isConnected) img.src = url;
					});
				}
			}
		}

		container.appendChild(row);
	}
};

/**
 * Render a single member row's inner HTML.
 * @param {Object} m - party member record ({characterName, baseLevel, ...})
 * @param {{hp:number, hp_max:number}} life - life-cache entry (hp=-1 if unknown)
 * @param {boolean} full - true for full style (with icon slot), false for compact
 * @returns {string}
 * @private
 */
PartyPanel._renderMember = function _renderMember(m, life, full) {
	const hpPct =
		life.hp_max > 0 ? Math.max(0, Math.min(100, (life.hp / life.hp_max) * 100)) : 0;
	const hpText = life.hp >= 0 ? life.hp + ' / ' + life.hp_max : '???';
	const iconHtml = full ? '<img class="pp-icon" alt="">' : '';
	const name = escapeHtml(m.characterName || m.Name || '???');
	const lvl = m.baseLevel || m.level || m.Level || '?';
	return (
		iconHtml +
		'<div class="pp-info">' +
		'<div class="pp-name">' +
		name +
		'</div>' +
		'<div class="pp-lvl">Lv.' +
		lvl +
		'</div>' +
		'<div class="pp-hpbar"><div class="pp-hpfill" style="width:' +
		hpPct +
		'%"></div>' +
		'<div class="pp-hptext">' +
		hpText +
		'</div></div>' +
		'</div>'
	);
};

/**
 * LOW-1: load job icon via DB.INTERFACE_PATH constant (precedent: PartyFriendsV1.js:951).
 * Do NOT hardcode the Korean mojibake prefix.
 * @param {HTMLElement} row - member row element (must contain .pp-icon)
 * @param {number} jobId - job ID
 * @private
 */
PartyPanel._loadJobIcon = function _loadJobIcon(row, jobId) {
	if (jobId == null || jobId === 0) return;
	const path = DB.INTERFACE_PATH + 'renewalparty/icon_jobs_' + jobId + '.bmp';
	Client.loadFile(path, (url) => {
		const img = row.querySelector('.pp-icon');
		if (img) img.src = url;
	});
};

/**
 * D-19 distance gray-out: >15 cells from player → mark as "far".
 * Returns false when either position is unavailable (no gray-out for missing data).
 * @param {Object} entity - live entity (may be null when member out of view)
 * @returns {boolean}
 * @private
 */
PartyPanel._isFar = function _isFar(entity) {
	if (!entity || !entity.position) return false;
	const self = Session.Entity;
	if (!self || !self.position) return false;
	const dx = entity.position[0] - self.position[0];
	const dy = entity.position[1] - self.position[1];
	return dx * dx + dy * dy > DISTANCE_THRESHOLD_SQ;
};

export default UIManager.addComponent(PartyPanel);
