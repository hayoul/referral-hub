import process from 'node:process';
import { TwitterApi } from 'twitter-api-v2';

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

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET
});

try {
  const response = await client.v2.tweet(text);
  console.log('Posted to X:', response.data.id);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
