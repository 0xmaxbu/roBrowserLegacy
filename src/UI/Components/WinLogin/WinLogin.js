/**
 * UI/Components/WinLogin/WinLogin.js
 *
 * Login Window
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 */

import WinLogin from './WinLogin/WinLogin.js';
import WinLoginV2 from './WinLoginV2/WinLoginV2.js';
import WinLoginV3 from './WinLoginV3/WinLoginV3.js';
import UIVersionManager from 'UI/UIVersionManager.js';

const publicName = 'WinLogin';

const versionInfo = {
	default: WinLogin,
	common: {
		// 本项目 PACKETVER 全局固定 20191223，运营选择老版(V1)经典登录窗：
		// win_login.bmp 帐号/密码紧凑窗（中文图），与选人/建人 V3 老版风格配套。
		// 注意：登录服 new_account: no，V1 的申请按钮打开注册窗但服务端会拒绝。
		20191223: WinLogin,
		20221207: WinLoginV3,
		20181114: WinLoginV2
	},
	re: {},
	prere: {}
};

const Controller = UIVersionManager.getUIController(publicName, versionInfo);

export default Controller;
