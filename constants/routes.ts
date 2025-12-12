/**
 * Route names constants
 * All screen/route names should be defined here
 */

export const ROUTES = {
  HOME: "/",
  SETTINGS: "/settings",
  TICKET_SETTINGS: "/settings/tickets",
  AMOUNTS_SETTINGS: "/settings/amounts",
  COUNT_SETTINGS: "/settings/count",
  TICKET_SELECT: "/ticket-select",
  ADD_NUMBER: "/ticket-select/add-number",
  REPORT: "/report",
  SALES_REPORT: "/report/sales",
  WINNING_REPORT: "/report/winning",
  NET_PAY_REPORT: "/report/net-pay",
} as const;
