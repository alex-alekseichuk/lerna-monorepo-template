# Template of monorepo project based on lerna

To install, run in the root:

```bash
npm i
```

There are packages:

- tools
- pkg1
- pkg2

pkg2 uses/depends on pkg1.

```javascript
const pkg1 = require('@monorepo/pkg1/src/pkg1');
pkg1.f1();
```

Both pkg1 and pkg2 depends on tools.
CLI tool script1 is available in both pkg1 and pkg2.
script1 is implemented as nodejs/javascript.

```bash
npx script1
```
