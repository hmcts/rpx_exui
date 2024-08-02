

class CaseFileViewPage{

    constructor(){
        this.container = $('#case-file-view')
        this.header = element(by.xpath(`//div[contains(@id,'case-file-view')]/../h2`))

        this.docTreeContainer = $('.document-tree-container')
        this.mediaViewContainer = $('.media-viewer-container')

        this.documentFolderHeader = $('.document-folders-header .document-folders-header__title')
        this.folderViewSortBtn = $('ccd-case-file-view-folder-sort button')

        this.sortDocumentsIcon = $('ccd-case-file-view-folder-sort button')
        this.sortDocumentsMenuContainer = element(by.xpath(`//div[contains(@class,'cdk-overlay-pane')]//div[contains(text(),'Sort documents by name')]`))
    }


    async getFolderContainer(folderPath){
        const nodes = folderPath.split('.')
        let folderContainer = null
        for(let node of nodes){
            if (!folderContainer){
                folderContainer = new DocumentTreeContainer(node)
            }else{
                expect(await folderContainer.isDisplayed(), `parent of folder ${node} not displayed`).to.be.true
                folderContainer = await folderContainer.getChildFolderContainer(node)
            }
        }
        return folderContainer;
    }

    async isSortMenuOptionDisplayed(option){
        const ele = element(by.xpath(`//div[contains(@class,'cdk-overlay-pane')]//div[contains(@class,'overlay-menu__actionText')][contains(text(),'${option}')]`))
        return await ele.isDisplayed();
    }

    async getFileDisplayedInMediaViewer(){
        const ele = element(by.xpath(`//title`));
        return await ele.getText()
}

}

class DocumentTreeContainer{
    constructor(folderName, parentPath){
        this.folderXpath = `//cdk-nested-tree-node[contains(@class,'document-tree-container__node')]//span[contains(@class,'node__name--folder')][contains(text(),'${folderName}')]`
        this.folderXpath = `${parentPath ? parentPath : ''}${this.folderXpath}`
        this.treeContainerNode = `${this.folderXpath}/../..`

        this.folderElement = element(by.xpath(`${this.folderXpath}`))
        this.nodeCountElement = element(by.xpath(`${this.folderXpath}/..//span[contains(@class,'node__count')]`))
        this.nodeIconImg = element(by.xpath(`${this.folderXpath}/..//img[contains(@class,'node__iconImg')]`))
    }

    async isDisplayed(){
        return await this.folderElement.isDisplayed();
    }

    async openFolder(){
        const iconImgSrc = await this.nodeIconImg.getAttribute('src')
        if (!iconImgSrc.includes('open')) {
            await this.nodeIconImg.click()
        }
    }

    async closeFolder() {
        if (iconImgSrc.includes('open')) {
            await this.nodeIconImg.click()
        }
    }

    async getChildFolderCountDisplayed(){
        return await this.nodeCountElement.getText();
    }

    async getChildFolderContainer(childFolderName){
        await this.openFolder()
        return new DocumentTreeContainer(childFolderName, this.treeContainerNode)
    }

    async getChildFileContainer(childFileName) {
        await this.openFolder()
        return new DocumentContainer(childFileName, this.treeContainerNode)
    }
}

class DocumentContainer {
    constructor(fileName, parentPath) {
        let fileXpath = `//cdk-nested-tree-node[contains(@class,'document-tree-container__node--document')]//span[contains(@class,'node__name node-name-document')][contains(text(),'${fileName}')]`
        fileXpath = `${parentPath ? parentPath : ''}${fileXpath}`
        this.treeContainerNode = `${fileXpath}/../..`

        this.fileElement = element(by.xpath(`${fileXpath}`))
        this.fileUploadTimestamp = element(by.xpath(`${this.treeContainerNode}//span[contains(@class,'node__document-upload-timestamp')]`))
    }


}


module.exports = new CaseFileViewPage();
