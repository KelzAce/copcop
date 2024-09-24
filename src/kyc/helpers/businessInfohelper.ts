import { BusinessInfoDto } from '../dto/businessInfo';
import { KycType } from '../entities/enums';
import { Kyc } from '../entities/kyc.entity';
// import { MerchantSocialMedia } from '../socialMedia/socialMedia.entity';

export const GetBusinessInfoUpdateData = (
  body: BusinessInfoDto,
  kycType: KycType,
) => {
  let data: Partial<Kyc> = {};
  // let mediaData: Partial<MerchantSocialMedia> = {};
  switch (kycType) {
    case KycType.NON_PROFIT:
      data = {
        tradingName: body.tradingName,
        businessName: body.businessName,
        phone: body.phone,
        supportPhone: body.supportPhone,
        email: body.email,
        supportEmail: body.supportEmail,
        companyRegistrationNumber: body.companyRegistrationNumber,
        description: body.description,
        bvn: body.trusteeBvn,
        bvnSecondTrustee: body.trustee2Bvn,
        estimatedMonthlySale: body.estimatedMonthlySale,
        progress: 2,
      };
      break;
    case KycType.NON_REGISTERED:
      data = {
        tradingName: body.businessName,
        businessName: body.businessName,
        phone: body.phone,
        supportPhone: body.supportPhone,
        email: body.email,
        businessType: body.businessType,
        description: body.description,
        estimatedMonthlySale: body.estimatedMonthlySale,
        progress: 2,
      };
      // mediaData = {
      //   ...body.socialMedia,
      // };
      break;
    case KycType.REGISTERED:
      data = {
        tradingName: body.businessName,
        businessName: body.businessName,
        phone: body.phone,
        supportPhone: body.supportPhone,
        email: body.email,
        supportEmail: body.supportEmail,
        description: body.description,
        companyRegistrationNumber: body.companyRegistrationNumber,
        estimatedMonthlySale: body.estimatedMonthlySale,
        progress: 2,
      };
      break;

    default:
      break;
  }

  return { data, /*mediaData*/ };
};
