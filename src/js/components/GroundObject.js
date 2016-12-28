import Vue from 'vue';
import * as THREE from 'THREE';
import CANNON from 'CANNON';

import { CSS_NS } from '../constants/constants.js';
import zipFileManager from '../utils/zipFileManager.js';


const assetUrl = 'assets/ground.jpg';
const loader = new THREE.TextureLoader();

export default Vue.extend( {

	props: {
		getWorld: Function,
		getScene: Function,
	},

	components: {},

	template: `
		<div class="${CSS_NS}-GroundObject"></div>
	`,

	mounted () {

		const world = this.getWorld();
		const scene = this.getScene();
		const texture = zipFileManager.loadTexture( assetUrl );

		const groundShape = new CANNON.Box( new CANNON.Vec3( 256, .2, 256 ) );
		const groundBody = new CANNON.Body( { mass: 0 } );
		groundBody.addShape( groundShape );
		world.add( groundBody );

		const geometry = new THREE.BoxGeometry(
			groundShape.halfExtents.x * 2,
			groundShape.halfExtents.y * 2,
			groundShape.halfExtents.z * 2
		);

		const material = new THREE.MeshPhongMaterial( { map: texture } );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4, 4 );

		const mesh = new THREE.Mesh( geometry, material )
		mesh.receiveShadow = true;

		scene.add( mesh );

	}

} );
