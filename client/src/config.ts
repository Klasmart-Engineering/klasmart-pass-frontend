export function getPaymentEndpoint() {
    return "" + process.env.PAYMENT_ENDPOINT
}

export function getAuthEndpoint() {
    return "" + process.env.AUTH_ENDPOINT
}

export function getAccountEndpoint() {
    return "" + process.env.ACCOUNT_ENDPOINT
}

export function getProductEndpoint() {
    return "" + process.env.PRODUCT_ENDPOINT
}

export function getOrganizationEndpoint(regionId: string) {
    switch (regionId.toLowerCase()) {
        case "seoul": {
            return "" + process.env.ORGANIZATION_SEOUL_ENDPOINT
        }
        case "mumbai": {
            return "" + process.env.ORGANIZATION_MUMBAI_ENDPOINT
        }
        case "tokyo": {
            return "" + process.env.ORGANIZATION_TOKYO_ENDPOINT
        }
        case "frankfurt": {
            return "" + process.env.ORGANIZATION_FRANKFURT_ENDPOINT
        }
        case "oregon": {
            return "" + process.env.ORGANIZATION_OREGON_ENDPOINT
        }
        default: {
            return "" + process.env.ORGANIZATION_ENDPOINT
        }
    }
}