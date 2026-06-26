'use client'

interface AdminPageHeaderProps {
  kicker: string
  title: string
  description?: string
  children?: React.ReactNode
}

export default function AdminPageHeader({
  kicker,
  title,
  description,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 border-b border-[#E5E5E0] pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="p-kicker mb-2">{kicker}</p>
          <h1 className="text-2xl font-semibold leading-tight text-[#0F1C1A] md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#737373]">
              {description}
            </p>
          )}
        </div>
        {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}
