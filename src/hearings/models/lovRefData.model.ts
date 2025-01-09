export interface LovRefDataModel {
  category_key: string;
  key: string;
  value_en: string;
  value_cy: string;
  hint_text_en: string;
  hint_text_cy: string;
  lov_order: number;
  parent_category: string;
  parent_key: string;
  active_flag: string;
  child_nodes?: LovRefDataModel[];
  selected?: boolean;
  from?: string;
  showAmendedLabel?: boolean;
}

export interface LovRefDataByServiceModel {
  list_of_values: LovRefDataModel[];
}

export interface LovRefDataByCategoryModel {
  categoryKey: string;
  lovDataModel: LovRefDataByServiceModel;
}
