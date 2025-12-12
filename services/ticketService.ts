/**
 * Ticket service for Firestore operations
 * Handles all CRUD operations for tickets
 */

import { COLLECTIONS } from "@/constants/collections";
import { generateTicketLabel, Ticket, TicketInput } from "@/src/types/ticket";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

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
 * Convert Firestore document to Ticket
 */
const convertToTicket = (doc: any): Ticket => {
  const data = doc.data();
  return {
    id: doc.id,
    ticketName: data.ticketName,
    timeSlot: data.timeSlot,
    label: data.label,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
};

/**
 * Get all tickets from Firestore
 * @returns Array of tickets sorted by creation date
 */
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const ticketsRef = collection(db, COLLECTIONS.TICKETS);
    const q = query(ticketsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertToTicket);
  } catch (error) {
    console.error("Error getting tickets:", error);
    throw error;
  }
};

/**
 * Create a new ticket in Firestore
 * @param ticketInput - Ticket input data
 * @returns Created ticket with ID
 */
export const createTicket = async (ticketInput: TicketInput): Promise<Ticket> => {
  try {
    const label = generateTicketLabel(ticketInput.ticketName, ticketInput.timeSlot);
    const ticketsRef = collection(db, COLLECTIONS.TICKETS);
    const now = Timestamp.now();
    
    const docRef = await addDoc(ticketsRef, {
      ticketName: ticketInput.ticketName,
      timeSlot: ticketInput.timeSlot,
      label: label,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: docRef.id,
      ...ticketInput,
      label: label,
      createdAt: convertTimestamp(now),
      updatedAt: convertTimestamp(now),
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

/**
 * Update an existing ticket in Firestore
 * @param ticketId - Ticket document ID
 * @param ticketInput - Updated ticket input data
 * @returns Updated ticket
 */
export const updateTicket = async (
  ticketId: string,
  ticketInput: TicketInput
): Promise<Ticket> => {
  try {
    const ticketRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    const label = generateTicketLabel(ticketInput.ticketName, ticketInput.timeSlot);
    
    await updateDoc(ticketRef, {
      ticketName: ticketInput.ticketName,
      timeSlot: ticketInput.timeSlot,
      label: label,
      updatedAt: Timestamp.now(),
    });

    const updatedDoc = await getDoc(ticketRef);
    
    if (!updatedDoc.exists()) {
      throw new Error("Ticket not found after update");
    }

    return convertToTicket(updatedDoc);
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

/**
 * Delete a ticket from Firestore
 * @param ticketId - Ticket document ID
 */
export const deleteTicket = async (ticketId: string): Promise<void> => {
  try {
    const ticketRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    await deleteDoc(ticketRef);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};

