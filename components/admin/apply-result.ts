import type { ActionResult } from "@/lib/admin";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export type BannerState = { type: "success" | "error"; message: string } | null;

export function applyActionResult<T extends FieldValues>(
  result: ActionResult,
  setError: UseFormSetError<T>,
  setBanner: (state: BannerState) => void,
  successMessage = "Saved",
) {
  if (!result.ok) {
    if (result.fieldErrors) {
      for (const [name, message] of Object.entries(result.fieldErrors)) {
        setError(name as Path<T>, { message });
      }
    }
    setBanner({ type: "error", message: result.error });
    return false;
  }

  setBanner({ type: "success", message: successMessage });
  return true;
}
