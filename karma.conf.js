const path = require('path');

module.exports = function(config) {
  config.set({

    // Base path that will be used to resolve all patterns (e.g., files, exclude)
    basePath: '',

    // Frameworks to use
    // Available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // List of files/patterns to load in the browser
    files: [
      { pattern: 'src/**/*.spec.ts', watched: true }
    ],

    // List of files/patterns to exclude
    exclude: [
      'node_modules/**/*'
    ],

    // Preprocess matching files before serving them to the browser
    // Available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'src/**/*.ts': ['@angular-devkit/build-angular', 'coverage'] // Added 'coverage' preprocessor
    },

    // Test results reporter to use
    // Possible values: 'dots', 'progress'
    // Available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress', 'kjhtml', 'coverage'], // Added coverage reporter

    // Coverage reporter configuration
    coverageReporter: {
      dir: path.join(__dirname, './coverage/my-app'), // Directory for coverage reports
      reporters: [
        { type: 'html' }, // Generates an HTML report
        { type: 'text-summary' }, // Generates a text summary in the terminal
      ],
    },

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
    // Available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome', 'Firefox'],

    // Continuous Integration mode
    // If true, Karma captures browsers, runs the tests, and exits
    singleRun: false,

    // Concurrency level
    // How many browser instances should be started simultaneously
    concurrency: Infinity,

    // Jasmine client configuration
    client: {
      clearContext: false // Leave Jasmine Spec Runner output visible in browser
    }
  });
};
