export interface EditableRow<T> {
  id: string;
  isEditing: boolean;
  model: T;
}
