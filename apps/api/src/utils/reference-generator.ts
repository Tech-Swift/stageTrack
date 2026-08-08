/**
 * Generates a random uppercase alphanumeric string.
 * Excludes confusing characters such as O, 0, I and 1.
 */
const generateRandomString = (length: number): string => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return result;
};

export const generateReferenceNumber = (
  prefix: string
): string => {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const time =
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const random = generateRandomString(6);

  return `${prefix}-${date}-${time}-${random}`;
};