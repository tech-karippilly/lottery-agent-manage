/**
 * Amounts service for Firestore operations
 * Handles all CRUD operations for ticket and winning amounts
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "@/constants/collections";
import {
  TicketAmount,
  TicketAmountInput,
  WinningAmount,
  WinningAmountInput,
} from "@/src/types/amounts";

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
 * Convert Firestore document to TicketAmount
 */
const convertToTicketAmount = (doc: any): TicketAmount => {
  const data = doc.data();
  return {
    id: doc.id,
    digit: data.digit,
    dcAmount: data.dcAmount,
    amount: data.amount,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

/**
 * Convert Firestore document to WinningAmount
 */
const convertToWinningAmount = (doc: any): WinningAmount => {
  const data = doc.data();
  return {
    id: doc.id,
    digit: data.digit,
    position: data.position,
    label: data.label,
    dcAmount: data.dcAmount,
    amount: data.amount,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

// ==================== TICKET AMOUNTS ====================

/**
 * Get all ticket amounts from Firestore
 * @returns Array of ticket amounts
 */
export const getTicketAmounts = async (): Promise<TicketAmount[]> => {
  try {
    const amountsRef = collection(db, COLLECTIONS.TICKET_AMOUNTS);
    const q = query(amountsRef, orderBy("digit", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertToTicketAmount);
  } catch (error) {
    console.error("Error getting ticket amounts:", error);
    throw error;
  }
};

/**
 * Get ticket amount by digit
 * @param digit - Digit value (3, 2, or 1)
 * @returns Ticket amount for the digit
 */
export const getTicketAmountByDigit = async (digit: number): Promise<TicketAmount | null> => {
  try {
    const amountsRef = collection(db, COLLECTIONS.TICKET_AMOUNTS);
    const q = query(amountsRef, where("digit", "==", digit));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    return convertToTicketAmount(querySnapshot.docs[0]);
  } catch (error) {
    console.error("Error getting ticket amount by digit:", error);
    throw error;
  }
};

/**
 * Create or update a ticket amount
 * @param ticketAmountInput - Ticket amount input data
 * @returns Created or updated ticket amount
 */
export const saveTicketAmount = async (
  ticketAmountInput: TicketAmountInput
): Promise<TicketAmount> => {
  try {
    // Check if amount exists for this digit
    const existing = await getTicketAmountByDigit(ticketAmountInput.digit);

    const now = Timestamp.now();
    const data = {
      digit: ticketAmountInput.digit,
      dcAmount: ticketAmountInput.dcAmount,
      amount: ticketAmountInput.amount,
      updatedAt: now,
    };

    if (existing?.id) {
      // Update existing
      const amountRef = doc(db, COLLECTIONS.TICKET_AMOUNTS, existing.id);
      await updateDoc(amountRef, data);
      const updatedDoc = await getDoc(amountRef);
      return convertToTicketAmount(updatedDoc);
    } else {
      // Create new
      const amountsRef = collection(db, COLLECTIONS.TICKET_AMOUNTS);
      const docRef = await addDoc(collection(db, COLLECTIONS.TICKET_AMOUNTS), {
        ...data,
        createdAt: now,
      });
      const newDoc = await getDoc(docRef);
      return convertToTicketAmount(newDoc);
    }
  } catch (error) {
    console.error("Error saving ticket amount:", error);
    throw error;
  }
};

// ==================== WINNING AMOUNTS ====================

/**
 * Get all winning amounts from Firestore
 * @returns Array of winning amounts
 */
export const getWinningAmounts = async (): Promise<WinningAmount[]> => {
  try {
    const amountsRef = collection(db, COLLECTIONS.WINNING_AMOUNTS);
    const querySnapshot = await getDocs(amountsRef);
    const amounts = querySnapshot.docs.map(convertToWinningAmount);
    // Sort manually: by digit desc, then by position asc
    return amounts.sort((a, b) => {
      if (a.digit !== b.digit) {
        return b.digit - a.digit;
      }
      return a.position - b.position;
    });
  } catch (error) {
    console.error("Error getting winning amounts:", error);
    throw error;
  }
};

/**
 * Get winning amounts by digit
 * @param digit - Digit value (3, 2, or 1)
 * @returns Array of winning amounts for the digit
 */
export const getWinningAmountsByDigit = async (digit: number): Promise<WinningAmount[]> => {
  try {
    const amountsRef = collection(db, COLLECTIONS.WINNING_AMOUNTS);
    const q = query(
      amountsRef,
      where("digit", "==", digit),
      orderBy("position", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertToWinningAmount);
  } catch (error) {
    console.error("Error getting winning amounts by digit:", error);
    throw error;
  }
};

/**
 * Create or update a winning amount
 * @param winningAmountInput - Winning amount input data
 * @returns Created or updated winning amount
 */
export const saveWinningAmount = async (
  winningAmountInput: WinningAmountInput
): Promise<WinningAmount> => {
  try {
    // Validate: For digit 3, label must be provided (super or box)
    if (winningAmountInput.digit === 3 && !winningAmountInput.label) {
      throw new Error("Label (super or box) is required for digit 3");
    }
    // For digits 1 and 2, label should be null/undefined
    if ((winningAmountInput.digit === 1 || winningAmountInput.digit === 2) && winningAmountInput.label) {
      throw new Error("Label should not be provided for digits 1 and 2");
    }

    // Check if amount exists for this digit, position, and label
    const amountsRef = collection(db, COLLECTIONS.WINNING_AMOUNTS);
    let q = query(
      amountsRef,
      where("digit", "==", winningAmountInput.digit),
      where("position", "==", winningAmountInput.position)
    );

    const querySnapshot = await getDocs(q);
    // Filter by label in memory since Firestore null queries can be tricky
    let existing = null;
    if (!querySnapshot.empty) {
      const matchingDocs = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        const docLabel = data.label || null;
        // For digit 3, use the provided label; for digits 1 and 2, use null
        const inputLabel = winningAmountInput.digit === 3 
          ? winningAmountInput.label || null 
          : null;
        return docLabel === inputLabel;
      });
      if (matchingDocs.length > 0) {
        existing = convertToWinningAmount(matchingDocs[0]);
      }
    }

    const now = Timestamp.now();
    // For digit 3, always save the label; for digits 1 and 2, save null
    const labelToSave = winningAmountInput.digit === 3 
      ? winningAmountInput.label 
      : null;
    
    const data = {
      digit: winningAmountInput.digit,
      position: winningAmountInput.position,
      label: labelToSave,
      dcAmount: winningAmountInput.dcAmount,
      amount: winningAmountInput.amount,
      updatedAt: now,
    };

    if (existing?.id) {
      // Update existing
      const amountRef = doc(db, COLLECTIONS.WINNING_AMOUNTS, existing.id);
      await updateDoc(amountRef, data);
      const updatedDoc = await getDoc(amountRef);
      return convertToWinningAmount(updatedDoc);
    } else {
      // Create new
      const docRef = await addDoc(collection(db, COLLECTIONS.WINNING_AMOUNTS), {
        ...data,
        createdAt: now,
      });
      const newDoc = await getDoc(docRef);
      return convertToWinningAmount(newDoc);
    }
  } catch (error) {
    console.error("Error saving winning amount:", error);
    throw error;
  }
};

/**
 * Delete a winning amount
 * @param amountId - Winning amount document ID
 */
export const deleteWinningAmount = async (amountId: string): Promise<void> => {
  try {
    const amountRef = doc(db, COLLECTIONS.WINNING_AMOUNTS, amountId);
    await deleteDoc(amountRef);
  } catch (error) {
    console.error("Error deleting winning amount:", error);
    throw error;
  }
};

