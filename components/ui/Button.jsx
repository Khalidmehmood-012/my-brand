export default function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
}) {
  const base =
    'py-3 px-6 rounded-xl font-semibold text-sm transition duration-200'

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-black text-black hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  )
}