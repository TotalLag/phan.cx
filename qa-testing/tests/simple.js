import { origin } from '../../elder.config';
import HomePage from '../page-objects/home-page';

fixture('Simple (' + origin + ')').page(origin);
test('default true', async (t) => {
  return true;
});
test('Check the home page title', async (t) => {
  await t.expect(HomePage.title).eql('Chris Phan - Hello World!');
});
