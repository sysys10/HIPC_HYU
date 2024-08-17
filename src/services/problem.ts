import {
  collection,
  query,
  getDocs,
  Timestamp,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase"; // Firebase 설정 파일 경로에 맞게 수정해주세요

interface Problem {
  boj_id: string;
  p_num: string;
  p_time: Timestamp;
  p_tier: number;
}

interface UserState {
  boj_id: string;
  full_solved: number;
  rating: number;
  tier?: string;
  full_solved_diff?: number;
  rating_diff?: number;
  paid?: number;
  penalty?: number;
  name?: string;
}

export const fetchSolvedProblems = async (): Promise<Problem[]> => {
  try {
    const problemsRef = collection(db, "problems");
    const recentProblemsQuery = query(
      problemsRef,
      orderBy("p_time", "desc"),
      limit(50)
    );

    const querySnapshot = await getDocs(recentProblemsQuery);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        boj_id: data.boj_id,
        p_num: data.p_num,
        p_time: data.p_time,
        p_tier: data.p_tier,
      } as Problem;
    });
  } catch (error) {
    console.error("Error fetching recent problems: ", error);
    throw error;
  }
};

export const fetchUserStates = async (): Promise<UserState[]> => {
  try {
    const newstateRef = collection(db, "newstate");
    const querySnapshot = await getDocs(newstateRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        boj_id: data.boj_id,
        full_solved: data.full_solved,
        rating: data.rating,
      } as UserState;
    });
  } catch (error) {
    console.error("Error fetching user states: ", error);
    throw error;
  }
};

type TopUsersByRating = Pick<UserState, 'boj_id' | 'rating' | 'tier' | 'rating_diff' | 'name'>;

export const fetchTopUsersByRating = async (): Promise<TopUsersByRating[]> => {
  try {
    const newstateRef = collection(db, "newstate");
    const q = query(newstateRef, orderBy("rating", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        boj_id: data.boj_id,
        rating: data.rating,
        tier: data.tier,
        rating_diff: data.rating_diff,
        name: data.name,
      };
    });
  } catch (error) {
    console.error("Error fetching top users by rating: ", error);
    throw error;
  }
};

type TopUsersBySolvedDiff = Pick<UserState, 'boj_id' | 'tier' | 'full_solved_diff' | 'name'>;

export const fetchTopUsersBySolvedDiff = async (): Promise<TopUsersBySolvedDiff[]> => {
  try {
    const newstateRef = collection(db, "newstate");
    const q = query(
      newstateRef,
      orderBy("full_solved_diff", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        boj_id: data.boj_id,
        tier: data.tier,
        full_solved_diff: data.full_solved_diff,
        name: data.name,
      };
    });
  } catch (error) {
    console.error("Error fetching top users by solved diff: ", error);
    throw error;
  }
};

type TopUsersByRatingDiff = Pick<UserState, 'boj_id' | 'tier' | 'rating_diff' | 'name'>;

export const fetchTopUsersByRatingDiff = async (): Promise<TopUsersByRatingDiff[]> => {
  try {
    const newstateRef = collection(db, "newstate");
    const q = query(newstateRef, orderBy("rating_diff", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        boj_id: data.boj_id,
        tier: data.tier,
        rating_diff: data.rating_diff,
        name: data.name,
      };
    });
  } catch (error) {
    console.error("Error fetching top users by rating diff: ", error);
    throw error;
  }
};

export const fetchSolvedCount = async (): Promise<number> => {
  try {
    const InformationRef = doc(db, "information", "solvedProblems");
    const snapshot = await getDoc(InformationRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const count = data.problem_cnt;
      return count;
    } else {
      console.error("Solved problems document not found");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching solved count:", error);
    throw error;
  }
};