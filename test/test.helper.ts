// import { faker } from '@faker-js/faker';
// import { Cooperative } from '../src/shared/entities/cooperative.entity';
// import { User } from '../src/user/entities/user.entity';
// import { Access } from 'src/access/entities/access.entity';

// export const getUser = ({
//   role = 'admin',
//   is_verified = true,
//   cooperativeId = null,
//   first_name = null,
//   last_name = null,
//   email = null,
// }): User => {
//   return {
//     first_name: first_name ?? faker.person.firstName(),
//     last_name: last_name ?? faker.person.lastName(),
    // // phone_number: phone_number ?? faker.phone
    // email: email ?? faker.internet.email(),
    // password: faker.lorem.word(),
    // cooperative: {
    //   id: cooperativeId ?? faker.string.uuid(),
    //   cooperative_name: faker.company.name(),
      // createdAt: new Date('2022-11-23T15:23:46.502Z'),
      // users: [],
      // senderIds: [],
      // campaigns: [],
      // contacts: [],
      // groups: [],
      // messages: [],
      // socialAccounts: [],
      // teams: [],
      // merchantCustomers: [],
      // notifications: [],
    // },
//     id: faker.string.uuid(),
//     status: false,
//     created_at: new Date('2022-11-23T15:23:46.624Z'),
//     deleted_at: new Date('2022-11-23T15:23:46.624Z'),
//     is_verified,
//     role,
//     invitedBy: faker.string.uuid(),
//     invitationSentAt: new Date(),
//     invitationAcceptance: false,
//   };
// };

// export const getCooperative = ({ cooperativeId = null }): Cooperative => {
//   return {
//     id: faker.string.uuid(),
//     cooperative_name: faker.company.name(),
//     created_at: new Date('2022-11-23T15:23:46.502Z'),
//     users: [], 
//   };
// };

// export const bankDetails: BankDetails = {
//   id: faker.string.uuid(),
//   wallet: undefined,
//   currency: 'NGN',
//   is_verified: true,
//   created_at: new Date('2022-11-23T15:23:46.502Z'),
//   bvn: faker.number.bigInt(11).toString(),
//   accountName: faker.person.fullName(),
//   accountNumber: faker.number.bigInt(11).toString(),
//   bankName: faker.person.lastName(),
//   bankCode: faker.number.bigInt(3).toString(),
// };

// export const getWallet = ({
//   merchant = null,
// }: {
//   merchant: Cooperative | null;
// }): Wallet => {
//   return {
//     id: faker.string.uuid(),
//     currency: faker.finance.currencyCode(),
//     balance: Number(faker.finance.amount()),
//     created_at: new Date('2022-11-23T15:23:46.502Z'),
//     merchant: merchant ?? getCooperative({}),
//     bankDetails,
//     customerRef: 'MY_TSSBWU121283',
//     putMoney: () => Promise.resolve(new Wallet()),
//     removeMoney: () => Promise.resolve(new Wallet()),
//   };
// };

// export const getSenderId = ({ merchant = null }): SenderId => {
//   return {
//     id: faker.string.uuid(),
//     name: 'uncooked',
//     is_approved: true,
//     created_at: new Date('2023-01-08T08:10:16.928Z'),
//     deleted_at: new Date(),
//     merchant: merchant ?? getCooperative({}),
//     address: '',
//     registrationNumber: '',
//     message: '',
//     twilioPhoneNumber: '',
//     campaigns: [], // Add campaigns property
//     messages: [], // Add messages property
//   };
// };

// export const sendBirdAccount = {
//   data: {
//     userId: faker.string.uuid(),
//     nickName: faker.internet.userName(),
//     profileUrl: '',
//     user_id: faker.string.uuid(),
//     nickname: faker.person.firstName(),
//     profile_url: '',
//     issueAccessToken: false,
//     access_token: '',
//     is_online: false,
//     is_active: false,
//     is_created: false,
//     phone_number: '',
//     require_auth_for_profile_image: false,
//     session_tokens: [],
//     last_seen_at: 0,
//     discovery_keys: [],
//     preferred_languages: [],
//     has_ever_logged_in: false,
//     metadata: {
//       role: Role.ADMIN,
//     },
//   },
// };

// export const getSystemWallet = (): SystemWalletEntity => {
//   return {
//     id: faker.string.uuid(),
//     balance: Number(faker.finance.amount()),
//     type: SystemWalletType.SystemWallet,
//     status: WalletStatus.Active,
//     provider: 'bani',
//     cardProvider: 'rex',
//     activePaymentBank: 'wema',
//     ref: '',
//     putMoney: () => Promise.resolve(new SystemWalletEntity()),
//     removeMoney: () => Promise.resolve(new SystemWalletEntity()),
//   };
// };

// export const VirtualTerminalTest: VirtualTerminal = {
//   id: faker.string.uuid(),
//   name: faker.company.name(),
//   balance: 0,
//   phone: faker.phone.number(),
//   supportPhone: faker.phone.number(),
//   created_at: new Date(),
//   merchant: null,
//   wallet: null,
//   slug: faker.company.name(),
//   customerRef: faker.word.noun(),
//   ledger: null,
//   putMoney: () => Promise.resolve(new VirtualTerminal()),
//   removeMoney: () => Promise.resolve(new VirtualTerminal()),
// };

// export const getVirtualTerminal = ({ merchant, wallet }) => {
//   return {
//     ...VirtualTerminalTest,
//     merchant: merchant,
//     wallet: wallet,
//   };
// };

// export const InvoiceTest: Invoice = {
//   id: faker.string.uuid(),
//   title: faker.word.noun(),
//   invoiceNo: faker.string.numeric(7),
//   dateOfPayment: new Date(),
//   currency: 'NGN',
//   schedulingDateandTime: new Date(),
//   schedulingReoccurence: InvoiceSchedules.DAILY,
//   shippingFee: 0,
//   tax: 0,
//   amount: 100,
//   status: InvoiceStatus.PENDING,
//   discount: 0,
//   reminderDateandTime: new Date(),
//   reminderDaysCount: 0,
//   transactionRef: faker.string.alphanumeric(11),
//   productDetails: [
//     {
//       productName: faker.word.noun(),
//       productQuantity: 1,
//       productPrice: 100,
//     },
//   ],
//   additionalNote: faker.word.words(5),
//   timeZone: 'TZ',
//   customers: [
//     {
//       name: faker.company.name(),
//       email: faker.internet.email(),
//       phone: faker.phone.number(),
//     },
//   ],
//   senderName: faker.company.name(),
//   senderEmail: faker.internet.email(),
//   senderPhone: faker.phone.number(),
//   created_at: new Date(),
//   updatedAt: new Date(),
//   merchant: null,
// };

// export const getInvoice = ({ merchant }) => {
//   return {
//     ...InvoiceTest,
//     merchant: merchant,
//   };
// };

// export interface bankCode {
//   id: number;
//   code: string;
//   name: string;
// }

// export const getBanks = (): bankCode[] => {
//   return [
//     {
//       id: 132,
//       code: '560',
//       name: 'Page MFBank',
//     },
//     {
//       id: 133,
//       code: '304',
//       name: 'Stanbic Mobile Money',
//     },
//     {
//       id: 134,
//       code: '308',
//       name: 'FortisMobile',
//     },
//   ];
// };

// export const BankCode: BankCodes = {
//   id: faker.string.uuid(),
//   name: 'test bank',
//   slug: 'test-bank',
//   code: '213',
//   ussd: '#123',
//   createdAt: faker.date.recent(),
// };

// export const kyc: Kyc = {
//   id: faker.string.uuid(),
//   bankName: faker.person.jobTitle(),
//   acctNo: faker.string.numeric(10),
//   acctName: faker.person.fullName(),
//   bvn: faker.string.numeric(11),
//   bvnSecondTrustee: faker.string.numeric(11),
//   businessName: faker.internet.domainWord(),
//   tradingName: faker.internet.domainWord(),
//   phone: faker.phone.number(),
//   email: faker.internet.email(),
//   supportEmail: faker.internet.email(),
//   supportPhone: faker.phone.number(),
//   category: BusinessCategory.LLC,
//   description: faker.lorem.sentence(),
//   estimatedMonthlySale: faker.number.int({ min: 1000, max: 2000 }).toString(),
//   country: faker.location.country(),
//   state: faker.location.state(),
//   city: faker.location.city(),
//   address: faker.location.streetAddress(),
//   identityDocUrl: faker.internet.url(),
//   identityDocType: "Driver's Lisence",
//   identityDocNumber: faker.string.numeric(10),
//   certIncorpUrl: faker.internet.url(),
//   certIncorpTrusteeUrl: faker.internet.url(),
//   incorpTrusteeDocUrl: faker.internet.url(),
//   constitutionDocUrl: faker.internet.url(),
//   businessCategory: BusinessCategory.LLC,
//   companyRegistrationNumber: faker.string.alphanumeric(8),
//   businessType: faker.word.noun(),
//   operatingLicenseUrl: faker.internet.url(),
//   memorandumUrl: faker.internet.url(),
//   additionalDocUrl: faker.internet.url(),
//   photoUrl: faker.internet.url(),
//   status: KycStatus.PENDING,
//   kycType: KycType.NON_PROFIT,
//   progress: 1,
//   isCompleted: true,
//   merchant: null,
//   socialMedia: null,
//   companyOwners: [],
//   createdAt: faker.date.recent(),
//   updatedAt: faker.date.recent(),
// };

// export const getKyc = ({ merchant }: { merchant: Merchant }): Kyc => {
//   return {
//     ...kyc,
//     merchant: merchant,
//   };
// };

// export const SocialMedia: MerchantSocialMedia = {
//   id: faker.string.uuid(),
//   facebookLink: faker.internet.url(),
//   instagramLink: faker.internet.url(),
//   tiktokLink: faker.internet.url(),
//   twitterLink: faker.internet.url(),
//   linkedinLink: faker.internet.url(),
//   websiteLink: faker.internet.url(),
//   kyc: null,
//   merchant: null,
//   createdAt: faker.date.recent(),
//   updatedAt: faker.date.recent(),
// };

// export const getKycSocialMedia = (): MerchantSocialMedia => {
//   return {
//     ...SocialMedia,
//   };
// };

// export const companyOwner: CompanyOwner = {
//   id: faker.string.uuid(),
//   ownsMoreThan5PercentageOfCompany: false,
//   isBusinessOwner: false,
//   bvn: faker.string.numeric(11),
//   fullName: faker.person.fullName(),
//   email: faker.internet.email(),
//   phone: faker.phone.number(),
//   state: faker.location.state(),
//   city: faker.location.city(),
//   address: faker.location.streetAddress(),
//   docUrl: faker.internet.url(),
//   docType: "Driver's Lisence",
//   docNumber: faker.string.numeric(11),
//   kyc: null,
//   merchant: null,
//   createdAt: faker.date.recent(),
//   updatedAt: faker.date.recent(),
// };

// export const getCompanyOwner = ({ kyc }: { kyc: Kyc }): CompanyOwner => {
//   return {
//     ...companyOwner,
//     kyc: kyc,
//   };
// };
