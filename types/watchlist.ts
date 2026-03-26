export type StockWithWatchlistStatus = Stock & {
    isInWatchlist: boolean;
};

export type SearchCommandProps = {
    renderAs?: 'button' | 'text';
    label?: string;
    initialStocks: StockWithWatchlistStatus[];
};

export type WatchlistButtonProps = {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    type?: 'button' | 'icon';
    onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
};

export type WatchlistMutationResult = {
    success: boolean;
    error?: string;
};

export type WatchlistListItem = {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
};
