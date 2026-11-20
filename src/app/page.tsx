
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Classic Pizza", icon: "🍕" },
  { name: "Vegetarian", icon: "🥦" },
  { name: "Meat Lovers", icon: "🥩" },
  { name: "Specialty Pizza", icon: "🧀" },
  { name: "Sides & Appetizers", icon: "🍟" },
  { name: "Drinks & Desserts", icon: "🥤" },
];

const features = [
  {
    icon: "🚀",
    title: "Fast Delivery",
    description: "Hot and fresh pizzas delivered right to your doorstep.",
  },
  {
    icon: "👨‍🍳",
    title: "Quality Ingredients",
    description: "Made with fresh ingredients and delicious flavors.",
  },
  {
    icon: "❤️",
    title: "Made with Love",
    description: "Every pizza is prepared with care and passion.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf4] text-[#29211d]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-2xl font-black text-[#d93824]">
            🍕 PizzaHub
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link href="/" className="text-[#d93824]">Home</Link>
            <Link href="/menu" className="hover:text-[#d93824]">Browse Menu</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-full px-4 py-2 text-sm font-bold hover:text-[#d93824]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[#d93824] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b92d1c]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-[#d93824]">
            🍕 Freshly Baked, Always Delicious
          </span>

          <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Hot & Fresh Pizza
            <span className="block text-[#d93824]">
              Delivered to Your Door
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
            Discover amazing local pizza restaurants, explore delicious menus,
            and enjoy your favorite pizza without leaving home.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-[#d93824] px-8 py-4 font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-1 hover:bg-[#b92d1c]"
            >
              Explore Pizza Menu →
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full border-2 border-orange-200 px-8 py-4 font-bold transition hover:border-[#d93824] hover:text-[#d93824]"
            >
              Join PizzaHub
            </Link>
          </div>

          <div className="mt-10 flex gap-8">
            <div>
              <h3 className="text-2xl font-black text-[#d93824]">Fresh</h3>
              <p className="text-sm text-gray-500">Quality Food</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#d93824]">Local</h3>
              <p className="text-sm text-gray-500">Pizza Shops</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#d93824]">Easy</h3>
              <p className="text-sm text-gray-500">Ordering</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-5 rounded-full bg-orange-200 blur-3xl" />
          <Image
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000"
            alt="Freshly baked delicious pizza"
            width={700}
            height={650}
            priority
            unoptimized
            className="relative z-10 w-full rounded-[40px] object-cover shadow-2xl"
          />
          <div className="absolute -bottom-5 -left-3 z-20 rounded-2xl bg-white p-5 shadow-xl md:left-0">
            <p className="font-black text-[#d93824]">Made Fresh Daily</p>
            <p className="text-sm text-gray-500">Every slice matters ❤️</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[#d93824]">
              Explore Our Menu
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Find Your Favorite Pizza
            </h2>
            <p className="mt-4 text-gray-500">
              Something delicious for every pizza lover.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                href="/menu"
                key={category.name}
                className="group rounded-3xl border border-orange-100 bg-[#fffaf4] p-6 text-center transition hover:-translate-y-2 hover:border-[#d93824] hover:shadow-xl"
              >
                <span className="text-4xl">{category.icon}</span>
                <h3 className="mt-4 text-sm font-bold group-hover:text-[#d93824]">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-bold uppercase tracking-widest text-[#d93824]">
              Our Favorites
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Featured Menu Items
            </h2>
            <p className="mt-3 text-gray-500">
              Discover delicious pizzas from local restaurants.
            </p>
          </div>

          <Link
            href="/menu"
            className="font-bold text-[#d93824] hover:underline"
          >
            View All Menu →
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-dashed border-orange-300 bg-white p-12 text-center">
          <span className="text-5xl">🍕</span>
          <h3 className="mt-5 text-xl font-bold">
            Delicious pizzas are waiting!
          </h3>
          <p className="mt-3 text-gray-500">
            Browse our menu to discover available pizzas from local restaurants.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-block rounded-full bg-[#d93824] px-7 py-3 font-bold text-white hover:bg-[#b92d1c]"
          >
            Browse Menu
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#fff0e5] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[#d93824]">
              Why PizzaHub?
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              More Than Just Pizza
            </h2>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl bg-white p-9 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <span className="text-5xl">{feature.icon}</span>
                <h3 className="mt-6 text-xl font-black">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center">
          <p className="font-bold uppercase tracking-widest text-[#d93824]">
            Simple & Easy
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            How PizzaHub Works
          </h2>
        </div>

        <div className="mt-12 grid gap-10 text-center md:grid-cols-3">
          {[
            { number: "01", title: "Explore", text: "Discover pizzas from local restaurants." },
            { number: "02", title: "Choose", text: "Find your favorite pizza and place an order." },
            { number: "03", title: "Enjoy", text: "Get ready to enjoy your delicious pizza." },
          ].map((step) => (
            <div key={step.number}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d93824] text-xl font-black text-white">
                {step.number}
              </div>
              <h3 className="mt-5 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-gray-500">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#241a17] py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3 lg:px-8">
          <div>
            <Link href="/" className="text-2xl font-black text-[#ff654d]">
              🍕 PizzaHub
            </Link>
            <p className="mt-4 max-w-sm leading-7 text-gray-400">
              Discover local pizza restaurants and enjoy delicious food
              delivered to your door.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/menu" className="hover:text-white">Browse Menu</Link>
              <Link href="/sign-in" className="hover:text-white">Sign In</Link>
              <Link href="/sign-up" className="hover:text-white">Sign Up</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Contact</h3>
            <p className="mt-4 text-gray-400">Email: support@pizzahub.com</p>
            <p className="mt-3 text-gray-400">Fresh Pizza, Happy Moments!</p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PizzaHub. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
