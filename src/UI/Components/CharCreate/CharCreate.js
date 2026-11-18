/**
 * UI/Components/CharCreate/CharCreate.js
 *
 * Character Creation
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */

import CharCreate from './CharCreate/CharCreate.js';
import CharCreateV2 from './CharCreatev2/CharCreatev2.js';
import CharCreateV3 from './CharCreatev3/CharCreatev3.js';
import CharCreateV4 from './CharCreatev4/CharCreatev4.js';
import UIVersionManager from 'UI/UIVersionManager.js';

const publicName = 'CharCreate';
const versionInfo = {
	default: CharCreate,
	common: {
		// 本项目 PACKETVER 全局固定 20191223，运营选择老版(V3)样式建人界面：
		// 种族说明框+性别/发型/发色选择器（kRO 2015-2018 样式），与 CharSelectV3 同代。
		// 上游原映射（20180124→V4）保留供其他日期使用。
		20191223: CharCreateV3,
		20180124: CharCreateV4,
		20151001: CharCreateV3,
		20120307: CharCreateV2
	},
	re: {},
	prere: {}
};

const Controller = UIVersionManager.getUIController(publicName, versionInfo, { phase: 'char' });
export default Controller;
