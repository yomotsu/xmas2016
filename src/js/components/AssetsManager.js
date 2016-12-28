import Vue from 'vue';

import { CSS_NS } from '../constants/constants.js';
import zipFileManager from '../utils/zipFileManager.js';

const files = {};

export default Vue.extend( {

	props: {
		url: String,
	},

	created () {

		this.loadZipAsBlob( this.url );

	},

	template: `
		<div class="${CSS_NS}-AssetsManager"></div>
	`,

	methods: {

		loadZipAsBlob () {

			const xhr = new XMLHttpRequest();
			xhr.open( 'GET', this.url, true );
			xhr.responseType = 'arraybuffer';

			xhr.onprogress = ( e ) => {

				this.$emit( 'loadProgress', e.loaded, e.total );

			};

			xhr.onload = ( e ) => {

				this.$emit( 'loadProgress', e.loaded, e.total );

				zipFileManager.extract( new Int8Array( xhr.response ) ).then( () => {

					this.$emit( 'load' );

				} );

			};

			xhr.send();

		},

	}

} );
