import { PinOnTheGoPage } from './app.po';

describe('pin-on-the-go App', function() {
  let page: PinOnTheGoPage;

  beforeEach(() => {
    page = new PinOnTheGoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
