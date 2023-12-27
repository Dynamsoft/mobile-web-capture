// Define new UiConfig for mobile capture viewer
export const mobileCaptureViewerUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-capture-viewer-header-mobile",
            children: [
                {
                    type: Dynamsoft.DDV.Elements.CameraResolution,
                    className: "ddv-capture-viewer-resolution",
                },
                Dynamsoft.DDV.Elements.Flashlight,
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-capture-viewer-footer-mobile",
            children: [
                Dynamsoft.DDV.Elements.AutoDetect,
                Dynamsoft.DDV.Elements.AutoCapture,
                {
                    type: Dynamsoft.DDV.Elements.Capture,
                    className: "ddv-capture-viewer-captureButton",
                },
                {   
                    // Bind click event to "ImagePreview" element
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.ImagePreview,
                    events:{ 
                        click: "showEditViewer",
                    }
                },
                Dynamsoft.DDV.Elements.CameraConvert,
            ],
        },
    ],
};

// Define new UiConfig for mobile edit viewer
export const mobileEditViewerUiConfig = {
    type:  Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    className: "ddv-edit-viewer-mobile",
    children: [
        {
            type:  Dynamsoft.DDV.Elements.Layout,
            className: "ddv-edit-viewer-header-mobile",
            children: [
                {   
                    // Add a "Back" button to header and bind click event to go back the capture viewer
                    // The event will be registered later
                    type: Dynamsoft.DDV.Elements.Button,
                    className: "ddv-button-back",
                    events:{
                        click: "backToCaptureViewer"
                    }
                },
                Dynamsoft.DDV.Elements.Pagination,
                Dynamsoft.DDV.Elements.Download,
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
        {
            type:  Dynamsoft.DDV.Elements.Layout,
            className: "ddv-edit-viewer-footer-mobile",
            children: [
                Dynamsoft.DDV.Elements.DisplayMode,
                Dynamsoft.DDV.Elements.RotateLeft,
                Dynamsoft.DDV.Elements.Crop,
                Dynamsoft.DDV.Elements.Filter,
                Dynamsoft.DDV.Elements.Undo,
                Dynamsoft.DDV.Elements.Delete,
                Dynamsoft.DDV.Elements.Load,
            ],
        },
    ],
};

// Define new UiConfig for pc capture viewer
export const pcCaptureViewerUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    className: "ddv-capture-viewer-desktop",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-capture-viewer-header-desktop",
            children: [
                {
                    type: Dynamsoft.DDV.Elements.CameraResolution,
                    className: "ddv-capture-viewer-resolution-desktop",
                },
                Dynamsoft.DDV.Elements.AutoDetect,
                {
                    type: Dynamsoft.DDV.Elements.Capture,
                    className: "ddv-capture-viewer-capture-desktop",
                },
                Dynamsoft.DDV.Elements.AutoCapture,
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
        {
            // Bind click event to "ImagePreview" element
            // The event will be registered later.
            type: Dynamsoft.DDV.Elements.ImagePreview,
            className: "ddv-capture-viewer-image-preview-desktop",
            events:{ 
                click: "showEditViewer",
            }
        },
    ],
};

// Define new UiConfig for pc edit viewer
export const pcEditViewerUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    className: "ddv-edit-viewer-desktop",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-edit-viewer-header-desktop",
            children: [
                {
                    type: Dynamsoft.DDV.Elements.Layout,
                    children: [
                        {
                            // Add a "Back" button to header and bind click event to go back the capture viewer
                            // The event will be registered later
                            type: Dynamsoft.DDV.Elements.Button,
                            className: "ddv-button-back",
                            events:{
                                click: "backToCaptureViewer"
                            }
                        },
                        Dynamsoft.DDV.Elements.ThumbnailSwitch,
                        Dynamsoft.DDV.Elements.Zoom,
                        Dynamsoft.DDV.Elements.FitMode,
                        Dynamsoft.DDV.Elements.DisplayMode,
                        Dynamsoft.DDV.Elements.RotateLeft,
                        Dynamsoft.DDV.Elements.RotateRight,
                        Dynamsoft.DDV.Elements.Crop,
                        Dynamsoft.DDV.Elements.Filter,
                        Dynamsoft.DDV.Elements.Undo,
                        Dynamsoft.DDV.Elements.Redo,
                        Dynamsoft.DDV.Elements.DeleteCurrent,
                        Dynamsoft.DDV.Elements.DeleteAll,
                        Dynamsoft.DDV.Elements.Pan,
                    ],
                },
                {
                    type: Dynamsoft.DDV.Elements.Layout,
                    children: [
                        {
                            type: Dynamsoft.DDV.Elements.Pagination,
                            className: "ddv-edit-viewer-pagination-desktop",
                        },
                        Dynamsoft.DDV.Elements.Load,
                        Dynamsoft.DDV.Elements.Download,
                        Dynamsoft.DDV.Elements.Print,
                    ],
                },
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
    ],
};