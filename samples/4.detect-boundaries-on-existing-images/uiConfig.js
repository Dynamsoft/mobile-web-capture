// Create a "LoadImage" button bind click event to load image
// The event will be registered later.
const AddNewButton = {
    type: Dynamsoft.DDV.Elements.Button,
    className: "ddv-load-image2",
    style: {
        background: "#fe8e14"
    },
    events: {
        click: "addNew"
    }
};

export const mobilePerspectiveUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-perspective-viewer-header-mobile",
            children: [
                Dynamsoft.DDV.Elements.Blank,
                Dynamsoft.DDV.Elements.Pagination,
                {
                    // Bind event for "PerspectiveAll" button to download pdf
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.PerspectiveAll,
                    events: {
                        click: "downloadPDF"
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
                // Replace the default "RotateRight" button with an "AddNew" button in perspective viewer's footer and bind event to the new button.
                // The event will be registered later.
                AddNewButton,
                Dynamsoft.DDV.Elements.DeleteCurrent,
                Dynamsoft.DDV.Elements.DeleteAll,
            ],
        },
    ],
};

// PC Perspective Viewer
export const pcPerspectiveUiConfig = {
    type: Dynamsoft.DDV.Elements.Layout,
    flexDirection: "column",
    children: [
        {
            type: Dynamsoft.DDV.Elements.Layout,
            className: "ddv-perspective-viewer-header-desktop",
            children: [
                Dynamsoft.DDV.Elements.FullQuad,
                Dynamsoft.DDV.Elements.RotateLeft,
                // Replace the default "RotateRight" button with an "AddNew" button in perspective viewer's header and bind event to the new button.
                // The event will be registered later.
                AddNewButton,
                Dynamsoft.DDV.Elements.DeleteCurrent,
                Dynamsoft.DDV.Elements.DeleteAll,
                {
                    type: Dynamsoft.DDV.Elements.Pagination,
                    className: "ddv-perspective-viewer-pagination-desktop",
                },
                {
                    // Bind event for "PerspectiveAll" button to download pdf
                    // The event will be registered later.
                    type: Dynamsoft.DDV.Elements.PerspectiveAll,
                    className: "ddv-perspective-viewer-perspective-desktop",
                    events: {
                        click: "downloadPDF"
                    }
                },
            ],
        },
        Dynamsoft.DDV.Elements.MainView,
    ],
};