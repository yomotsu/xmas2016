import Vue from 'vue';

import { CSS_NS } from '../constants/constants.js';

export default Vue.extend( {

	template: `
		<button
			type="button"
			class="${CSS_NS}-AddButton"
			@click="onclick"
		>
			add
		</button>
	`,

	methods: {

		onclick () {

			this.$emit( 'click' );

		},

	},

} );
