import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { sessionStorage } from "aws-amplify/utils";
import { irraBase } from "./storage/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */

cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage);

const backend = defineBackend({
  auth,
  data,
  irraBase,
});

const { cfnIdentityPool, cfnUserPool } = backend.auth.resources.cfnResources;

cfnIdentityPool.allowUnauthenticatedIdentities = true;
//cfnUserPool.deletionProtection = "ACTIVE";
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 10,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercase: true,
    temporaryPasswordValidityDays: 7,
  },
};

const { amplifyDynamoDbTables } = backend.data.resources.cfnResources;
for (const table of Object.values(amplifyDynamoDbTables)) {
  table.deletionProtectionEnabled = false;
  table.pointInTimeRecoveryEnabled = true;
}