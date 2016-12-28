import Vue from 'vue';

import { CSS_NS } from '../constants/constants.js';
import zipFileManager from '../utils/zipFileManager.js';

const assetUrl = 'assets/ho.mp3';

export default Vue.extend( {

	props: {},

	data () {

		return {

			ready: false,
			current: 0,

		}

	},

	components: {},

	template: `
	<div class="${CSS_NS}-Voice"></div>
	`,

	created () {

		this.pool = [];

		zipFileManager.loadAudio( assetUrl ).then( ( audio ) => {

			this.pool.push(
				audio.cloneNode( true ),
				audio.cloneNode( true ),
				audio.cloneNode( true ),
				audio.cloneNode( true ),
				audio.cloneNode( true )
			);
			this.ready = true;

		} );

	},

	methods: {

		play () {

			this.current = this.current >= this.pool.length - 1 ? 0 : this.current + 1;
			this.pool[ this.current ].play();

		},

	},

} );
