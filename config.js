/*
* Configuration settings.
*/


var environments = {};

// create a staging environment as default

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};


const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check the passed enviroment OR make staging as default.
const enviromentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module

module.exports = enviromentToExport; 
