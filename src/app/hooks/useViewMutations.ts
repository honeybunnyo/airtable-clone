import { api } from '~/trpc/react';
import { toast } from 'sonner';

export const useViewMutations = (tableId: string) => {
  const utils = api.useUtils();
  
  const createView = api.view.create.useMutation({
    onMutate: async (variables) => {
      await utils.view.getViewsByTable.cancel({ tableId });

      const previousViews = utils.view.getViewsByTable.getData({ tableId });

      // Create an optimistic update for the new view
      const optimisticView = {
        id: `temp-${variables.name}`,
        name: variables.name,
        tableId,
        sortConfig: {},
        filterConfig: {},
        hiddenColumns: [],
      }

      utils.view.getViewsByTable.setData({ tableId }, (old) => ({
        views: [...(old?.views ?? []), optimisticView],
      }));

      return { previousViews };
    },
    onError: (_, variables, context) => {
      toast.error(`Failed to create view`);
      if (context?.previousViews) {
        utils.view.getViewsByTable.setData({ tableId }, context.previousViews);
      }
    },
    onSuccess: async () => {
      void utils.view.getViewsByTable.invalidate({ tableId });
    },
  })
  const deleteView = api.view.delete.useMutation({
    onMutate: async (variables) => {
      toast(`Deleting view...`);
      
      await utils.view.getViewsByTable.cancel({ tableId });
      const previousViews = utils.view.getViewsByTable.getData({ tableId });

      // Optimistically remove the view
      utils.view.getViewsByTable.setData({ tableId }, (old) => {
        if (!old) return undefined;
        return {
          views: old.views.filter((view) => view.id !== variables.viewId)
        };
      });

      return { previousViews };
    },
    onError: (_, variables, context) => {
      toast.error(`Failed to delete view`);
      if (context?.previousViews) {
        utils.view.getViewsByTable.setData({ tableId }, context.previousViews);
      }
    },
    onSuccess: async () => {
      await utils.view.getViewsByTable.invalidate({ tableId });
    },
  });
  return {
    createView,
    deleteView,
  };
};
