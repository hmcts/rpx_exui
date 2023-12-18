
class HearingPanelPage{
  constructor() {
    this.pageContainer = $('exui-hearing-panel');

    this.specificPanelSelection = $('#specificPanelSelection');
    this.noSpecificPanel = $('#noSpecificPanel')

    this.includePanelMemberSearchInput = element(by.xpath("//div[contains(text(),'Include specific panel members')]/..//xuilib-search-judicials//input"))
    this.excludePanelMemberSearchInput = element(by.xpath("//div[contains(text(),'Exclude specific panel members')]/..//xuilib-search-judicials//input"))

    this.includePanelMemberBtn = element(by.xpath("//div[contains(text(),'Include specific panel members')]/..//div[contains(@class ,'govuk-button--secondary')]"))
    this.excludePanelMemberBtn = element(by.xpath("//div[contains(text(),'Exclude specific panel members')]/..//div[contains(@class ,'govuk-button--secondary')]"))

    this.fieldMapping = {
      "Do you require a panel for this hearing?": element(by.xpath("//h1[contains(text(),'Do you require a panel for this hearing?')]")),
      "Include specific panel members": element(by.xpath("//div[contains(text(),'Include specific panel members')]")),
      "Exclude specific panel members": element(by.xpath("//div[contains(text(),'Exclude specific panel members')]")),
      "Or select any other panel roles required": $('#panel-role-selector') 
    }
  }

  async isDisplayed() {
    return await this.pageContainer.isDisplayed();
  }

  async inputValue(field, value){
    switch (field){
      case "Do you require a panel for this hearing?":
        if(value.toLowerCase().includes('yes')){
          await this.specificPanelSelection.click()
        }else{
          await this.noSpecificPanel.click()
        }
        break;
      case "Include specific panel members":
        const includeMembers = value.split(',')
        await this.includePanelMemberSearchInput.sendKeys(includeMembers[0].trim())
        await this.selectPanelMember(includeMembers[1].trim());
        await this.includePanelMemberBtn.click()
        break;
      case "Exclude specific panel members":
        const excludeMember = value.split(',')
        await this.excludePanelMemberSearchInput.sendKeys(excludeMember[0].trim())
        await this.selectPanelMember(excludeMember[1].trim());
        await this.excludePanelMemberBtn.click()
        break;
      case "Or select any other panel roles required":
        const values = value.split(',')
        for(const role of values){
          await this.selectPanelRole(role.trim());
        }
        break;
      default:
        throw new Error(`${field} not recognised.`)
    }
  }

  async selectPanelRole(role){
    const ele = element(by.xpath(`//*[@id='panel-role-selector']//label[contains(text(),'${role}')]/../input`))
    await ele.click();
  }

  async selectPanelMember(member) {
    const ele = element(by.xpath(`//div[contains(@class,'mat-autocomplete-panel')]//mat-option//span[contains(text(),'${member}')]`))
    await ele.click();
  }
}

module.exports = HearingPanelPage;
