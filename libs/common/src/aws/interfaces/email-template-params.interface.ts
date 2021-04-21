export interface IEmailWithTemplateParams {
  Destination: {
    CcAddresses?: string[];
    ToAddresses: string[];
  };
  Template: string;
  TemplateData: any;
  Source: string;
  ReplyToAddresses?: string[];
}
