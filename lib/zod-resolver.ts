import type { FieldError, FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

function setError(
  errors: Record<string, unknown>,
  path: Array<string | number>,
  error: FieldError,
) {
  if (path.length === 0) {
    return;
  }

  let current: Record<string, unknown> = errors;

  for (let index = 0; index < path.length - 1; index += 1) {
    const key = String(path[index]);
    const next = current[key];

    if (typeof next !== "object" || next === null) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }

  current[String(path[path.length - 1])] = error;
}

export function zodResolver<T extends FieldValues>(
  schema: ZodType<T>,
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, unknown> = {};

    for (const issue of result.error.issues) {
      if (issue.path.length === 0) {
        continue;
      }

      setError(errors, issue.path as Array<string | number>, {
        type: issue.code,
        message: issue.message,
      });
    }

    return {
      values: {},
      errors: errors as never,
    };
  };
}
