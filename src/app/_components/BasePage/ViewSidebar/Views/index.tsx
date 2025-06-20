import { api } from "~/trpc/react";
import ViewComponent from "./ViewComponent"
import { useParams } from 'next/navigation'
import { useState } from "react";

const Views = () => {
  const params = useParams();
  const tableId = typeof params?.tableId === 'string' ? params.tableId : '';

  const { data } = api.view.getViewsByTable.useQuery({ tableId }, {
    enabled: !!tableId,
  });

  const allViews = data?.views ?? [];

  console.log("Views data:", allViews);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(
    allViews[0]?.id ?? null
  )

  const handleSelect = (viewId: string) => {
    setSelectedViewId(viewId)
  }

  return (
    <div className="flex flex-col mt-2 gap-1">
      {allViews.map((view) => (
        <ViewComponent
          key={view.id}
          view={view}
          selected={view.id === selectedViewId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}

export default Views