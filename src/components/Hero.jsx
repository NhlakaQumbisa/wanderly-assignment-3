
function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-emerald-950/40" />

      <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            Discover your next adventure
          </p>

          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            The world is
            <span className="block text-emerald-400">waiting for you.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Explore unforgettable destinations, discover hidden gems, and
            create memories that last a lifetime.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#destinations"
              className="rounded-full bg-emerald-400 px-7 py-4 font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Explore destinations →
            </a>

            <a
              href="#about"
              className="rounded-full border border-white/20 px-7 py-4 font-semibold transition hover:bg-white/10"
            >
              Discover our story
            </a>
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="mt-1 text-sm text-slate-400">Destinations</p>
            </div>

            <div>
              <p className="text-2xl font-bold">4.9/5</p>
              <p className="mt-1 text-sm text-slate-400">Traveller rating</p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[320px] items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative flex h-72 w-full max-w-md items-center justify-center rounded-[2rem] border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-sm md:h-96">
            <div className="absolute left-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm">
              ✦ Your next escape
            </div>

            <div className="text-center">
              <span className="text-8xl">🌍</span>
              <p className="mt-5 text-2xl font-semibold">Adventure awaits</p>
              <p className="mt-2 text-slate-400">
                One world. Endless possibilities.
              </p>
            </div>

            <div className="absolute bottom-5 right-5 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
              <p className="text-xs text-slate-400">Your journey starts here</p>
              <p className="mt-1 font-semibold text-emerald-300">
                Explore more ✈
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
