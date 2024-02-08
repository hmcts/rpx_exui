import { AxiosInstance } from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { HttpMock } from './httpMock';

export class HttpMockAdapter {
  public static getInstance(): MockAdapter {
    if (!this.adapterInstance) {
      this.adapterInstance = new MockAdapter(this.mockInstance);
    }
    return this.adapterInstance;
  }

  private static adapterInstance?: MockAdapter;
  private static mockInstance: AxiosInstance = HttpMock.getInstance();
}
