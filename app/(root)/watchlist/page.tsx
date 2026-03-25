import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { getCurrentUserWatchlist } from "@/lib/actions/watchlist.actions";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const WatchlistPage = async () => {
  const watchlist = await getCurrentUserWatchlist();

  if (watchlist.length === 0) {
    return (
      <section className="watchlist-empty-container flex min-h-[calc(100vh-10rem)] justify-center">
        <div className="watchlist-empty max-w-2xl rounded-2xl border border-gray-600 bg-gray-800/70 px-6 py-10 md:px-10">
          <div className="watchlist-icon rounded-full border border-gray-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="star-icon h-8 w-8 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
              />
            </svg>
          </div>

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-500">Watchlist</p>
          <h1 className="watchlist-title mt-4">Your watchlist is empty</h1>
          <p className="empty-description mb-0 mt-4">
            Add a stock from its detail page and it will stay saved to your account here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="rounded-2xl border border-gray-600 bg-gray-800/70 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-yellow-500">Watchlist</p>
        <h1 className="watchlist-title mt-4">Saved stocks</h1>
        <p className="empty-description mb-0 mt-3 max-w-2xl text-left">
          Your watchlist is stored in MongoDB for this account and stays in sync across sessions.
        </p>
      </div>

      <div className="grid gap-4">
        {watchlist.map((item) => (
          <article
            key={item.symbol}
            className="flex flex-col gap-4 rounded-2xl border border-gray-600 bg-gray-800/70 p-5 md:flex-row md:items-center md:justify-between"
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
                showTrashIcon
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WatchlistPage;
