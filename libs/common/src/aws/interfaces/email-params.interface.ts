export interface IEmailParams {
  Destination: {
    CcAddresses?: string[];
    ToAddresses: string[];
  };
  Message: {
    Body: {
      Html: {
        Data: string;
      };
      Text?: {
        Data: string;
      };
    };
    Subject: {
      Data: string;
    };
  };
  Source: string;
  ReplyToAddresses?: string[];
}
