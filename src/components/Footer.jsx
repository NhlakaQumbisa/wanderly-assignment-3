
function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <a href="#" className="text-2xl font-bold">
            Wanderly<span className="text-emerald-400">.</span>
          </a>
          <p className="mt-4 max-w-sm leading-7 text-slate-400">
            Discover incredible destinations, experience new cultures, and
            make memories that last a lifetime.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Explore</h3>
          <ul className="mt-4 space-y-3 text-slate-400">
            <li><a href="#destinations" className="hover:text-emerald-400">Destinations</a></li>
            <li><a href="#about" className="hover:text-emerald-400">About us</a></li>
            <li><a href="#reviews" className="hover:text-emerald-400">Reviews</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Plan your trip</h3>
          <p className="mt-4 leading-7 text-slate-400">
            Your next adventure is only a few steps away.
          </p>
          <a
            href="#destinations"
            className="mt-4 inline-block rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Explore trips →
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        © {new Date().getFullYear()} Wanderly. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
