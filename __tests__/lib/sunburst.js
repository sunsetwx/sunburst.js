/*!
 * Sunburst API client library for JavaScript
 * https://sunsetwx.com
 *
 * Copyright (c) 2018, SunsetWx, LLC.
 * ISC License
 */

// A lengthier timeout is set due to potential network latency.
jest.setTimeout(30000);

const SunburstJS = require('../../dist/sunburst.node.js');

const passwordCredentials = {
  email: process.env.SUNBURST_API_TESTING_EMAIL,
  password: process.env.SUNBURST_API_TESTING_PASSWORD
};

const sunburst = new SunburstJS({
  clientId: process.env.SUNBURST_API_CLIENT_ID,
  clientSecret: process.env.SUNBURST_API_CLIENT_SECRET,
  scope: ['all']
});

const respCheck = (resp) => {
  expect(resp).toBeTruthy();
  expect(resp && resp.error).toBeFalsy();
};

const messageCheck = (resp) => {
  expect(resp.message).toBeTruthy();
};

const featureCheck = (feature) => {
  expect(feature.geometry).toBeTruthy();
  expect(feature.geometry.coordinates).toBeTruthy();
  expect(feature.properties).toBeTruthy();
};

test('request a single quality prediction', async () => {
  try {
    const now = new Date();

    const resp = await sunburst.quality({
      geo: [40.7933949, -77.8600012],
      after: now.setDate(now.getDate() + 1)
    });

    respCheck(resp);
    resp.features.forEach(featureCheck);

  } catch (ex) {
    throw ex;
  }
});

test('request multiple quality predictions', async () => {
  try {
    const resp = await sunburst.batchQuality([
      {
        geo: [40.7933949, -77.8600012],
        type: 'sunrise'
      },
      {
        geo: [40.7933949, -77.8600012],
        type: 'sunset'
      }
    ]);

    respCheck(resp);

    resp.forEach((query) => {
      expect(query.error).toBeFalsy();

      expect(query.collection).toBeTruthy();
      expect(query.collection.features).toBeTruthy();

      query.collection.features.forEach(featureCheck);
    });
  } catch (ex) {
    throw ex;
  }
});

test('request coordinates for location', async () => {
  try {
    const resp = await sunburst.coordinates({
      location: 'state college, pa'
    });

    respCheck(resp);
    resp.features.forEach(featureCheck);

  } catch (ex) {
    throw ex;
  }
});

test('request location of coordinates', async () => {
  try {
    const resp = await sunburst.location({
      geo: [40.7933949, -77.8600012]
    });

    respCheck(resp);
    featureCheck(resp);
    expect(resp.properties.locale).toBeDefined();

  } catch (ex) {
    throw ex;
  }
});

test('request all permanent sessions', async () => {
  try {
    const type = 'permanent';

    const resp = await sunburst.sessions({ type });
    respCheck(resp);
    expect(resp.length).toBeGreaterThan(0);

    resp.forEach((session) => {
      expect(session).toBeTruthy();
      expect(session.id).toBeTruthy();
      expect(session.type).toBeTruthy();
      expect(session.type === type).toBeTruthy();
    });
  } catch (ex) {
    throw ex;
  }
});

test('request session creation and deletion', async () => {
  try {
    const { email, password } = passwordCredentials;
    const type = 'remember_me';
    const scope = ['account'];

    const session = await sunburst.createSession({
      email,
      password,
      type,
      scope
    });

    expect(session.clientId).toBeTruthy();
    expect(session.clientSecret).toBeTruthy();
    expect(session.scope).toBeTruthy();

    session.scope.forEach((scopeStr) => (
      scope.forEach((inputScopeStr) => (
        expect(scopeStr === inputScopeStr).toBeTruthy()
      ))
    ));

    const deletionResp = await sunburst.deleteSessionById({
      id: session.clientId
    });

    respCheck(deletionResp);
    messageCheck(deletionResp);

  } catch (ex) {
    throw ex;
  }
});

test('request deletion of \'remember_me\' sessions', async () => {
  try {
    const type = 'remember_me';
    const resp = await sunburst.deleteSessions({ type });

    respCheck(resp);
    messageCheck(resp);

  } catch (ex) {
    throw ex;
  }
});

test('request access token and use with new class instance', async () => {
  try {
    const token = await sunburst.getToken({
      // `forceRefresh` is set to `true` so that a new token will be requested.
      forceRefresh: true,

      // `preventStore` is set to `true` to prevent storing the new token within
      // the original class instance.
      preventStore: true
    });

    // This client instance has its token state managed externally.
    const client = new SunburstJS({ token });

    const resp = await client.quality({
      geo: [40.7933949, -77.8600012]
    });

    respCheck(resp);
    resp.features.forEach(featureCheck);

  } catch (ex) {
    throw ex;
  }
});

test('request account info', async () => {
  try {
    const resp = await sunburst.account();

    respCheck(resp);
    expect(resp.email).toBeTruthy();

  } catch (ex) {
    throw ex;
  }
});

test('request invalid account deletion', async () => {
  try {
    // Password has been purposely left undefined.
    const resp = await sunburst.deleteAccount();
  } catch (ex) {
    expect(ex.message).toBeTruthy();
    expect(ex.statusCode === 401).toBeTruthy();
  }
});

test('request invalid update to email address', async () => {
  try {
    // Email and password have been purposely left undefined.
    const resp = await sunburst.updateEmail();
  } catch (ex) {
    expect(ex.message).toBeTruthy();
    expect(ex.statusCode === 401).toBeTruthy();
  }
});

test('request invalid password reset', async () => {
  try {
    // Email has been purposely left undefined.
    const resp = await sunburst.passwordReset();
  } catch (ex) {
    expect(ex.message).toBeTruthy();
    expect(ex.statusCode === 400).toBeTruthy();
  }
});

test('request password reset', async () => {
  try {
    // Email is purposely an example.
    const resp = await sunburst.passwordReset({
      email: 'example@example.com'
    });

    respCheck(resp);
    messageCheck(resp);

  } catch (ex) {
    throw ex;
  }
});

test('request new MFA TOTP secret', async () => {
  try {
    const resp = await sunburst.totpSecret();
    respCheck(resp);

    expect(resp.secret).toBeTruthy();
    expect(resp.qrCode).toBeTruthy();

  } catch (ex) {
    throw ex;
  }
});

test('request MFA settings', async () => {
  try {
    const resp = await sunburst.mfa();
    respCheck(resp);

    expect(resp.mfaEnabled).toBeDefined();
    expect(resp.mfaRecoveryCodes).toBeDefined();

  } catch (ex) {
    throw ex;
  }
});

test('request an update to MFA settings', async () => {
  try {
    const { password } = passwordCredentials;

    const resp = await sunburst.updateMfa({ password });
    respCheck(resp);
    messageCheck(resp);

  } catch (ex) {
    throw ex;
  }
});

test('request logout', async () => {
  try {
    const resp = await sunburst.logout();

    respCheck(resp);
    messageCheck(resp);

  } catch (ex) {
    throw ex;
  }
});
