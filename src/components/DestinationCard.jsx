import TravellerCounter from './TravellerCounter'
function DestinationCard({ destination }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
       <img
  src={destination.image_url}
  alt={destination.name}
  className="h-full w-full object-cover transition duration-500 hover:scale-105"
/>

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-800">
          {destination.category}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {destination.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {destination.duration}
            </p>
          </div>

          <span className="whitespace-nowrap text-sm font-semibold text-amber-500">
            ★ {destination.rating}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {destination.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="text-xl font-bold text-slate-900">
              ${destination.price.toLocaleString()}
            </p>
          </div>

          <a
            href="#plan-trip"
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            View trip
          </a>
        </div>
        <TravellerCounter />
      </div>
    </article>  )
}

export default DestinationCard
