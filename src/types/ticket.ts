/**
 * Ticket type definitions
 * Defines the structure for lottery tickets
 */

/**
 * Time slot represents the hour of the day (24-hour format)
 * Examples: 8 (8 PM), 6 (6 PM), 3 (3 PM), 15 (3 PM), etc.
 */
export type TimeSlot = number;

/**
 * Ticket interface
 * Represents a lottery ticket with name, time slot, and computed label
 */
export interface Ticket {
  /**
   * Unique identifier for the ticket (Firestore document ID)
   */
  id?: string;

  /**
   * Name of the ticket
   */
  ticketName: string;

  /**
   * Time slot for the ticket (hour in 24-hour format)
   * Examples: 8 (8 PM), 6 (6 PM), 3 (3 PM)
   */
  timeSlot: TimeSlot;

  /**
   * Label for the ticket (computed as ticketName + timeSlot)
   * Format: "{ticketName} {timeSlot} PM" or "{ticketName} {timeSlot} AM"
   */
  label: string;

  /**
   * Timestamp when the ticket was created
   */
  createdAt?: Date;

  /**
   * Timestamp when the ticket was last updated
   */
  updatedAt?: Date;
}

/**
 * Ticket data for creating/updating (without computed fields)
 */
export interface TicketInput {
  /**
   * Name of the ticket
   */
  ticketName: string;

  /**
   * Time slot for the ticket (hour in 24-hour format)
   */
  timeSlot: TimeSlot;
}

/**
 * Helper function to generate ticket label from ticket name and time slot
 * @param ticketName - Name of the ticket
 * @param timeSlot - Time slot (hour in 24-hour format)
 * @returns Formatted label string
 */
export const generateTicketLabel = (ticketName: string, timeSlot: TimeSlot): string => {
  const hour12 = timeSlot > 12 ? timeSlot - 12 : timeSlot === 0 ? 12 : timeSlot;
  const period = timeSlot >= 12 ? "PM" : "AM";
  return `${ticketName} ${hour12} ${period}`;
};

