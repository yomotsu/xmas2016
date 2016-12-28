import es6Promise from 'es6-promise';

import vm         from './components/vm.js';

es6Promise.polyfill();
// Vue.config.devtools = false;

vm.$mount( '#xmas2016' );
