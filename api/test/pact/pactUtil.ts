import axios from 'axios';

export async function getUsers(path: string) {
  const axiosConfig = {
    headers: {
      'Authorization': 'Bearer some-access-token',
      'Content-Type': 'application/json',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };
  return axios.get(path, axiosConfig);
}

export async function getOrganisationDetails(path: string) {
  const axiosConfig = {
    headers: {
      'Authorization': 'Bearer some-access-token',
      'Content-Type': 'application/json',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };
  return axios.get(path, axiosConfig);
}

export async function getCaseAssignments(taskUrl: string) {
  const axiosConfig = {
    headers: {
      'Authorization': 'Bearer some-access-token',
      'Content-Type': 'application/json',
      'ServiceAuthorization': 'ServiceAuthToken'
    }
  };

  return await axios.get(taskUrl, axiosConfig);
}

export async function postAssignCasesToUsers(taskUrl: string, payload: any) {
  const axiosConfig = {
    headers: {
      'Authorization': 'Bearer some-access-token',
      'Content-Type': 'application/json',
      'ServiceAuthorization': 'ServiceAuthToken'
    }
  };

  return await axios.post(taskUrl, payload, axiosConfig);
}

export async function getIdamUsersByEmail(taskUrl: string) {
  const axiosConfig = {
    headers: {
      'Authorization': 'Bearer some-access-token',
      'Content-Type': 'application/json'
    }
  };

  return await axios.get(taskUrl, axiosConfig);
}

export async function getTaskById(taskUrl: string) {
  const axiosConfig = {
    headers: {
      Authorization: 'Bearer someAuthorizationToken',
      'Content-Type': 'application/json',
      ServiceAuthorization: 'Bearer someServiceAuthorizationToken'
    }
  };

  return await axios.get(taskUrl, axiosConfig);
}

export async function searchTasks(taskUrl: string, payload: any) {
  const axiosConfig = {
    headers: {
      Authorization: 'Bearer someAuthorizationToken',
      'Content-Type': 'application/json',
      ServiceAuthorization: 'Bearer someServiceAuthorizationToken'
    }
  };

  return await axios.post(taskUrl, payload, axiosConfig);
}

export async function markTaskAs(taskUrl: string) {
  const axiosConfig = {
    headers: {
      Authorization: 'Bearer someAuthorizationToken',
      'Content-Type': 'application/json',
      ServiceAuthorization: 'Bearer someServiceAuthorizationToken'
    }
  };

  return await axios.post(taskUrl, null, axiosConfig);
}

export async function assignTaskToUser(taskUrl: string, payLoad: any) {
  const axiosConfig = {
    headers: {
      Authorization: 'Bearer someAuthorizationToken',
      ServiceAuthorization: 'Bearer someServiceAuthorizationToken'
    }
  };

  return await axios.post(taskUrl, payLoad, axiosConfig);
}

export async function postS2SLease(S2SUrl: string, payload: any): Promise<any> {
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'ServiceAuthorization': 'ServiceAuthToken'
    }
  };
  return await axios.post(S2SUrl, payload, axiosConfig);
}
