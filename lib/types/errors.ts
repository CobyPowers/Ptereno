export interface PteroErrors {
  errors: Array<PteroError>;
}

export interface PteroError {
  code: string;
  status: string;
  detail?: string;
  meta?: {
    source_field: string;
    rule: string;
  };
}
