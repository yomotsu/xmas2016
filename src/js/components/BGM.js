import Vue from 'vue';

import { CSS_NS } from '../constants/constants.js';
import zipFileManager from '../utils/zipFileManager.js';

const assetUrl = 'assets/bgm.mp3';

export default Vue.extend( {

	props: {},

	components: {},

	template: `<div class="${CSS_NS}-BGM"></div>`,

	mounted () {

		zipFileManager.loadAudio( assetUrl ).then( ( audio ) => {

			this.audio = audio;
			this.audio.loop = true;
			this.audio.play();

		} );

	},

} );
