import Vue from 'vue';

import { CSS_NS } from '../constants/constants.js';
import AssetsManager from './AssetsManager.js';
import Splash from './Splash.js';
import Intro from './Intro.js';
import AddButton from './AddButton.js';
import Viewer from './Viewer.js';
import Voice from './Voice.js';
import BGM from './BGM.js';
import Info from './Info.js';

export default new Vue( {

	data () {

		return {

			userReady: false,
			gameReady: false,
			loaded: false,
			loadedData: 0,
			totalData: 0,
			santaLength: 0,

		};

	},

	components: {

		AssetsManager,
		Splash,
		Intro,
		AddButton,
		Viewer,
		Voice,
		BGM,
		Info,

	},

	template: `
		<div class="${CSS_NS}-Root">
			<AssetsManager
				url="static/assets.zip"
				@loadProgress="onLoadProgress"
				@load="onLoad"
			/>
			<template v-if="!userReady || !loaded">
				<Splash
					:loaded="loaded"
					:loadedData="loadedData"
					:totalData="totalData"
					@userReady="onUserReady"
				/>
			</template>
			<template v-if="userReady && loaded">
					<template v-if="!gameReady">
						<Intro @gameReady="onGameReady" />
					</template>
					<AddButton @click="addSanta" />
					<Viewer :santaLength="santaLength" />
					<Voice ref="voice" />
					<BGM />
				</template>
			<Info />
		</div>
	`,

	mounted () {},

	methods: {

		onLoadProgress ( loadedData, totalData ) {

			this.loadedData = loadedData;
			this.totalData = totalData;

		},

		onLoad () {

			this.loaded = true;
			console.log( 'loaded' );

		},

		onUserReady () {

			this.userReady = true;

		},

		onGameReady () {

			this.gameReady = true;
			this.addSanta();

		},

		addSanta () {

			this.santaLength ++;
			this.$refs.voice.play();

		},

	},

} );
