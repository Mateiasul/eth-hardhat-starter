// prettier.config.js or .prettierrc.js
module.exports = {
    overrides: [
        {
            files: ["*.sol", "*.js"],
            options: {
                printWidth: 140,
                tabWidth: 4,
                useTabs: true,
                singleQuote: false,
                bracketSpacing: false,
                explicitTypes: "always"
            }
        }
    ]
};