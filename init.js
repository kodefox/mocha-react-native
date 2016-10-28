require('./lib/globals');
require('./lib/register');

const {patchModule} = require('./lib/moduleIntercept');
patchModule();

require('react-native-mock/mock');
