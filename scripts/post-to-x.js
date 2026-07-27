import crypto from 'node:crypto';
import process from 'node:process';

const referrals = [
  {
    name: 'SkipTax',
    code: '2J5ANFD7',
    link: 'https://www.skiptax.com',
    description: 'Easy VAT refund in France.'
  },
  {
    name: 'ZappTax',
    code: 'REFQY9KZ',
    link: 'https://link.zapptax.com/vU5s/x5hwrl4a?deep_link_sub1=REFQY9KZ',
    description: 'Tax-free shopping in France and Belgium.'
  },
  {
    name: 'SpotAngels',
    code: 'hayoul1c078b4a',
    link: 'http://dl.spotangels.com/ct9kBg8um2b',
    description: 'Get $2 off your first parking.'
  },
  {
    name: 'US Mobile',
    code: '672AF643',
    link: 'https://www.usmobile.com/referrals?referrer=672AF643&name=Hayoul&utm_page_url=monster_referral',
    description: 'Get $25 and 30 days free.'
  },
  {
    name: 'HelloFresh',
    code: 'LLWH-7G7p',
    link: 'https://www.hellofresh.com/gw/share/LLWH-7G7p',
    description: 'Free meals and big portions.'
  },
  {
    name: 'Revolut',
    code: 'hayoulj4q!JUL2-26-AR',
    link: 'https://revolut.com/referral/?referral-code=hayoulj4q!JUL2-26-AR&geo-redirect',
    description: 'Join 75M+ users.'
  }
];

const today = new Date();
const day = today.getUTCDate();
const index = day % referrals.length;
const referral = referrals[index];

const text = `${referral.name} code: ${referral.code}\n${referral.link}`;

if (!process.env.X_API_KEY || !process.env.X_API_SECRET || !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_TOKEN_SECRET) {
  console.log('DRY RUN - would post to X:');
  console.log(text);
  process.exit(0);
}

const oauth = {
  consumer_key: process.env.X_API_KEY,
  consumer_secret: process.env.X_API_SECRET,
  token: process.env.X_ACCESS_TOKEN,
  token_secret: process.env.X_ACCESS_TOKEN_SECRET
};

function generateAuthHeader(method, url, params) {
  const oauthParams = {
    oauth_consumer_key: oauth.consumer_key,
    oauth_nonce: crypto.randomBytes(8).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: oauth.token,
    oauth_version: '1.0'
  };

  const allParams = { ...oauthParams, ...params };
  const sorted = Object.entries(allParams).sort(([a], [b]) => a.localeCompare(b));
  const encoded = sorted.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(encoded)}`;
  const signingKey = `${encodeURIComponent(oauth.consumer_secret)}&${encodeURIComponent(oauth.token_secret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBase).toString('base64');
  const authHeader = Object.entries({
    ...oauthParams,
    oauth_signature: signature
  }).map(([k, v]) => `${k}="${encodeURIComponent(v)}"`).join(', ');

  return `OAuth ${authHeader}`;
}

async function postToX(status) {
  const url = 'https://api.twitter.com/2/tweets';
  const body = JSON.stringify({ text: status });
  const authHeader = generateAuthHeader('POST', url, {});

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body
  });

  const data = await response.text();
  if (!response.ok) {
    throw new Error(`X API error ${response.status}: ${data}`);
  }

  console.log('Posted to X:', data);
}

try {
  await postToX(text);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
