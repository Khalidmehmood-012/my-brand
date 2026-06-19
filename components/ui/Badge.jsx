export default function Badge({ text }) {
  if (!text) return null

  const styles = {
    'NEW IN': 'bg-black text-white',
    'SALE': 'bg-red-500 text-white',
    'SOLD OUT': 'bg-gray-400 text-white',
  }

  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
        styles[text] || 'bg-black text-white'
      }`}
    >
      {text}
    </span>
  )
}