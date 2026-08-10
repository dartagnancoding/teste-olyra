import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CrmLoading() {
  return (
    <div role="status" aria-label="Carregando leads">
      <div className="mb-10 flex flex-col gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-full sm:w-56" />
          <Skeleton className="h-11 w-full sm:w-36" />
        </div>

        <Card className="flex flex-col gap-4 p-5">
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <Skeleton key={row} className="h-10 w-full" />
          ))}
        </Card>
      </div>
    </div>
  )
}
