import Vue from 'vue';

import { LANG, CSS_NS } from '../constants/constants.js';


export default Vue.extend( {

	props: {},

	data () {

		return {

			current: 0,

		}

	},

	template: `
		<transition type="transition" appear>
			<div class="${CSS_NS}-Intro">
				<div class="${CSS_NS}-Intro__Inner">
					<template v-if="current === 0">
						<div class="${CSS_NS}-Intro__Item">
							<img
								class="${CSS_NS}-Intro__ItemImage"
								src="./static/img/icon_01.svg"
								alt=""
							/>
							${
								( LANG === 'ja' ) ?
									'マウスドラッグ / スワイプで回転できます' :
									'Mouse drag / Touch move to rotate'
							}
						</div>
					</template>
					<template v-if="current === 1">
						<div class="${CSS_NS}-Intro__Item">
							<img
								class="${CSS_NS}-Intro__ItemImage"
								src="./static/img/icon_02.svg"
								alt=""
							/>
							${
								( LANG === 'ja' ) ?
									'addボタンをクリックして追加しよう！' :
									'Click add button to call more!'
							}
						</div>
					</template>
				</div>
			</div>
		</transition>
	`,

	created () {

	},

	mounted () {

		const duration = 3000;

		setTimeout( () => {

			this.current = 1;

		}, duration );

		setTimeout( () => {

			this.$emit( 'gameReady' );

		}, duration * 2 );

	},

} );
