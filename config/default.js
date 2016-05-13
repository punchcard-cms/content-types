'use strict';
const path = require('path');

module.exports = {
  contentTypes: {
    contentTypeDir: './content-types',
    contentTypeExt: 'yml',
    viewsDir: path.join(__dirname, '../views/'),
    formTemplateFile: 'form.html',
  }
};
