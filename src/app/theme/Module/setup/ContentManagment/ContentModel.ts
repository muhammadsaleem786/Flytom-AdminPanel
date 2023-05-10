export class ContentModel {
  constructor() {
    let objVehiclePart_Request = new BannerList();
    this.BannerList.push(objVehiclePart_Request);
}
  Id: number;
    ContentTypeId: string;
    ContentDescription : string;
    IsActive: boolean;       
    BannerList: Array<BannerList> = [];
}
export class BannerList {
  Id: number;
  BannerImageUrl :string;
  BannerTitle :string;
  BannerDescription :string;
}
