
import { useState } from 'react'

const slides = [
  {
    name: 'Bali',
    country: 'Indonesia',
    caption: 'FEATURED DESTINATION',
    image:
      '/images/bali.jpg',
    alt: 'Lush tropical landscape and coastline in Bali, Indonesia',
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    caption: 'ADVENTURE AWAITS',
    image:
      '/images/swiss-alps.jpg',
    alt: 'Snow-covered mountain peaks beneath a starry sky',
  },
  {
    name: 'Kenya',
    country: 'Africa',
    caption: 'WILD & BEAUTIFUL',
    image:
      '/images/kenya.jpg',
    alt: 'Wide African landscape with wildlife in Kenya',
  },
  {
    name: 'Maldives',
    country: 'Indian Ocean',
    caption: 'PARADISE FOUND',
    image:
      '/images/maldives.jpg',
    alt: 'Turquoise water surrounding a tropical island in the Maldives',
  },
]

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const activeSlide = slides[currentSlide]

  function changeSlide(direction) {
    setCurrentSlide(
      (currentSlide + direction + slides.length) % slides.length,
    )
  }

  return (
    <section
      id="home"
      className="grid gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-16 lg:py-20"
    >
      <div>
        <p className="mb-5 text-sm font-semibold tracking-[0.2em] text-emerald-700">
          YOUR NEXT ADVENTURE STARTS HERE
        </p>

        <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          The world is waiting <span className="text-emerald-600">for you.</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
          Discover extraordinary destinations, experience new cultures and
          create memories that last a lifetime.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#tours"
            className="rounded-full bg-emerald-600 px-7 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Explore our tours â†’
          </a>
          <a
            href="#plan"
            className="rounded-full border border-slate-300 px-7 py-3 font-semibold text-slate-800 transition hover:border-emerald-600"
          >
            Plan your trip
          </a>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Curated journeys. Unforgettable memories.
        </p>
      </div>

      <div className="min-w-0">
        <div className="relative h-[420px] overflow-hidden rounded-3xl bg-slate-200 shadow-xl sm:h-[500px]">
          <img
            key={activeSlide.name}
            src={activeSlide.image}
            alt={activeSlide.alt}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          <div className="absolute bottom-6 left-6 text-white sm:bottom-8 sm:left-8">
            <p className="text-xs font-semibold tracking-[0.2em]">
              {activeSlide.caption}
            </p>
            <h2 className="mt-2 text-3xl font-bold">{activeSlide.name}</h2>
            <p className="mt-1 text-sm text-white/80">{activeSlide.country}</p>
          </div>

          <span className="absolute right-6 top-6 rounded-full bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-sm">
            {String(currentSlide + 1).padStart(2, '0')} / 04
          </span>

          <div className="absolute bottom-7 right-6 flex gap-2 sm:right-8">
            <button
              type="button"
              onClick={() => changeSlide(-1)}
              aria-label="Previous destination"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-black/20 text-xl text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
            >
              â†
            </button>
            <button
              type="button"
              onClick={() => changeSlide(1)}
              aria-label="Next destination"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-black/20 text-xl text-white backdrop-blur-sm transition hover:bg-white hover:text-slate-900"
            >
              â†’
            </button>
          </div>
        </div>

        <div
          className="mt-5 flex justify-center gap-3"
          aria-label="Choose a destination"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.name}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show ${slide.name}`}
              aria-pressed={currentSlide === index}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === index
                  ? 'w-8 bg-emerald-600'
                  : 'w-2.5 bg-slate-300 hover:bg-emerald-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero

