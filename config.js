const packageJson = require('./package.json')
const isProdData = true
const hostname = isProdData ? 'app.seekdid.com' : '127.0.0.1:21000'

module.exports = {
  isProdData,
  appNmae: packageJson.name,
  hostname,
  domain: `https://${hostname}/`,
  servicesApi: isProdData ? 'https://register-api.seekdid.com/v1' : 'https://register-api.seekdid.com/v1',
  crossEthApi: isProdData ? '' : '',
  identiconServe: 'https://display.did.id/identicon/',
  didtop: isProdData ? 'https://did.top' : 'https://test.did.top',
  homepage: isProdData ? 'https://data.did.id' : 'https://testdata.did.id',
  dasBalance: isProdData ? 'https://balance.did.id' : 'https://testbalance.did.id',
  ckbNode: isProdData ? '' : ''
}
