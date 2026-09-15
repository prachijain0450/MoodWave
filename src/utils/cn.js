/**
 * Utility function to conditionally combine class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
