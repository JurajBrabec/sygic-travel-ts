type User = {
  id: string;
  is_sso_user: boolean;
  name: string;
  email: string;
  api_key: string | null;
  api_key_type: string | null;
  measurement_unit: string;
  fb_id: string | null;
  ga_id: string | null;
  just_created: boolean;
  roles: string[];
  created_date: string;
  affiliate_id: string | null;
  is_email_subscribed: boolean;
  is_registered: boolean;
  photo: { url: string };
  privacy_consents: {
    type: string;
    agreed: boolean;
    answered_at: string | null;
  }[];
  premium: {
    is_active: boolean;
    name: string;
    type: string;
    expiration_at: string | null;
    product_id: string;
  };
};
