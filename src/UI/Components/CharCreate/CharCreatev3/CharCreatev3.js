/**
 * UI/Components/CharCreate/CharCreatev3/CharCreatev3.js
 *
 * Chararacter Creation windows
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import htmlText from './CharCreatev3.html?raw';
import cssText from './CharCreatev3.css?raw';
import { createCharCreate } from '../CharCreateCommon.js';

export default createCharCreate({
	name: 'CharCreatev3',
	htmlText,
	cssText,
	hostHeight: 342,
	hostWidth: 576,
	hasRace: true,
	humanCanvasSelector: '#canvas_human',
	doramCanvasSelector: '#canvas_doram',
	modelCanvasSelector: '#canvas_model',
	nameInputSelector: '#char_name',
	nameInputEvent: 'click',
	cancelSelectors: ['.button.close', '.button.cancel'], // .button.cancel 为 fork 020ca70c 加的中文取消按钮，工厂化时绑定丢失（2026-11-19 回归修复）
	makeSelector: '.button.make'
});
