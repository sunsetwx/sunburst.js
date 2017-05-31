# sunburst.js

This library provides automated authorization handling and bindings for the Sunburst API.

```js
import Sunburst from 'sunburst.js';

const auth = {
  id: 'f78fe615-8eb1-48c4-be21-e5f4f437e8ba',
  key: '18qwl0htsPX|[!NGQ@[qK{X;[&^EVzaH'
};

let sunburst = new Sunburst(auth);

const params = {
  type: 'sunrise',
  coords: [
    -77.8600012,
    40.7933949
  ]
};

// Query for quality forecasts within the default radius using the supplied parameters.
sunburst.quality(params, resp => {
  console.log(resp);
}, err => {
  console.error(err);
});

// Setup an averaging reducer.
const averagingReducer = (acc, val, idx, arr) =>
  idx + 1 !== arr.length ? (
    acc + val
  ) : (
    (acc + val) / arr.length
  );

// Map the selected property and apply the selected reducer.
const reduceFeatureProps = (features, reducer, property) =>
  features
    .map(({ properties }) => properties[property])
    .reduce(reducer);

// Average two numerical properties.
const averageFeatureQuality = resp => {
  const avgPer = reduceFeatureProps(resp.features, averagingReducer, 'quality_percent');

  const avgQuality = {
    label:      sunburst.utils.quality.label(avgPer),
    percent:    avgPer,
    value:      reduceFeatureProps(resp.features, averagingReducer, 'quality_value'),
    source:     resp.features[0].properties.source,
    reportedAt: new Date(Date.now()).toLocaleString()
  };

  console.log('Average Quality:', avgQuality);
};
```

More examples, for each endpoint: [https://sunburst.sunsetwx.com/v1/docs](https://sunburst.sunsetwx.com/v1/docs?javascript=)

## License

The source code is available under the [MIT License](https://opensource.org/licenses/MIT).