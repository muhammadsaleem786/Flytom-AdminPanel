export class ContentModel {

    ID: number;
    ContentTypeId: number;
    ContentDescription : string;
    IsActive: boolean;       
    BannerList: Array<BannerList> = [];
}
export class BannerList {
  ID: number;
  BannerImageUrl :string;
  BannerTitle :string;
  BannerDescription :string;
}
