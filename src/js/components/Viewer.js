import Vue from 'vue';
import * as THREE from 'THREE';
import CANNON from 'CANNON';
import createOrbitControlsClass from 'three-orbit-controls';

import { CSS_NS } from '../constants/constants.js';
import HouseObject from './HouseObject.js';
import SnowObject from './SnowObject.js';
import GroundObject from './GroundObject.js';
import SantaObject from './SantaObject.js';

const OrbitControls = createOrbitControlsClass( THREE );

export default Vue.extend( {

	props: {

		santaLength: Number,

	},

	data () {

		return {

			width: 0,
			height: 0,
			delta: 0,
			elapsed: 0,

		}

	},

	components: {

		HouseObject,
		SnowObject,
		GroundObject,
		SantaObject,

	},

	template: `
		<div class="${CSS_NS}-Viewer">
			<canvas
				class="${CSS_NS}-Viewer__Canvas"
				ref="canvas"
			>
				<HouseObject
					:getWorld="getWorld"
					:getScene="getScene"
				/>
				<SnowObject
					:getWorld="getWorld"
					:getScene="getScene"
					:elapsed="elapsed"
					:viewHeight="height"
				/>
				<GroundObject
					:getWorld="getWorld"
					:getScene="getScene"
				/>
				<template v-for=" i in santaLength ">
					<SantaObject
						:getWorld="getWorld"
						:getScene="getScene"
						:elapsed="elapsed"
						:debugMode="false"
					/>
				</template>
			</canvas>
		</div>
	`,

	created () {

		this.world = new CANNON.World( {
			allowSleep: true,
			quatNormalizeSkip: 1
		} );
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.world.gravity.set( 0, -10, 0 );

		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		// this.scene.fog = new THREE.Fog( 0x222233, 2, 10 );
		// this.scene.add( new THREE.AxisHelper( 10 ) );

	},

	mounted () {

		const clearColor = 0x222233;

		this.width  = this.$el.clientWidth;
		this.height = this.$el.clientHeight;

		this.objects = [];

		this.camera = new THREE.PerspectiveCamera( 24, this.width / this.height, 1, 1000 );
		this.camera.position.set( 14, 20, 14 );

		this.renderer = new THREE.WebGLRenderer( { canvas: this.$refs.canvas } );
		this.renderer.setSize( this.width, this.height );
		this.renderer.setClearColor ( clearColor );
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.BasicShadowMap;
		// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.target.set( 0, 7.5, 0 );
		this.controls.minDistance = 8;
		this.controls.maxDistance = 40;
		this.controls.maxPolarAngle = 100 * THREE.Math.DEG2RAD;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;
		this.controls.zoomSpeed = 0.5;
		this.controls.rotateSpeed = 0.3;
		this.controls.enablePan = false;

		this.scene.add( new THREE.AmbientLight( 0x666688 ) );
		this.scene.add( new THREE.HemisphereLight( 0x333344, 0x222233, 1 ) );

		const dirLight = new THREE.DirectionalLight( 0x333333, 0.1 );
		dirLight.position.set( 2, 20, 0 );
		dirLight.castShadow = true;
		dirLight.shadow.camera.near    = 1;
		dirLight.shadow.camera.far     = 100;
		dirLight.shadow.camera.right   =  10;
		dirLight.shadow.camera.left    = -10;
		dirLight.shadow.camera.top     =  10;
		dirLight.shadow.camera.bottom  = -10;
		dirLight.shadow.mapSize.width  = 256;
		dirLight.shadow.mapSize.height = 256;
		dirLight.shadow.bias = 0.01;
		// this.scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
		this.scene.add( dirLight );


		this.onresize = function () {

			this.width  = this.$el.clientWidth;
			this.height = this.$el.clientHeight;

			// TODO watchに移す?
			this.renderer.setSize( this.width, this.height );
			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();

		}.bind( this );

		window.addEventListener( 'resize', this.onresize );

		this.update();

	},

	methods: {

		getWorld () {

			return this.world;

		},

		getScene () {

			return this.scene;

		},

		addObject ( object ) {

			this.objects.push( object );

		},

		update () {

			this.delta   = this.clock.getDelta();
			this.elapsed = this.clock.getElapsedTime();

			// if ( 20 < this.elapsed ) { return; }

			requestAnimationFrame( this.update );
			this.updatePhysics();
			// TODO 
			// elapsedをwatchして更新しているから
			// 1フレーム前になってしまっている
			this.render();

		},

		updatePhysics ( delta ) {

			this.world.step( Math.min( this.delta, 0.1 ) );

		},

		render () {

			this.controls.update();
			this.renderer.render( this.scene, this.camera );

		},

	},

} );
