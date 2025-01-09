import { Answer } from './answer';
import { IsHiddenSource } from './hearings.enum';

export interface Section {
  screenName?: string
  insetInfo?: string;
  sectionHTMLTitle: string;
  answers?: Answer[];
  isHiddenSource?: IsHiddenSource;
  isHiddenMargin?: boolean;
}
