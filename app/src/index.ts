import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { echo, echoBidirectionalStream, echoClientStream, echoServerStream } from './api/echo';
import router from './router';

// =========================================================================
// vue-example

const app = createApp(App);
app.use(createPinia()).use(router);
app.mount('#root');

if (module.hot) {
	module.hot.dispose(() => {
		app.unmount();
		console.clear();
	});
	module.hot.accept();
}

// =========================================================================
// grpc-example

async function main(): Promise<void> {
	console.log(`\n\nUNARY\n\n`);
	console.log(await echo('Hello World!'));

	console.log(`\n\nSERVER_STREAM\n\n`);
	for await (const response of echoServerStream('Hello World!')) {
		console.log(response);
	}

	console.log(`\n\nClIENT_STREAM\n\n`);
	const clientStreamContext = echoClientStream();
	clientStreamContext.write('1. Hello');
	clientStreamContext.write('2. World');
	clientStreamContext.write('3. Exclamation mark');
	clientStreamContext.end();
	console.log(await clientStreamContext.response);

	console.log(`\n\nBIDIRECTIONAL_STREAM\n\n`);
	const contextBidirectional = echoBidirectionalStream();
	contextBidirectional.write('1. Hello');
	contextBidirectional.write('2. World');
	contextBidirectional.write('3. Exclamation mark');
	contextBidirectional.end();
	for await (const response of contextBidirectional.response) {
		console.log(response);
	}
}

main();
