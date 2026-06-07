export type SymbolPair = {
  symbol: string;
  baseAsset: string;
  name: string;
  group: string;
};

export const SYMBOL_PAIRS = [
  { symbol: "BTCUSDT", baseAsset: "BTC", name: "Bitcoin", group: "Major" },
  { symbol: "ETHUSDT", baseAsset: "ETH", name: "Ethereum", group: "Major" },
  { symbol: "SOLUSDT", baseAsset: "SOL", name: "Solana", group: "Layer 1" },
  { symbol: "BNBUSDT", baseAsset: "BNB", name: "BNB", group: "Exchange" },
  { symbol: "HYPEUSDT", baseAsset: "HYPE", name: "Hyperliquid", group: "DeFi" },
  { symbol: "ADAUSDT", baseAsset: "ADA", name: "Cardano", group: "Layer 1" },
  { symbol: "XRPUSDT", baseAsset: "XRP", name: "XRP", group: "Payments" },
  { symbol: "DOGEUSDT", baseAsset: "DOGE", name: "Dogecoin", group: "Large cap" },
  { symbol: "AVAXUSDT", baseAsset: "AVAX", name: "Avalanche", group: "Layer 1" },
  { symbol: "LINKUSDT", baseAsset: "LINK", name: "Chainlink", group: "Oracle" },
  { symbol: "TRXUSDT", baseAsset: "TRX", name: "TRON", group: "Layer 1" },
  { symbol: "TONUSDT", baseAsset: "TON", name: "Toncoin", group: "Layer 1" },
  { symbol: "SUIUSDT", baseAsset: "SUI", name: "Sui", group: "Layer 1" },
  { symbol: "DOTUSDT", baseAsset: "DOT", name: "Polkadot", group: "Layer 1" },
  { symbol: "LTCUSDT", baseAsset: "LTC", name: "Litecoin", group: "Payments" },
  { symbol: "BCHUSDT", baseAsset: "BCH", name: "Bitcoin Cash", group: "Payments" },
  { symbol: "UNIUSDT", baseAsset: "UNI", name: "Uniswap", group: "DeFi" },
  { symbol: "AAVEUSDT", baseAsset: "AAVE", name: "Aave", group: "DeFi" },
  { symbol: "NEARUSDT", baseAsset: "NEAR", name: "NEAR Protocol", group: "Layer 1" },
  { symbol: "ICPUSDT", baseAsset: "ICP", name: "Internet Computer", group: "Layer 1" },
  { symbol: "FILUSDT", baseAsset: "FIL", name: "Filecoin", group: "Storage" },
  { symbol: "INJUSDT", baseAsset: "INJ", name: "Injective", group: "DeFi" },
  { symbol: "ATOMUSDT", baseAsset: "ATOM", name: "Cosmos", group: "Layer 1" },
  { symbol: "ETCUSDT", baseAsset: "ETC", name: "Ethereum Classic", group: "Layer 1" },
  { symbol: "ARBUSDT", baseAsset: "ARB", name: "Arbitrum", group: "Layer 2" },
  { symbol: "OPUSDT", baseAsset: "OP", name: "Optimism", group: "Layer 2" },
  { symbol: "APTUSDT", baseAsset: "APT", name: "Aptos", group: "Layer 1" },
  { symbol: "SEIUSDT", baseAsset: "SEI", name: "Sei", group: "Layer 1" },
  { symbol: "RUNEUSDT", baseAsset: "RUNE", name: "THORChain", group: "DeFi" },
  { symbol: "FETUSDT", baseAsset: "FET", name: "Artificial Superintelligence Alliance", group: "AI" },
  { symbol: "TAOUSDT", baseAsset: "TAO", name: "Bittensor", group: "AI" },
  { symbol: "RENDERUSDT", baseAsset: "RENDER", name: "Render", group: "AI" },
  { symbol: "WLDUSDT", baseAsset: "WLD", name: "Worldcoin", group: "Identity" },
  { symbol: "PENDLEUSDT", baseAsset: "PENDLE", name: "Pendle", group: "DeFi" },
  { symbol: "JUPUSDT", baseAsset: "JUP", name: "Jupiter", group: "DeFi" },
  { symbol: "PYTHUSDT", baseAsset: "PYTH", name: "Pyth Network", group: "Oracle" },
  { symbol: "TIAUSDT", baseAsset: "TIA", name: "Celestia", group: "Modular" },
  { symbol: "ENAUSDT", baseAsset: "ENA", name: "Ethena", group: "DeFi" },
  { symbol: "ONDOUSDT", baseAsset: "ONDO", name: "Ondo", group: "RWA" },
  { symbol: "STRKUSDT", baseAsset: "STRK", name: "Starknet", group: "Layer 2" },
  { symbol: "OMUSDT", baseAsset: "OM", name: "MANTRA", group: "RWA" },
  { symbol: "POLUSDT", baseAsset: "POL", name: "Polygon", group: "Layer 2" },
  { symbol: "ALGOUSDT", baseAsset: "ALGO", name: "Algorand", group: "Layer 1" },
  { symbol: "VETUSDT", baseAsset: "VET", name: "VeChain", group: "Supply chain" },
  { symbol: "HBARUSDT", baseAsset: "HBAR", name: "Hedera", group: "Layer 1" },
  { symbol: "XLMUSDT", baseAsset: "XLM", name: "Stellar", group: "Payments" },
  { symbol: "QNTUSDT", baseAsset: "QNT", name: "Quant", group: "Interoperability" },
  { symbol: "KASUSDT", baseAsset: "KAS", name: "Kaspa", group: "Layer 1" },
  { symbol: "STXUSDT", baseAsset: "STX", name: "Stacks", group: "Bitcoin ecosystem" },
  { symbol: "IMXUSDT", baseAsset: "IMX", name: "Immutable", group: "Gaming" },
  { symbol: "GRTUSDT", baseAsset: "GRT", name: "The Graph", group: "Data" },
  { symbol: "SANDUSDT", baseAsset: "SAND", name: "The Sandbox", group: "Gaming" },
  { symbol: "MANAUSDT", baseAsset: "MANA", name: "Decentraland", group: "Gaming" },
  { symbol: "AXSUSDT", baseAsset: "AXS", name: "Axie Infinity", group: "Gaming" },
  { symbol: "FLOWUSDT", baseAsset: "FLOW", name: "Flow", group: "Layer 1" },
  { symbol: "CHZUSDT", baseAsset: "CHZ", name: "Chiliz", group: "Fan tokens" },
  { symbol: "GALAUSDT", baseAsset: "GALA", name: "Gala", group: "Gaming" },
  { symbol: "LDOUSDT", baseAsset: "LDO", name: "Lido DAO", group: "DeFi" },
  { symbol: "CRVUSDT", baseAsset: "CRV", name: "Curve", group: "DeFi" },
  { symbol: "MKRUSDT", baseAsset: "MKR", name: "Maker", group: "DeFi" },
  { symbol: "COMPUSDT", baseAsset: "COMP", name: "Compound", group: "DeFi" },
  { symbol: "SNXUSDT", baseAsset: "SNX", name: "Synthetix", group: "DeFi" },
  { symbol: "DYDXUSDT", baseAsset: "DYDX", name: "dYdX", group: "DeFi" },
  { symbol: "ZROUSDT", baseAsset: "ZRO", name: "LayerZero", group: "Interoperability" },
  { symbol: "EGLDUSDT", baseAsset: "EGLD", name: "MultiversX", group: "Layer 1" },
  { symbol: "XTZUSDT", baseAsset: "XTZ", name: "Tezos", group: "Layer 1" },
  { symbol: "IOTAUSDT", baseAsset: "IOTA", name: "IOTA", group: "Infrastructure" },
  { symbol: "MINAUSDT", baseAsset: "MINA", name: "Mina", group: "Layer 1" },
  { symbol: "ROSEUSDT", baseAsset: "ROSE", name: "Oasis", group: "Privacy" },
  { symbol: "ZECUSDT", baseAsset: "ZEC", name: "Zcash", group: "Privacy" },
  { symbol: "DASHUSDT", baseAsset: "DASH", name: "Dash", group: "Payments" },
  { symbol: "KAVAUSDT", baseAsset: "KAVA", name: "Kava", group: "DeFi" },
  { symbol: "CAKEUSDT", baseAsset: "CAKE", name: "PancakeSwap", group: "DeFi" },
  { symbol: "1INCHUSDT", baseAsset: "1INCH", name: "1inch", group: "DeFi" },
  { symbol: "ENSUSDT", baseAsset: "ENS", name: "Ethereum Name Service", group: "Infrastructure" },
  { symbol: "WOOUSDT", baseAsset: "WOO", name: "WOO Network", group: "Exchange" },
  { symbol: "GMXUSDT", baseAsset: "GMX", name: "GMX", group: "DeFi" },
  { symbol: "FXSUSDT", baseAsset: "FXS", name: "Frax Share", group: "DeFi" },
  { symbol: "LPTUSDT", baseAsset: "LPT", name: "Livepeer", group: "DePIN" },
  { symbol: "ARUSDT", baseAsset: "AR", name: "Arweave", group: "Storage" },
  { symbol: "AKTUSDT", baseAsset: "AKT", name: "Akash Network", group: "DePIN" },
  { symbol: "JASMYUSDT", baseAsset: "JASMY", name: "JasmyCoin", group: "Data" },
  { symbol: "IOTXUSDT", baseAsset: "IOTX", name: "IoTeX", group: "DePIN" },
  { symbol: "CFXUSDT", baseAsset: "CFX", name: "Conflux", group: "Layer 1" },
  { symbol: "CELOUSDT", baseAsset: "CELO", name: "Celo", group: "Layer 1" },
  { symbol: "ZILUSDT", baseAsset: "ZIL", name: "Zilliqa", group: "Layer 1" },
  { symbol: "ANKRUSDT", baseAsset: "ANKR", name: "Ankr", group: "Infrastructure" },
  { symbol: "BATUSDT", baseAsset: "BAT", name: "Basic Attention Token", group: "Web3" },
  { symbol: "ZRXUSDT", baseAsset: "ZRX", name: "0x Protocol", group: "DeFi" }
] satisfies SymbolPair[];

export function searchSymbolPairs(query: string, limit = 12): SymbolPair[] {
  const normalized = query.trim().toUpperCase();

  if (!normalized) {
    return SYMBOL_PAIRS.slice(0, limit);
  }

  return SYMBOL_PAIRS.filter((pair) => {
    const haystack = `${pair.symbol} ${pair.baseAsset} ${pair.name} ${pair.group}`.toUpperCase();
    return haystack.includes(normalized);
  }).slice(0, limit);
}
