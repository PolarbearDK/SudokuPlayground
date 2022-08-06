export interface BoardCell {
  invalid?: boolean;
  locked?: boolean;
  possibleValues?: number[];
  suggestedValue?: number;
  value?: number;
}
