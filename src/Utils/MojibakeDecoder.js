/**
 * MojibakeDecoder — 把客户端 hardcode 的 Latin1-mojibake 路径段还原为磁盘 readdir 字节串。
 *
 * 背景：roBrowserLegacy 客户端用 `\xHH` 转义 hardcode 韩文资源路径，运行时字符串里
 * 是 Latin1 字符（U+00HH），例如 `유저인터페이스` 在源码里写作
 * `'\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba'`（= CP949 字节当 Latin1）。
 *
 * remote-client 磁盘上 chinese-data 目录名却是 UTF-8 GBK-mojibake 形式（CP949 韩文字节
 * 被当 GBK 解码后又 UTF-8 化），例如 `蜡历牢磐其捞胶`。这是 Form C。
 *
 * 本模块按 `/` 分段，对每段做：若含 U+0080–U+00FF 的 Latin1 字符，则把每个码点的低 8 位
 * 收集成 bytes，用 GBK 解码（CP949 字节 → GBK 解码 = 磁盘 Form C 字符串）；否则原样返回。
 *
 * 参考调查结论（dev-logs 与 docs/encoding-lessons-learned.md）：
 *   Form A（客户端 Latin1 mojibake） --GBK decode--> Form C（磁盘 readdir UTF-8 GBK-mojibake）
 *
 * 这是 cache-busting manifest 查表的归一化基础：客户端 filename → normalize → 磁盘 key。
 */
class MojibakeDecoder {
	static _gbkDecoder = null;

	/**
	 * 懒初始化 GBK TextDecoder（浏览器与 Node 24+ 均原生支持 'gbk'）。
	 * @returns {TextDecoder}
	 */
	static _getGbkDecoder() {
		if (!this._gbkDecoder) {
			this._gbkDecoder = new TextDecoder('gbk');
		}
		return this._gbkDecoder;
	}

	/**
	 * 判断字符码点是否落在 Latin1 范围（U+0080–U+00FF），即客户端 hardcode 的 mojibake 字节。
	 * U+0000–U+007F 是 ASCII，U+0100+ 不属于 Latin1（已是 Unicode 字符，无法无损转 byte）。
	 * @param {number} code - charCodeAt 结果
	 * @returns {boolean}
	 */
	static _isLatin1MojibakeByte(code) {
		return code >= 0x80 && code <= 0xff;
	}

	/**
	 * 对单一路径段做 Form A → Form C 转换。
	 *
	 * - 纯 ASCII 或含 U+0100+ 字符：原样返回（后者无法还原，假定不是 mojibake）
	 * - 含 U+0080–U+00FF 字符：收集低 8 位成 bytes，GBK 解码
	 *
	 * @param {string} segment - 不含 `/` 的路径段
	 * @returns {string}
	 */
	static decodeMojibakeSegment(segment) {
		if (!segment) {
			return '';
		}

		const len = segment.length;
		let hasMojibake = false;
		const bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			const code = segment.charCodeAt(i);
			if (code > 0xff) {
				// 已是 Unicode 字符（如 UTF-8 Korean），不是 Latin1 mojibake，保持原样
				return segment;
			}
			if (this._isLatin1MojibakeByte(code)) {
				hasMojibake = true;
			}
			bytes[i] = code & 0xff;
		}

		if (!hasMojibake) {
			return segment; // 纯 ASCII，避免无谓的 TextDecoder 调用
		}

		return this._getGbkDecoder().decode(bytes);
	}

	/**
	 * 把完整路径按 `/` 分段，每段独立做 mojibake 归一化，再以 `/` 拼回。
	 *
	 * 用于 cache-busting manifest 的 filename → 磁盘 key 归一化。
	 * 注意：调用方应在反斜杠已被替换为 `/` 之后调用本函数（FileManager.getHTTP 已做该替换）。
	 *
	 * @param {string} filename - `/` 分隔的相对路径（可能含 Latin1 mojibake 段）
	 * @returns {string} 归一化后的路径（每段为磁盘 readdir 字节串）
	 */
	static normalize(filename) {
		if (!filename) {
			return filename;
		}

		const segments = filename.split('/');
		for (let i = 0; i < segments.length; i++) {
			segments[i] = this.decodeMojibakeSegment(segments[i]);
		}
		return segments.join('/');
	}
}

export default MojibakeDecoder;
