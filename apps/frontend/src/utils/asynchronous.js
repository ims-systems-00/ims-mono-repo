import { imsLogger } from "@/services/loggerService";
export async function asynchronously(promise) {
  try {
    return [null, await promise];
  } catch (error) {
    imsLogger(error);
    return [error, null];
  }
}
