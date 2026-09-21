"use client";

import { inputClassName } from "@/components/admin/form";

export function StringListInput({
  label,
  values,
  onChange,
  placeholder,
  addLabel,
  error,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addLabel: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-fg">{label}</p>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={value}
              placeholder={placeholder}
              className={inputClassName}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="btn btn-ghost px-3 py-2 text-sm"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              disabled={values.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        onClick={() => onChange([...values, ""])}
      >
        {addLabel}
      </button>
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
