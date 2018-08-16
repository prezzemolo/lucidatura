riassumere
===

[![npm version](https://img.shields.io/npm/v/riassumere.svg)](https://www.npmjs.org/package/riassumere)
[![build status](https://img.shields.io/travis/prezzemolo/riassumere/master.svg)](https://travis-ci.org/prezzemolo/riassumere)
[![github stars](https://img.shields.io/github/stars/prezzemolo/riassumere.svg?style=social&label=Stars)](https://github.com/prezzemolo/riassumere/stargazers)
[![Greenkeeper badge](https://badges.greenkeeper.io/prezzemolo/riassumere.svg)](https://greenkeeper.io/)

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

- Using CommonJS on Node.js:

```javascript
const riassumere = require('riasummere').default
```

- Using ES Modules on Node.js with expreimental-modules flag:

```javascript
import riassumereModule from 'riassumere'
const riassumere = riassumereModule.default
```

and then,
```javascript
riassumere('https://twitter.com/BarackObama').then(console.dir)
/*
{ title: 'Barack Obama (@barakobama) | Twitter',
  canonical: 'https://twitter.com/barakobama',
  type: 'website',
  lang: 'en',
  icon: 'https://abs.twimg.com/favicons/favicon.ico' }
*/
```

That's all!

Signature
---
```typescript
interface ISummary {
  title: string,
  canonical: string,
  type: string,
  lang?: string,
  icon?: string,
  image?: string,
  description?: string,
  site_name?: string
}
interface IRissumereOptionObject {
  url: string,
  lang?: string
}
type IRissumereOption = string | IRissumereOptionObject
/*
  if only one argument given returns Promise<ISummary>,
  else returns Promise<ISummary[]>
 */
export default (...IRissumereOption[]) => Promise<ISummary | ISummary[]>
```

FMI, open [src/interfaces.ts](src/interfaces.ts)!

Handling Errors
---

- `StatusCodeError`: When server respond with status code greater than 400
```typescript
import riassumere, { errors } from 'riassumere'

riassumere('https://twitter.com/BarackObama')
  .then(console.dir)
  .catch(e => {
    if (e intanceof errors.StatusCodeError) {
      /*
        error message from server.
        if no error message present, message equals to `e.code`.
      */ 
      console.log(e.message)
      // HTTP status message
      console.log(e.code)
    }
  })
}
```

- `SummarizerNotFoundError`: When unsupported URL given.
```typescript
import riassumere, { errors } from 'riassumere'

riassumere('ftp://twitter.com/BarackObama')
  .then(console.dir)
  .catch(e => {
    if (e intanceof errors.SummarizerNotFoundError) {
      // unsupported URL
      console.log(e.url)
    }
  })
}
```

FMI, open [src/errors.ts](src/errors.ts)!
