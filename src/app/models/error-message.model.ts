export interface ErrorMessage {
  title: string;
  description: string;
  fieldId?: string;
  multiple?: boolean;
  errors?: MultipleErrorMessage[];
}

export interface MultipleErrorMessage {
  error: string;
  name?: string;
}

export interface ResponseErrorMessage {
  message?: string;
  name?: string;
  status?: number;
  statusTest?: string;
  url?: string;
  error?: {
    errorCode?: number;
    errorDescription?: string;
    errorMessage?: string;
    status?: string;
    timeStamp?: string;
  }
  headers?: any;

}

