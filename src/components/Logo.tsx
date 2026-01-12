export default function Logo() {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-3"
    >
      {/* Background circle */}
      <circle cx="30" cy="30" r="30" fill="#10b981" />

      {/* Wave paths */}
      <path
        d="M10 35C15 32 20 38 25 35C30 32 35 38 40 35C45 32 50 38 50 35V50H10V35Z"
        fill="white"
        opacity="0.3"
      />
      <path
        d="M10 40C15 37 20 43 25 40C30 37 35 43 40 40C45 37 50 43 50 40V50H10V40Z"
        fill="white"
        opacity="0.5"
      />
      <path
        d="M10 45C15 42 20 48 25 45C30 42 35 48 40 45C45 42 50 48 50 45V50H10V45Z"
        fill="white"
      />

      {/* Sun */}
      <circle cx="30" cy="20" r="6" fill="#fbbf24" />
      <circle cx="30" cy="20" r="4" fill="#fef3c7" />
    </svg>
  );
}
