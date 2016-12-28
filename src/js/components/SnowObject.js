import Vue from 'vue';
import * as THREE from 'THREE';

import { CSS_NS } from '../constants/constants.js';
import SnowMesh from '../libs/SnowMesh.js';


export default Vue.extend( {

	props: {
		getWorld: Function,
		getScene: Function,
		elapsed: Number,
		viewHeight: Number,
	},

	components: {},

	template: `
		<div class="${CSS_NS}-SnowObject"></div>
	`,

	mounted () {

		const scene = this.getScene();
		this.snowMesh = new SnowMesh( 64, 64, 20, 5000, this.viewHeight * 0.5 );
		this.snowMesh.position.y = 10;
		scene.add( this.snowMesh );

	},

	watch: {

		elapsed: {
			handler () {

				this.snowMesh.material.uniforms.time.value = this.elapsed;

			}
		},

		viewHeight: {
			handler () {

				this.snowMesh.material.uniforms.scale.value = this.viewHeight * 0.5;

			}
		},

	},

} );
