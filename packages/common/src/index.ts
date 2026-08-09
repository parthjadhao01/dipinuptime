import { z } from "zod";

export const ProtocolVersionSchema = z.literal(1);
export const WebsiteStatusSchema = z.enum([
  "up",
  "down",
  "degraded",
  "unknown",
]);
export const ProbeStatusSchema = z.enum(["up", "down"]);
export const ValidatorIdSchema = z.string().uuid();
export const CallbackIdSchema = z.string().uuid();

export const MonitorCreateSchema = z.object({
  url: z.string().trim().url().max(2_048),
});

export const WebsiteTickSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  status: WebsiteStatusSchema,
  latency: z.number().finite().nonnegative(),
});

export const WebsiteSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  ticks: z.array(WebsiteTickSchema),
});

export const SignUpIncomingMessageSchema = z.object({
  ip: z.string(),
  publicKey: z.string().min(1),
  signedMessage: z.string().min(1),
  callbackId: CallbackIdSchema,
});

export const ValidateIncomingMessageSchema = z.object({
  callbackId: CallbackIdSchema,
  signedMessage: z.string().min(1),
  status: ProbeStatusSchema,
  latency: z.number().finite().nonnegative(),
  websiteId: z.string().uuid(),
  validatorId: ValidatorIdSchema,
});

export const IncomingMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("signup"), data: SignUpIncomingMessageSchema }),
  z.object({
    type: z.literal("validate"),
    data: ValidateIncomingMessageSchema,
  }),
]);

export const SignUpOutgoingMessageSchema = z.object({
  validatorId: ValidatorIdSchema,
  callbackId: CallbackIdSchema,
});

export const ValidateOutgoingMessageSchema = z.object({
  url: z.string().url(),
  callbackId: CallbackIdSchema,
  websiteId: z.string().uuid(),
});

export const OutgoingMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("signup"), data: SignUpOutgoingMessageSchema }),
  z.object({
    type: z.literal("validate"),
    data: ValidateOutgoingMessageSchema,
  }),
]);

export type WebsiteStatus = z.infer<typeof WebsiteStatusSchema>;
export type ProbeStatus = z.infer<typeof ProbeStatusSchema>;
export type MonitorCreate = z.infer<typeof MonitorCreateSchema>;
export type Website = z.infer<typeof WebsiteSchema>;
export type SignUpIncommingMessage = z.infer<
  typeof SignUpIncomingMessageSchema
>;
export type ValidateIncommingMessage = z.infer<
  typeof ValidateIncomingMessageSchema
>;
export type IncommingMessage = z.infer<typeof IncomingMessageSchema>;
export type SignUpOutgoingMessage = z.infer<typeof SignUpOutgoingMessageSchema>;
export type ValidateOutgoingMessage = z.infer<
  typeof ValidateOutgoingMessageSchema
>;
export type OutgoingMessage = z.infer<typeof OutgoingMessageSchema>;
