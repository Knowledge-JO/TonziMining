import { Address, fromNano, toNano } from '@ton/core'

import { NetworkProvider } from '@ton/blueprint'
import { TonziWallet } from '../wrappers/TonziWallet'

const tonziWalletAddress =
    'EQCbFs2UN_yaS0wLVRyyvGXU-G1pZYbktl8lO5952_HTDI1V'

export async function run(provider: NetworkProvider) {
    const sender = provider.sender()
    const address = sender.address
    if (!address) return

    const tonziWallet = provider.open(
        TonziWallet.createFromAddress(
            Address.parse(tonziWalletAddress),
        ),
    )

    const userBalance =
        await tonziWallet.getContractBalance()
    console.log(fromNano(userBalance))
}
