// tslint:disable:no-object-literal-type-assertion
import * as path from "path";
import { Configuration } from "webpack";

module.exports = {
    entry: "./src/index.ts",

    output: {
        path: path.resolve("build"),
        filename: "index.js",
        chunkFilename: '[name].bundle.js',
        libraryTarget: "umd",
        library: "docx",
    },

    resolve: {
        extensions: ["ts"],
        modules: [path.resolve("./src")],
        alias:{
            '@': './src'
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ["ts-loader"],
            },
        ],
    },

    // Because docx is now targetting web
    // target: 'node',
} as Configuration;