import * as THREE from 'THREE';
import JSZip from 'jszip';

let fileStore;
const threeJsonLoader = new THREE.JSONLoader();

const zipFileManager = {

	extract ( data ) {

		const blob = new Blob( [ data ], { type: 'application/zip' } );
		const zip  = new JSZip();
		const promise = new Promise( ( resolve, reject ) => {

			zip.loadAsync( blob ).then( ( file ) => {

				fileStore = file;
				resolve();

			} );

		} );

		return promise;

	},

	requestFile ( path ) {

		return fileStore.files[ path ];

	},

	loadAudio ( path ) {

		const promise = new Promise( ( resolve, reject ) => {

			fileStore.files[ path ].async( 'arraybuffer' ).then( ( arraybuffer ) => {

				const audio = new Audio();
				const blob = new Blob( [ arraybuffer ], { type: 'audio/mp3' } );
				audio.src = URL.createObjectURL( blob );

				audio.addEventListener( 'loadeddata', ( event ) => {

					URL.revokeObjectURL( event.target.src );
					resolve( audio );

				} );

			} );

		} );

		return promise;

	},

	loadTexture ( path ) {

		const canvas = document.createElement( 'canvas' );
		const ctx    = canvas.getContext( '2d' );
		const texture = new THREE.CanvasTexture( canvas );
		const type = ( /\.jpg$/ ).test( path ) ? 'image/jpeg' :
		             ( /\.png$/ ).test( path ) ? 'image/png' :
		             ( /\.gif$/ ).test( path ) ? 'image/gif' :
		             'unknown';

		canvas.width  = 1024;
		canvas.height = 1024;

		fileStore.files[ path ].async( 'arraybuffer' ).then( ( arraybuffer ) => {

			const blob = new Blob( [ arraybuffer ], { type: type } );
			const image = new Image();

			image.onload = function () {

				const width  = image.naturalWidth;
				const height = image.naturalHeight;

				canvas.width = width;
				canvas.height = height;
				ctx.drawImage( image, 0, 0, width, height );
				texture.needsUpdate = true;
				URL.revokeObjectURL( image.src );

			}

			image.src = URL.createObjectURL( blob );

		} );

		return texture;

	},

	loadThreeJson ( path ) {

		const promise = new Promise( ( resolve, reject ) => {

			const dirName = path.replace( /\/.+\.json$/, '/' );
			const file = fileStore.files[ path ];

			file.async( 'string' ).then( ( json ) => {

				const result = threeJsonLoader.parse( JSON.parse( json ), '__zip__' + dirName );
				return resolve( result );

			} );

		} );

		return promise;

	},

};

export default zipFileManager;

// three.jsの拡張
THREE.Loader.Handlers.handlers.push(
	/__zip__/,
	{
		load: ( filename ) => {

			return zipFileManager.loadTexture( filename.replace( /^__zip__/, '' ) );

		}

	}

);
