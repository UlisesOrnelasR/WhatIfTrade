'use client';

import { useMemo } from 'react';

import TradingViewWidget from '@/components/TradingViewWidget';
import { HEATMAP_WIDGET_CONFIG } from '@/lib/constants';

const STOCK_HEATMAP_SCRIPT_URL = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';

const StockHeatmapWidget = () => {
  const config = useMemo(
    () => ({
      ...HEATMAP_WIDGET_CONFIG,
      symbolUrl:
        typeof window === 'undefined'
          ? HEATMAP_WIDGET_CONFIG.symbolUrl
          : `${window.location.origin}/stocks/{tvsymbol}`,
    }),
    []
  );

  return (
    <TradingViewWidget
      title="Stock Heatmap"
      scriptUrl={STOCK_HEATMAP_SCRIPT_URL}
      config={config}
      height={600}
    />
  );
};

export default StockHeatmapWidget;
