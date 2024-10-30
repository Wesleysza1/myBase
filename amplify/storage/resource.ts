// amplify\storage\resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const MyBase = defineStorage({
  name: "MyBase",
  isDefault: true, // identify your default storage bucket (required)
  access: (allow) => ({
    'curriculos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['write']),
    ],
    // 'documentos/{entity_id}/*': [
    //   allow.entity('identity').to(['read', 'write', 'delete']),
    //   allow.authenticated.to(['read', 'write', 'delete']),
    // ],
    'documentos/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write']),
    ],
  })
});