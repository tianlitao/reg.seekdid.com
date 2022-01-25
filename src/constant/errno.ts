export default {
  success: 0,
  serverError: 500,
  networkError: -1,
  // MetaMask
  metaMaskWalletRequestPermissions: -32002,
  metaMaskUserRejectedAccountAccess: -32603,
  metaMaskUserDeniedMessageSignature: 4001,
  // WalletConnect
  walletConnectUserRejectedTheTransaction: 'User rejected the transaction',
  walletConnectInsufficientFundsForTransfer: 'insufficient funds for transfer',
  // TronLink
  tronLinkConfirmationDeclinedByUser: 'Confirmation declined by user',
  tronLinkInsufficientBalance: 'class org.tron.core.exception.ContractValidateException : Validate TransferContract error, no OwnerAccount.',
  tronLinkTypeErrorAddUpdateDataNotFunction: 'transactionBuilder.addUpdateData',
  // imToken
  imTokenUserCanceled: 'user_canceled',
  // Portal Wallet
  portalWalletInsufficientBalance: 'input capacity not enough',
  portalWalletValidationFailure: 'ValidationFailure(-31)',
  // rpc api error
  rpcApiErrNotOpenForRegistration: 30001,
  rpcApiErrAccountNotExist: 30003,
  rpcApiErrOrderStatusExpired: 30008,
  rpcApiErrAccountCharsErr: 30015,
  rpcApiErrSystemUpgrade: 30019,
  rpcApiErrAccountFrequencyLimit: 11013,
  rpcApiErrTransferAccountSameAddress: 30023,
  rpcApiErrWithdrawFromDasLockInsufficientBalance: 30025,
  rpcApiErrWithdrawFromDasLockUnsupportedLongAddress: 30030,
  apiErrorCodeInsufficientBalance: 11007,
  apiErrorCodeResolveFailed: 11011,
  apiErrorCodeNotEnoughChange: 11014,
  apiErrorCodeNotExitsTrx: 11001,
  apiErrorCodeReverseAlreadyExist: 12001
}
