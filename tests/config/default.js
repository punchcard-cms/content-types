'use strict';
const path = require('path');

module.exports = {
  content: {
    directory: './fixtures/content-types',
    plugins: {
      core: {
        directory: path.join(__dirname, '../fixtures/input-plugins-core'),
      },
    },
  },
};
