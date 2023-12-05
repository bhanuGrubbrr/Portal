export class FormFieldBase<T> {
  defaultValue?: any;
  value?: any;
  key: string;
  label: string;
  minLength: number | null;
  maxLength: number | null;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: { key: string; value: string; selected?: boolean }[];
  pattern: RegExp | null;
  additionalErrorMessage: string | null;

  constructor(options: {
    defaultValue?: any;
    value: any;
    key?: string;
    label?: string;
    minLength?: number | null;
    maxLength?: number | null;
    required?: boolean;
    order?: number;
    controlType?: string;
    type?: string;
    options?: { key: string; value: string; selected?: boolean }[];
    pattern?: RegExp | null;
    additionalErrorMessage?: string | null;
  }) {
    this.defaultValue = options?.defaultValue ?? null;
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.minLength = options?.minLength || null;
    this.maxLength = options?.maxLength || null;
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.pattern = options.pattern || null;
    this.additionalErrorMessage = options.additionalErrorMessage || null;
  }
}
