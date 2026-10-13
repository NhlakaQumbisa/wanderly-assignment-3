
import { useState } from 'react'

function TravellerCounter() {
  const [travellers, setTravellers] = useState(1)

  return (
    <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
      <span className="text-sm font-medium text-slate-700">
        Travellers
      </span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setTravellers((count) => Math.max(1, count - 1))}
          disabled={travellers === 1}
          aria-label="Remove one traveller"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg disabled:opacity-40"
        >
          −
        </button>

        <span className="min-w-4 text-center font-semibold" aria-live="polite">
          {travellers}
        </span>

        <button
          type="button"
          onClick={() => setTravellers((count) => Math.min(10, count + 1))}
          disabled={travellers === 10}
          aria-label="Add one traveller"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default TravellerCounter
