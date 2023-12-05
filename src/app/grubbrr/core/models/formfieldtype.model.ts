export class FormFieldTypeModel {
  constructor(
    type: string,
    label: string,
    required: boolean,
    value?: any | null,
    defaultValue?: any | null
  ) {
    this.type = type;
    this.required = required;
    this.label = label;
    this.value = value;
    this.defaultValue = defaultValue;
  }

  minLength?: number | null;
  maxLength?: number | null;
  minValue?: number | null;
  maxValue?: number | null;
  type: string | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  required: boolean;
  label: string;
  value?: any | null;
  defaultValue: any | null;
}
