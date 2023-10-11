const env = require('./Env');
const Config = require('./Config.env.json');

// 导出配置变量
module.exports = {
    Env: env,
    API_ADMIN_PATH: Config[env]['API_ADMIN_PATH'],
    RES_PATH: Config[env]['RES_PATH'],
    RUBY_API_PATH: Config[env]['RUBY_API_PATH'],
    AUTH_SECRET: Config[env]['AUTH_SECRET'],
};