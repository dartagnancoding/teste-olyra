import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CrmLoading() {
  return (
    <div role="status" aria-label="Carregando leads">
      <div className="mb-10 flex flex-col gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start lg:gap-10">
        <Card className="flex flex-col gap-6 p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full" />
          <Card className="flex flex-col gap-4 p-5">
            {[0, 1, 2, 3, 4].map((row) => (
              <Skeleton key={row} className="h-10 w-full" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
