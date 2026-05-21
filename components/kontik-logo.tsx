import Image from 'next/image'

export function KontikLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/kontik-logo.png"
      alt="Kontik Business Travel"
      width={170}
      height={60}
      priority
      className={`${className}`}
    />
  )
}
