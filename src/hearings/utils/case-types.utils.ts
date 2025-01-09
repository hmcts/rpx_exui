import { CaseCategoryDisplayModel, CaseCategoryModel } from '../models/caseCategory.model';
import { CategoryType } from '../models/hearings.enum';
import { LovRefDataModel } from '../models/lovRefData.model';

export class CaseTypesUtils {
  public static getCaseCategoryDisplayModels(caseTypeRefData: LovRefDataModel[], caseCategories: CaseCategoryModel[]): CaseCategoryDisplayModel[] {
    const caseTypeMap = CaseTypesUtils.generateCaseTypesRefDataMap(caseTypeRefData);
    const allCaseTypes: CaseCategoryModel[] = caseCategories?.filter((category) => category.categoryType === CategoryType.CaseType);
    const allCaseTypesWithChildren = [];
    allCaseTypes?.forEach((caseType) => {
      const childNodes = [];
      caseCategories.forEach((cat) => {
        if (cat.categoryParent === caseType.categoryValue) {
          const categoryDisplayValue = caseTypeMap[cat.categoryValue];
          const caseCategoryDisplayModel: CaseCategoryDisplayModel = { ...cat, categoryDisplayValue };
          childNodes.push(caseCategoryDisplayModel);
        }
      });
      const caseTypeDisplayValue = caseTypeMap[caseType.categoryValue];
      const caseTypeDisplayModel: CaseCategoryDisplayModel = { ...caseType, categoryDisplayValue: caseTypeDisplayValue };
      const caseTypeWithChildren = { ...caseTypeDisplayModel, childNodes };
      allCaseTypesWithChildren.push(caseTypeWithChildren);
    });
    return allCaseTypesWithChildren;
  }

  public static generateCaseTypesRefDataMap(caseTypeRefData: LovRefDataModel[]): object {
    const caseTypeMap = {};
    caseTypeRefData.forEach((caseType) => {
      if (caseType.child_nodes?.length > 0) {
        caseType.child_nodes.forEach((child) => {
          caseTypeMap[child.key] = child.value_en;
        });
      }
      caseTypeMap[caseType.key] = caseType.value_en;
    });
    return caseTypeMap;
  }
}
