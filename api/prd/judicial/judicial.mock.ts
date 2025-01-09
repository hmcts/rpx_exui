import * as MockAdapter from 'axios-mock-adapter';
import { HttpMockAdapter } from '../../common/httpMockAdapter';
import { ALL_JUDICIAL_USERS, RAW_JUDICIAL_USERS } from './data/judicial.mock.data';
import { JudicialUserModel, RawJudicialUserModel } from './models/judicialUser.model';

export const init = () => {
  const mock: MockAdapter = HttpMockAdapter.getInstance();
  const searchJudicialByPersonalCode = /refdata\/judicial\/users/;
  const searchJudicialBySearchText = /refdata\/judicial\/users\/search/;

  mock.onPost(searchJudicialBySearchText).reply((config) => {
    const data = JSON.parse(config.data);
    const searchedValue: string = data.searchString;
    const searchResult: JudicialUserModel[] = ALL_JUDICIAL_USERS.filter((user) => user.fullName.toLowerCase().includes(searchedValue.toLowerCase()));
    return [
      200,
      searchResult
    ];
  });

  mock.onPost(searchJudicialByPersonalCode).reply((config) => {
    const data = JSON.parse(config.data);
    const personalCodes: string[] = data.personal_code;
    const searchResult: RawJudicialUserModel[] = RAW_JUDICIAL_USERS.filter((user) => personalCodes.includes(user.personal_code));
    return [
      200,
      searchResult
    ];
  });
};
