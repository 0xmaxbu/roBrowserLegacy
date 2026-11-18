/**
 * UI/Components/CharSelect/CharSelect.js
 *
 * Character Selection
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */

import CharSelect from './CharSelect/CharSelect.js';
import CharSelectV2 from './CharSelectV2/CharSelectV2.js';
import CharSelectV3 from './CharSelectV3/CharSelectV3.js';
import CharSelectV4 from './CharSelectV4/CharSelectV4.js';
import UIVersionManager from 'UI/UIVersionManager.js';

const publicName = 'CharSelect';
const versionInfo = {
	default: CharSelect,
	common: {
		// 本项目 PACKETVER 全局固定 20191223，运营选择老版(V3)样式界面：
		// 三槽位+属性表格+RAGNAROK 水印（kRO 2014-2018 经典样式），
		// 素材 audit 见 dev-logs/2026-11-16-charselect-v3-charcreate-v3-restore.md。
		// 上游原映射（20180124→V4）保留供其他日期使用。
		20191223: CharSelectV3,
		20180124: CharSelectV4,
		20141016: CharSelectV3,
		20100803: CharSelectV2,
		20100728: CharSelect,
		20100720: CharSelectV2
	},
	re: {},
	prere: {}
};

const Controller = UIVersionManager.getUIController(publicName, versionInfo, { phase: 'char' });
export default Controller;
