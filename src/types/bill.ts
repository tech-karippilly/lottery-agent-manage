/**
 * Bill type definitions
 * Defines the structure for lottery bills
 */

import { Digit } from "./numberList";
import { NumberListItem } from "./numberList";

/**
 * Bill interface
 * Represents a lottery bill with ticket information, totals, and number list
 */
export interface Bill {
  /**
   * Unique identifier for the bill (Firestore document ID)
   */
  id?: string;

  /**
   * Bill ID (user-facing identifier)
   */
  billId: string;

  /**
   * Ticket label (reference to the ticket this bill belongs to)
   * Format: "{ticketName} {timeSlot} PM/AM"
   */
  ticketLabel: string;

  /**
   * Digit value (must be 3, 2, or 1)
   */
  digit: Digit;

  /**
   * Total DC (Double Chance?) amount
   */
  totalDcAmount: number;

  /**
   * Total amount
   */
  totalAmount: number;

  /**
   * List of numbers associated with this bill
   */
  numberList: NumberListItem[];

  /**
   * Timestamp when the bill was created
   */
  createdAt?: Date;

  /**
   * Timestamp when the bill was last updated
   */
  updatedAt?: Date;
}

/**
 * Bill input for creating/updating (without computed fields)
 */
export interface BillInput {
  /**
   * Bill ID (user-facing identifier)
   */
  billId: string;

  /**
   * Ticket label (reference to the ticket this bill belongs to)
   */
  ticketLabel: string;

  /**
   * Digit value (must be 3, 2, or 1)
   */
  digit: Digit;

  /**
   * Total DC (Double Chance?) amount
   */
  totalDcAmount: number;

  /**
   * Total amount
   */
  totalAmount: number;

  /**
   * List of numbers associated with this bill
   */
  numberList: NumberListItem[];
}

/**
 * Helper function to calculate total DC amount from number list
 * @param numberList - Array of number list items
 * @returns Sum of all dcAmount values
 */
export const calculateTotalDcAmount = (numberList: NumberListItem[]): number => {
  return numberList.reduce((total, item) => total + item.dcAmount, 0);
};

/**
 * Helper function to calculate total amount from number list
 * @param numberList - Array of number list items
 * @returns Sum of all amount values
 */
export const calculateTotalAmount = (numberList: NumberListItem[]): number => {
  return numberList.reduce((total, item) => total + item.amount, 0);
};

