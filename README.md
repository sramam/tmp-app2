# npm install needs to be run twice.

In complicated dependency structures, it sometimes turns out tha `npm install` needs to be run twice. 
These can be hard to pin-point. 

This documents the simplest reproduction. 

## Versions

```
$ node -v
v8.8.1
$ npm -v
6.4.1
```

## Project dependency structure


### App1 Dependencies (requires ONE npm install)

```
app1@1.0.0 /Users/sramam/github/sramam/npm-install-twice/app1
├── nested@1.0.0 (github:sramam/tmp-nested#bc8f0d6d7d828dfc4b0c91dd7f1cfdba20989519)
└─┬ root@1.0.0 (github:sramam/tmp-root#b824e118fbef629bcae5cb4b00a9483803d79915)
  └── nested@1.0.0 deduped (github:sramam/tmp-nested#bc8f0d6d7d828dfc4b0c91dd7f1cfdba20989519)
```

### App2 Dependencies (requires TWO npm install)

```
app2@1.0.0 /Users/sramam/github/sramam/npm-install-twice/app2
└─┬ root@1.0.0 (github:sramam/tmp-root#b824e118fbef629bcae5cb4b00a9483803d79915)
  └── nested@1.0.0 (github:sramam/tmp-nested#bc8f0d6d7d828dfc4b0c91dd7f1cfdba20989519)
```

### index.js

In both cases, the index.js is the same:

```javascript
const root = require('root');
const nested = require('nested');

function app() {
	const { root0, root1 } = root;
	const { nested1, nested2 } = nested;
	console.log(JSON.stringify({root0, root1, nested1, nested2 }, null, 2));
}

app();
```

## Reproduction:


### Needs one `npm install`

```
git clone https://github.com/sramam/app1
npm i
node index.js 
```

### Needs two `npm installs`

```
# This will throw an error
git clone https://github.com/sramam/app1
npm i
node index.js 

# now run a second install
npm i
node index.js

```

### The repos 

[app1](https://github.com/sramam/tmp-app1)
[app2](https://github.com/sramam/tmp-app2)
[root](https://github.com/sramam/tmp-root)
[nested](https://github.com/sramam/tmp-nested)
 



