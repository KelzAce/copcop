import { AddtionalInfoDto } from '../dto/addtionalInfo';
import { KycType } from '../entities/enums';
import { Kyc } from '../entities/kyc.entity';
// import { MerchantSocialMedia } from '../socialMedia/socialMedia.entity';

export const GetAdditionalInfoUpdateData = (
  body: AddtionalInfoDto,
  kycType: KycType,
) => {
  let data: Partial<Kyc> = {};
  // let mediaData: Partial<MerchantSocialMedia> = {};
  switch (kycType) {
    case KycType.NON_PROFIT:
      data = {
        progress: 3,
        country: body.country,
        address: body.address,
        city: body.city,
        state: body.state,
        businessType: body.businessType,
      };
      // mediaData = {
      //   ...body.socialMedia,
      // };
      break;
    case KycType.NON_REGISTERED:
      data = {
        country: body.country,
        address: body.address,
        city: body.city,
        state: body.state,
        identityDocUrl: body.identityDocUrl,
        identityDocType: body.identityDocType,
        identityDocNumber: body.identityDocNumber,
        isCompleted: true,
        progress: 3,
      };
      break;
    case KycType.REGISTERED:
      data = {
        progress: 3,
        country: body.country,
        address: body.address,
        city: body.city,
        state: body.state,
        businessType: body.businessType,
      };
      // mediaData = {
      //   ...body.socialMedia,
      // };
      break;

    default:
      break;
  }

  return { data, /*mediaData*/ };
};
