import Link from "next/link";

export default function Onboarding() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <div className="relative flex-1 overflow-hidden bg-primary md:flex-none md:basis-1/2">
        <div className="absolute -top-10 -right-10 size-28 rounded-full border-[14px] border-white/20" />
        <Zigzag className="absolute top-24 left-0" />
        <Zigzag className="absolute right-0 bottom-6" />
      </div>
      <div className="flex flex-col gap-4 px-6 pt-8 pb-8 md:basis-1/2 md:justify-center md:px-16 lg:px-24">
        <h1 className="text-2xl font-semibold md:text-4xl">Manage What To Do</h1>
        <p className="text-sm text-neutral-500 md:max-w-sm md:text-base">
          The best way to manage what you have to do, don&apos;t forget your plans
        </p>
        <Link
          href="/home"
          className="mt-16 bg-primary py-3 md:mt-8 md:max-w-sm text-center font-medium text-white"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

function Zigzag({ className }: { className: string }) {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" className={className}>
      {[10, 30, 50].map((y) => (
        <path
          key={y}
          d={`M0 ${y + 10} l15 -15 l15 15 l15 -15 l15 15 l15 -15 l15 15 l15 -15 l15 15`}
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="4"
        />
      ))}
    </svg>
  );
}
