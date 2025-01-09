
const { fieldNameMapper } = require('../../../../api/lib/util');
const caseFileViewPageObject = require('../pageObjects/caseFileViewPage');
const browserWaits = require('../../support/customWaits')

Then('In case file view tab, I see documents tree view', async function () {
    expect( await caseFileViewPageObject.docTreeContainer.isDisplayed()).to.be.true;
});

Then('In case file view tab, I see documents media view', async function () {
    expect(await caseFileViewPageObject.mediaViewContainer.isDisplayed()).to.be.true;

});

Then('In case file view tab, I see documents tree view header with text {string}', async function (headerText) {
    await browserWaits.retryWithActionCallback(async () => {
        expect(await caseFileViewPageObject.documentFolderHeader.getText()).to.includes(headerText);
    })

});

Then('In case file view tab, I see documents sort icon displayed', async function () {
    expect(await caseFileViewPageObject.sortDocumentsIcon.isDisplayed()).to.be.true

});

When('In case file view tab, I click documents sort icon', async function () {
    await caseFileViewPageObject.sortDocumentsIcon.click()
});

Then('In case file view tab, I see documents sort options menu displayed', async function () {
    expect(await caseFileViewPageObject.sortDocumentsMenuContainer.isDisplayed()).to.be.true

});

Then('In case file view tab, I see documents sort options', async function (datatable) {
    const datatableHash = datatable.parse().hashes();

    for (let row of datatableHash) {
        expect(await caseFileViewPageObject.isSortMenuOptionDisplayed(row.option)).to.be.true;
    }

});

Then('In case file view tab, I dont see documents sort options', async function (datatable) {
    const datatableHash = datatable.parse().hashes();

    for (let row of datatableHash) {
        expect(await caseFileViewPageObject.isSortMenuOptionDisplayed(row.option)).to.be.false;
    }

});

Then('In case file view tab, I see tree view displays folder {string}', async function (folderPath) {
    const folderContainer = await caseFileViewPageObject.getFolderContainer(folderPath);
    expect(await folderContainer.isDisplayed()).to.be.true;

});

Then('In case file view tab, I see tree view displays folders', async function (datatable) {
    const datatableHash = datatable.parse().hashes();

    for (let row of datatableHash){
        const folderContainer = await caseFileViewPageObject.getFolderContainer(row.folderPath);
        expect(await folderContainer.isDisplayed()).to.be.true;
    }

});


Then('In case file view tab, I see tree view displays folder files count', async function (datatable) {
    const datatableHash = datatable.parse().hashes();

    for (let row of datatableHash) {
        const folderContainer = await caseFileViewPageObject.getFolderContainer(row.folderPath);
        expect(await folderContainer.nodeCountElement.getText()).to.equal(row.count);
    }

});


Then('In case file view tab, I see files under folder {string}', async function (folderPath, datatable) {
    const datatableHash = datatable.parse().hashes();
    const folderContainer = await caseFileViewPageObject.getFolderContainer(folderPath);

    for (let row of datatableHash) {
        const fileContainer = await folderContainer.getChildFileContainer(row.file);
        expect(await fileContainer.fileElement.isDisplayed()).to.be.true
    }

});


Then('In case file view tab, I see file upload stamp for files under folder {string}', async function (folderPath, datatable) {
    const datatableHash = datatable.parse().hashes();
    const folderContainer = await caseFileViewPageObject.getFolderContainer(folderPath);

    for (let row of datatableHash) {
        const fileContainer = await folderContainer.getChildFileContainer(row.file);
        expect(await fileContainer.fileElement.isPresent()).to.be.true
        expect(await fileContainer.fileUploadTimestamp.isPresent()).to.be.true
        // expect(await fileContainer.fileUploadTimestamp.getText()).to.includes(row.uploadDate)


    }

});

Then('In case file view tab, I dont see file upload stamp for files under folder {string}', async function (folderPath, datatable) {
    const datatableHash = datatable.parse().hashes();
    const folderContainer = await caseFileViewPageObject.getFolderContainer(folderPath);

    for (let row of datatableHash) {
        const fileContainer = await folderContainer.getChildFileContainer(row.file);
        expect(await fileContainer.fileElement.isDisplayed()).to.be.true
        expect(await fileContainer.fileUploadTimestamp.getText()).to.equal('')


    }

});

When('In case file view tab, I select file {string} under folder {string}', async function (fileName, folderPath) {
    const folderContainer = await caseFileViewPageObject.getFolderContainer(folderPath);
    const fileContainer = await folderContainer.getChildFileContainer(fileName);
    await fileContainer.fileElement.click();
   
});

Then('In case file view tab, I see file {string} in media viewer', async function (fileName) {
    await browserWaits.retryWithActionCallback(async () => {
        const fileDisplayed = await caseFileViewPageObject.getFileDisplayedInMediaViewer();
        expect(fileDisplayed).to.includes(fileName)
    })
    

});

When('In case file view tab, I select file {string} under folder {string}, I see file in media viewer', async function (fileName, folderPath) {
    const folderContainer = await caseFileViewPageObject.getFolderContainer(folderPath);
    const fileContainer = await folderContainer.getChildFileContainer(fileName);
    await fileContainer.fileElement.click();
    await browserWaits.retryWithActionCallback(async () => {
        const fileDisplayed = await caseFileViewPageObject.getFileDisplayedInMediaViewer();
        expect(fileDisplayed !== "").to.be.true
    })
});

