import { merge } from 'webpack-merge';

import common from './webpack.common.js';

const PORT = process.env.PORT || 8000;

export default merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: PORT,
  },
});
