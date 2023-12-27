//Mobile PerspectiveViewer
export const mobilePerspectiveUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-perspective-viewer-header-mobile",
            children: [
                {
                    // Add a "Back" button in perspective viewer's header and bind the event.
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.Button,
                    className: "ddv-button-back",
                    events:{
                        click: "backToCaptureViewer"
                    }
                },
                Dynamsoft.DDV.Elements.Pagination,
                {
                    // Bind event for "PerspectiveAll" button
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.PerspectiveAll,
                    events:{
                        click: "done"
                    }
                },
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-perspective-viewer-footer-mobile",
            children: [
                Dynamsoft.DDV.Elements.FullQuad,
                Dynamsoft.DDV.Elements.RotateLeft,
                Dynamsoft.DDV.Elements.RotateRight,
                {   
                    // Bind event for "DeleteCurrent" button
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.DeleteCurrent,
                    events: {
                        click: "noImageBack"
                    },
                },
                {   
                    // Bind event for "DeleteAll" button
                    // The event will be registered later.
                    type:Dynamsoft.DDV.Elements.DeleteAll,
                    events: {
                        click: "noImageBack"
                    },
                }
            ],
        },
    ],
};

//Pc PerspectiveViewer
export const pcPerspectiveUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-perspective-viewer-header-desktop",
            children: [
                {   
                    // Add a "Back" button in perspective viewer's header and bind the event.
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.Button,
                    className: "ddv-button-back",
                    style: {
                        position: "absolute",
                        left: "0px",
                    },
                    events:{
                        click: "backToCaptureViewer"
                    }
                },
                Dynamsoft.DDV.Elements.FullQuad,
                Dynamsoft.DDV.Elements.RotateLeft,
                Dynamsoft.DDV.Elements.RotateRight,
                {
                    // Bind event for "DeleteCurrent" button
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.DeleteCurrent,
                    events: {
                        click: "noImageBack"
                    },
                },
                {
                    // Bind event for "DeleteAll" button
                    // The event will be registered later.
                    type:Dynamsoft.DDV.Elements.DeleteAll,
                    events: {
                        click: "noImageBack"
                    },
                },
                {
                    type: Dynamsoft.DDV.Elements.Pagination,
                    className: "ddv-perspective-viewer-pagination-desktop",
                },
                {   
                    // Bind event for "PerspectiveAll" button
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.PerspectiveAll,
                    className: "ddv-perspective-viewer-perspective-desktop",
                    events:{
                        click: "done"
                    }
                },
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
    ],
};