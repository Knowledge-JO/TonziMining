import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from '@ton/core'

export type TonziConfig = {
    adminAddress: Address
    tonziWalletCode: Cell
}

export function tonziConfigToCell(
    config: TonziConfig,
): Cell {
    return beginCell()
        .storeAddress(config.adminAddress)
        .storeRef(config.tonziWalletCode)
        .endCell()
}

export class Tonzi implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Tonzi(address)
    }

    static createFromConfig(
        config: TonziConfig,
        code: Cell,
        workchain = 0,
    ) {
        const data = tonziConfigToCell(config)
        const init = { code, data }
        return new Tonzi(
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

    async sendDeposit(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(1, 32)
                .storeCoins(value)
                .endCell(),
        })
    }

    async getUserTonziAddress(
        provider: ContractProvider,
        address: Address,
    ): Promise<Address> {
        const res = await provider.get(
            'get_user_tonzi_wallet_address',
            [
                {
                    type: 'slice',
                    cell: beginCell()
                        .storeAddress(address)
                        .endCell(),
                },
            ],
        )

        return res.stack.readAddress()
    }
}
