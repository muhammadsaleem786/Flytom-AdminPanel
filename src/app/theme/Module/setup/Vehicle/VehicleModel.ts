export class VehicleModel {
  constructor() {
    let objVehiclePart_Request = new VehiclePartRequest();
    this.VehiclePartRequest.push(objVehiclePart_Request);
}
    Id: number;
    MakesId: string;
    VehicleModelsId : string;
       FuelTypeId: string;
        TankCapacity: string;
        NoOfDoor: string;
        NoOfSeatId: string;
         Description : string;
         DriveWheelType : string;
         CarType : string="P";
         LicenceType:string;
         CategoryId:string;
         SteeringTypeId: string;
         SequreFeetId:string;
         RangeGiven:string;
         Lift:string;
         LoadCapacity:string;
         Length:number;
         Height:number;
         Width:number;
      VehicleImage: Array<VehicleImage> = [];
      VehiclePartRequest: Array<VehiclePartRequest> = [];
}
export class VehicleImage {
  Id: number;
  Image :string;
}
export class VehiclePartRequest{
  Id: number;
  Name:string;
  DropDownId :number;
  IsChecked:boolean;
}