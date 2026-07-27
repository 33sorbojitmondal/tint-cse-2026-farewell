export default function ProgressBar({ progress }) {
  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Story progress"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-soft transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
