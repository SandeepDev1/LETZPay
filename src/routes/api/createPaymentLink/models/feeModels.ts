export interface ethFees {
    gasLimit: string
    gasPrice: string
}

// Polygon
export interface maticFees {
    gasLimit: string
    gasPrice: string
}

// BTC, LTC, DOGE, BCH
export interface ledgerFees {
    fast: string
    medium: string
    slow: string
}