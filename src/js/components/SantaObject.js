import Vue from 'vue';
import * as THREE from 'THREE';
import CANNON from 'CANNON';

import { CSS_NS } from '../constants/constants.js';
import zipFileManager from '../utils/zipFileManager.js';

const assetUrl = 'assets/santa.json';
let mesh;

export default Vue.extend( {

	props: {
		getWorld: Function,
		getScene: Function,
		elapsed: Number,
		debugMode: Boolean,
	},

	data () {

		return {

			ready: false,

		}

	},

	components: {},

	template: `
		<div class="${CSS_NS}-SantaObject"></div>
	`,

	mounted () {

		const world = this.getWorld();
		const scene = this.getScene();
		const startPosition = new THREE.Vector3( 0, 16, 0 );

		this.cacheObject().then( () => {

			this.body = createRagdoll( world );

			this.mesh = new THREE.SkinnedMesh(
				mesh.geometry,
				mesh.material
			);
			this.mesh.castShadow = true;

			scene.add( this.mesh );

			const bones = this.mesh.skeleton.bones;
			this.skelton = {
				head       : bones.find( ( b ) => { return b.name === 'head' } ),
				upperBody  : bones.find( ( b ) => { return b.name === 'upperBody' } ),
				upperArmR  : bones.find( ( b ) => { return b.name === 'upperArmR' } ),
				lowerArmR  : bones.find( ( b ) => { return b.name === 'lowerArmR' } ),
				upperArmL  : bones.find( ( b ) => { return b.name === 'upperArmL' } ),
				lowerArmL  : bones.find( ( b ) => { return b.name === 'lowerArmL' } ),
				pelvis     : bones.find( ( b ) => { return b.name === 'pelvis' } ),
				upperLegL  : bones.find( ( b ) => { return b.name === 'upperLegR' } ),
				lowerLegL  : bones.find( ( b ) => { return b.name === 'lowerLegR' } ),
				upperLegR  : bones.find( ( b ) => { return b.name === 'upperLegL' } ),
				lowerLegR  : bones.find( ( b ) => { return b.name === 'lowerLegL' } )
			};

			this.debugVisuals = [];

			for ( let key in this.body ) {

				const debugVisual = getDebugVisual( this.body[ key ] );
				this.debugVisuals.push( debugVisual );
				scene.add( debugVisual.visual );

				if ( !this.debugMode ) { debugVisual.visual.visible = false; }

			}

			this.setPosition( startPosition );
			this.ready = true;

		} );

	},

	methods: {

		cacheObject () {

			const promise = new Promise( ( resolve, reject ) => {

				if ( !!mesh ) { resolve(); }

				zipFileManager.loadThreeJson( assetUrl ).then( ( data ) => {

					const geometry = data.geometry;
					const materials = data.materials;
					materials[ 0 ].skinning = true;
					// materials[ 0 ].wireframe = true;

					mesh = new THREE.SkinnedMesh(
						geometry,
						new THREE.MultiMaterial( materials )
					);

					resolve();

				} );

			} );

			return promise;

		},

		update () {

			const position = this.body.pelvis.position;
			this.mesh.position.copy( position );
			// mesh.position.x += 2;
			for ( let key in this.skelton ) {

				this.skelton[ key ].position.copy( this.body[ key ].position ).sub( position );
				this.skelton[ key ].quaternion.copy( this.body[ key ].quaternion );

			}

			if ( this.debugMode ) {

				this.debugVisuals.forEach( ( el ) => {
					
					el.visual.position.copy( el.body.position );
					el.visual.quaternion.copy( el.body.quaternion );

				} );

			}

		},

		setPosition ( x, y, z ) {

			const position = new CANNON.Vec3( x, y, z );

			if ( x.isVector3 || x instanceof CANNON.Vec3 ) {

				position.copy( x );

			} else {

				position.set( x, y, z );

			}

			for ( let i in this.body ) {

				this.body[ i ].position.vadd( position, this.body[ i ].position );

			}

		},

	},

	watch: {

		elapsed: {
			handler () {

				if ( this.ready ) { this.update(); }

			}
		},

	},

} );


function getDebugVisual ( body ) {

	const shape = body.shapes[ 0 ];
	let mesh;

	switch ( shape.type ) {

		case CANNON.Shape.types.SPHERE:
			const sphere_geometry = new THREE.SphereGeometry( shape.radius, 8, 8 );
			mesh = new THREE.Mesh( sphere_geometry );
			break;

		case CANNON.Shape.types.BOX:
			const box_geometry = new THREE.BoxGeometry(
				shape.halfExtents.x * 2,
				shape.halfExtents.y * 2,
				shape.halfExtents.z * 2
			);
			mesh = new THREE.Mesh( box_geometry );
			break;

	}

	mesh.material.wireframe = true;

	return {
		body: body,
		visual: mesh
	};

}



function createRagdoll ( world, position ) {

	const body = {};

	const weight = 80; // Kg
	const angleA     = Math.PI / 4;
	const angleB     = Math.PI / 3; 
	const twistAngle = Math.PI / 8;

	const shouldersDistance = 0.5,
	      thighsDistance    = 0.3,
	      upperArmLength    = 0.2,
	      lowerArmLength    = 0.4,
	      upperArmSize      = 0.2,
	      lowerArmSize      = 0.15,
	      neckLength        = 0.1,
	      headRadius        = 0.2,
	      upperBodyLength   = 0.4,
	      pelvisLength      = 0.2,
	      upperLegLength    = 0.3,
	      upperLegSize      = 0.2,
	      lowerLegLength    = 0.4,
	      lowerLegSize      = 0.2,
	      // weights ---
	      upperArmWeight   = weight * 0.3 * 0.5,
	      lowerArmWeight   = weight * 0.2 * 0.5,
	      headWeight       = weight * 0.8,
	      upperBodyWeight  = weight * 0.3,
	      pelvisWeight     = weight * 0.22,
	      upperLegWeight   = weight * 0.10 * 0.5,
	      lowerLegWeight   = weight * 0.5  * 0.5;



	const headShape      = new CANNON.Sphere( headRadius );
	const upperArmShape  = new CANNON.Box(
		new CANNON.Vec3(
			upperArmLength * 0.5,
			upperArmSize   * 0.5,
			upperArmSize   * 0.5
		)
	);
	const lowerArmShape  = new CANNON.Box(
		new CANNON.Vec3(
			lowerArmLength * 0.5,
			lowerArmSize   * 0.5,
			lowerArmSize   * 0.5
		)
	);
	const upperBodyShape = new CANNON.Box(
		new CANNON.Vec3(
			shouldersDistance * 0.5,
			upperBodyLength   * 0.5,
			lowerArmSize      * 0.5
		)
	);
	const pelvisShape    = new CANNON.Box(
		new CANNON.Vec3(
			shouldersDistance * 0.5,
			pelvisLength      * 0.5,
			lowerArmSize      * 0.5
		)
	);
	const upperLegShape  = new CANNON.Box(
		new CANNON.Vec3(
			upperLegSize   * 0.5,
			upperLegLength * 0.5,
			lowerArmSize   * 0.5
		)
	);
	var lowerLegShape  = new CANNON.Box(
		new CANNON.Vec3(
			lowerLegSize   * 0.5,
			lowerLegLength * 0.5,
			lowerArmSize   * 0.5
		)
	);


	// Lower legs
	body.lowerLegL = new CANNON.Body( {
		mass: lowerLegWeight,
		position: new CANNON.Vec3( -thighsDistance / 2, lowerLegLength / 2, 0 )
	} );
	body.lowerLegR = new CANNON.Body( {
		mass: lowerLegWeight,
		position: new CANNON.Vec3(  thighsDistance / 2, lowerLegLength / 2, 0 )
	} );
	body.lowerLegL.addShape( lowerLegShape );
	body.lowerLegR.addShape( lowerLegShape );
	world.addBody( body.lowerLegL );
	world.addBody( body.lowerLegR );
	// debugVisuals.add( body.lowerLegR );
	// debugVisuals.add( body.lowerLegL );


	// Upper legs
	body.upperLegL = new CANNON.Body( {
		mass: upperLegWeight,
		position: new CANNON.Vec3(
			-thighsDistance / 2,
			body.lowerLegL.position.y + lowerLegLength / 2 + upperLegLength / 2,
			0
		)
	} );
	body.upperLegR = new CANNON.Body( {
		mass: upperLegWeight,
		position: new CANNON.Vec3(
			thighsDistance / 2,
			body.lowerLegR.position.y + lowerLegLength / 2 + upperLegLength / 2,
			0
		)
	} );
	body.upperLegL.addShape( upperLegShape );
	body.upperLegR.addShape( upperLegShape );
	world.addBody( body.upperLegL );
	world.addBody( body.upperLegR );
	// debugVisuals.add( body.upperLegL );
	// debugVisuals.add( body.upperLegR );


	// Pelvis
	body.pelvis = new CANNON.Body( {
		mass: pelvisWeight,
		position: new CANNON.Vec3(
			0,
			body.upperLegL.position.y + upperLegLength / 2 + pelvisLength / 2,
			0
		)
	} );
	body.pelvis.addShape( pelvisShape );
	world.addBody( body.pelvis );
	// debugVisuals.add( body.pelvis );

	// Upper body
	body.upperBody = new CANNON.Body( {
		mass: upperBodyWeight,
		position: new CANNON.Vec3(
			0,
			body.pelvis.position.y + pelvisLength / 2 + upperBodyLength / 2,
			0
		)
	} );
	body.upperBody.addShape( upperBodyShape );
	world.addBody( body.upperBody );
	// debugVisuals.add( body.upperBody );


	// Head
	body.head = new CANNON.Body( {
		mass: headWeight,
		position: new CANNON.Vec3(
			0,
			body.upperBody.position.y + upperBodyLength / 2 + headRadius + neckLength,
			0
		)
	} );
	body.head.addShape( headShape );
	world.addBody( body.head );
	// debugVisuals.add( body.head );


	// Upper arms
	body.upperArmL = new CANNON.Body( {
		mass: upperArmWeight,
		position: new CANNON.Vec3(
			shouldersDistance / 2 + upperArmLength / 2,
			body.upperBody.position.y + upperBodyLength / 2,
			0
		)
	} );
	body.upperArmR = new CANNON.Body( {
		mass: upperArmWeight,
		position: new CANNON.Vec3(
			-shouldersDistance / 2 -upperArmLength / 2,
			body.upperBody.position.y + upperBodyLength / 2,
			0
		),
	} );
	body.upperArmL.addShape( upperArmShape );
	body.upperArmR.addShape( upperArmShape );
	world.addBody( body.upperArmL );
	world.addBody( body.upperArmR );
	// debugVisuals.add( body.upperArmL );
	// debugVisuals.add( body.upperArmR );


	// lower arms
	body.lowerArmL = new CANNON.Body( {
		mass: lowerArmWeight,
		position: new CANNON.Vec3(
			-body.upperArmR.position.x + lowerArmLength / 2 + upperArmLength/2,
			body.upperArmR.position.y,
			0
		)
	} );
	body.lowerArmR = new CANNON.Body( {
		mass: lowerArmWeight,
		position: new CANNON.Vec3(
			-body.upperArmL.position.x - lowerArmLength / 2 - upperArmLength/2,
			body.upperArmL.position.y,
			0
		)
	} );
	body.lowerArmL.addShape( lowerArmShape );
	body.lowerArmR.addShape( lowerArmShape );
	world.addBody( body.lowerArmL );
	world.addBody( body.lowerArmR );
	// debugVisuals.add( body.lowerArmL );
	// debugVisuals.add( body.lowerArmR );


	// JOINTS ---

	// Neck joint
	const neckJoint = new CANNON.ConeTwistConstraint(
		body.head,
		body.upperBody,
		{
			pivotA: new CANNON.Vec3( 0, -headRadius - neckLength / 2, 0 ),
			pivotB: new CANNON.Vec3( 0, upperBodyLength / 2, 0 ),
			axisA: CANNON.Vec3.UNIT_Y,
			axisB: CANNON.Vec3.UNIT_Y,
			angle: Math.PI * 0.2 * 0,
			twistAngle: twistAngle
		} );
	world.addConstraint( neckJoint );

	// Knee joints
	const leftKneeJoint = new CANNON.ConeTwistConstraint(
		body.lowerLegL,
		body.upperLegL,
		{
			pivotA: new CANNON.Vec3( 0,  lowerLegLength / 2, 0 ),
			pivotB: new CANNON.Vec3( 0, -upperLegLength / 2, 0 ),
			axisA: CANNON.Vec3.UNIT_Y,
			axisB: CANNON.Vec3.UNIT_Y,
			angle: angleA,
			twistAngle: twistAngle
		}
	);
	const rightKneeJoint= new CANNON.ConeTwistConstraint(
		body.lowerLegR,
		body.upperLegR,
		{
			pivotA: new CANNON.Vec3( 0,  lowerLegLength / 2, 0 ),
			pivotB: new CANNON.Vec3( 0, -upperLegLength / 2, 0 ),
			axisA: CANNON.Vec3.UNIT_Y,
			axisB: CANNON.Vec3.UNIT_Y,
			angle: angleA,
			twistAngle: twistAngle
		}
	);
	world.addConstraint( leftKneeJoint );
	world.addConstraint( rightKneeJoint );

	// Hip joints
	const leftHipJoint = new CANNON.ConeTwistConstraint(
			body.upperLegL,
			body.pelvis, {
				pivotA: new CANNON.Vec3( 0, upperLegLength / 2, 0 ),
				pivotB: new CANNON.Vec3( -thighsDistance / 2, -pelvisLength /2, 0 ),
				axisA: CANNON.Vec3.UNIT_Y,
				axisB: CANNON.Vec3.UNIT_Y,
				angle: angleA,
				twistAngle: twistAngle
			}
		);
	const rightHipJoint = new CANNON.ConeTwistConstraint(
		body.upperLegR,
		body.pelvis, {
			pivotA: new CANNON.Vec3( 0, upperLegLength / 2, 0 ),
			pivotB: new CANNON.Vec3( thighsDistance / 2, -pelvisLength /2, 0 ),
			axisA: CANNON.Vec3.UNIT_Y,
			axisB: CANNON.Vec3.UNIT_Y,
			angle: angleA,
			twistAngle: twistAngle
		}
	);
	world.addConstraint( leftHipJoint );
	world.addConstraint( rightHipJoint );

	const spineJoint = new CANNON.ConeTwistConstraint(
		body.pelvis,
		body.upperBody,
		{
			pivotA: new CANNON.Vec3( 0, pelvisLength / 2, 0 ),
			pivotB: new CANNON.Vec3( 0, -upperBodyLength / 2, 0 ),
			axisA: CANNON.Vec3.UNIT_Y,
			axisB: CANNON.Vec3.UNIT_Y,
			angle: angleA * 0.5,
			twistAngle: twistAngle
		}
	);
	world.addConstraint( spineJoint );

	// Shoulders
	const leftShoulder = new CANNON.ConeTwistConstraint(
		body.upperBody,
		body.upperArmL,
		{
			pivotA: new CANNON.Vec3( shouldersDistance / 2,  upperBodyLength / 2, 0 ),
			pivotB: new CANNON.Vec3( -upperArmLength / 2, 0, 0 ),
			axisA: CANNON.Vec3.UNIT_X,
			axisB: CANNON.Vec3.UNIT_X,
			angle: angleB
	} );
	const rightShoulder= new CANNON.ConeTwistConstraint(
		body.upperBody,
		body.upperArmR,
		{
			pivotA: new CANNON.Vec3( -shouldersDistance / 2, upperBodyLength / 2, 0 ),
			pivotB: new CANNON.Vec3( upperArmLength / 2, 0, 0 ),
			axisA: CANNON.Vec3.UNIT_X,
			axisB: CANNON.Vec3.UNIT_X,
			angle: angleB,
			twistAngle: twistAngle
		}
	);
	world.addConstraint( leftShoulder );
	world.addConstraint( rightShoulder );

	// Elbow joint
	const leftElbowJoint = new CANNON.ConeTwistConstraint(
		body.lowerArmL,
		body.upperArmL,
		{
			pivotA: new CANNON.Vec3( -lowerArmLength / 2, 0, 0 ),
			pivotB: new CANNON.Vec3( upperArmLength / 2, 0, 0 ),
			axisA: CANNON.Vec3.UNIT_X,
			axisB: CANNON.Vec3.UNIT_X,
			angle: angleA,
			twistAngle: twistAngle
		}
	);
	const rightElbowJoint= new CANNON.ConeTwistConstraint(
		body.lowerArmR,
		body.upperArmR,
		{
			pivotA: new CANNON.Vec3( lowerArmLength / 2, 0, 0 ),
			pivotB: new CANNON.Vec3( -upperArmLength / 2, 0, 0 ),
			axisA: CANNON.Vec3.UNIT_X,
			axisB: CANNON.Vec3.UNIT_X,
			angle: angleA,
			twistAngle: twistAngle
		}
	);
	world.addConstraint( leftElbowJoint );
	world.addConstraint( rightElbowJoint );

	return body;

};
