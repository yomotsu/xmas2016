
'use strict';

const vertexShader = `
attribute vec3 direction;
uniform float time;
uniform float width;
uniform float height;
uniform float depth;
// varying float debug;

void main () {

	vec3 box = vec3( width, height, depth );
	vec3 pos = position + direction * time * vec3( 5., 10., 5. );
	pos = mod( pos, box ) - ( box * 0.5 );

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
	gl_PointSize = 150.0 / - mvPosition.z;

}
`;

const fragmentShader = `
uniform sampler2D texture;
varying float debug;

void main() {

	vec3 color = vec3( 1. );
	gl_FragColor = texture2D( texture, vec2( gl_PointCoord ) );
	// gl_FragColor = vec4( debug, 1., 1., 1. );

}
`;

const texture = new THREE.Texture();
texture.image = new Image();
texture.image.onload = function () { texture.needsUpdate = true; };
texture.image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABNElEQVR4Ae2UJVhEQRSFsby94Zq3YX0r7u5OpH+4NqQHXOtLRBzaViQuDYefi609mfcxdc/4tfETF4MZ+IBq4mkgJShLkVG8SMGnDuDlnRs6gIWgbAHoFOk73jg1WAE+eCIzKMnkSSSwonYu5w8TNDL8LRumkfGgvNQ5QAHHkq6AQx65I1HSHU8yQqSio0C9ijx6eATggiVJFwAi6SHP3T2sYYc1dwHSGcEMRJru5JZFkdRJeKTexwoHovGQJHURWeYABk9kMC11D3bo4YlpMqU2zAHqgG1qUKGWbaAu0nmTAPcAUisQtAuwqR9Acws2h/hMH3YY4Dl4iI7XeKC4xmKy9B+S/lN285n8rEnyu/xMpu/89I/vTAV/GKcpSCjNjLkkFG1KC5Jqp4lUu+xJVZPWY/gEUevVvuohObYAAAAASUVORK5CYII=';

const Snow = function ( width ,height ,depth ,particleLength ) {

	THREE.Points.call( this );

	this.geometry = new THREE.BufferGeometry();

	var positions = new Float32Array( particleLength * 3 );
	var directions = new Float32Array( particleLength * 3 );

	for ( let i = 0; i < particleLength; i += 3 ) {

		const x = Math.random() * width  - width  * 0.5;
		const y = Math.random() * height - height * 0.5;
		const z = Math.random() * depth  - depth  * 0.5;

		positions[ i ]     = x;
		positions[ i + 1 ] = y;
		positions[ i + 2 ] = z;

		directions[ i ]     = Math.random() * 2 - 1;
		directions[ i + 1 ] = -( Math.random() * 0.5 + 0.5 );
		directions[ i + 2 ] = Math.random() * 2 - 1;

	}

	this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	this.geometry.addAttribute( 'direction', new THREE.BufferAttribute( directions, 3 ) );

	this.material = new THREE.ShaderMaterial( {
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
			time   : { value: 0 },
			width  : { value: width },
			height : { value: depth },
			depth  : { value: height },
			texture: { value: texture }
		},
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false
	} );

}

Snow.prototype = Object.assign( Object.create( THREE.Points.prototype ), {

	update: function ( elapsed ) {

		this.material.uniforms.time.value = elapsed;

	}

} );
