#version 300 es
#pragma vscode_glsllint_stage : frag
precision highp float;

// TargetIndicator fragment shader (Phase 12 plan 12-07, D-03/D-20).
// Draws a downward-pointing rounded triangle (SDF) with a silver metallic
// gradient: brighter at top, darker at bottom, with a specular highlight
// band across the upper third. Soft anti-aliased edges.

in vec2 vTexCoord;

uniform float uTick;   // reserved for future shimmer animation (currently unused)

out vec4 fragColor;

// SDF of a downward-pointing rounded triangle.
//   vTexCoord space: (0.5, 0) = bottom-center (tip), (0.5, 1) = top-center.
//   Returns <0 inside, >0 outside.
//   Vertices (in p=uv*2-1 space): TL(-0.8, 0.7), TR(0.8, 0.7), tip(0, -0.9).
//   r = corner radius (D-03: 1-2px expressed in uv units).
float sdTriangleDown(vec2 uv, float r) {
	vec2 p = uv * 2.0 - 1.0;
	// Top edge: interior is below y = 0.7
	float top   = p.y - 0.7;
	// Left edge through (-0.8, 0.7) and (0, -0.9). Interior on its right.
	//   Line: 2x + y + 0.9 = 0; gradient magnitude = sqrt(5) ≈ 2.2360679
	float left  = (-2.0 * p.x - p.y - 0.9) / 2.2360679775;
	// Right edge through (0.8, 0.7) and (0, -0.9). Interior on its left.
	float right = ( 2.0 * p.x - p.y - 0.9) / 2.2360679775;
	return max(max(top, left), right) - r;
}

void main(void) {
	// Soft anti-aliased border via SDF (D-03 rounded corners).
	float dist = sdTriangleDown(vTexCoord, 0.08);
	// Early-out for pixels well outside the triangle (perf: skip shading).
	if (dist > 0.04) discard;

	// Silver metallic gradient (D-03, D-20): brighter at top, darker at bottom.
	float gradient = mix(0.6, 0.95, vTexCoord.y);
	// Specular highlight: a bright band across the upper third, fading
	// horizontally toward the edges to suggest a curved metal surface.
	float verticalBand = smoothstep(0.4, 0.6, vTexCoord.y) * (1.0 - smoothstep(0.7, 0.9, vTexCoord.y));
	float horizFalloff = 1.0 - smoothstep(0.25, 0.5, abs(vTexCoord.x - 0.5) * 2.0);
	float spec = verticalBand * horizFalloff;
	vec3 silver = vec3(0.85, 0.86, 0.88) * gradient + vec3(0.4) * spec;

	// Anti-alias the SDF border (~1px transition).
	float alpha = 1.0 - smoothstep(-0.04, 0.04, dist);
	fragColor = vec4(silver, alpha);
}
