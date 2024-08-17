import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Question, PaginationInfo, QuestionListType } from "../types";

const QUESTIONS_PER_PAGE = 10;

export const getQuestionList = async (
  page: number,
  problemNumber: string = ""
): Promise<{
  questions: QuestionListType[];
  paginationInfo: PaginationInfo;
}> => {
  try {
    const questionsRef = collection(db, "questions");
    let baseQuery;

    if (problemNumber) {
      const problemNumberInt = parseInt(problemNumber, 10);
      if (!isNaN(problemNumberInt)) {
        baseQuery = query(
          questionsRef,
          where("p_num", "==", problemNumberInt),
          orderBy("createdAt", "desc")
        );
      } else {
        // If problemNumber is not a valid number, return empty results
        return { 
          questions: [], 
          paginationInfo: { currentPage: 1, totalPages: 0, pageSize: QUESTIONS_PER_PAGE } 
        };
      }
    } else {
      baseQuery = query(questionsRef, orderBy("createdAt", "desc"));
    }

    // Get total count
    const totalSnapshot = await getDocs(baseQuery);
    const totalQuestions = totalSnapshot.size;

    // Apply pagination
    let pageQuery = query(baseQuery, limit(QUESTIONS_PER_PAGE));
    if (page > 1) {
      const startAtSnapshot = await getDocs(query(baseQuery, limit((page - 1) * QUESTIONS_PER_PAGE)));
      const lastVisible = startAtSnapshot.docs[startAtSnapshot.docs.length - 1];
      if (lastVisible) {
        pageQuery = query(pageQuery, startAfter(lastVisible));
      }
    }

    const snapshot = await getDocs(pageQuery);
    const questions: QuestionListType[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        p_num: data.p_num,
        title: data.title,
        codeLanguage: data.codeLanguage,
        solved: data.solved,
        createdAt: (data.createdAt as Timestamp).toDate(),
        writer: data.writer
      };
    });

    const paginationInfo: PaginationInfo = {
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / QUESTIONS_PER_PAGE),
      pageSize: QUESTIONS_PER_PAGE,
    };

    return { questions, paginationInfo };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const searchQuestions = async (
  searchTerm: string,
  page: number = 1
): Promise<{
  questions: QuestionListType[];
  paginationInfo: PaginationInfo;
}> => {
  // 검색 기능은 getQuestionList 함수를 재사용합니다.
  return getQuestionList(page, searchTerm);
};

export const getQuestions = async (
  page: number
): Promise<{
  questions: Question[];
  paginationInfo: PaginationInfo;
}> => {
  try {
    const questionsRef = collection(db, "questions");
    let q = query(
      questionsRef,
      orderBy("createdAt", "desc"),
      limit(QUESTIONS_PER_PAGE)
    );

    const snapshot = await getDocs(q);
    const questions = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
        } as Question)
    );

    const totalDocs = await getDocs(questionsRef);
    const totalQuestions = totalDocs.size;

    const paginationInfo: PaginationInfo = {
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / QUESTIONS_PER_PAGE),
      pageSize: QUESTIONS_PER_PAGE,
    };

    return { questions, paginationInfo };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const getQuestionById = async (id: string): Promise<Question | null> => {
  try {
    const docRef = doc(db, "questions", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Question;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

export const addQuestion = async (
  question: Omit<Question, "id" | "createdAt" | "solved">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "questions"), {
      ...question,
      solved: false,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export const updateQuestion = async (
  questionId: string,
  updatedFields: Partial<Question>
): Promise<void> => {
  try {
    const questionRef = doc(db, "questions", questionId);
    await updateDoc(questionRef, updatedFields);
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("질문 업데이트에 실패했습니다.");
  }
};
