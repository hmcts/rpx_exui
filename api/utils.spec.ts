import { expect } from 'chai';

import { allContainOnlySafeCharacters, hasUnacceptableCharacters, toTitleCase, urlHasUnacceptableCharacters } from './utils';

const validRoleList = [
  '[PETSOLICITOR]',
  '[RESPSOLICITOR]',
  '[BARRISTER]',
  '[CAFCASSSOLICITOR]',
  '[EPSMANAGING]',
  '[LABARRISTER]',
  '[LAMANAGING]',
  '[LASOLICITOR]',
  '[SOLICITOR]',
  '[SOLICITORA]',
  '[SOLICITORB]',
  '[SOLICITORC]',
  '[SOLICITORD]',
  '[SOLICITORE]',
  '[SOLICITORF]',
  '[SOLICITORG]',
  '[SOLICITORH]',
  '[SOLICITORI]',
  '[SOLICITORJ]',
  '[LEGALREPRESENTATIVE]',
  '[CREATOR]',
  '[CREATOR]',
  '[CREATOR]',
  '[CREATOR]',
  '[APPSOLICITOR]',
  '[CHILDSOLICITORA]',
  '[CHILDSOLICITORB]',
  '[CHILDSOLICITORC]',
  '[CHILDSOLICITORD]',
  '[CHILDSOLICITORE]',
  '[CHILDSOLICITORF]',
  '[CHILDSOLICITORG]',
  '[CHILDSOLICITORH]',
  '[CHILDSOLICITORI]',
  '[CHILDSOLICITORJ]',
  '[CHILDSOLICITORK]',
  '[CHILDSOLICITORL]',
  '[CHILDSOLICITORM]',
  '[CHILDSOLICITORN]',
  '[CHILDSOLICITORO]',
  '[LASHARED]',
  '[APPLICANTSOLICITORONE]',
  '[APPLICANTSOLICITORTWO]',
  '[RESPONDENTSOLICITORONE]',
  '[RESPONDENTSOLICITORTWO]',
  '[CLAIMANT]',
  '[CLAIMANTSOLICITOR]',
  '[DEFENDANT]',
  '[DEFENDANTSOLICITOR]',
  '[APPLICANTSOLICITOR]',
  '[OTHERPARTYSOLICITOR]',
  '[RESPONDENTSOLICITOR]',
  '[APPONESOLICITOR]',
  '[APPTWOSOLICITOR]',
  '[APPLICANTTWO]',
  '[APPLICANTSOLICITORTWOSPEC]',
  '[APPBARRISTER]',
  '[RESPBARRISTER]',
  '[INTVRSOLICITOR1]',
  '[INTVRSOLICITOR2]',
  '[INTVRSOLICITOR3]',
  '[INTVRSOLICITOR4]',
  '[INTVRBARRISTER1]',
  '[INTVRBARRISTER2]',
  '[INTVRBARRISTER3]',
  '[INTVRBARRISTER4]',
  '[C100APPLICANTSOLICITOR1]',
  '[C100APPLICANTSOLICITOR2]',
  '[C100APPLICANTSOLICITOR3]',
  '[C100APPLICANTSOLICITOR4]',
  '[C100APPLICANTSOLICITOR5]',
  '[FL401APPLICANTSOLICITOR]',
  '[C100CHILDSOLICITOR1]',
  '[C100CHILDSOLICITOR2]',
  '[C100CHILDSOLICITOR3]',
  '[C100CHILDSOLICITOR4]',
  '[C100CHILDSOLICITOR5]',
  '[C100RESPONDENTSOLICITOR1]',
  '[C100RESPONDENTSOLICITOR2]',
  '[C100RESPONDENTSOLICITOR3]',
  '[C100RESPONDENTSOLICITOR4]',
  '[C100RESPONDENTSOLICITOR5]',
  '[FL401RESPONDENTSOLICITOR]',
  'nbc-team-leader',
  'district-judge',
  'deputy-district-judge',
  'recorder',
  'allocated-nbc-caseworker',
  'case-allocator',
  'case-allocator',
  'case-allocator',
  'case-allocator',
  'case-allocator',
  'case-allocator',
  'task-supervisor',
  'task-supervisor',
  'task-supervisor',
  'task-supervisor',
  'case-allocator',
  'hmcts-judiciary',
  'hmcts-legal-operations',
  'hmcts-admin',
  'judge',
  'fee-paid-judge',
  'hearing-judge',
  'allocated-magistrate',
  'leadership-judge',
  'tribunal-caseworker',
  'tribunal-caseworker',
  'conflict-of-interest',
  'conflict-of-interest',
  'conflict-of-interest',
  'conflict-of-interest',
  'specific-access-judiciary',
  'specific-access-requested',
  'specific-access-granted',
  'specific-access-denied',
  'specific-access-legal-ops',
  'specific-access-requested',
  'specific-access-granted',
  'specific-access-denied',
  'specific-access-admin',
  'specific-access-ctsc',
  'specific-access-requested',
  'specific-access-granted',
  'specific-access-denied',
  'specific-access-requested',
  'specific-access-granted',
  'specific-access-denied',
  'challenged-access-judiciary',
  'challenged-access-legal-ops',
  'challenged-access-admin',
  'challenged-access-ctsc',
  'hearing-centre-admin',
  'national-business-centre',
  'ctsc',
  'hearing-manager',
  'hearing-manager',
  'hearing-manager',
  'hearing-manager',
  'hearing-manager',
  'hearing-viewer',
  'hearing-viewer',
  'hearing-viewer',
  'hearing-viewer',
  'hearing-viewer',
  'listed-hearing-viewer',
  'caseworker-privatelaw-externaluser-viewonly',
  'hearing-centre-team-leader',
  'senior-tribunal-caseworker',
  'circuit-judge',
  'specific-access-approver-judiciary',
  'specific-access-approver-legal-ops',
  'specific-access-approver-admin',
  'magistrate',
  'specific-access-approver-ctsc',
  'ctsc',
  'hmcts-ctsc',
  'ctsc-team-leader',
  'allocated-judge',
  'allocated-legal-adviser',
  'hearing-legal-adviser',
  'lead-judge',
  'tribunal-member-1',
  'tribunal-member-2',
  'tribunal-member-3',
  'allocated-tribunal-caseworker',
  'allocated-admin-caseworker',
  'allocated-ctsc-caseworker',
  'clerk',
  'regional-centre-team-leader',
  'regional-centre-admin',
  'senior-judge',
  'medical',
  'fee-paid-medical',
  'fee-paid-disability',
  'fee-paid-financial',
  'fee-paid-tribunal-member',
  'interloc-judge',
  'appraiser-1',
  'appraiser-2',
  'cbus-system-user',
  'tribunal-member',
  'ftpa-judge',
  'hearing-panel-judge',
  'case-manager',
  'gatekeeping-judge',
  'Role1',
  'post-hearing-judge',
  'registrar',
  'registrar',
  'dwp',
  'hmrc',
  'ibca',
  'post-hearing-salaried-judge',
  'cica',
  'allocated-legal-officer',
  'allocated-administrator'
];

describe('api utils', () => {
  describe('toTitleCase', () => {
    it('should correctly set a service name to title case', () => {
      expect(toTitleCase('')).to.equal('');
      expect(toTitleCase('ia')).to.equal('Ia');
      expect(toTitleCase('IA')).to.equal('Ia');
      expect(toTitleCase('iA')).to.equal('Ia');
      expect(toTitleCase(' iA ')).to.equal(' Ia ');
      expect(toTitleCase('4 cIvIL 14')).to.equal('4 Civil 14');
    });
  });

  describe('hasUnacceptableCharacters', () => {
    it('should match strings that contain dangerous characters', () => {
      expect(hasUnacceptableCharacters(null)).to.equal(false);
      const testString = '<script>alert("hello")</script>';
      expect(hasUnacceptableCharacters(testString)).to.equal(true);
      const testString2 = 'email@test.com';
      expect(hasUnacceptableCharacters(testString2)).to.equal(false);
      const testString3 = '&//?';
      expect(hasUnacceptableCharacters(testString3)).to.equal(true);
      const testString4 = '//https://www.google.com';
      expect(hasUnacceptableCharacters(testString4)).to.equal(true);
    });
  });

  describe('urlHasUnacceptableCharacters', () => {
    it('should match urls that do not contain dangerous characters', () => {
      expect(urlHasUnacceptableCharacters(null)).to.equal(false);
      const testString = '<script>alert("hello")</script>';
      expect(urlHasUnacceptableCharacters(testString)).to.equal(true);
      const testString2 = 'email@test.com';
      expect(urlHasUnacceptableCharacters(testString2)).to.equal(false);
      const testString3 = '&//?';
      expect(urlHasUnacceptableCharacters(testString3)).to.equal(false);
      const testString4 = '//https://www.google.com';
      expect(urlHasUnacceptableCharacters(testString4)).to.equal(false);
    });
  });

  describe('allContainOnlySafeCharacters', () => {
    it('should match lists with strings that do not contain dangerous characters', () => {
      expect(allContainOnlySafeCharacters([])).to.equal(true);
      const testList = ['ab', 'cd=ef', 'gh.jk'];
      expect(allContainOnlySafeCharacters(testList)).to.equal(true);
      testList.push('lm<n');
      expect(allContainOnlySafeCharacters(testList)).to.equal(false);
    });

    it('should allow all valid roles possible for role assignment', () => {
      expect(allContainOnlySafeCharacters(validRoleList)).to.equal(true);
    });
  });
});
