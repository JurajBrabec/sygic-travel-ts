type KeyValues = { name: string; value: string }[];
type HAREntry = {
  page_ref: string;
  startedDateTime: string;
  request: {
    bodySize: number;
    method: string;
    url: string;
    httpVersion: string;
    headers: KeyValues;
    cookies: KeyValues;
    queryString: KeyValues;
    headersSize: number;
    postData?: {
      mimeType: string;
      params: KeyValues;
      text: string;
    };
  };
  response: {
    status: number;
    statusText: string;
    headers: KeyValues;
    cookies: KeyValues;
    content: {
      mimeType: string;
      size: number;
      text: string;
    };
    redirectUrl: string;
    headersSize: number;
    bodySize: number;
  };
  cache: {};
  timings: {
    blocked: number;
    dns: number;
    connect: number;
    ssl: number;
    wait: number;
    receive: number;
  };
  time: number;
  _securityState: string;
  serverIPAddress: string;
  connection: string;
};
type HAREntries = HAREntry[];
