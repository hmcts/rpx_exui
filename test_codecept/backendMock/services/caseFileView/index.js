
const { v4 } = require('uuid');
const userApiData = require('../userApiData')

const categoriesAndDocumentsResponse = require('./categoriesAndDocuments')

class CategoriesAndDocumentsApi{
    

    constructor(){
        this.docIdsAndFileMapping = this.getDocumentsInCategory(categoriesAndDocumentsResponse.categories);

    }

    getDocumentsInCategory(categories){
        let documents = {}
        for(const category of categories){
            if (category.documents) {
                for (const document of category.documents) {
                    const doc_url = document.document_url
                    const temp = doc_url.split('/')
                    const docId = temp[temp.length - 1]
                    documents[docId] = document.document_filename
                }
            }
            if (category.sub_categories) {
                const subCatDocuments = this.getDocumentsInCategory(category.sub_categories)
                documents = { ...documents, ...subCatDocuments }
            }
        }
        return documents;
    }

    getCategoriesAndDocumentsForCase(){
        return categoriesAndDocumentsResponse;
    }

    getDocNameWithId(docId){
        return this.docIdsAndFileMapping[docId]
    }

}

module.exports = new CategoriesAndDocumentsApi()



