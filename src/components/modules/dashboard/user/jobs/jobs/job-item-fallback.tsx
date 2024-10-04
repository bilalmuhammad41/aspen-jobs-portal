import { Skeleton } from "@/components/ui/skeleton";

export default function JobItemFallback() {
  return (
    <div className="flex flex-col space-y-3 my-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[400px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
