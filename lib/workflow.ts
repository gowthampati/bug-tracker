export const allowedTransitions: Record<string, string[]> = {
  Open: ["In Progress"],
  "In Progress": ["Resolved"],
  Resolved: ["Closed", "Open"],
  Closed: ["Open"],
};