<template>
  <div>
    <Dialog
      :showing="showing"
      :title="$tt('Convert')"
      closeButton
      @close="onClose"
    >
      <div class="mint-nft__desc">
        <div class="mint-nft__desc__title">
          {{ $tt('Your are converting {account} to NFT on Ethereum.', { account: account }) }}
        </div>
        <div class="mint-nft__desc__rule">
          <span>1.</span>
          <span>{{ $tt('Gas fee is required (real-time gas price) to convert the .bit account to NFT on Ethereum;') }}</span>
        </div>
        <div class="mint-nft__desc__rule">
          <span>2.</span>
          <span>
            {{ $tt('After Step1, the data stored in the .bit will be cleared, and it can’t be cancelled. You can see it in the list of "Converting".') }}
            <a
              class="mint-nft__faq"
              :href="$i18n.locale === LANGUAGE.zhCN ? 'https://talk.did.id/t/bit-ethereum-nft/482' : 'https://talk.did.id/t/convert-your-bit-to-nft-on-ethereum-now/481'"
              target="_blank"
            >{{ $tt('Learn more') }}</a>
          </span>
        </div>
      </div>
      <div class="mint-nft__step mint-nft__margin-bottom-12">
        <div class="mint-nft__setp__title">
          <span class="mint-nft__setp__tag">{{ $tt('Step1') }}</span>
        </div>
        <template v-if="currentStep === Step.one">
          <template v-if="!locking">
            <Button
              block
              shape="round"
              status="success"
              :loading="lockLoading || disabled"
              @click="onLock"
            >
              {{ $tt('Prepare') }}
            </Button>
          </template>
          <div
            v-else
            class="mint-nft__setp__processing"
          >
            <span class="mint-nft__setp__processing__icon">
              <Iconfont
                name="loading"
                color="#22C493"
                size="38"
              />
            </span>
            <span class="mint-nft__setp__processing__title">{{ $tt('Processing') }}</span>
          </div>
        </template>
        <div
          v-else
          class="mint-nft__setp__complete"
        >
          <Iconfont
            name="check-strong"
            color="#0DBA85"
            size="20"
          />
          {{ $tt('Done') }}
        </div>
        <div
          v-if="lockHash"
          class="mint-nft__setp__trx-hash"
        >
          <a
            class="mint-nft__setp__trx-id"
            :href="`${CKB.explorerTrx}${lockHash}`"
            target="_blank"
          >
            {{ collapseString(lockHash, 5, 5) }}
            <Iconfont
              class="mint-nft__setp__trx-id__icon"
              name="arrow-right"
              color="#B0B8BF"
              size="18"
            />
          </a>
        </div>
      </div>
      <div class="mint-nft__step">
        <div class="mint-nft__setp__title">
          <span class="mint-nft__setp__tag">{{ $tt('Step2') }}</span>
        </div>
        <template v-if="!minting">
          <Button
            block
            :disabled="currentStep === Step.one"
            :loading="mintLoading"
            shape="round"
            status="primary"
            @click="mintNft"
          >
            {{ $tt('Pay to Mint') }}
          </Button>
        </template>
        <div
          v-else
          class="mint-nft__setp__processing"
        >
          <span class="mint-nft__setp__processing__icon">
            <Iconfont
              name="loading"
              color="#22C493"
              size="38"
            />
          </span>
          <span class="mint-nft__setp__processing__title">{{ $tt('Processing') }}</span>
        </div>
        <div
          v-if="mintHash"
          class="mint-nft__setp__trx-hash"
        >
          <a
            class="mint-nft__setp__trx-id"
            :href="`${ETH.explorerTrx}${mintHash}`"
            target="_blank"
          >
            {{ collapseString(mintHash, 5, 5) }}
            <Iconfont
              class="mint-nft__setp__trx-id__icon"
              name="arrow-right"
              color="#B0B8BF"
              size="18"
            />
          </a>
        </div>
      </div>
      <span slot="action" />
    </Dialog>
    <CanNotBeLockedTips
      v-model="canNotBeLockedDialogShowing"
      :account="account"
    />
    <NotOwnerTips v-model="notOwnerTipsShowing" />
    <NoEthereumTips v-model="noEthereumTipsShowing" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { LANGUAGE } from '~/constant/language'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { CKB, ETH, NEW_LOCK_SCRIPT_TYPE } from '~/constant/chain'
import { collapseString, mmJsonHashAndChainIdHex, sleep } from '~/modules/tools'
import { CrossDirection, CYCLE_CALL_FUNCTION_TIME } from '~/constant'
import Iconfont from '~/components/icon/Iconfont.vue'
import CanNotBeLockedTips from '~/pages/me/-/CanNotBeLockedTips.vue'
import NotOwnerTips from '~/components/NotOwnerTips.vue'
import NoEthereumTips from '~/pages/me/-/NoEthereumTips.vue'

enum Step {
  one = 1,
  two = 2,
  succeed = 3,
}

enum MintStatus {
  lockPending = 0,
  lockConfirm = 1,
  lockRejected = 2,
  mintSign = 3,
  mintPending = 4,
  mintConfirm = 5,
  mintFailed = 6
}

export default Vue.extend({
  name: 'MintNft',
  components: {
    Dialog,
    Button,
    Iconfont,
    CanNotBeLockedTips,
    NotOwnerTips,
    NoEthereumTips
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: true
    },
    account: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      CKB,
      ETH,
      Step,
      LANGUAGE,
      disabled: true,
      currentStep: Step.one,
      locking: false,
      minting: false,
      lockLoading: false,
      mintLoading: false,
      checkMintStatusTimer: 0,
      canNotBeLockedDialogShowing: false,
      notOwnerTipsShowing: false,
      lockHash: '',
      mintHash: '',
      noEthereumTipsShowing: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  watch: {
    showing (newVal) {
      if (newVal) {
        this.disabled = true
        this.checkMintStatus()
      }
    }
  },
  methods: {
    collapseString,
    onClose () {
      this.currentStep = Step.one
      this.locking = false
      this.minting = false
      this.lockLoading = false
      this.mintLoading = false
      this.lockHash = ''
      this.mintHash = ''
      clearTimeout(this.checkMintStatusTimer)
      this.$emit('close', false)
    },
    async checkMintStatus () {
      try {
        const res = await this.$services.crossEth.lockMintStatus({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          },
          account: this.account
        })

        this.checkMintStatusTimer = window.setTimeout(() => {
          this.checkMintStatus()
        }, CYCLE_CALL_FUNCTION_TIME * 2)

        if (res) {
          if (res.lock_hash) {
            this.lockHash = res.lock_hash
          }
          if (res.mint_hash) {
            this.mintHash = res.mint_hash
          }
          switch (res.status) {
            case MintStatus.lockPending:
              this.currentStep = Step.one
              this.locking = true
              break
            case MintStatus.lockConfirm:
              this.currentStep = Step.one
              this.locking = true
              this.$emit('updateDirectionList')
              break
            case MintStatus.lockRejected:
              this.currentStep = Step.one
              this.locking = false
              clearTimeout(this.checkMintStatusTimer)
              break
            case MintStatus.mintSign:
              this.currentStep = Step.two
              this.locking = false
              this.$emit('updateDirectionList')
              clearTimeout(this.checkMintStatusTimer)
              break
            case MintStatus.mintPending:
              this.currentStep = Step.two
              this.minting = true
              break
            case MintStatus.mintConfirm:
              this.currentStep = Step.succeed
              this.minting = false
              clearTimeout(this.checkMintStatusTimer)
              this.$emit('completed')
              this.onClose()
              break
            case MintStatus.mintFailed:
              this.currentStep = Step.two
              this.minting = false
              clearTimeout(this.checkMintStatusTimer)
              break
          }
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code !== errno.rpcApiErrLockAccountNotExist) {
          this.checkMintStatusTimer = window.setTimeout(() => {
            this.checkMintStatus()
          }, CYCLE_CALL_FUNCTION_TIME * 2)
        }
      }
      finally {
        this.disabled = false
      }
    },
    async onLock () {
      if (this.connectedAccount.chain.coinType !== ETH.coinType) {
        this.noEthereumTipsShowing = true
        return
      }

      this.lockLoading = true
      await this.$walletSdk.onConnect(true)
      try {
        const res = await this.$services.crossEth.lockAccount({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          },
          account: this.account
        })
        if (!res) {
          return
        }

        for (const item of res.sign_list) {
          if (item.sign_msg) {
            if (item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
              const mmJson = JSON.parse(JSON.stringify(res.mm_json))
              mmJson.message.digest = item.sign_msg
              const signDataRes = await this.$walletSdk.signData(mmJson, true)
              item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
            }
            else {
              const signDataRes = await this.$walletSdk.signData(item.sign_msg)
              item.sign_msg = (signDataRes as string)
            }
            // sometimes metamask need a duration to receive next signing request
            await sleep(1000)
          }
        }

        const { hash } = await this.$services.crossEth.trxSend(res)
        this.lockHash = hash
        this.locking = true
        setTimeout(() => {
          this.checkMintStatus()
        }, CYCLE_CALL_FUNCTION_TIME * 10)
        this.$emit('updateDirectionList')
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.rpcApiErrAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: 3 })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorTxExpired) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Please click "Lock .bit" and try again.')
            })
          }
          else if (err.code === errno.rpcApiErrNotHaveOwnerPermission) {
            this.notOwnerTipsShowing = true
          }
          else if (err.code === errno.rpcApiErrExpiredAtCanNotLock) {
            this.canNotBeLockedDialogShowing = true
          }
          else {
            this.$alert({
              title: this.$tt('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.lockLoading = false
      }
    },
    async mintNft () {
      if (this.connectedAccount.chain.coinType !== ETH.coinType) {
        this.noEthereumTipsShowing = true
        return
      }
      this.mintLoading = true
      await this.$walletSdk.onConnect(true)
      try {
        const mintSignInfo = await this.$services.crossEth.mintSignInfo({
          key_info: {
            coin_type: String(this.connectedAccount.chain.coinType),
            key: this.connectedAccount.address
          },
          account: this.account
        })
        const trxId = await this.$walletSdk.mintEthNft(this.account, mintSignInfo.data, mintSignInfo.gnosis_signatures)
        if (trxId) {
          const res = await this.$services.crossEth.pendingHash({
            key_info: {
              coin_type: String(this.connectedAccount.chain.coinType),
              key: this.connectedAccount.address
            },
            account: this.account,
            hash: trxId,
            direction: CrossDirection.fromCKB
          })
          this.mintHash = trxId
        }
        this.minting = true
        setTimeout(() => {
          this.checkMintStatus()
        }, CYCLE_CALL_FUNCTION_TIME * 10)
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else {
            this.$alert({
              title: this.$tt('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.mintLoading = false
      }
    },
    // async mintNft () {
    //   this.mintLoading = true
    //   await this.$walletSdk.onConnect(true)
    //   try {
    //     const mintOrderPayInfo = await this.$services.crossEth.mintOrderPayInfo({
    //       key_info: {
    //         coin_type: String(this.connectedAccount.chain.coinType),
    //         key: this.connectedAccount.address
    //       },
    //       account: this.account
    //     })
    //     const trxId = await this.$walletSdk.sendTrx({
    //       to: mintOrderPayInfo.receipt_address,
    //       value: mintOrderPayInfo.amount,
    //       data: mintOrderPayInfo.order_id
    //     })
    //     if (trxId) {
    //       const res = await this.$services.crossEth.mintOrderPayHash({
    //         key_info: {
    //           coin_type: String(this.connectedAccount.chain.coinType),
    //           key: this.connectedAccount.address
    //         },
    //         order_id: mintOrderPayInfo.order_id,
    //         pay_hash: trxId
    //       })
    //       this.mintHash = trxId
    //     }
    //     this.minting = true
    //     setTimeout(() => {
    //       this.checkMintStatus()
    //     }, CYCLE_CALL_FUNCTION_TIME * 10)
    //   }
    //   catch (err: any) {
    //     console.error(err)
    //     if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
    //       if (err.code === errno.metaMaskWalletRequestPermissions) {
    //         this.$alert({
    //           title: this.$tt('Tips'),
    //           message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
    //         })
    //       }
    //       else {
    //         this.$alert({
    //           title: this.$tt('Error'),
    //           message: err.code ? `${err.code}: ${err.message}` : err
    //         })
    //       }
    //     }
    //   }
    //   finally {
    //     this.mintLoading = false
    //   }
    // }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.mint-nft__desc {
  margin-bottom: 32px;
}

.mint-nft__desc__title {
  margin-bottom: 12px;
  font-weight: 600;
  word-break: break-word;
  hyphens: auto;
}

.mint-nft__faq {
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color
  }
}

.mint-nft__step {
  border-radius: 12px;
  border: 1px solid #E3E5FF;
  padding: 16px;
}

.mint-nft__margin-bottom-12 {
  margin-bottom: 12px;
}

.mint-nft__setp__title {
  text-align: center;
  margin-bottom: 12px;
}

.mint-nft__setp__tag {
  height: 21px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 30px 30px 30px 30px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #5E5F5F;
}

.mint-nft__setp__processing {
  display: flex;
  align-items: center;
  background: #D6EFE7;
  border-radius: 60px;
  padding: 8px 12px;
  color: #22C493;
  font-size: 12px;
}

.mint-nft__setp__processing__title {
  font-size: 14px;
  font-weight: 600;
  color: #22C493;
  line-height: 16px;
}

.mint-nft__setp__processing__icon {
  margin-right: 4px;

  svg {
    animation: rotate360DegAnimation 0.9s linear infinite;
  }
}

.mint-nft__setp__complete {
  height: 52px;
  background: #D6EFE7;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #0DBA85;
}

.mint-nft__desc__rule {
  margin-bottom: 8px;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 2px;
  grid-template-columns: 14px auto;
  font-weight: 400;
  word-break: break-word;
  hyphens: auto;
}

.mint-nft__setp__trx-hash {
  display: flex;
  justify-content: center;
}

.mint-nft__setp__trx-id {
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 12px;
  font-weight: 400;
  color: #B0B8BF;
  line-height: 14px;
  margin-top: 18px;
}

.mint-nft__setp__trx-id__icon {
  margin-left: -8px;
}
</style>
