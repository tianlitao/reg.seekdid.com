const packageJson = require('./package.json')
const isProdData = window.location.host === '127.0.0.1:21000'
const hostname = isProdData ? '127.0.0.1:21000' : '127.0.0.1:21000'

module.exports = {
  isProdData,
  appNmae: packageJson.name,
  hostname,
  domain: `https://${hostname}/`,
  servicesApi: isProdData ? '' : '',
  identiconServe: '',
  bestdas: isProdData ? 'https://bestdas.com' : 'https://bestdas.com',
  dasBalance: isProdData ? 'https://balance.da.systems' : 'https://balance.da.systems',
  ckbNode: isProdData ? '' : ''
}
