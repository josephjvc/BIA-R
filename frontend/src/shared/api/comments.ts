import client from "./client";
import type { Comment, CreateCommentPayload } from "../types/comment";

export function getComments(instanceId: string): Promise<Comment[]> {
  return client.get(`/api/instances/${instanceId}/comments`).then((r) => r.data);
}

export function createComment(instanceId: string, payload: CreateCommentPayload): Promise<Comment> {
  return client.post(`/api/instances/${instanceId}/comments`, payload).then((r) => r.data);
}

export function updateComment(instanceId: string, commentId: string, payload: { content: string }): Promise<Comment> {
  return client.put(`/api/instances/${instanceId}/comments/${commentId}`, payload).then((r) => r.data);
}

export function deleteComment(instanceId: string, commentId: string): Promise<void> {
  return client.delete(`/api/instances/${instanceId}/comments/${commentId}`).then((r) => r.data);
}
