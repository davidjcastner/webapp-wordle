import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';

import HtmlWebpackPlugin from 'html-webpack-plugin';

const configuration: webpack.Configuration = {
    context: path.resolve(__dirname, 'src'),
    entry: './app.tsx',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'src/assets'),
            publicPath: '/assets/',
        },
    },
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.css/, use: ['style-loader', 'css-loader'] },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: './app.html' })],
};

export default configuration;
