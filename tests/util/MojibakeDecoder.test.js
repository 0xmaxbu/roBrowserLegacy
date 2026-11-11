import { describe, it, expect } from 'vitest';
import MojibakeDecoder from 'Utils/MojibakeDecoder.js';

describe('MojibakeDecoder', () => {
	describe('decodeMojibakeSegment', () => {
		it('纯 ASCII 段保持不变', () => {
			expect(MojibakeDecoder.decodeMojibakeSegment('basic_interface')).toBe('basic_interface');
			expect(MojibakeDecoder.decodeMojibakeSegment('win32_bg.bmp')).toBe('win32_bg.bmp');
			expect(MojibakeDecoder.decodeMojibakeSegment('ef_snow')).toBe('ef_snow');
		});

		it('Latin1 mojibake 韩文段 → GBK 解码（Form A → Form C，匹配磁盘 readdir）', () => {
			// 유저인터페이스 的 CP949 bytes 当 Latin1：\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba
			expect(MojibakeDecoder.decodeMojibakeSegment('\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba')).toBe('蜡历牢磐其捞胶');
			// 이펙트 的 CP949 bytes 当 Latin1：\xc0\xcc\xc6\xd1\xc6\xae
			expect(MojibakeDecoder.decodeMojibakeSegment('\xc0\xcc\xc6\xd1\xc6\xae')).toBe('捞蒲飘');
		});

		it('已是 UTF-8 Korean 的段保持原样（非 Latin1 mojibake，无法还原）', () => {
			// 注意：UTF-8 Korean 不是 Latin1 mojibake，decodeMojibakeSegment 不应破坏它
			expect(MojibakeDecoder.decodeMojibakeSegment('유저인터페이스')).toBe('유저인터페이스');
			expect(MojibakeDecoder.decodeMojibakeSegment('빨간포션')).toBe('빨간포션');
		});

		it('空段返回空字符串', () => {
			expect(MojibakeDecoder.decodeMojibakeSegment('')).toBe('');
		});
	});

	describe('normalize', () => {
		it('纯 ASCII 路径保持不变', () => {
			expect(MojibakeDecoder.normalize('data/sprite/effect/owl.spr')).toBe('data/sprite/effect/owl.spr');
			expect(MojibakeDecoder.normalize('data/texture/scr_logo.bmp')).toBe('data/texture/scr_logo.bmp');
		});

		it('完整路径含 mojibake 韩文目录名', () => {
			// data/texture/유저인터페이스/...
			const input1 = 'data/texture/\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/basic_interface/win32_bg.bmp';
			expect(MojibakeDecoder.normalize(input1)).toBe('data/texture/蜡历牢磐其捞胶/basic_interface/win32_bg.bmp');
			// data/sprite/이펙트/ef_snow
			const input2 = 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/ef_snow';
			expect(MojibakeDecoder.normalize(input2)).toBe('data/sprite/捞蒲飘/ef_snow');
		});

		it('多个 mojibake 段的路径（도람족/몸통 风格）', () => {
			// 도람족 CP949: \xb5\xb5\xb6\xf7\xc1\xb7 ; 몸통 CP949: \xb8\xf6\xc5\xeb
			const input = 'data/sprite/\xb5\xb5\xb6\xf7\xc1\xb7/\xb8\xf6\xc5\xeb/';
			const result = MojibakeDecoder.normalize(input);
			// 期望：每段都按 GBK 解码（结果可能是 Chinese chars，与磁盘一致）
			expect(result).toMatch(/^data\/sprite\/[^/]+\/[^/]+\/$/);
			expect(result).not.toContain('\xb5'); // 原 Latin1 字符应消失
		});

		it('处理空字符串', () => {
			expect(MojibakeDecoder.normalize('')).toBe('');
		});

		it('处理 null/undefined（返回原值，不抛异常）', () => {
			expect(MojibakeDecoder.normalize(null)).toBe(null);
			expect(MojibakeDecoder.normalize(undefined)).toBe(undefined);
		});

		it('路径末尾的 ASCII 文件名不被破坏', () => {
			const input = 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/\xbd\xfa\xc0\xda.spr';
			const result = MojibakeDecoder.normalize(input);
			expect(result.endsWith('.spr')).toBe(true);
			expect(result.startsWith('data/sprite/')).toBe(true);
		});
	});

	describe('与磁盘 readdir 一致性（真实样本）', () => {
		// 这两个是 remote-client/chinese-data/ 下的真实目录名
		it('蜡历牢磐其捞胶（texture/ 下真实存在）', () => {
			const input = 'data/texture/\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/';
			expect(MojibakeDecoder.normalize(input)).toBe('data/texture/蜡历牢磐其捞胶/');
		});

		it('捞蒲飘（sprite/ 下真实存在）', () => {
			const input = 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/';
			expect(MojibakeDecoder.normalize(input)).toBe('data/sprite/捞蒲飘/');
		});
	});
});
