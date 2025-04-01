import CryptoJS from 'crypto-js';

export class CryptoUtils
{
    public static async toSHA256(data: string): Promise<string>
    {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    public static toMD5(data: string): string
    {
        return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex);
    }

    /**
     * calculate the SHA256 hash of a file
     * @param file The file to hash
     * @returns {string}
     */
    public static async fileToSHA256(file: File): Promise<string>
    {
        if (!file) return '';
        const fileBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}