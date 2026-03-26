import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { getCurrentUserWatchlist } from "@/lib/actions/watchlist.actions";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type WatchlistHeaderProps = {
  title: string;
  description: string;
  empty?: boolean;
  compact?: boolean;
};

const WatchlistHeader = ({ title, description, empty = false, compact = false }: WatchlistHeaderProps) => (
  <div className={empty ? "mx-auto max-w-2xl text-center" : compact ? "space-y-1" : "space-y-2"}>
    {!compact ? <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-500">Watchlist</p> : null}
    <h1 className={empty ? "watchlist-title mt-3" : compact ? "text-lg font-semibold text-gray-100 md:text-xl" : "watchlist-title mt-3"}>
      {title}
    </h1>
    <p className={empty ? "empty-description mb-0 mt-2 max-w-2xl text-gray-400" : compact ? "max-w-2xl text-sm leading-6 text-gray-400" : "empty-description mb-0 mt-2 max-w-2xl text-gray-400"}>
      {description}
    </p>

    {empty ? (
      <Link
        href="/"
        className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-yellow-500 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
      >
        Explore the market
      </Link>
    ) : null}
  </div>
);

const WatchlistPage = async () => {
  const watchlist = await getCurrentUserWatchlist();

  if (watchlist.length === 0) {
    return (
      <section className="flex justify-center py-8 md:py-10">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-600 bg-gray-800/70 p-6 md:p-8">
          <WatchlistHeader
            empty
            title="Your watchlist is empty"
            description="Save a stock from its detail page and it will be ready here whenever you want to jump back into the chart."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-3">
      <div className="rounded-2xl border border-gray-700/80 bg-gray-800/40 px-4 py-4 md:px-5">
        <WatchlistHeader
          compact
          title="Saved stocks"
          description="Keep the names you want to revisit in one clean place and jump back into any stock page in a click."
        />
      </div>

      <div className="grid gap-4">
        {watchlist.map((item) => (
          <article
            key={item.symbol}
            className="flex flex-col gap-3 rounded-2xl border border-gray-700/80 bg-gray-800/70 p-4 transition-colors hover:border-gray-500/70 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">{item.symbol}</p>
                <Link href={`/stocks/${item.symbol}`} className="mt-2 block text-xl font-semibold text-gray-100 hover:text-yellow-500">
                  {item.company}
                </Link>
              </div>

              <p className="text-sm text-gray-400">Added {dateFormatter.format(new Date(item.addedAt))}</p>
            </div>

            <div className="w-full md:w-auto md:min-w-56">
              <WatchlistButton
                symbol={item.symbol}
                company={item.company}
                isInWatchlist
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WatchlistPage;
