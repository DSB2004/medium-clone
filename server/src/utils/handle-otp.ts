import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret();
const secretBase32 = secret.base32;

export const GENERATE_OTP: () => string = () => {
    const OTP = speakeasy.totp({
        secret: secretBase32,
        encoding: 'base32',
        step: 120,
    });
    return OTP;
}

export const VERIFY_OTP: (OTP: string) => boolean = (OTP: string) => {
    const verified = speakeasy.totp.verify({
        secret: secretBase32,
        encoding: 'base32',
        token: OTP,
        window: 5,
        step: 120
    });
    return verified;
}