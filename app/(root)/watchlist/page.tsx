const WatchlistPage = () => {
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
                <h1 className="watchlist-title mt-4">Your watchlist lives here</h1>
                <p className="empty-description mb-0 mt-4">
                    This first slice only unlocks the navigation entry point. Data management and saved stocks
                    will arrive in a future iteration.
                </p>
            </div>
        </section>
    )
}

export default WatchlistPage
