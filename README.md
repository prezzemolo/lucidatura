riassumere
===
Promise based website metadatas summarizer for browser and node.js.

Installing
---
```bash
$ npm install riassumere
```

Example
---
Import module with

- Using TypeScript:

```typescript
import riassumere from 'riassumere'
```

- Using ES Modules with some transpiler (e.g. Babel):

```javascript
import riassumere from 'riassumere'
```

- Using CommonJS on node.js:

```javascript
const riassumere = require('riasummere').default
```

- Using ES Modules on node.js with expreimental-modules flag:

```javascript
import riassumereModule from 'riassumere'
const riassumere = riassumereModule.default
```

and then,
```javascript
riassumere('https://twitter.com/BarackObama')
  .then(metadata => {
    console.dir(metadata)
  })
/*
{ title: 'Barack Obama (@barakobama) | Twitter',
  canonical: 'https://twitter.com/barakobama',
  type: 'website',
  lang: 'en',
  icon: 'https://abs.twimg.com/favicons/favicon.ico' }
*/
```

That's all!
