import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <nav className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-white text-xl font-bold hover:text-blue-200 transition-colors duration-200"
              >
                PocketGrow
              </Link>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-blue-200 focus:outline-none focus:text-blue-200"
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </motion.svg>
            </motion.button>

            {/* Desktop navigation */}
            <div className="hidden lg:flex lg:ml-8 space-x-6">
              <Link
                to="/"
                className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link
                to="/my-savings"
                className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
              >
                My savings
              </Link>
            </div>
          </nav>

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => {
                navigate({ to: '/login' })
              }}
              className="bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Sign In
            </button>
            <button className="bg-blue-800 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200">
              Get Started
            </button>
            <button
              onClick={() => {
                logout()
                navigate({ to: '/' })
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden pb-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div
                className="flex flex-col space-y-3"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Link
                    to="/"
                    className="text-white hover:text-blue-200 transition-colors duration-200 font-medium block px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link
                    to="/my-savings"
                    className="text-white hover:text-blue-200 transition-colors duration-200 font-medium block px-3 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My savings
                  </Link>
                </motion.div>
                <motion.div
                  className="flex flex-col space-y-2 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => {
                      navigate({ to: '/login' })
                      setIsMenuOpen(false)
                    }}
                    className="bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-blue-800 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      logout()
                      navigate({ to: '/' })
                      setIsMenuOpen(false)
                    }}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
