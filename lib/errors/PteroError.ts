import {
  PteroError as PteroErrorType,
  PteroErrors as PteroErrorsType,
} from "../types/errors.ts";

export default class PteroError extends Error {
  errors?: PteroErrorsType;

  constructor(message: string, errors?: PteroErrorsType) {
    super();

    this.message = message + "\n" + this.parseErrors(errors);
    this.errors = errors;
  }

  parseError(err: PteroErrorType) {
    let msg = `${err.status} ${err.code}`;

    if (err.detail) {
      msg += ` - ${err.detail}`;
    }

    if (err.meta) {
      const { source_field, rule } = err.meta;

      msg += `\n    -> ${source_field} (${rule})`;
    }

    return msg;
  }

  parseErrors(errs?: PteroErrorsType) {
    if (!errs) return;

    const { errors } = errs;

    return errors.map((err) => {
      return this.parseError(err);
    }).join("\n");
  }
}
