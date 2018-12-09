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
git clone https://github.com/sramam/app2
npm i
node index.js 

# now run a second install
npm i
node index.js

```

### The repos 

- [app1](https://github.com/sramam/tmp-app1)
- [app2](https://github.com/sramam/tmp-app2)
- [root](https://github.com/sramam/tmp-root)
- [nested](https://github.com/sramam/tmp-nested)

### Run log

```
$ git clone https://github.com/sramam/tmp-app2
Cloning into 'tmp-app2'...
cremote: Enumerating objects: 17, done.
remote: Counting objects: 100% (17/17), done.
remote: Compressing objects: 100% (14/14), done.
remote: Total 17 (delta 2), reused 17 (delta 2), pack-reused 0
Unpacking objects: 100% (17/17), done.



$ cd tmp-app2



$ npm i
----------░░░░░░░░░⸩ ⠧ loadDep:root: sill install loadAllDepsIntoIdealTree
npm WARN app2@1.0.0 No repository field.

added 2 packages and audited 1 package in 1.216s
found 0 vulnerabilities



$ node index.js
module.js:515
    throw err;
    ^

Error: Cannot find module 'nested'
    at Function.Module._resolveFilename (module.js:513:15)
    at Function.Module._load (module.js:463:25)
    at Module.require (module.js:556:17)
    at require (internal/module.js:11:18)
    at Object.<anonymous> (/private/tmp/tmp-app2/index.js:2:16)
    at Module._compile (module.js:612:30)
    at Object.Module._extensions..js (module.js:623:10)
    at Module.load (module.js:531:32)
    at tryModuleLoad (module.js:494:12)
    at Function.Module._load (module.js:486:3)



# second npm install
$ npm i
----------░░░░░░░░░⸩ ⠧ diffTrees: sill install generateActionsToTake
npm WARN app2@1.0.0 No repository field.

added 1 package, removed 1 package and audited 2 packages in 1.789s
found 0 vulnerabilities



$ node index.js
{
  "root0": "root",
  "root1": "nested1",
  "nested1": "nested1",
  "nested2": "nested2"
}
``` 


