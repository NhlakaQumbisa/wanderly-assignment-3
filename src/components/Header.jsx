
function Header({
  user,
  checkingSession,
  onLogin,
  onSignup,
  onLogout
}) {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <a
          href="#"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          Wanderly<span className="text-emerald-500">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#destinations"
            className="text-slate-600 hover:text-emerald-600"
          >
            Destinations
          </a>

          <a
            href="#about"
            className="text-slate-600 hover:text-emerald-600"
          >
            About
          </a>

          <a
            href="#reviews"
            className="text-slate-600 hover:text-emerald-600"
          >
            Reviews
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {checkingSession ? (
            <span className="text-sm text-slate-500">
              Loading...
            </span>
          ) : user ? (
            <>
              <span className="text-sm font-medium text-slate-700">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-emerald-600"
              >
                Login
              </button>

              <button
                type="button"
                onClick={onSignup}
                className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                Sign Up
              </button>
            </>
          )}

          <a
            href="#destinations"
            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Explore trips
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Header
