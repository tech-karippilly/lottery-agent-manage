/**
 * Count type definitions
 * Defines the structure for count settings (only for digit 3)
 */

/**
 * Count interface
 * Represents count value for digit 3
 */
export interface Count {
  /**
   * Unique identifier (Firestore document ID)
   */
  id?: string;

  /**
   * Count value (only for digit 3)
   */
  count: number;

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
 * Count input for creating/updating
 */
export interface CountInput {
  count: number;
}

