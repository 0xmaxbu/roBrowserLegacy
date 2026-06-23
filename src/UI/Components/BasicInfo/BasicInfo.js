/**
 * UI/Components/BasicInfo/BasicInfo.js
 *
 * Chararacter Basic information windows
 *
 * Note: For different versions, please use different Object names and main div IDs to avoid conflicts in settings and styles
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */

import BasicInfo from './BasicInfo/BasicInfo.js';
import BasicInfoV0 from './BasicInfoV0/BasicInfoV0.js';
import BasicInfoV3 from './BasicInfoV3/BasicInfoV3.js';
import BasicInfoV4 from './BasicInfoV4/BasicInfoV4.js';
import BasicInfoV5 from './BasicInfoV5/BasicInfoV5.js';
import BasicInfoV6 from './BasicInfoV6/BasicInfoV6.js';
import UIVersionManager from 'UI/UIVersionManager.js';
import Session from 'Engine/SessionStorage.js';

const publicName = 'BasicInfo';
const versionInfo = {
	default: BasicInfoV0,
	common: {
		20200520: BasicInfoV5, // not sure the exact client date that started supporting 4th Jobs
		20191223: BasicInfoV6, // Phase 12-03: PACKETVER 20191223 -> BasicInfoV6 rewrite (D-21)
		20180124: BasicInfoV4,
		20160101: BasicInfoV3,
		20090601: BasicInfo
	},
	re: {},
	prere: {},
	job: {
		FourthClass: BasicInfoV5,
		// REVIEWS.md BLOCK-5: was BasicInfoV4. MapEngine/Entity.js:1212 calls
		// BasicInfo.selectUIVersionWithJob(...) after character data loads;
		// UIVersionManager.js:62-63 resolves
		//   _selectedUI = versionInfo.job[job] || versionInfo.job.default
		// so if job.default still pointed at V4, the first job-select after
		// entering the world would knock V6 out. Setting it to V6 keeps V6
		// selected after login.
		default: BasicInfoV6
	}
};

const BasicInfoController = UIVersionManager.getUIController(publicName, versionInfo);

/**
 * D-22: hot-swap BasicInfo between the V4 fallback and the V6 rewrite at
 * runtime, without a page reload. Mirrors the lifecycle pattern used at
 * Entity.js:1211-1219 for job-change version switches:
 *   1. remove() the currently-selected UI (runs its onRemove)
 *   2. selectSpecificUIVersion() to repoint getUI() at the target version
 *   3. prepare() the new UI (idempotent — guarded by __loaded)
 *   4. push current Session data into the new UI (LOW-5: pass explicit
 *      args, not Session.Character.hp which doesn't exist)
 *   5. append() the new UI (runs its onAppend)
 *
 * @param {boolean} useNew  true -> V6 (20191223), false -> V4 (20180124)
 */
BasicInfoController.toggleNewUI = function (useNew) {
	const oldUI = this.getUI();
	if (oldUI) {
		oldUI.remove();
	}
	this.selectSpecificUIVersion(useNew ? 20191223 : 20180124);
	const newUI = this.getUI();
	if (newUI) {
		newUI.prepare();
		if (newUI.update) {
			// LOW-5: HP/SP live on Session.Entity.life.*, NOT Session.Character.
			const life = Session.Entity && Session.Entity.life;
			if (life) {
				newUI.update('hp', life.hp, life.hp_max);
				newUI.update('sp', life.sp, life.sp_max);
			}
			if (Session.Character) {
				newUI.update('name', Session.Character.name);
				newUI.update('blvl', Session.Character.level);
				newUI.update('job', Session.Character.job);
			}
			// Transfer exp/weight/jlvl/zeny from old UI so V4 shows real
			// values after a V6→V4 hot-swap (V6 stores these as instance
			// props; V4 needs them pushed via update()).
			if (oldUI) {
				newUI.base_exp = oldUI.base_exp || 0;
				newUI.base_exp_next = oldUI.base_exp_next || 1;
				newUI.job_exp = oldUI.job_exp || 0;
				newUI.job_exp_next = oldUI.job_exp_next || -1;
				newUI.weight_max = oldUI.weight_max || 1;

				if (newUI.base_exp_next > 0) {
					newUI.update('bexp', newUI.base_exp, newUI.base_exp_next);
				}
				if (newUI.job_exp_next > 0) {
					newUI.update('jexp', newUI.job_exp, newUI.job_exp_next);
				}
				if (oldUI._jlvl != null) {
					newUI.update('jlvl', oldUI._jlvl);
				}
				if (Session.zeny != null) {
					newUI.update('zeny', Session.zeny);
				}
				if (Session.Character && Session.Character.weight != null && newUI.weight_max > 0) {
					newUI.update('weight', Session.Character.weight, newUI.weight_max);
				}
			}
		}
		newUI.append();
	}
};

export default BasicInfoController;
