/**
 * Count service for Firestore operations
 * Handles count operations (only for digit 3)
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "@/constants/collections";
import { Count, CountInput } from "@/src/types/count";

/**
 * Convert Firestore timestamp to Date
 */
const convertTimestamp = (timestamp: any): Date | undefined => {
  if (!timestamp) return undefined;
  if (timestamp instanceof Date) return timestamp;
  if (timestamp?.toDate) return timestamp.toDate();
  return new Date(timestamp);
};

/**
 * Convert Firestore document to Count
 */
const convertToCount = (doc: any): Count => {
  const data = doc.data();
  return {
    id: doc.id,
    count: data.count,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

/**
 * Get count from Firestore
 * There should only be one count document (for digit 3)
 * @returns Count value or null if not found
 */
export const getCount = async (): Promise<Count | null> => {
  try {
    const countRef = collection(db, COLLECTIONS.COUNT);
    const q = query(countRef, limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return convertToCount(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error getting count:", error);
    throw error;
  }
};

/**
 * Save count (create or update)
 * Since there's only one count value, it will update existing or create new
 * @param countInput - Count input data
 * @returns Saved count
 */
export const saveCount = async (countInput: CountInput): Promise<Count> => {
  try {
    const existing = await getCount();
    const now = Timestamp.now();
    const data = {
      count: countInput.count,
      updatedAt: now,
    };

    if (existing?.id) {
      // Update existing
      const countRef = doc(db, COLLECTIONS.COUNT, existing.id);
      await updateDoc(countRef, data);
      const updatedDoc = await getDoc(countRef);
      return convertToCount(updatedDoc);
    } else {
      // Create new
      const docRef = await addDoc(collection(db, COLLECTIONS.COUNT), {
        ...data,
        createdAt: now,
      });
      const newDoc = await getDoc(docRef);
      return convertToCount(newDoc);
    }
  } catch (error) {
    console.error("Error saving count:", error);
    throw error;
  }
};

