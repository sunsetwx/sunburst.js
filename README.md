# sunburst.js
### API client library for Node.js and in-browser JavaScript

This library provides authorization handling and methods for accessing the Sunburst API.

## Installation and usage

In-browser JavaScript:

```html
<!-- SunburstJS is exposed as a global for compatibility -->
<script src="assets/js/sunburst.iife.js"></script>
```

Install using npm:
```sh
npm i sunburst.js
```

Node.js:

```js
const SunburstJS = require('sunburst.js');
```

or, with your favorite module bundler:

```js
import SunburstJS from 'sunburst.js';
```

## Getting started

Create a session pair. Aka. `clientId` and `clientSecret`, which are what we use as our API keys:

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
const sunburst = new SunburstJS({
  clientId: 'f78fe615-8eb1-48c4-be21-e5f4f437e8ba',
  clientSecret: '18qwl0htsPX|[!NGQ@[qK{X;[&^EVzaH',
  scope: ['predictions']
});
```

Here is an example, using an asynchronous function:

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
    resp.forEach((query) => {
      if (query.error) {
        // Handle individual query errors separately,
        // as some queries may have still suceeded.
        return console.error(ex);
      }
      query.collection.features.forEach(({ properties }) => {
        console.log(properties);
      });
    });
  } catch (ex) {
    // Handle general network or parsing errors.
    return console.error(ex);
  }
})();
```

Here is an example, using `then` and `catch` callback functions:

```js
(function () {
  const now = new Date();
  const thisTimeTomorrow = now.setDate(now.getDate() + 1);

  sunburst.batchQuality([
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
  ]).then(function (resp) {
    for (const query of resp) {
      if (query.error) {
        // Handle individual query errors separately,
        // as some queries may have still suceeded.
        console.error(ex);
        continue;
      }
      for (const feature of query.collection.features) {
        console.log(feature.properties);
      }
    }
  }).catch(function (ex) {
    // Handle general network or parsing errors.
    return console.error(ex);
  });
})();
```

More examples, for each endpoint: [https://sunburst.sunsetwx.com/v1/docs](https://sunburst.sunsetwx.com/v1/docs?javascript=)

## License

The source code is available under the [ISC License](https://opensource.org/licenses/ISC).
