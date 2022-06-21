const packageJson = require('./package.json')
const isProdData = window.location.host === '127.0.0.1:21000'
const hostname = isProdData ? '127.0.0.1:21000' : '127.0.0.1:21000'

module.exports = {
  isProdData,
  appNmae: packageJson.name,
  hostname,
  domain: `https://${hostname}/`,
  servicesApi: isProdData ? '' : '',
  crossEthApi: isProdData ? '' : '',
  identiconServe: '',
  didtop: isProdData ? 'https://did.top' : 'https://test.did.top',
  homepage: isProdData ? 'https://data.did.id' : 'https://testdata.did.id',
  dasBalance: isProdData ? 'https://balance.did.id' : 'https://testbalance.did.id',
  ckbNode: isProdData ? '' : ''
}
