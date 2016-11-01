import url from 'fast-url-parser';
url.queryString = require('querystringparser');
class URL {
  constructor() {
    window.DEVMODE = false;
    this.parseQuery();
  }
  parseQuery() {
    const parsed = url.parse(window.location.search, true);
    if (parsed.query.devMode) {
      window.DEVMODE = true;
    }
  }
}
export default new URL();
