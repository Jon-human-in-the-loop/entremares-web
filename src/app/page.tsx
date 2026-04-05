export default function Home() {
  return (
    <main className="min-h-screen bg-warm-white">
      {/* Hero Section */}
      <section className="w-full px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-dark-brown leading-tight">
            Entremares
          </h1>
          <p className="mb-4 text-lg md:text-xl text-earth-brown font-light">
            Premium Artisanal Alfajores
          </p>
          <p className="mb-8 text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
            Discover the rich heritage of craftsmanship in every bite. Our artisanal alfajores
            are handcrafted with passion, using traditional methods and premium ingredients.
            Perfect for gift-giving or indulging in moments of pure pleasure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-earth-brown text-cream font-semibold rounded-sm hover:bg-dark-brown transition-colors duration-200">
              Explore Gift Packs
            </button>
            <button className="px-8 py-3 border-2 border-earth-brown text-earth-brown font-semibold rounded-sm hover:bg-honey transition-colors duration-200">
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Featured Gift Packs Preview */}
      <section className="w-full px-4 py-16 md:py-24 bg-cream">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-4xl md:text-5xl font-serif font-bold text-dark-brown text-center">
            Curated Gift Packs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pack 1 */}
            <div className="bg-warm-white p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4 h-48 bg-gradient-to-b from-honey to-warm-gold rounded-sm flex items-center justify-center">
                <span className="text-gray-300 text-sm">Product Image</span>
              </div>
              <h3 className="mb-2 text-xl font-serif font-bold text-dark-brown">
                Classic Pack (6 pieces)
              </h3>
              <p className="mb-4 text-gray-700 text-sm leading-relaxed">
                A delightful selection of our signature flavors. Perfect for first-time tasters.
              </p>
              <p className="text-warm-gold font-semibold">Coming Soon</p>
            </div>

            {/* Pack 2 */}
            <div className="bg-warm-white p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4 h-48 bg-gradient-to-b from-honey to-warm-gold rounded-sm flex items-center justify-center">
                <span className="text-gray-300 text-sm">Product Image</span>
              </div>
              <h3 className="mb-2 text-xl font-serif font-bold text-dark-brown">
                Premium Pack (12 pieces)
              </h3>
              <p className="mb-4 text-gray-700 text-sm leading-relaxed">
                Our most popular selection. A complete experience of artisanal craftsmanship.
              </p>
              <p className="text-warm-gold font-semibold">Coming Soon</p>
            </div>

            {/* Pack 3 */}
            <div className="bg-warm-white p-6 rounded-sm shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="mb-4 h-48 bg-gradient-to-b from-honey to-warm-gold rounded-sm flex items-center justify-center">
                <span className="text-gray-300 text-sm">Product Image</span>
              </div>
              <h3 className="mb-2 text-xl font-serif font-bold text-dark-brown">
                Special Edition
              </h3>
              <p className="mb-4 text-gray-700 text-sm leading-relaxed">
                Limited edition flavors and premium gift packaging for special occasions.
              </p>
              <p className="text-warm-gold font-semibold">Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="w-full px-4 py-16 md:py-24 bg-warm-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-4xl md:text-5xl font-serif font-bold text-dark-brown">
            Our Heritage
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="mb-6 text-gray-700 leading-relaxed">
              At Entremares, we believe in the power of tradition and the joy of giving.
              Each alfajor is a testament to generations of craftsmanship, made with love
              and the finest ingredients.
            </p>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Our artisanal approach ensures that every bite carries the warmth of our
              heritage and the passion of our makers. We source premium ingredients and
              maintain traditional production methods to deliver an unforgettable experience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether for gifting or personal indulgence, Entremares represents the best
              of artisanal tradition—premium quality, authentic craftsmanship, and a
              commitment to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-dark-brown text-cream py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="mb-4 text-lg font-serif font-bold">Entremares</h3>
              <p className="text-sm text-honey">Premium artisanal alfajores.</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-serif font-bold">Quick Links</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-warm-gold transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-warm-gold transition-colors">Gift Packs</a></li>
                <li><a href="#" className="hover:text-warm-gold transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-serif font-bold">Contact</h3>
              <p className="text-sm">Portugal</p>
              <p className="text-sm text-honey">Coming soon</p>
            </div>
          </div>
          <div className="border-t border-honey pt-8 text-center text-sm text-honey">
            <p>&copy; 2024 Entremares. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
