// lib/convex.ts

import { ConvexReactClient } from 'convex/react';

// This is your correct URL
const convexUrl = 'https://brilliant-spider-331.convex.cloud';

export const convex = new ConvexReactClient(convexUrl, {
  // This is the only option we need
  unsavedChangesWarning: false,
});