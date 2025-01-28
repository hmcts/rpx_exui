export interface NavigationModel {
  conditionOperator?: string;
  conditionValue?: string | boolean;
  resultValue: string;
}

export interface ScreenNavigationModel {
  screenName: string;
  conditionKey?: string;
  navigation: NavigationModel[];
}
