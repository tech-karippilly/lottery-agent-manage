/**
 * Amounts type definitions
 * Defines the structure for ticket and winning amounts
 */

import { Digit, Position } from "./numberList";

/**
 * Ticket Amount interface
 * Amounts for each digit (3, 2, 1)
 */
export interface TicketAmount {
  /**
   * Unique identifier (Firestore document ID)
   */
  id?: string;

  /**
   * Digit value (3, 2, or 1)
   */
  digit: Digit;

  /**
   * DC amount for this digit
   */
  dcAmount: number;

  /**
   * Regular amount for this digit
   */
  amount: number;

  /**
   * Timestamp when created
   */
  createdAt?: Date;

  /**
   * Timestamp when updated
   */
  updatedAt?: Date;
}

/**
 * Ticket Amount input for creating/updating
 */
export interface TicketAmountInput {
  digit: Digit;
  dcAmount: number;
  amount: number;
}

/**
 * Winning Amount Label type
 * For digit 3, we have "super" and "box" labels
 */
export type WinningAmountLabel = "super" | "box";

/**
 * Winning Amount interface
 * Amounts for winning positions
 */
export interface WinningAmount {
  /**
   * Unique identifier (Firestore document ID)
   */
  id?: string;

  /**
   * Digit value (3, 2, or 1)
   */
  digit: Digit;

  /**
   * Position number (1-6 for digit 3, 1 for digits 1 and 2)
   */
  position: Position;

  /**
   * Label for digit 3 ("super" or "box"), undefined for digits 1 and 2
   */
  label?: WinningAmountLabel;

  /**
   * DC amount for this position
   */
  dcAmount: number;

  /**
   * Regular amount for this position
   */
  amount: number;

  /**
   * Timestamp when created
   */
  createdAt?: Date;

  /**
   * Timestamp when updated
   */
  updatedAt?: Date;
}

/**
 * Winning Amount input for creating/updating
 */
export interface WinningAmountInput {
  digit: Digit;
  position: Position;
  label?: WinningAmountLabel;
  dcAmount: number;
  amount: number;
}

