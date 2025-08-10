import { createFileRoute } from '@tanstack/react-router'

import { Logo } from '@/assets/images'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img
            src={Logo}
            className="h-32 w-32 mx-auto mb-8 animate-[spin_20s_linear_infinite] drop-shadow-2xl"
            alt="logo"
          />
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text ">
          PocketGrow
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
          Your personal finance companion for smart money management and growth
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Get Started
          </button>
          <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
