
import { useEffect, useState } from 'react'
import DestinationCard from './DestinationCard'

function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/destinations',
        )

        if (!response.ok) {
          throw new Error('Unable to load destinations.')
        }

        const data = await response.json()
        setDestinations(data.destinations)
      } catch (err) {
        setError(
          'We could not load destinations. Please check that the Wanderly API is running.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const categories = ['All', 'Beach', 'Adventure']

  const filteredDestinations =
    selectedCategory === 'All'
      ? destinations
      : destinations.filter(
          (destination) => destination.category === selectedCategory,
        )

  return (
    <section id="destinations" className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="font-semibold uppercase tracking-widest text-emerald-600">
            Find your escape
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl">
            Explore our destinations
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            From tropical beaches to spectacular mountains, discover a trip
            that matches your sense of adventure.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-slate-600" role="status">
            Loading destinations...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-red-600" role="alert">
            {error}
          </p>
        ) : (
          <>
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-3 font-medium transition ${
                    selectedCategory === category
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <p className="mb-5 text-sm text-slate-500" aria-live="polite">
              Showing {filteredDestinations.length} destinations
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </div>

            {filteredDestinations.length === 0 && (
              <p className="py-12 text-center text-slate-600">
                No destinations found in this category.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Destinations
