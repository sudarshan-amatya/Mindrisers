import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export function CardSkeleton() {
  return (
    <div className="w-56 h-57 bg-white rounded-xl p-3 space-y-3 mr-16">
      <Skeleton height={140} borderRadius={12} />
      <Skeleton height={18} />
      <Skeleton height={18} width="60%" />
    </div>
  );
}
