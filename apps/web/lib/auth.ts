import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { createTransport } from "nodemailer";
import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import type { NextAuthOptions } from "next-auth";

import EmailProvider, {
  SendVerificationRequestParams,
} from "next-auth/providers/email";

export const NEXT_AUTH_CONFIG : NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest(params: SendVerificationRequestParams) {
        console.log("sending email verification request...");
        const { identifier, url, provider } = params;
        const { host } = new URL(url);
        const transport = createTransport({
          host: process.env.EMAIL_SERVER_HOST!,
          port: Number(process.env.EMAIL_SERVER_PORT!),
          secure: false,
          auth: {
            user: process.env.EMAIL_SERVER_USER!,
            pass: process.env.EMAIL_SERVER_PASSWORD!,
          },
        });
        const result = await transport.sendMail({
          secure: false,
          to: identifier,
          from: provider.from,
          subject: `sigin in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host }),
        });
        console.log(result);
        if (result.rejected?.length) {
          throw new Error(
            `Email(s) (${result.rejected.join(", ")}) could not be sent`,
          );
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.email = user.email ?? undefined;
        token.id = user.id;

        const accessToken = jwt.sign(
          {
            id: token.id,
            email: token.email,
          },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "1h" },
        );

        token.accessToken = accessToken;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      session.user.email = token.email;
      session.user.id = token.id!;

      session.accessToken = token.accessToken!;

      return session;
    },
  },
  pages: {
    signIn: "/signin", // your custom sign in page route
    signOut: "/", // redirect here after sign out
    error: "/signin", // auth errors go back to signin
  },
};

export function html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const color = {
    background: "#f9f9f9",
    text: "#444444",
    mainBackground: "#ffffff",
    buttonBackground: "#346df1",
    buttonBorder: "#346df1",
    buttonText: "#ffffff",
  };

  return `
<body style="margin:0; padding:0; background-color:${color.background};">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px; background-color:${color.mainBackground}; border-radius:10px; margin:20px auto;">
          
          <tr>
            <td align="center"
              style="padding:24px; font-size:22px; font-family:Helvetica, Arial, sans-serif; color:${color.text};">
              Sign in to <strong>${escapedHost}</strong>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${color.buttonBackground}" style="border-radius:6px;">
                    <a href="${url}" target="_blank"
                      style="
                        display:inline-block;
                        padding:12px 24px;
                        font-size:18px;
                        font-family:Helvetica, Arial, sans-serif;
                        color:${color.buttonText};
                        text-decoration:none;
                        font-weight:bold;
                        border-radius:6px;
                        border-width:1px;
                        border-style:solid;
                        border-color:${color.buttonBorder};
                      ">
                      Sign in
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center"
              style="padding:0 24px 24px 24px; font-size:16px; line-height:22px; font-family:Helvetica, Arial, sans-serif; color:${color.text};">
              If you did not request this email, you can safely ignore it.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
