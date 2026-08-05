export type SignUpIncommingMessage = {
    ip : string,
    publicKey : string,
    signedMessage : string,
    callbackId : string
}
export type ValidateIncommingMessage = {
    callbackId : string,
    signedMessage : string
    status : "Good" | "Bad",
    latency : number,
    websiteId : string,
    validatorId : string
}

export type IncommingMessage = {
    type : "signup",
    data : SignUpIncommingMessage
} | {
    type : "validate",
    data : ValidateIncommingMessage
}

export type SignUpOutgoingMessage = {
    validatorId : string
    callbackId : string,

}
export type ValidateOutgoingMessage = {
    url : string,
    callbackId : string,
    websiteId : string
}

export type OutgoingMessage = {
    type : "signup",
    data : SignUpOutgoingMessage
} | {
    type : "validate",
    data : ValidateOutgoingMessage
}