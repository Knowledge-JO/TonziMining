import {
    Address,
    Contract,
    Cell,
    beginCell,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from '@ton/core'

type TonziWalletConfig = {}

function tonziWalletConfigToCell(
    config: TonziWalletConfig,
): Cell {
    return beginCell().endCell()
}

export class TonziWallet implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new TonziWallet(address)
    }

    static createFromConfig(
        config: TonziWalletConfig,
        code: Cell,
        workchain = 0,
    ) {
        const data = tonziWalletConfigToCell(config)
        const init = { code, data }

        return new TonziWallet(
            contractAddress(workchain, init),
            init,
        )
    }

    async sendDeploy(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        })
    }

    async getContractBalance(
        provider: ContractProvider,
    ): Promise<number> {
        const res = await provider.get('user_balance', [])
        const balance = res.stack.readNumber()
        return balance
    }
}
