import { Address, toNano } from '@ton/core'

import { compile, NetworkProvider } from '@ton/blueprint'

async function run(provider: NetworkProvider) {
    const sender = provider.sender()
    const address = sender.address
    if (!address) return
}
