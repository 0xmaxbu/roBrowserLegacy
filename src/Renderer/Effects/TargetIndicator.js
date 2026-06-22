/**
 * Renderer/Effects/TargetIndicator.js
 *
 * World-space WebGL arrow that hovers above the current target entity's head.
 * Phase 12 plan 12-07 (D-03 world-effect layer, NOT a DOM component).
 *
 * Design decisions (see .planning/phases/12-12-ui/12-CONTEXT.md):
 *   - D-03: World-effect layer (not DOM). Mirrors LockOnTarget.js structure.
 *   - D-04: Through-walls visibility. renderBeforeEntities=false (Pass2,
 *           top layer) AND static beforeRender disables DEPTH_TEST so the
 *           arrow is never occluded by terrain/walls. afterRender restores.
 *   - D-04b (CRITICAL, REVIEWS.md source-verified): EffectManager.render's
 *           `if (pos)` guard (EffectManager.js:448) SKIPS the per-instance
 *           render() call when `_Params.Inst.position` is null/undefined.
 *           The original CONTEXT.md claim "add(effect, null) renders always-
 *           visible" was WRONG: null position = NEVER renders. We MUST pass
 *           Params.Inst.position = entity.position (live reference so
 *           culling tracks the moving target). Through-walls visibility
 *           comes from DEPTH_TEST disable, NOT null position.
 *   - D-15: Arrow bobs vertically (sin wave, ~1.5s). Switching targets is
 *           instant (old effect.needCleanUp=true, new effect added).
 *           Persistent: render() does NOT set needCleanUp.
 *   - REVIEWS.md LOW-2: Defense-in-depth. If the controller ever fails to
 *           clean a stale target (entity destroyed but effect not yet
 *           removed), render() detects null/stale target.position and sets
 *           needCleanUp=true so the zombie is pruned next frame.
 *
 * EffectManager contract (verified at EffectManager.js:328-507):
 *   - add(effect, Params): Params.Inst.position must be truthy for render().
 *   - instance.render(gl, tick) receives ONLY 2 args; matrices arrive via
 *     static beforeRender and must be cached to module-level vars.
 *   - needCleanUp=true on the instance splices it next frame (:487).
 *   - Init.ownerAID is set so any code path that reads _Params.Init.ownerAID
 *     (e.g. EffectManager.remove/clean) does not throw.
 *
 * Controller: subscribes to TargetManager.onChange; adds/removes the effect
 * as the target changes. Auto-installs on import (idempotent).
 *
 * This file is part of the rAthena RO private server project (Phase 12 UI).
 */

import WebGL from 'Utils/WebGL.js';
import EffectManager from 'Renderer/EffectManager.js';
import TargetManager from 'UI/TargetManager.js';
import _vertexShader from './TargetIndicator.vs?raw';
import _fragmentShader from './TargetIndicator.fs?raw';

// Module-level GL state (populated by static init).
let _program = null;
let _buffer = null;

// D-04b: instance.render(gl, tick) only receives 2 args. The matrices passed
// to static beforeRender MUST be cached here for render() to read.
let _cachedModelView = null;
let _cachedProjection = null;

// Visual constants (D-15).
const HEAD_OFFSET = 3.0;     // world units above target feet (approx head height)
const ARROW_SIZE = 1.2;      // world units (quad half-width / half-height)
const BOB_AMPLITUDE = 0.3;   // bob height in world units
const BOB_PERIOD_MS = 1500;  // ~1.5s sin period (D-15)

class TargetIndicator {
	/**
	 * @param {object} target entity (must expose a live `position` array)
	 */
	constructor(target) {
		this.target = target;
		this.ready = true; // instance ready; shader is constructor-level (static init)
	}

	/**
	 * Instance init (matches LockOnTarget pattern). Called by EffectManager
	 * on first render via the needInit flag.
	 */
	init(gl) {
		this.ready = true;
	}

	/**
	 * Instance cleanup. Called by EffectManager when needCleanUp is set.
	 */
	free(gl) {
		this.ready = false;
	}

	/**
	 * Per-frame draw. Called by EffectManager.render ONLY when
	 * _Params.Inst.position is truthy (D-04b guard at EffectManager.js:448).
	 *
	 * @param {object} gl   webgl context
	 * @param {number} tick game tick (ms)
	 */
	render(gl, tick) {
		// REVIEWS.md LOW-2: defense-in-depth null-guard + zombie cleanup.
		// If we ever reach render() with a stale/destroyed target whose
		// position reference has gone null/undefined, mark for cleanup so
		// EffectManager splices this zombie out next frame (:487).
		if (!this.target || !this.target.position) {
			this.needCleanUp = true;
			return;
		}

		// D-15: vertical bobbing (sin wave, ~1.5s period).
		const phase = ((tick % BOB_PERIOD_MS) / BOB_PERIOD_MS) * Math.PI * 2;
		const bob = Math.sin(phase) * BOB_AMPLITUDE;

		const uniform = _program.uniform;
		gl.uniform3fv(uniform.uTargetPos, this.target.position);
		gl.uniform1f(uniform.uBobOffset, HEAD_OFFSET + bob);
		gl.uniform1f(uniform.uSize, ARROW_SIZE);
		gl.uniform1f(uniform.uTick, tick);
		// D-04b: matrices cached in static beforeRender.
		gl.uniformMatrix4fv(uniform.uModelViewMat, false, _cachedModelView);
		gl.uniformMatrix4fv(uniform.uProjectionMat, false, _cachedProjection);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		// PERSISTENT (D-15): do NOT set needCleanUp on the normal draw path.
		// Removal is external (the controller sets it on target change/clear).
	}

	/**
	 * Static init: compile shaders, build the shared quad buffer. Called
	 * once on first render via constructor.needInit (EffectManager.js:427).
	 */
	static init(gl) {
		_program = WebGL.createShaderProgram(gl, _vertexShader, _fragmentShader);
		_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
		// Quad as TRIANGLE_STRIP (4 vertices). Stride 16 bytes:
		//   bytes 0-7:  aPosition.xy (2 floats)
		//   bytes 8-15: aTexCoord.xy (2 floats)
		//   vertex  pos          tex      screen position
		//   0       (-0.5,-0.5)  (0,0)    bottom-left
		//   1       ( 0.5,-0.5)  (1,0)    bottom-right
		//   2       (-0.5, 0.5)  (0,1)    top-left
		//   3       ( 0.5, 0.5)  (1,1)    top-right
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				-0.5, -0.5, 0.0, 0.0,
				 0.5, -0.5, 1.0, 0.0,
				-0.5,  0.5, 0.0, 1.0,
				 0.5,  0.5, 1.0, 1.0
			]),
			gl.STATIC_DRAW
		);
		TargetIndicator.ready = true;
	}

	/**
	 * Static cleanup. Called by EffectManager when the last instance is
	 * removed (EffectManager.js:499-504).
	 */
	static free(gl) {
		if (_program) {
			gl.deleteProgram(_program);
			_program = null;
		}
		if (_buffer) {
			gl.deleteBuffer(_buffer);
			_buffer = null;
		}
		TargetIndicator.ready = false;
	}

	/**
	 * Per-frame setup before all instances render. EffectManager passes the
	 * matrices here (EffectManager.js:433); we MUST cache them because the
	 * instance render() only gets (gl, tick) — D-04b.
	 */
	static beforeRender(gl, modelView, projection, fog, tick) {
		_cachedModelView = modelView;
		_cachedProjection = projection;

		gl.useProgram(_program);
		gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);

		const attr = _program.attribute;
		gl.enableVertexAttribArray(attr.aPosition);
		gl.enableVertexAttribArray(attr.aTexCoord);
		gl.vertexAttribPointer(attr.aPosition, 2, gl.FLOAT, false, 16, 0);
		gl.vertexAttribPointer(attr.aTexCoord, 2, gl.FLOAT, false, 16, 8);

		// D-04: THROUGH-WALLS — disable depth test so the arrow draws over
		// terrain and walls. Scoped to this effect's render pass; restored
		// in afterRender. Threat T-12-07-02 mitigation.
		gl.disable(gl.DEPTH_TEST);
	}

	/**
	 * Per-frame teardown after all instances render. Restore GL state.
	 */
	static afterRender(gl) {
		// D-04: restore depth test for subsequent render passes.
		gl.enable(gl.DEPTH_TEST);
		const attr = _program.attribute;
		gl.disableVertexAttribArray(attr.aPosition);
		gl.disableVertexAttribArray(attr.aTexCoord);
	}
}

// D-04: render in Pass2 (renderBeforeEntities=false) = after entities = top
// layer. Combined with DEPTH_TEST disable in beforeRender, the arrow is
// always visible, even through walls.
TargetIndicator.renderBeforeEntities = false;

// ─── Controller: subscribe to TargetManager, manage effect lifecycle ───────

let _currentEffect = null;
let _unsub = null;
let _installed = false;

/**
 * Wire up the TargetManager subscription. Idempotent — safe to call from
 * multiple consumers' onAppend and safe to invoke on module load.
 */
function install() {
	if (_installed) return;
	_installed = true;

	// Init TargetManager (idempotent — safe even if a Wave-1 consumer
	// already inited it). Starts the focus monkey-patch + RAF health-check.
	TargetManager.init();

	_unsub = TargetManager.onChange(entity => {
		// D-15: instant target switch — remove the old effect first.
		if (_currentEffect) {
			// EffectManager splices next frame at :487-494.
			_currentEffect.needCleanUp = true;
			_currentEffect = null;
		}

		if (entity && entity.position) {
			// D-04b CORRECTION (CRITICAL): MUST pass a Params object with
			//   Inst.position = entity.position  (LIVE array reference so
			//                                    culling tracks the moving
			//                                    target — null would skip
			//                                    render() per :448 guard)
			//   Init.ownerAID  = entity.GID     (so any clean()/remove()
			//                                    path that reads
			//                                    _Params.Init.ownerAID
			//                                    does not throw)
			// Through-walls visibility comes from DEPTH_TEST disable in
			// static beforeRender — NOT from null position.
			const Params = {
				effect: {},
				Inst: {
					position: entity.position,
					startTick: 0,
					duration: -1, // infinite (persistent until cleared)
					endTick: -1,
					persistent: true
				},
				Init: {
					ownerAID: entity.GID,
					ownerEntity: entity
				}
			};
			_currentEffect = new TargetIndicator(entity);
			EffectManager.add(_currentEffect, Params);
		}
	});
}

export default { install, Effect: TargetIndicator };

// Auto-install on import. Idempotent — safe if TargetManager already loaded
// and safe if multiple modules import this file. Wires the controller so
// Wave-2 consumers (or the map-entry bootstrap) only need to import this
// module for the arrow to start tracking the target.
install();
