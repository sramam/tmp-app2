const root = require('root');
const nested = require('nested');

function app() {
	const { root0, root1 } = root;
	const { nested1, nested2 } = nested;
	console.log(JSON.stringify({root0, root1, nested1, nested2 }, null, 2));
}

app();
