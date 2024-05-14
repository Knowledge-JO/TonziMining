import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
} from '@ton/sandbox'
import { Cell, toNano } from '@ton/core'
import { Tonzi } from '../wrappers/TonziFactory'
import '@ton/test-utils'
import { compile } from '@ton/blueprint'

describe('Tonzi', () => {
    let code: Cell

    beforeAll(async () => {
        code = await compile('Tonzi')
    })

    let blockchain: Blockchain
    let deployer: SandboxContract<TreasuryContract>
    let tonzi: SandboxContract<Tonzi>

    beforeEach(async () => {
        blockchain = await Blockchain.create()

        tonzi = blockchain.openContract(
            Tonzi.createFromConfig({}, code),
        )

        deployer = await blockchain.treasury('deployer')

        const deployResult = await tonzi.sendDeploy(
            deployer.getSender(),
            toNano('0.05'),
        )

        expect(deployResult.transactions).toHaveTransaction(
            {
                from: deployer.address,
                to: tonzi.address,
                deploy: true,
                success: true,
            },
        )
    })

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonzi are ready to use
    })
})
