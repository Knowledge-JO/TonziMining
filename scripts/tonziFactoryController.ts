import { Address, toNano } from '@ton/core'
import { Tonzi } from '../wrappers/TonziFactory'
import { compile, NetworkProvider } from '@ton/blueprint'

// factory address - EQDYq9v5YzmgpjZxn7VfHY7XXVO18CiE29CfzwT3_dynJJfV

const factoryAddress =
    'EQAwGd0jI2EaNj_O8TodnVv5Nd8OhQ6C1RDTs8diOkhf18Zh'

const walletAddr =
    '0QCnHjatFtuYE38ZKAfTJnKiyknNToK79bRH7Lk2uGEnDd4l'

export async function run(provider: NetworkProvider) {
    const sender = provider.sender()
    const address = sender.address
    if (!address) return

    const tonzi = provider.open(
        Tonzi.createFromAddress(
            Address.parse(factoryAddress),
        ),
    )

    // run methods on `tonzi`

    await tonzi.sendDeposit(sender, toNano('0.1'))

    const addr = await tonzi.getUserTonziAddress(address)
    console.log(addr)
}
