// require all `tests/**/*.spec.js`
const testsContext = require.context('./', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);

// require all `src/**/*.js` except for `main.js` (for isparta coverage reporting) & static sources
const componentsContext = require.context('../src/', true, /^((?!main)|(static\/libs\/*).)*\.js$/);

componentsContext.keys().forEach(componentsContext);
