import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

interface PenaltyType {
  boj_id: string;
  penalty: number;
  paid: number;
  name: string;
}

export const getPenalty = async (): Promise<PenaltyType[] | null> => {
  try {
    const newStateRef = collection(db, "userData");
    const querySnapshot = await getDocs(newStateRef);

    const penalties: PenaltyType[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      penalties.push({
        name: data.name,
        boj_id: data.boj_id,
        penalty: data.penalty,
        paid: data.paid,
      });
    });

    return penalties;
  } catch (error) {
    console.error("Error fetching penalties:", error);
    return null;
  }
};
