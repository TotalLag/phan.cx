import { Selector, t } from 'testcafe';

class HomePage {
  get title() {
    return Selector('title').textContent;
  }
}

export default new HomePage();
