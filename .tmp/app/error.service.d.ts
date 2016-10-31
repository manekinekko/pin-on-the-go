export declare class ErrorService {
    /**
     * [ERR001]: User denied Geolocation
     * [ERR002]: Location Unavailable
     */
    static Type: {
        GEOLOCATION: number;
        PINTEREST: number;
        TRYCATCH: number;
    };
    static ErrorCode: {
        UNKNOWN: number;
    };
    constructor();
    code(type: number, error: {
        code: number;
        message: string;
    }): string;
}
