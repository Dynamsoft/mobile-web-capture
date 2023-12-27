export default class LicenseManager {
    private static setLicenseServer;
    /**
     * License the components.
     * @param license the license key to be used.
     * @remarks - for an online license, LicenseManager asks DLS for the license associated with the 'license' key and gets all usable modules
                - for an offline license, LicenseManager parses it to get a list of usable modules
     * @returns a promise resolving to true or false to indicate whether the license was initialized successfully.
    */
    static initLicense(license: string): {
        isSuccess: boolean;
        error: string;
    };
    /**
     * The following methods should be called before `initLicense`.
     */
    static setDeviceFriendlyName(name: string): void;
    static getDeviceFriendlyName(): string;
    static getDeviceUUID(): string;
    static isSupportDceModule(): boolean;
}
//# sourceMappingURL=licensemanager.d.ts.map