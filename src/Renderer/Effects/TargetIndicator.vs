#version 300 es
#pragma vscode_glsllint_stage : vert
precision highp float;

// TargetIndicator vertex shader (Phase 12 plan 12-07, D-03/D-15).
// Billboards a vertical quad above the target entity's head.

in vec2 aPosition;   // quad corner in [-0.5, 0.5]
in vec2 aTexCoord;   // uv in [0, 1]

uniform vec3  uTargetPos;   // target entity.position (live reference, world tile coords)
uniform float uBobOffset;   // vertical world-Y offset (head height + sin wave)
uniform float uSize;        // arrow half-size in world units
uniform mat4  uModelViewMat;
uniform mat4  uProjectionMat;

out vec2 vTexCoord;

void main(void) {
	// Canonical RO coordinate swizzle (matches LockOnTarget.vs:18 and
	// GroundAura.vs:35-39): entity.position is stored as [tileX, tileY, alt]
	// and converted to OpenGL world space (worldX, worldY_up, worldZ_depth):
	//   worldX = pos.x + 0.5
	//   worldY = -pos.z         (OpenGL +Y = up)
	//   worldZ = pos.y + 0.5
	// The arrow quad is vertical (faces the camera in RO's isometric view):
	// aPosition.x spans world-X (horizontal width), aPosition.y spans
	// world-Y (vertical height). uBobOffset lifts the arrow above the head.
	vec3 worldPos = vec3(
		uTargetPos.x + 0.5 + aPosition.x * uSize,
		-uTargetPos.z + uBobOffset + aPosition.y * uSize,
		uTargetPos.y + 0.5
	);
	gl_Position = uProjectionMat * uModelViewMat * vec4(worldPos, 1.0);
	vTexCoord = aTexCoord;
}
