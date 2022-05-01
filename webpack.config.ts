import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';

import HtmlWebpackPlugin from 'html-webpack-plugin';

const configuration: webpack.Configuration = {
    context: path.resolve(__dirname, 'src'),
    entry: './app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    plugins: [new HtmlWebpackPlugin({ template: './app.html' })],
};

export default configuration;
