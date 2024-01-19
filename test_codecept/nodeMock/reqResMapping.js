
const requestMapping = {
    mockServiceResetCallbacks: [ ],
    get:{
        
    },
    post:{
      

    },
    put:{

    },
    delete:{

    }

}
module.exports = { requestMapping};


// function getOrganisation(){
//     return {"organisationIdentifier":"VRSFNPV","name":"Test sreekanth org","status":"ACTIVE","sraId":null,"sraRegulated":false,"companyNumber":null,"companyUrl":null,"superUser":{"firstName":"test","lastName":"test","email":"sreekanth_su1@mailinator.com"},"paymentAccount":[],"contactInformation":[{"addressLine1":"Flat 39","addressLine2":"Sheraton House","addressLine3":null,"townCity":"London","county":"Essex","country":null,"postCode":"SW1V 3BZ","dxAddress":[]}]}

// }

// function getUsersList(){
//     return {"organisationIdentifier":"VRSFNPV","users":[{"userIdentifier":"41f7963b-4186-4463-b96d-32dfa31f6915","firstName":"test","lastName":"tes","email":"test65757@test7687.com","idamStatus":"PENDING","roles":null,"idamStatusCode":" ","idamMessage":"19 No call made to SIDAM to get the user roles as user status is not 'ACTIVE'"},{"userIdentifier":"4510b778-6a9d-4c53-918a-c3f80bd7aadd","firstName":"test","lastName":"test","email":"sreekanth_su1@mailinator.com","idamStatus":"ACTIVE","roles":["pui-finance-manager","pui-user-manager","caseworker-publiclaw","caseworker-divorce","caseworker-divorce-solicitor","pui-organisation-manager","caseworker-probate","caseworker-probate-solicitor","caseworker-ia","caseworker-publiclaw-solicitor","pui-case-manager","caseworker-divorce-financialremedy","caseworker-ia-legalrep-solicitor","caseworker-divorce-financialremedy-solicitor","caseworker"],"idamStatusCode":"200","idamMessage":"11 OK"}]}
// }

// function getJurisdictions(){
//     return [{"id":"SSCS"},{"id":"AUTOTEST1"},{"id":"DIVORCE"},{"id":"PROBATE"},{"id":"PUBLICLAW"},{"id":"bulkscan"},{"id":"BULKSCAN"},{"id":"IA"},{"id":"EMPLOYMENT"},{"id":"CMC"}]
// }



// function getShareCases(){
//     return [
//         {
//             "caseId": "1573922332670942",
//             "caseTitle": "Paul Saddlebrook Vs Jennifer Saddlebrook",
//             "sharedWith": [
//                 {
//                     "idamId": "u111111",
//                     "firstName": "Joe",
//                     "lastName": "Elliott",
//                     "email": "joe.elliott@woodford.com"
//                 },
//                 {
//                     "idamId": "u222222",
//                     "firstName": "Steve",
//                     "lastName": "Harrison",
//                     "email": "steve.harrison@woodford.com"
//                 }
//             ]
//         },
//         {
//             "caseId": "1573925439311211",
//             "caseTitle": "Neha Venkatanarasimharaj Vs Sanjet Venkatanarasimharaj",
//             "sharedWith": []
//         },
//         {
//             "caseId": "1574006431043307",
//             "caseTitle": "Sam Green Vs Williams Lee",
//             "sharedWith": [
//                 {
//                     "idamId": "u666666",
//                     "firstName": "Kate",
//                     "lastName": "Grant",
//                     "email": "kate.grant@lambbrooks.com"
//                 },
//                 {
//                     "idamId": "u777777",
//                     "firstName": "Nick",
//                     "lastName": "Rodrigues",
//                     "email": "nick.rodrigues@lambbrooks.com"
//                 },
//                 {
//                     "idamId": "u888888",
//                     "firstName": "Joel",
//                     "lastName": "Molloy",
//                     "email": "joel.molloy@lambbrooks.com"
//                 }
//             ]
//         }
//     ];
// }

// function organisationUsers(){

//     return [{ "idamId": "u111111", "firstName": "Joe", "lastName": "Elliott", "email": "joe.elliott@woodford.com" }, { "idamId": "u222222", "firstName": "Steve", "lastName": "Harrison", "email": "steve.harrison@woodford.com" }, { "idamId": "u333333", "firstName": "James", "lastName": "Priest", "email": "james.priest@woodford.com" }, { "idamId": "u444444", "firstName": "Shaun", "lastName": "Coldwell", "email": "shaun.coldwell@woodford.com" }];
// }

// function getCaseShareOrgs(){
//     return [
//         {
//             "name": "Uday2 Test Org",
//             "organisationIdentifier": "W98ZZ5W",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": null,
//                     "addressLine3": null,
//                     "townCity": "Town",
//                     "county": "Berkshire",
//                     "country": null,
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "org-name9",
//             "organisationIdentifier": "36D1IN0",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "some-org-name",
//             "organisationIdentifier": "HTIXPV9",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": null,
//                     "addressLine3": null,
//                     "townCity": null,
//                     "county": null,
//                     "country": null,
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "gmjbGiAqBs",
//             "organisationIdentifier": "99MYB0D",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "some-org-name",
//             "organisationIdentifier": "74UIZZ0",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": null,
//                     "addressLine3": null,
//                     "townCity": null,
//                     "county": null,
//                     "country": null,
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "rkOGPHNIxf",
//             "organisationIdentifier": "C5E2CNJ",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "fSlJfKIEtN",
//             "organisationIdentifier": "RAHN4V8",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "QmjIflnSBY",
//             "organisationIdentifier": "7U5ESY2",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "kdaDTEAlyk",
//             "organisationIdentifier": "XXP0053",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "MHQYvohRQp",
//             "organisationIdentifier": "Q6BPWMH",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "uKUqhbHcDn",
//             "organisationIdentifier": "F3BY6VF",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "addressLine2",
//                     "addressLine3": "addressLine3",
//                     "townCity": "some-town-city",
//                     "county": "some-county",
//                     "country": "some-country",
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         },
//         {
//             "name": "Lousy Overpriced LawyerS",
//             "organisationIdentifier": "US4JC82",
//             "contactInformation": [
//                 {
//                     "addressLine1": "Minerva House",
//                     "addressLine2": "Unit 10 Victoria Station",
//                     "addressLine3": null,
//                     "townCity": "london",
//                     "county": "Orange County",
//                     "country": null,
//                     "postCode": "SE1 9BB"
//                 }
//             ]
//         }
//     ];
// }
