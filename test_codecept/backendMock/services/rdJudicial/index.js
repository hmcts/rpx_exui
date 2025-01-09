

const { v4 } = require('uuid');


class RDJudicialService{

    constructor(){
      this.methods = {
        OnFindperson:'ON_FIND_PERSON'
      }

      this.persons = []
      let sidamId = 123456781234
      for(let i = 0 ; i< 10;i++){
        sidamId += 1
        const personTemplate = this.getPersonTemplate();
        personTemplate.sidam_id = v4();

          personTemplate.full_name = `auto test ${i} judge ${i}`
        personTemplate.fullName = personTemplate.full_name

          personTemplate.surname = `judge ${i}`
        personTemplate.email_id = `auto_test_judge_${i}@justice.gov.uk`

        personTemplate.emailId = personTemplate.email_id

          personTemplate.knownAs = `auto testjudge ${i} judicial`
          personTemplate.known_as = `auto testjudge ${i} judicial`

          personTemplate.title = `mockjudge`
        personTemplate.personal_code = `personalcode-${i}`
        personTemplate.personalCode = personTemplate.personal_code

          this.persons.push(personTemplate)

      }

    }

    findPerson(reqBody){
        if(reqBody.searchString){
          return this.persons.filter(person => person.full_name.includes(reqBody.searchString))
        } else if (reqBody.personal_code){
          const usersWithPersonalCode = reqBody.personal_code.map(code => this.persons.find(person => person.personal_code === code) )
          return usersWithPersonalCode
        }
    }

    getPersonTemplate(){
        return {
            "title": "string",
            "known_as": "string",
            "surname": "string",
            "full_name": "string",
            "email_id": "string",
            "sidam_id": "string",
            "personal_code": "string"
        }
    }


}

module.exports = new RDJudicialService();
