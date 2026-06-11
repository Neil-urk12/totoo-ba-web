import fdaLogo from '../assets/fda_logo.webp'

export default function Maintenance() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
      role="main"
    >
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center gap-1 mb-8" aria-hidden="true">
          <span
            className="inline-block w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--fg)", animationDelay: "0ms" }}
          />
          <span
            className="inline-block w-4 h-4 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--fg)", animationDelay: "300ms" }}
          />
          <img
            src={fdaLogo}
            alt=""
            className="h-10 w-10 object-contain ml-1"
          />
          <span
            className="text-2xl font-bold tracking-tight ml-1"
            style={{ color: "var(--fg)" }}
          >
            Totoo ba ito?
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--fg)" }}>
          We&rsquo;ll be back soon
        </h1>

        <p className="text-lg mb-2" style={{ color: "var(--muted)" }}>
          Something new is on the way
        </p>

        <p className="text-sm" style={{ color: "var(--muted)" }}>
          We will be back soon with new features and improvements!
        </p>
      </div>
    </div>
  )
}
