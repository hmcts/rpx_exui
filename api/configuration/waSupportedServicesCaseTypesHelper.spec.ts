import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import * as SharedUtilities from '../configuration';
import * as service from './waSupportedServicesCaseTypesHelper';
chai.use(sinonChai);

describe('getFormattedSupportedServicesCaseTypes', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return null if the config value is null', () => {
    const formattedServiceCasetypes = service.getFormattedSupportedServicesCaseTypes('');
    expect(formattedServiceCasetypes).to.equal(null);
  });

  it('should return null if the config value is empty', () => {
    const formattedServiceCasetypes = service.getFormattedSupportedServicesCaseTypes('');
    expect(formattedServiceCasetypes).to.equal(null);
  });

  it('should return the config in correct format', () => {
    const formattedServiceCasetypes = service.getFormattedSupportedServicesCaseTypes('IA');
    const expectedValue = {
      configurations: [
        {
          caseTypes: [
            'Asylum'
          ],
          releaseVersion: '3.5',
          serviceName: 'IA'
        }]
    };
    expect(formattedServiceCasetypes).to.deep.equal(expectedValue);
  });

  it('should return null if there is any error', () => {
    const expectedValue = {
      configurations: [{
        caseTypes: [
          'Asylum'
        ],
        releaseVersion: '3.5',
        serviceName: 'IA'
      },
      {
        caseTypes: [
          'CIVIL',
          'GA'
        ],
        releaseVersion: '3.5',
        serviceName: 'CIVIL'
      }]
    };

    const stub = sinon.stub(SharedUtilities, 'getConfigValue');
    stub.withArgs('waSupportedServiceandCaseTypes.IA.caseTypes').returns('Asylum');
    stub.withArgs('waSupportedServiceandCaseTypes.IA.releaseVersion').returns('3.5');
    stub.withArgs('waSupportedServiceandCaseTypes.CIVIL.caseTypes').returns('CIVIL,GA');
    stub.withArgs('waSupportedServiceandCaseTypes.CIVIL.releaseVersion').returns('3.5');
    const formattedServiceCasetypes = service.getFormattedSupportedServicesCaseTypes('IA,CIVIL');
    stub.restore();
    expect(formattedServiceCasetypes).to.deep.equal(expectedValue);
  });
});
