'use client'

interface SaveButtonProps {
  onSave: () => void
  saving?: boolean
  label?: string
}

export default function SaveButton({
  onSave,
  saving = false,
  label = '保存',
}: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#0F1C1A] bg-[#0F1C1A] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#B08D57] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {label}
    </button>
  )
}
