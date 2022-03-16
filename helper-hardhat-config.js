const networkConfig = {
    31337: {
        name: 'localhost',
        keyHash: '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311',
        fee: '100000000000000000',
    },
    4: {
        name: 'rinkeby',
        linkToken: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
        vrfCoordinator: '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B',
        keyHash: '0x2ed0feb3e7fd2022120aa4fab1945545a9f2ffc9076fd6156fa96eaff4c1311',
        fee: '100000000000000000',
    },
    137: {
        name: 'polygon',
        linkToken: '0xb0897686c545045afc77cf20ec7a532e3120e0f1',
        vrfCoordinator: '0x3d2341ADb2D31f1c5530cDC622016af293177AE0',
        keyHash: '0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da',
        fee: '100000000000000000',
    }
}

module.exports = {
    networkConfig
}