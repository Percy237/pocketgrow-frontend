import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
}

const variants = {
  primary: 'bg-[#4F46E5] text-white hover:bg-indigo-700 disabled:bg-indigo-400',
  secondary:
    'bg-[#F3F4F6] text-[#64748B] hover:bg-gray-200 disabled:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          px-6 py-3 cursor-pointer rounded-md font-semibold transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#4F46E5]  focus:ring-offset-1
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    )
  },
)

export default Button
