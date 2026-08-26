export const LEMON_SQUEEZY_CONFIG = {
  apiKey: process.env.LEMON_SQUEEZY_API_KEY || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiJkNzE3MDJhMzUwZDg5YjkzMGQwNzEyNDdmZDY1YTZhMGUwZWVhYzU4NTc0MWE2ZmY4ZTI1Y2MxNjA5MGY3NDVlNDY2NDA1NGY4MTZlMjc5NCIsImlhdCI6MTc4NzY3MDk2MC40MTU2NzYsIm5iZiI6MTc4NzY3MDk2MC40MTU2NzksImV4cCI6MTgwMzUxMzYwMC4wODU4NTksInN1YiI6Ijc4MzczMDciLCJzY29wZXMiOltdfQ.uBkMJfoNV2-f4kLpZgcwcFR-dirOFEpKNX8aQOUsD8hx3oCmF2ubX_X_StWeZ57DYXdUZadYvfmzAVnSlUuvaIo-7FW-EeQ1g-4JBnBi7qvnyb5sHgxIy6s29dChI_t9zxJltQ116yuJUP8MZ9AhTpFNb9eexSdjYJkqRJZ3cZxQMvQAVxDWBkprFKnEAmZa2mN7j-ScFQ855pTD-CWK_PiyB5zMIWFuxs_mBcBmPR5NUprJGEm8Gqc_MHvBmeol7fFvIvKWZDo77InVmFMsAxCVJQLRFmNbEhlNLR8SOcDVhMWSB5Xm0wWPzn0aSuHULp4kWxWpTG5knNjofpT-w01QmisqAF1uTnQ2eVifM1vDT7XnbAj9xxR8LeyOOCctB7cw-INg8RpFHGZyZXDQtd1nJc2b26iP9z2ulTkYRpuQ6ZI7XpGp6J10yaXtVt2QCx3urjNlfTxOWzHhEw3uh9NEADvdirrIxO58xLCAsJ_N5gZzGrNCU6EGql-hW0A-QC-Zc1Rc5Y8Aif0-ze8gahDKF2aRbl3NRejVh8OP-jrkclSyEibLBw73kTE5QX8unXAVKaxDuw_Z2d5f66xOljQwGdUui6f03BxpfrwDWwu5-dtdeFU767utcjGxOHcmjccd5DGp6KlCl_4tjY630MyPXClXmFIqd-gQ1OFrFxM",
  checkoutUrls: {
    pro: process.env.LEMON_SQUEEZY_PRO_CHECKOUT_URL || "https://specguard.lemonsqueezy.com/checkout/buy/9e16942b-ac83-43b7-a38c-bff41eef80ff",
    enterprise: process.env.LEMON_SQUEEZY_ENTERPRISE_CHECKOUT_URL || "https://specguard.lemonsqueezy.com/checkout/buy/9e16942b-ac83-43b7-a38c-bff41eef80ff",
  },
};

export function buildLemonSqueezyCheckoutUrl(options: {
  planId: "pro" | "enterprise";
  email?: string;
  name?: string;
  userId?: string;
  returnUrl?: string;
}): string {
  const baseUrl = LEMON_SQUEEZY_CONFIG.checkoutUrls[options.planId] || LEMON_SQUEEZY_CONFIG.checkoutUrls.pro;
  const url = new URL(baseUrl);

  if (options.email) {
    url.searchParams.set("checkout[email]", options.email);
  }
  if (options.name) {
    url.searchParams.set("checkout[name]", options.name);
  }
  if (options.userId) {
    url.searchParams.set("checkout[custom][user_id]", options.userId);
  }
  if (options.returnUrl) {
    url.searchParams.set("checkout[success_url]", options.returnUrl);
  }

  return url.toString();
}
