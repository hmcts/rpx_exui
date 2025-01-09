import { of } from 'rxjs';
import { MonitoringService } from './monitoring.service';

describe('Monitoring service', () => {
  const mockedHttpClient = jasmine.createSpyObj('mockedHttpClient', { get: of({ connectionString: 'InstrumentationKey=dummy' }) });

  it('should be Truthy', () => {
    const service = new MonitoringService(mockedHttpClient);
    expect(service).toBeTruthy();
  });

  it('should be able to LogException and should call the http service', () => {
    const service = new MonitoringService(mockedHttpClient);
    expect(service).toBeTruthy();
    service.logException(new Error('Some ErrorMesssage'));
    expect(mockedHttpClient.get).toHaveBeenCalled();
  });

  it('should be able to LogEvent', () => {
    const service = new MonitoringService(mockedHttpClient);
    expect(service).toBeTruthy();
    service.logEvent('name', [], []);
    expect(mockedHttpClient.get).toHaveBeenCalled();
  });

  it('should be able to LogPageview', () => {
    const service = new MonitoringService(mockedHttpClient);
    expect(service).toBeTruthy();
    service.logPageView('name', null, [], [], 1);
    expect(mockedHttpClient.get).toHaveBeenCalled();
  });

  describe('enableCookies()', () => {
    it('should set areCookiesEnabled to true', () => {
      const service = new MonitoringService(mockedHttpClient);
      service.enableCookies();
      expect(service.areCookiesEnabled).toBeTruthy();
    });
  });
});
