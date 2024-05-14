import { Address, toNano } from '@ton/core'
import { Tonzi } from '../wrappers/TonziFactory'
import { compile, NetworkProvider } from '@ton/blueprint'

// factory address - EQAkQbI7KpN2gdpLxeLx5-3IyovZcCMl8gtObS0JhdgyzCeX

export async function run(provider: NetworkProvider) {
    const sender = provider.sender()
    const address = sender.address
    if (!address) return

    const tonzi = provider.open(
        Tonzi.createFromConfig(
            {
                adminAddress: address,
                tonziWalletCode:
                    await compile('TonziWallet'),
            },
            await compile('TonziFactory'),
        ),
    )

    await tonzi.sendDeploy(sender, toNano('0.05'))

    await provider.waitForDeploy(tonzi.address)

    // run methods on `tonzi`
}
