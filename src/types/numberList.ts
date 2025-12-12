/**
 * Number List type definitions
 * Defines the structure for lottery number entries
 */

/**
 * Valid digit values (3, 2, or 1)
 */
export type Digit = 3 | 2 | 1;

/**
 * Number List Item interface
 * Represents a single number entry in the lottery system
 */
export interface NumberListItem {
  /**
   * Unique identifier for the number list item (Firestore document ID)
   */
  id?: string;

  /**
   * The lottery number
   */
  number: number;

  /**
   * Count of occurrences or frequency
   */
  count: number;

  /**
   * DC (Double Chance?) amount
   */
  dcAmount: number;

  /**
   * Regular amount
   */
  amount: number;

  /**
   * Ticket label (reference to the ticket this number belongs to)
   * Format: "{ticketName} {timeSlot} PM/AM"
   */
  ticketLabel: string;

  /**
   * Digit value (must be 3, 2, or 1)
   */
  digit: Digit;

  /**
   * Label for the number
   */
  numberLabel: string;

  /**
   * Timestamp when the number list item was created
   */
  createdAt?: Date;

  /**
   * Timestamp when the number list item was last updated
   */
  updatedAt?: Date;
}

/**
 * Number List Item input for creating/updating (without computed fields)
 */
export interface NumberListItemInput {
  /**
   * The lottery number
   */
  number: number;

  /**
   * Count of occurrences or frequency
   */
  count: number;

  /**
   * DC (Double Chance?) amount
   */
  dcAmount: number;

  /**
   * Regular amount
   */
  amount: number;

  /**
   * Ticket label (reference to the ticket this number belongs to)
   */
  ticketLabel: string;

  /**
   * Digit value (must be 3, 2, or 1)
   */
  digit: Digit;

  /**
   * Label for the number
   */
  numberLabel: string;
}

/**
 * Valid digit values array for validation
 */
export const VALID_DIGITS: Digit[] = [3, 2, 1];

/**
 * Helper function to validate if a value is a valid digit
 * @param value - The value to validate
 * @returns True if the value is a valid digit (3, 2, or 1)
 */
export const isValidDigit = (value: number): value is Digit => {
  return VALID_DIGITS.includes(value as Digit);
};

/**
 * Helper function to generate number label
 * @param number - The lottery number
 * @returns Formatted number label string
 */
export const generateNumberLabel = (number: number): string => {
  return `Number ${number}`;
};

