import { Matchers } from '@pact-foundation/pact';
import { like } from '@pact-foundation/pact/src/dsl/matchers';

const { string, boolean, eachLike } = Matchers;

export default {
  'request_parameter_supported': boolean(true),
  'claims_parameter_supported': boolean(false),
  'scopes_supported': eachLike('openid'),
  'issuer': like('https://idam-web-public.aat.platform.hmcts.net/o'),
  'id_token_encryption_enc_values_supported': eachLike('A256GCM'),
  'acr_values_supported': [],
  'authorization_endpoint': like('https://idam-web-public.aat.platform.hmcts.net/o/authorize'),
  'request_object_encryption_enc_values_supported': eachLike('A256GCM'),
  'rcs_request_encryption_alg_values_supported': eachLike('RSA-OAEP'),
  'claims_supported': [],
  'rcs_request_signing_alg_values_supported': eachLike('PS384'),
  'token_endpoint_auth_methods_supported': eachLike('client_secret_post'),
  'token_endpoint': like('https://idam-web-public.aat.platform.hmcts.net/o/token'),
  'response_types_supported': eachLike('code'),
  'request_uri_parameter_supported': boolean(true),
  'rcs_response_encryption_enc_values_supported': eachLike('A256GCM'),
  'end_session_endpoint': like('https://idam-web-public.aat.platform.hmcts.net/o/endSession'),
  'rcs_request_encryption_enc_values_supported': eachLike('A256GCM'),
  'version': string('3.0'),
  'rcs_response_encryption_alg_values_supported': eachLike('RSA-OAEP'),
  'userinfo_endpoint': like('https://idam-web-public.aat.platform.hmcts.net/o/userinfo'),
  'id_token_encryption_alg_values_supported': eachLike('RSA-OAEP'),
  'jwks_uri': like('https://idam-web-public.aat.platform.hmcts.net/o/jwks'),
  'subject_types_supported': eachLike('public'),
  'id_token_signing_alg_values_supported': eachLike('ES384'),
  'request_object_signing_alg_values_supported': eachLike('ES384'),
  'request_object_encryption_alg_values_supported': eachLike('RSA-OAEP'),
  'rcs_response_signing_alg_values_supported': eachLike('PS384')
};
