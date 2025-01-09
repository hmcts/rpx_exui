import { of } from 'rxjs';
import { LoggerService } from './logger.service';
import { DeploymentEnvironmentEnum } from '../../enums/deployment-environment-enum';

describe('Logger service', () => {
  const mockedMonitoringService = jasmine.createSpyObj('mockedMonitoringService', ['logEvent', 'logException', 'enableCookies']);
  const mockedNgxLogger = jasmine.createSpyObj('mockedNgxLogger', ['trace', 'debug', 'info',
    'log', 'warn', 'error', 'fatal']);
  const mockedSessionStorageService = jasmine.createSpyObj('mockedSessionStorageService', ['getItem']);
  const mockedCryptoWrapper = jasmine.createSpyObj('mockedCryptoWrapper', ['encrypt', 'decrypt']);
  const mockedConsoleObject = jasmine.createSpyObj('mockedConsoleObject', ['log', 'trace', 'debug', 'info', 'warn', 'error']);
  const mockEnvironmentService = jasmine.createSpyObj('mockEnvironmentService', ['config$', 'getDeploymentEnv']);
  const mockConfig = jasmine.createSpyObj('mockConfig', ['subscribe']);
  mockEnvironmentService.config$ = mockConfig;

  it('should be Truthy', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    expect(service).toBeTruthy();
  });

  it('should be able to call info', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.info('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.info).toHaveBeenCalled();
  });

  it('should be able to call log', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.log('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.log).toHaveBeenCalled();
  });

  it('should be able to call warn', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.warn('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.warn).toHaveBeenCalled();
  });

  it('should be able to call error', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.error('message');
    expect(mockedMonitoringService.logException).toHaveBeenCalled();
    expect(mockedNgxLogger.error).toHaveBeenCalled();
  });

  it('should be able to call fatal', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.fatal('message');
    expect(mockedMonitoringService.logException).toHaveBeenCalled();
    expect(mockedNgxLogger.fatal).toHaveBeenCalled();
  });

  it('should be able to call debug', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.debug('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
  });

  it('should be able to call trace', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    service.trace('message');
    expect(mockedMonitoringService.logEvent).toHaveBeenCalled();
    expect(mockedNgxLogger.trace).toHaveBeenCalled();
  });

  it('should be able to get a message', () => {
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    // slice off the last two characters of string to ensure no accidental discrepancies
    const expectedMessage = `Message - message, Timestamp - ${Date.now()}`.slice(0, -2);
    const returnedMessage = service.getMessage('message');
    expect(returnedMessage).not.toBeNull();
    expect(returnedMessage.slice(0, -2)).toBe(expectedMessage);
  });

  it('should be able to get a message with the user email encrypted', () => {
    const userInfo = { id: '1', forename: 'Test', surname: 'User', email: 'testemail', active: true, roles: ['pui-case-manager'] };
    mockedSessionStorageService.getItem.and.returnValue(JSON.stringify(userInfo));
    // Return dummy encrypted email address
    mockedCryptoWrapper.encrypt.and.returnValue('encrypted@example.com');
    const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    // slice off the last two characters of string to ensure no accidental discrepancies
    const expectedMessage = `User - encrypted@example.com, Message - message, Timestamp - ${Date.now()}`.slice(0, -2);
    const returnedMessage = service.getMessage('message');
    expect(returnedMessage).not.toBeNull();
    expect(returnedMessage.slice(0, -2)).toBe(expectedMessage);
  });

  it('should log the correct environment type to the console', () => {
    mockEnvironmentService.config$ = of(true);
    mockEnvironmentService.getDeploymentEnv.and.returnValue(DeploymentEnvironmentEnum.PROD);
    spyOn(console, 'info');
    new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    expect(console.info).toHaveBeenCalledWith('Environment is prod.');
    mockEnvironmentService.getDeploymentEnv.and.returnValue(DeploymentEnvironmentEnum.AAT);
    new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
      mockedCryptoWrapper, mockEnvironmentService);
    expect(console.info).toHaveBeenCalledWith('Environment is aat.');
  });

  describe('enableCookies()', () => {
    it('should make a call to monitoringService', () => {
      const service = new LoggerService(mockedMonitoringService, mockedNgxLogger, mockedSessionStorageService,
        mockedCryptoWrapper, mockEnvironmentService);
      service.enableCookies();
      expect(mockedMonitoringService.enableCookies).toHaveBeenCalled();
    });
  });

  describe('switchConsoleLogs()', () => {
    it('should switch off all console logs when needed', () => {
      // Reset console to use a mocked object.
      console.log = mockedConsoleObject.log;
      console.debug = mockedConsoleObject.debug;
      console.trace = mockedConsoleObject.trace;
      console.info = mockedConsoleObject.info;
      console.warn = mockedConsoleObject.warn;
      console.error = mockedConsoleObject.error;

      // Let LoggerService switch off the console logs, and use console.
      LoggerService.switchConsoleLogs({ switchOffAll: true });
      console.log('log');
      console.trace('trace');
      console.debug('debug');
      console.info('info');
      console.warn('warn');
      console.error('error');

      // Expect the mocked console object NOT to have received the console calls.
      expect(mockedConsoleObject.log).not.toHaveBeenCalled();
      expect(mockedConsoleObject.trace).not.toHaveBeenCalled();
      expect(mockedConsoleObject.debug).not.toHaveBeenCalled();
      expect(mockedConsoleObject.info).toHaveBeenCalledTimes(1);
      expect(mockedConsoleObject.warn).toHaveBeenCalledTimes(1);
      expect(mockedConsoleObject.error).not.toHaveBeenCalled();
    });

    it('should NOT switch off any console logs when NOT needed', () => {
      // Reset console to use a mocked object.
      console.log = mockedConsoleObject.log;
      console.debug = mockedConsoleObject.debug;
      console.trace = mockedConsoleObject.trace;
      console.info = mockedConsoleObject.info;
      console.warn = mockedConsoleObject.warn;
      console.error = mockedConsoleObject.error;

      // Let LoggerService NOT switch off the console logs, and use console.
      LoggerService.switchConsoleLogs({ switchOffAll: false });
      console.log('log');
      console.trace('trace');
      console.debug('debug');
      console.info('info');
      console.warn('warn');
      console.error('error');

      // Expect the mocked console object to have received the console calls.
      expect(mockedConsoleObject.log).toHaveBeenCalled();
      expect(mockedConsoleObject.trace).toHaveBeenCalled();
      expect(mockedConsoleObject.debug).toHaveBeenCalled();
      expect(mockedConsoleObject.info).toHaveBeenCalled();
      expect(mockedConsoleObject.warn).toHaveBeenCalled();
      expect(mockedConsoleObject.error).toHaveBeenCalled();
    });
  });
});
