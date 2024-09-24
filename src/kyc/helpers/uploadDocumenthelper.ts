import { UploadDocumentDto } from '../dto/uploadDocument';
import { KycType } from '../entities/enums';
import { Kyc } from '../entities/kyc.entity';

export const GetUploadDocumentUpdateData = (
  body: UploadDocumentDto,
  kycType: KycType,
): Partial<Kyc> => {
  let data: Partial<Kyc> = {};
  switch (kycType) {
    case KycType.NON_PROFIT:
      data = {
        progress: 4,
        certIncorpTrusteeUrl: body.certIncorpTrusteeUrl,
        incorpTrusteeDocUrl: body.incorpTrusteeDocUrl,
        constitutionDocUrl: body.constitutionDocUrl,
        identityDocUrl: body.identityDocUrl,
        identityDocType: body.identityDocType,
        identityDocNumber: body.identityDocNumber,
        isCompleted: true,
        additionalDocUrl: body.additionalDocUrl,
      };
      break;

    case KycType.REGISTERED:
      data = {
        progress: 4,
        certIncorpUrl: body.certIncorpUrl,
        operatingLicenseUrl: body.operatingLicenseUrl,
        memorandumUrl: body.memorandumUrl,
        additionalDocUrl: body.additionalDocUrl,
      };

    default:
      break;
  }

  return data;
};
