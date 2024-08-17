import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { Comment } from "../types";

export const addComment = async (
  comment: Omit<Comment, "id" | "createdAt">
  
): Promise<string> => {
  const docRef = await addDoc(collection(db, "comments"), {
    ...comment,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

export const getComments = async (questionId: string): Promise<Comment[]> => {
  const q = query(
    collection(db, "comments"),
    where("questionId", "==", questionId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Comment)
  );
};

export const deleteComment = async (
  commentId: string,
  userId: string
): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      throw new Error("Comment not found");
    }

    const commentData = commentSnap.data() as Comment;
    if (commentData.author !== userId) {
      throw new Error("You don't have permission to delete this comment");
    }

    await deleteDoc(commentRef);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const updateComment = async (
  commentId: string,
  updatedContent: string,
  userId: string
): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId);
    const commentSnap = await getDoc(commentRef);

    if (!commentSnap.exists()) {
      throw new Error("Comment not found");
    }

    const commentData = commentSnap.data() as Comment;
    if (commentData.author !== userId) {
      throw new Error("You don't have permission to update this comment");
    }

    await updateDoc(commentRef, {
      content: updatedContent,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};
