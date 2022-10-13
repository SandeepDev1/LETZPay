export interface ethFees {
    gasLimit: string
    gasPrice: string
}

export interface celoFees {
    gasLimit: number
    gasPrice: string
}

// KuCoin
export interface kcsFees {
    gasLimit: string
    gasPrice: string
}

// Klaytn
export interface klayFees {
    gasLimit: string
    gasPrice: string
}

// Polygon
export interface maticFees {
    gasLimit: string
    gasPrice: string
}

//XinFin
export interface xdcFees {
    gasLimit: string
    gasPrice: string
}

// BTC, LTC, DOGE, BCH
export interface ledgerFees {
    fast: string
    medium: string
    slow: string
}