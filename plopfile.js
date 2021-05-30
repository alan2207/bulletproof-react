const componentGenerator = require('./generators/component/index');

module.exports = function (plop) {
  plop.setGenerator('component', componentGenerator);
};
