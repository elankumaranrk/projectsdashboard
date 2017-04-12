import { OpenPage } from './app.po';

describe('open App', function() {
  let page: OpenPage;

  beforeEach(() => {
    page = new OpenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
