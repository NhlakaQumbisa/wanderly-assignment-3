
function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#" className="text-2xl font-bold tracking-tight text-slate-900">
          Wanderly<span className="text-emerald-500">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#destinations" className="text-slate-600 hover:text-emerald-600">
            Destinations
          </a>
          <a href="#about" className="text-slate-600 hover:text-emerald-600">
            About
          </a>
          <a href="#reviews" className="text-slate-600 hover:text-emerald-600">
            Reviews
          </a>
        </div>

        <a
          href="#destinations"
          className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          Explore trips
        </a>
      </nav>
    </header>
  )
}

export default Header
