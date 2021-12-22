export default class ProductInformationBlock{
    constructor(magic,revSigniture,man,hwId,hwSubId,revision,features,serial,year,month,day,customText){
      this.magic = magic;
      this.revSigniture = revSigniture;
      this.man = man;
      this.hwId = hwId;
      this.hwSubId = hwSubId;
      this.revision = revision;
      this.features = features;
      this.serial = serial;
      this.year = year;
      this.month = month;
      this.day = day;
      this.customText = customText;
    }
  }