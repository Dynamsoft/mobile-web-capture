export default function ImageContainer(props) {
    return (
        <div
            style={props.showCaptureViewer ? { display: 'none' } : {}}  
            className="image-container"
        >
            <div 
                onClick={() => {props.setShowCaptureViewer(true)}} 
                className="restore-button"
            >Restore</div>
            <span>Original Image:</span>
            <img alt="" src={props.images.originalImage} />
            <span>Normalized Image:</span>
            <img alt="" src={props.images.detectedImage} />
        </div>
    )
}