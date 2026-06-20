"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, Pencil, Trash2, LogIn } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CommentSection({ id, user }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Fetch current user's profile to get latest image
  useEffect(() => {
    if (!user?.email) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profiles/${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentUserProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch comments
  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/${id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchComments();
  }, [id]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsPostingComment(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, comment: commentText }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) => [data, ...prev]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, comment: editingText }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                comment: editingText.trim(),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
      setEditingCommentId(null);
      setEditingText("");
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="px-4 md:px-10 lg:px-12 mt-12 md:mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Comments
            </h2>
            <p className="text-sm text-muted-foreground">
              {comments.length > 0
                ? `${comments.length} comment${comments.length !== 1 ? "s" : ""}`
                : "No comments yet"}
            </p>
          </div>
        </div>

        {/* Comment Form / Auth Prompts */}
        <div className="mb-8">
          {!user ? (
            /* Not logged in */
            <div className="rounded-2xl border border-separator bg-accent/20 p-6 text-center">
              <LogIn className="size-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Sign in to leave a comment on this artwork
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn className="size-4" />
                Sign In
              </Link>
            </div>
          ) : (
            /* Logged in — show comment form */
            <div className="relative overflow-hidden rounded-3xl bg-background p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-separator/40 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-20"></div>
              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-primary shadow-sm border-2 border-background z-10 overflow-hidden">
                  {currentUserProfile?.profileImage || user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUserProfile?.profileImage || user.image}
                      alt={currentUserProfile?.name || user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (currentUserProfile?.name || user.name || "U")[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative group rounded-2xl bg-accent/20 border border-separator/40 focus-within:border-primary/40 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="What are your thoughts on this masterpiece?"
                      rows={3}
                      maxLength={500}
                      className="w-full bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground/60 border-none outline-none focus:ring-0 resize-none"
                    />
                    <div className="flex items-center justify-between p-2 pl-4 border-t border-separator/30 bg-background/50 rounded-b-2xl">
                      <span className="text-xs font-medium text-muted-foreground/60">
                        {commentText.length}/500
                      </span>
                      <button
                        onClick={handlePostComment}
                        disabled={!commentText.trim() || isPostingComment}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                      >
                        {isPostingComment ? (
                          <>
                            <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="size-4" />
                            Post
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comment List */}
        <div className="space-y-4">
          {isLoadingComments ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="size-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                Loading comments...
              </p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="size-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {comments.map((c) => (
                <motion.div
                  key={c._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl bg-accent/10 hover:bg-accent/20 p-5 md:p-6 transition-colors group relative"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-sm font-bold text-primary overflow-hidden shadow-sm border border-separator/30">
                      {c.userAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.userAvatar}
                          alt={c.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (c.userName || "U")[0].toUpperCase()
                      )}
                    </div>

                    {/* Comment Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-foreground tracking-tight">
                            {c.userName}
                          </span>
                          <span className="size-1 rounded-full bg-separator/80"></span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          {c.updatedAt && (
                            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest bg-accent px-1.5 py-0.5 rounded-md">
                              Edited
                            </span>
                          )}
                        </div>

                        {/* Edit/Delete (own comments only) */}
                        {user && user.email === c.userId && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingCommentId(c._id);
                                setEditingText(c.comment);
                              }}
                              className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-background shadow-sm transition-all"
                              title="Edit"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50/50 shadow-sm transition-all"
                              title="Delete"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment Text or Edit Mode */}
                      {editingCommentId === c._id ? (
                        <div className="mt-2 bg-background p-3 rounded-2xl border border-primary/20 shadow-sm">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={2}
                            maxLength={500}
                            className="w-full bg-transparent px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-0 resize-none border-none"
                          />
                          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-separator/30">
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditingText("");
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleEditComment(c._id)}
                              disabled={!editingText.trim()}
                              className="px-4 py-1.5 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm shadow-primary/20 disabled:opacity-50"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                          {c.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
