export interface IGetCardClientResponse {
  uuid: string;
  cardBrandName: string;
  maskedCardNumber: string;
  printedName: string;
  expirationDate: Date;
  isPreferred: boolean;
  isActive: boolean;
}
