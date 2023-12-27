import { DSImageData } from "../interface/DSImageData";
import { EnumBufferOverflowProtectionMode } from "../enum/EnumBufferOverflowProtectionMode";
import { EnumColourChannelUsageType } from "../enum/EnumColourChannelUsageType";
export default abstract class ImageSourceAdapter {
    #private;
    /**
     * @ignore
     */
    get _isFetchingStarted(): boolean;
    abstract hasNextImageToFetch(): boolean;
    addImageToBuffer(image: DSImageData): void;
    getImage(): DSImageData;
    setNextImageToReturn(imageId: number, keepInBuffer?: boolean): void;
    /**
     * @ignore
     */
    _resetNextReturnedImage(): void;
    hasImage(imageId: number): boolean;
    startFetching(): void;
    stopFetching(): void;
    setMaximumImageCount(count: number): void;
    getMaximumImageCount(): number;
    getImageCount(): number;
    clearBuffer(): void;
    isBufferEmpty(): boolean;
    setBufferOverflowProtectionMode(mode: EnumBufferOverflowProtectionMode): void;
    getBufferOverflowProtectionMode(): EnumBufferOverflowProtectionMode;
    setColourChannelUsageType(type: EnumColourChannelUsageType): void;
    getColourChannelUsageType(): EnumColourChannelUsageType;
}
//# sourceMappingURL=ImageSourceAdapter.d.ts.map