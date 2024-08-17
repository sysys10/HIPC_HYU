import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

interface PenaltyType {
  boj_id: string;
  penalty: number;
  paid: number;
  name: string;
}

interface SignedUserType {
  boj_id: string;
  department: string;
  email: string;
  isProfileComplete: boolean;
  name: string;
  photoURL: string;
  quarter: string;
  updatedAt: string;
}

export const getUserBojId = async (userId: string): Promise<string | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.boj_id || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user's boj_id:", error);
    return null;
  }
};

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

export const getAssigned = async (
  email: string
): Promise<SignedUserType | null> => {
  try {
    console.log(email);
    const signedUserRef = collection(db, "signedUser");
    const q = query(signedUserRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data() as SignedUserType;
      return userData;
    } else {
      console.log("No user found with the given email");
      return null;
    }
  } catch (error) {
    console.error("Error fetching assigned user:", error);
    return null;
  }
};
