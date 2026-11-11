/**
 * Core/CacheManifest.js
 *
 * Per-file hash manifest for immutable CDN cache-busting.
 *
 * Fetches /file-hashes.json from remote-client at app start, stores the
 * {filename: md5} map, and injects it into the Worker (FileManager.fileVersionMap)
 * so getHTTP() can append ?v=<md5> to asset URLs.
 *
 * Change detection: the manifest ETag is persisted to localStorage across
 * sessions; if it differs at the next app start, hasChanged() returns true
 * (used by UpdateAvailable UI to prompt the user to reload).
 *
 * Flow:
 *   Main thread:  CacheManifest.init(remoteClient)
 *                   → fetch /file-hashes.json (ETag revalidation)
 *                   → parse {files: {path: md5}}
 *                   → Thread.send('SET_VERSION_MAP', map)
 *   Worker:       ThreadEventHandler 'SET_VERSION_MAP'
 *                   → FileManager.fileVersionMap = map
 *   Worker:       FileManager.getHTTP() consults fileVersionMap before fetch()
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Thread from './Thread.js';

class CacheManifest {
	/**
	 * Map of normalized filename → md5 hash
	 * @type {Object<string, string>}
	 */
	static fileHashes = {};

	/**
	 * ETag of the currently loaded manifest (from this fetch response)
	 * @type {string|null}
	 */
	static manifestETag = null;

	/**
	 * ETag seen at previous app start (read from localStorage at init time)
	 * @type {string|null}
	 */
	static _previousETag = null;

	/**
	 * Whether the manifest changed between the previous and current app start.
	 * Only meaningful after init() resolves.
	 * @type {boolean}
	 */
	static _changed = false;

	/**
	 * localStorage key for persisting the seen ETag across browser sessions.
	 */
	static STORAGE_KEY = 'ro_cache_manifest_etag';

	/**
	 * Fetch the manifest from the remote-client and inject it into the Worker.
	 *
	 * Uses `cache: 'no-cache'` so the browser always revalidates with the
	 * origin via If-None-Match; on 304 the browser transparently returns the
	 * cached body, so response.json() still works.
	 *
	 * @param {string} remoteClient - base URL with trailing slash (e.g. "http://host:8080/")
	 * @returns {Promise<boolean>} true if the manifest changed since the last app start
	 */
	static async init(remoteClient) {
		if (!remoteClient) {
			console.warn('[CacheManifest] no remoteClient configured, skipping');
			return false;
		}

		const url = remoteClient + 'file-hashes.json';

		try {
			// Read previous ETag BEFORE fetching so we can compare after.
			this._previousETag = this._readStoredETag();

			const response = await fetch(url, { cache: 'no-cache' });
			if (!response.ok) {
				console.warn('[CacheManifest] fetch failed: HTTP ' + response.status);
				return false;
			}

			const data = await response.json();
			if (!data || typeof data !== 'object' || !data.files) {
				console.warn('[CacheManifest] invalid manifest format (missing .files)');
				return false;
			}

			this.fileHashes = data.files;
			this.manifestETag = response.headers.get('etag');

			// Detect change: only flag as changed when we have both a previous
			// and current ETag and they differ. First-ever load (no previous)
			// is not a "change" — nothing to invalidate yet.
			this._changed =
				this._previousETag !== null &&
				this.manifestETag !== null &&
				this._previousETag !== this.manifestETag;

			this._writeStoredETag(this.manifestETag);

			// Inject the hash map into the Worker so FileManager.getHTTP() can
			// consult it. postMessage structured-clones the object once at
			// startup; the ~3.7MB / 40k-entry cost is acceptable.
			Thread.send('SET_VERSION_MAP', this.fileHashes);

			console.log(
				'[CacheManifest] loaded ' +
					Object.keys(this.fileHashes).length +
					' file hashes, etag=' +
					this.manifestETag +
					', changed=' +
					this._changed
			);

			return this._changed;
		} catch (e) {
			console.warn('[CacheManifest] init error:', e);
			return false;
		}
	}

	/**
	 * Look up the hash for a normalized filename.
	 *
	 * @param {string} filename - normalized path (lowercased, forward slashes,
	 *                            mojibake-decoded; same form as manifest keys)
	 * @returns {string|null} md5 hex string, or null if not in the manifest
	 */
	static getHash(filename) {
		return this.fileHashes[filename] || null;
	}

	/**
	 * Get the full hash map (used for Worker injection and debugging).
	 * @returns {Object<string, string>}
	 */
	static getMap() {
		return this.fileHashes;
	}

	/**
	 * Whether the manifest changed between the previous and current app start.
	 * Valid only after init() has resolved.
	 *
	 * @returns {boolean}
	 */
	static hasChanged() {
		return this._changed;
	}

	/**
	 * Read the previously stored ETag from localStorage.
	 * @returns {string|null}
	 */
	static _readStoredETag() {
		try {
			return localStorage.getItem(this.STORAGE_KEY);
		} catch (_e) {
			// localStorage unavailable (privacy mode, disabled, etc.) — non-fatal
			return null;
		}
	}

	/**
	 * Persist the current ETag to localStorage.
	 * @param {string|null} etag
	 */
	static _writeStoredETag(etag) {
		try {
			if (etag) {
				localStorage.setItem(this.STORAGE_KEY, etag);
			} else {
				localStorage.removeItem(this.STORAGE_KEY);
			}
		} catch (_e) {
			// localStorage unavailable — non-fatal, change detection just won't persist
		}
	}
}

export default CacheManifest;
