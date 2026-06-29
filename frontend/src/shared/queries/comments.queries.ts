import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/comments";
import type { CreateCommentPayload } from "../types/comment";

export function useComments(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["instances", instanceId, "comments"],
    queryFn: () => api.getComments(instanceId!),
    enabled: !!instanceId,
  });
}

export function useCreateComment(instanceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentPayload) => api.createComment(instanceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances", instanceId, "comments"] });
      toast.success("Comment added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteComment(instanceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => api.deleteComment(instanceId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances", instanceId, "comments"] });
      toast.success("Comment deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
