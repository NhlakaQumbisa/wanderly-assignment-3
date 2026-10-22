
import Header from './components/Header'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <section
          aria-label="Our travel approach"
          className="grid grid-cols-1 gap-5 border-y border-slate-200 px-6 py-8 sm:grid-cols-3 sm:px-10 lg:px-16"
        >
          <p className="text-sm font-medium text-slate-700">
            <span className="mr-3 font-bold text-emerald-600">01</span>
            Thoughtfully curated trips
          </p>

          <p className="text-sm font-medium text-slate-700">
            <span className="mr-3 font-bold text-emerald-600">02</span>
            Local experiences
          </p>

          <p className="text-sm font-medium text-slate-700">
            <span className="mr-3 font-bold text-emerald-600">03</span>
            Memories that stay
          </p>
        </section>

        <Destinations />
      </main>

      <Footer />
    </>
  )
}

export default App
