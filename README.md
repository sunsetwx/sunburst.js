# sunburst.js

### Sunburst API client library for JavaScript

This library provides authorization handling and methods for accessing the Sunburst API from [SunsetWx](https://sunsetwx.com/).

* Supports Node.js, React Native, and popular web browsers.

### Platform Support

Platform     | Version
------------ | -------
Node.js      | 6.5+
React Native | 0.54+

## Installation and usage

JavaScript in-browser script tag usage:

* Place `dist/sunburst.iife.js` into your website's files.

```html
<!-- The library is exposed as a global variable: SunburstJS -->
<script src="assets/js/sunburst.iife.js"></script>
```

Installation using npm:

```sh
npm i sunburst.js
```

Node.js 8.10+ usage:

```js
const SunburstJS = require('sunburst.js');
```

Node.js 6.5+ usage:

```js
const SunburstJS = require('sunburst.js/dist/sunburst.node.js');
```

Usage with React Native or your favorite module bundler:

```js
import SunburstJS from 'sunburst.js';
```

## Getting started

Create a session pair. Also known as `clientId` and `clientSecret`, which are our API keys:

```js
(async () => {
  try {
    const sunburst = new SunburstJS();

    const session = await sunburst.createSession({
      email: 'example@example.com',
      password: 'hunter2',
      type: 'permanent',
      scope: ['predictions']
    });
    console.log(session);
  } catch (ex) {
    // Handle general network or parsing errors.
    return console.error(ex);
  }
})();
```

Now you can make API requests:

```js
let sunburst = new SunburstJS({
  clientId: 'f78fe615-8eb1-48c4-be21-e5f4f437e8ba',
  clientSecret: '18qwl0htsPX|[!NGQ@[qK{X;[&^EVzaH',
  scope: ['predictions']
});
```

Here is an example of making four quality prediction requests:

```js
(async () => {
  try {
    const now = new Date();
    const thisTimeTomorrow = now.setDate(now.getDate() + 1);

    const resp = await sunburst.batchQuality([
      {
        geo: [40.7933949, -77.8600012],
        type: 'sunrise'
      },
      {
        geo: [40.7933949, -77.8600012],
        type: 'sunset'
      },
      {
        geo: [40.7933949, -77.8600012],
        type: 'sunrise',
        after: thisTimeTomorrow
      },
      {
        geo: [40.7933949, -77.8600012],
        type: 'sunset',
        after: thisTimeTomorrow
      }
    ]);

    resp.forEach(({ collection, error }) => {
      if (error) {
        // Handle individual query errors separately,
        // as some queries may have still succeeded.
        return console.error(error);
      }
      collection.features.forEach(({ properties }) => {
        console.log(properties);
      });
    });
  } catch (ex) {
    // Handle general network or parsing errors.
    return console.error(ex);
  }
})();
```

More examples, for each endpoint: [https://sunburst.sunsetwx.com/v1/docs](https://sunburst.sunsetwx.com/v1/docs?javascript=)

## License

The source code is available under the [ISC License](https://opensource.org/licenses/ISC).
