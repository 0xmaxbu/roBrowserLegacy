/**
 * Plugins/PluginManager.js
 *
 * Plugin Manager - Load and execute plugins
 * Plugins have to be globals, can not be server specific (multiple server in one clientinfo)
 * You alter memory, so you can't restore it if you change server.
 *
 * It's a work in progress, and subject to changes.
 *
 * To add plugins use the "plugins" param to list plugins in the ROBrowser Config. Plugins must be located in the /Plugin/ folder.
 *
 * Usage:
 * 		plugins: {
 *					<plugin_1_name>: '<plugin_1_path>',
 *					<plugin_2_name>: '<plugin_2_path>',
 *					<plugin_3_name>: '<plugin_3_path>',
 *					...
 *					<plugin_n_name>: '<plugin_n_path>'
 *				},
 *
 * Example:
 * 		plugins:		{ KeyboardControl: 'KeyToMove_v1/KeyToMove' },
 *
 *
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import Configs from 'Core/Configs.js';

/**
 * Eager-load all plugin modules at build time so Vite bundles them into the
 * single-file production output (builder-web.mjs uses codeSplitting:false).
 *
 * Without this, the runtime dynamic `import(resolvedPath)` below would 404 in
 * production (the plugin file is not served alongside the bundled Online.js).
 * The glob keys are paths relative to this file (e.g. './BotAutoHunt/BotAutoHunt.js').
 *
 * A runtime-import fallback is kept for dev mode (vite dev serves src/ directly).
 */
const pluginModules = import.meta.glob('./*/*.js', { eager: true });

/**
 * Plugin namespace
 */
const Plugins = {};

/**
 * @var {Array} plugin list
 */
Plugins.list = [];

/**
 * @var {boolean} track if plugins have been initialized
 */
let _initialized = false;

/**
 * Initialize plugins
 */
Plugins.init = function init(context) {
	if (_initialized) {
		return;
	}
	_initialized = true;

	const paths = [];
	const params = [];

	this.list = Configs.get('plugins', {});

	for (const [_pluginName, value] of Object.entries(this.list)) {
		if (typeof value === 'string' || value instanceof String) {
			// Only Path is provided as string
			paths.push('./' + value);
			params.push(null);
		} else if (typeof value === 'object' && value !== null) {
			// Path and parameters are provided as well
			if (value.path) {
				paths.push('./' + value.path);

				if (value.pars) {
					params.push(value.pars);
				} else {
					params.push(null);
				}
			}
		}
	}

	paths.forEach((pluginPath, i) => {
		// Ensure .js extension for native ES module resolution (Vite resolves it automatically)
		let resolvedPath = pluginPath;
		if (!resolvedPath.endsWith('.js') && !resolvedPath.endsWith('.mjs')) {
			resolvedPath += '.js';
		}

		// Production path: plugin bundled at build time via import.meta.glob
		const bundledModule = pluginModules[resolvedPath];
		if (bundledModule) {
			_loadPlugin(bundledModule, pluginPath, params[i]);
			return;
		}

		// Dev fallback: runtime dynamic import (vite dev serves src/ directly)
		// @vite-ignore keeps Vite from trying to analyze this computed specifier
		import(/* @vite-ignore */ resolvedPath)
			.then(module => {
				_loadPlugin(module, pluginPath, params[i]);
			})
			.catch(err => {
				console.error('[PluginManager] Error loading plugin: ' + pluginPath, err);
			});
	});
};

/**
 * Initialize a single plugin module
 *
 * @param {object} module - plugin module (default export = init function)
 * @param {string} pluginPath - path string for logging
 * @param {*} params - plugin parameters (or null)
 */
function _loadPlugin(module, pluginPath, params) {
	const plugin = module.default || module;
	if (typeof plugin === 'function') {
		if (plugin(params)) {
			console.log('[PluginManager] Initialized plugin: ' + pluginPath);
		} else {
			console.error('[PluginManager] Failed to intialize plugin: ' + pluginPath);
		}
	} else {
		console.error('[PluginManager] Plugin has no init function: ' + pluginPath);
	}
}

/**
 * Export
 */
export default Plugins;
