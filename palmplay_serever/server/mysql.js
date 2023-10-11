'use strict';

const nodelib = require('nodelibc');

module.exports = new nodelib.Mysql('39.100.98.114', 'guo', 'Yaya123...', 'hwb_t');
// module.exports = new nodelib.Mysql('git.ehw8.com', 'hwdev', 'hwdev{}!@#$%^', 'hw8_test');

//sequelize-auto -o 
//".\src\models\" 
//-d hwb_beta_db -h 34.80.157.68 -u guo_test -p 3306 -x YAya123... -e mssql
