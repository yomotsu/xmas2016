import Vue from 'vue';
import * as THREE from 'THREE';
import CANNON from 'CANNON';

import { CSS_NS } from '../constants/constants.js';
import zipFileManager from '../utils/zipFileManager.js';


const assetUrl = 'assets/house.json';

export default Vue.extend( {

	props: {
		getWorld: Function,
		getScene: Function,
	},

	components: {},

	template: `
		<div class="${CSS_NS}-HouseObject"></div>
	`,

	mounted () {

		zipFileManager.loadThreeJson( assetUrl ).then( ( data ) => {

			const world = this.getWorld();
			const scene = this.getScene();

			const position = new THREE.Vector3( -2, 0, 0 );
			const axisZ = new THREE.Vector3( 0, 0, 1 );

			const geometry = data.geometry;
			const materials = data.materials;
			// materials[ 0 ].wireframe = true;

			// mesh
			const mesh = new THREE.Mesh(
				geometry,
				new THREE.MultiMaterial( materials )
			);
			mesh.position.copy( position );
			// mesh.castShadow = true;
			mesh.receiveShadow = true;
			scene.add( mesh );


			// bodies
			const roof1 = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 3, 0.2, 4 ) ),
				position: new CANNON.Vec3( 2, 6, 0 ).vadd( position ),
				quaternion: new THREE.Quaternion().setFromAxisAngle( axisZ, -48 * THREE.Math.DEG2RAD )
			} );
			world.addBody( roof1 );
			// debugVisual( roof1, scene );

			const roof2 = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 3, 0.2, 4 ) ),
				position: new CANNON.Vec3( -2, 6, 0 ).vadd( position ),
				quaternion: new THREE.Quaternion().setFromAxisAngle( axisZ,  48 * THREE.Math.DEG2RAD )
			} );
			world.addBody( roof2 );
			// debugVisual( roof2, scene );


			const chimneyF = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 0.6, 1.5, 0.15 ) ),
				position: new CANNON.Vec3( 1.9, 6.5, 0.5 ).vadd( position )
			} );
			world.addBody( chimneyF );
			// debugVisual( chimneyF, scene );

			const chimneyB = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 0.6, 1.5, 0.15 ) ),
				position: new CANNON.Vec3( 1.9, 6.5, -0.5 ).vadd( position )
			} );
			world.addBody( chimneyB );
			// debugVisual( chimneyB, scene );

			const chimneyR = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 0.15, 1.5, 0.6 ) ),
				position: new CANNON.Vec3( 2.4, 6.5, 0 ).vadd( position )
			} );
			world.addBody( chimneyR );
			// debugVisual( chimneyR, scene );

			const chimneyL = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 0.15, 1.5, 0.6 ) ),
				position: new CANNON.Vec3( 1.4, 6.5, 0 ).vadd( position )
			} );
			world.addBody( chimneyL );
			// debugVisual( chimneyL, scene );

			const body = new CANNON.Body( {
				mass: 0,
				shape: new CANNON.Box( new CANNON.Vec3( 3, 2, 4 ) ),
				position: new CANNON.Vec3( 0, 2, 0 ).vadd( position )
			} );
			world.addBody( body );
			// debugVisual( body, scene );

		} );

	}

} );
