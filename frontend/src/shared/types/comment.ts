export interface Comment {
  id: string;
  instanceId: string;
  userId: string;
  userDisplayName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  content: string;
}
