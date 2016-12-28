import Vue from 'vue';

import { CSS_NS } from '../constants/constants.js';

export default Vue.extend( {

	props: {

		loaded: Boolean,
		loadedData: Number,
		totalData: Number,

	},

	data () {

		return {

			current: 0,

		}

	},

  computed: {

		loadProgress () { return this.loadedData / this.totalData; }

	},

	components: {},

	template: `
	<transition type="transition" appear>
		<div
			class="${CSS_NS}-Splash"
		>
			<div class="${CSS_NS}-Splash__Inner">
				<div class="${CSS_NS}-Splash__Title">
					<div class="${CSS_NS}-Splash__TitleMain">Happy Holidays</div>
					<div class="${CSS_NS}-Splash__TitleSub">2016</div>
					<div class="${CSS_NS}-Splash__TitleLogo"></div>
					<div class="${CSS_NS}-Splash__Author">by Yomotsu</div>
				</div>

				<div class="${CSS_NS}-Splash__StartButtonOuter">
					<button
						type="button"
						class="${CSS_NS}-Splash__StartButton"
						@click="start"
						v-bind:disabled="!loaded"
					>
						<template v-if="loaded">
							Start
						</template>
						<template v-else>
							Loading
						</template>
					</button>
				</div>
				

				<div class="${CSS_NS}-Splash__ProgressBar">
					<div
						class="${CSS_NS}-Splash__ProgressBarIcon"
						v-bind:style="{ left: ( loadProgress * 100 ) + '%' }"
					></div>
					<div class="${CSS_NS}-Splash__ProgressBarTrack">
						<div
							class="${CSS_NS}-Splash__ProgressBarValue"
							v-bind:style="{ width: ( loadProgress * 100 ) + '%' }"
						></div>
					</div>
					<div
						class="${CSS_NS}-Splash__ProgressBarPercentage"
						v-bind:style="{ left: ( loadProgress * 100 ) + '%' }"
					>
						{{ ( ( loadProgress * 100 )|0 ) }}%
					</div>
					<div class="${CSS_NS}-Splash__ProgressBarData">
						{{ loadedData }} / {{ totalData }} loaded
					</div>
				</div>
			</div>
		</div>
	</transition>
	`,

	methods: {

		start () {

			if ( !this.loaded ) { return; }

			this.$emit( 'userReady' );

		},

	},

	watch: {},

} );
