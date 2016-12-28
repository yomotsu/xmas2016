import Vue from 'vue';

import { LANG, CSS_NS } from '../constants/constants.js';


export default Vue.extend( {

	props: {},

	data () {

		return {

			show: false,
			onSantaAdded: Function,

		}

	},

	template: `
		<div class="${CSS_NS}-Info">
			<div class="${CSS_NS}-Info__Toolbar">
				<button
					type="button"
					class="${CSS_NS}-Info__Button"
					@click="togglePanel"
				>
					<img
						class="${CSS_NS}-Intro__InfoIcon"
						src="./static/img/icon_03.svg"
						alt=""
					/>
				</button>
			</div>
			<template v-if="show">
				<transition type="transition" appear>
					<div
						class="${CSS_NS}-Info__Panel"
						@click.self="closePanel"
					>
						<div class="${CSS_NS}-Info__PanelInner">
							<h2 class="${CSS_NS}-Info__Heading">Author</h2>
							<ul>
								<li><a href="https://twitter.com/yomotsu">@yomotsu</a></li>
							</ul>
							<h2 class="${CSS_NS}-Info__Heading">Copyrights</h2>
							<ul>
								<li>Santa Model: <a href="http://seiga.nicovideo.jp/seiga/im2676471">割と資本主義的なサンタクロース</a> by Paya 
								</li>
								<li>BGM: <a href="https://www.freesound.org/people/Setuniman/sounds/170914/">happy again 0X20pic</a> by Setuniman</li>
							</ul>
							<div class="${CSS_NS}-Info__PanelCloseButtonOuter">
								<button
									type="button"
									class="${CSS_NS}-Info__PanelCloseButton"
									@click="closePanel"
								>
									close
								</button>
							</div>
						</div>
					</div>
				</template>
			</transition>
		</div>
	`,

	methods: {

		togglePanel () {

			this.show = !this.show;

		},

		closePanel () {

			this.show = false;

		},

	},

} );
