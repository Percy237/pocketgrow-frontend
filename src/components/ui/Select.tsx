import { forwardRef, useEffect, useRef, useState } from 'react'
import type { HTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string
  error?: string
  options?: Array<SelectOption>
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      className = '',
      options = [],
      placeholder,
      value: controlledValue,
      defaultValue = '',
      disabled = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue)
    const selectRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const selectedOption = options.find((option) => option.value === value)
    const displayText =
      selectedOption?.label ||
      placeholder ||
      `Select ${label ? label.toLowerCase() : 'an option'}`

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])

    const handleOptionClick = (optionValue: string) => {
      if (!isControlled) {
        setInternalValue(optionValue)
      }
      onChange?.(optionValue)
      setIsOpen(false)
    }

    const handleTriggerClick = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    return (
      <div className="w-full" ref={ref} {...props}>
        {label && (
          <label
            className="block text-sm font-medium text-[#64748B] mb-1"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <div className="relative" ref={selectRef}>
          <div
            className={`
              w-full rounded-md border border-gray-300 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]
              disabled:bg-[#F3F4F6] disabled:cursor-not-allowed
              flex items-center justify-between
              ${isOpen ? 'ring-2 ring-[#4F46E5] border-[#4F46E5]' : ''}
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              ${disabled ? 'text-gray-400' : 'cursor-pointer bg-white'}
              ${className}
            `}
            onClick={handleTriggerClick}
          >
            <span className="truncate">{displayText}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {isOpen && !disabled && (
            <div
              ref={dropdownRef}
              className="
                absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg
                border border-gray-200 max-h-60 overflow-auto
              "
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-4 py-2 cursor-pointer hover:bg-gray-50
                    ${option.value === value ? 'bg-[#EEF2FF] text-[#4F46E5]' : ''}
                    ${option.disabled ? 'text-gray-400 cursor-not-allowed' : ''}
                  `}
                  onClick={() =>
                    !option.disabled && handleOptionClick(option.value)
                  }
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
