"use client";

import React from "react";
import { useParams } from "next/navigation";
import PostEditForm from "@/components/PostEditForm";
import { checkAuthStatus } from "@/lib/apis/auth";

export default function EditPostPage() {
  const params = useParams();
  const postId = params.postId as string;

  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkAuthStatus().then((authData) => setUserId(authData.userId)).catch(() => setUserId(null));
  }, []);

  if (!userId) return <div className="loading">Loading...</div>;

  return <PostEditForm postId={postId} userId={userId} />;
}
