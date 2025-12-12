/**
 * Winning Details type definitions
 * Defines the structure for lottery winning details
 */

import { Digit } from "./numberList";

/**
 * Position type for winning details
 * For digit 3: positions 1-6 (positions 1-5 have 1 number each, position 6 has 30 numbers)
 */
export type Position = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Winning Detail interface
 * Represents a single winning detail entry
 */
export interface WinningDetail {
  /**
   * Unique identifier for the winning detail (Firestore document ID)
   */
  id?: string;

  /**
   * Ticket label (reference to the ticket this winning detail belongs to)
   * Format: "{ticketName} {timeSlot} PM/AM"
   */
  ticketLabel: string;

  /**
   * Position number (1-6 for digit 3)
   */
  position: Position;

  /**
   * Winning number(s)
   * For positions 1-5: single number
   * For position 6: array of 30 numbers
   */
  number: number | number[];

  /**
   * Digit value (must be 3, 2, or 1)
   */
  digit: Digit;

  /**
   * Timestamp when the winning detail was created
   */
  createdAt?: Date;

  /**
   * Timestamp when the winning detail was last updated
   */
  updatedAt?: Date;
}

/**
 * Winning Detail input for creating/updating (without computed fields)
 */
export interface WinningDetailInput {
  /**
   * Ticket label (reference to the ticket this winning detail belongs to)
   */
  ticketLabel: string;

  /**
   * Position number (1-6 for digit 3)
   */
  position: Position;

  /**
   * Winning number(s)
   * For positions 1-5: single number
   * For position 6: array of 30 numbers
   */
  number: number | number[];

  /**
   * Digit value (must be 3, 2, or 1)
   */
  digit: Digit;
}

/**
 * Constants for winning details structure
 */
export const WINNING_DETAILS_CONSTANTS = {
  /**
   * Maximum number of positions for digit 3
   */
  MAX_POSITIONS_DIGIT_3: 6,

  /**
   * Number of numbers in position 6 for digit 3
   */
  POSITION_6_NUMBER_COUNT: 30,

  /**
   * Positions that have single number (1-5)
   */
  SINGLE_NUMBER_POSITIONS: [1, 2, 3, 4, 5] as Position[],

  /**
   * Position that has multiple numbers (6)
   */
  MULTIPLE_NUMBER_POSITION: 6 as Position,
} as const;

/**
 * Helper function to check if a position requires multiple numbers
 * @param position - The position number
 * @param digit - The digit value
 * @returns True if the position requires multiple numbers
 */
export const isMultipleNumberPosition = (position: Position, digit: Digit): boolean => {
  return digit === 3 && position === WINNING_DETAILS_CONSTANTS.MULTIPLE_NUMBER_POSITION;
};

/**
 * Helper function to validate winning detail number structure
 * @param position - The position number
 * @param digit - The digit value
 * @param number - The number(s) to validate
 * @returns True if the number structure is valid for the position and digit
 */
export const validateWinningDetailNumber = (
  position: Position,
  digit: Digit,
  number: number | number[]
): boolean => {
  if (isMultipleNumberPosition(position, digit)) {
    // Position 6 with digit 3 should have array of 30 numbers
    return (
      Array.isArray(number) &&
      number.length === WINNING_DETAILS_CONSTANTS.POSITION_6_NUMBER_COUNT
    );
  } else {
    // Positions 1-5 should have single number
    return typeof number === "number";
  }
};

