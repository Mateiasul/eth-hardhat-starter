// prettier.config.js or .prettierrc.js
module.exports = {
    overrides: [
        {
            files: "*.sol",
            options: {
                printWidth: 140,
                tabWidth: 4,
                useTabs: false,
                singleQuote: false,
                bracketSpacing: false,
                explicitTypes: "always"
            }
        }
    ]
};