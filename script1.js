var baseURL = "http://api.login2explore.com:5577";
var connToken = "90932211|-31949213965352874|90963572";
var jpdbirl = "/api/irl";
var jpdbiml = "/api/iml";
var inventoryDBName = "Inventory-DB";
var itemRelationName = "Items";

setBaseUrl(baseURL);

function setBaseUrl(url) {
    // Assuming you are setting a global variable for the base URL
    window.baseUrl = url;
    console.log("Base URL set to:", window.baseUrl);
}

function disableForm(bvalue) {
    $("#itemId").prop("disabled", bvalue);
    $("#itemName").prop("disabled", bvalue);
    $("#openingStock").prop("disabled", bvalue);
    $("#uom").prop("disabled", bvalue);
}

function initItemForm() {
    localStorage.clear();
    console.log("initItemForm() - done");
}

function saveItemData() {
    var itemId = $("#itemId").val();
    var itemName = $("#itemName").val();
    var openingStock = $("#openingStock").val();
    var uom = $("#uom").val();

    if (itemId === "" || itemName === "" || openingStock === "" || uom === "") {
        alert("All fields are required");
        return;
    }

    var jsonStrObj = {
        id: itemId,
        name: itemName,
        openingStock: openingStock,
        uom: uom
    };

    var putRequest = createPUTRequest(connToken, JSON.stringify(jsonStrObj), inventoryDBName, itemRelationName);
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(putRequest, jpdbiml);
    jQuery.ajaxSetup({ async: true });

    console.log("Data saved successfully:", jsonObj);
    resetForm();
}

function editItem() {
    var itemId = $("#itemId").val();
    
    if (itemId === "") {
        alert("Item ID is required to edit an item.");
        return;
    }

    // Create a GET_BY_KEY request to fetch the item data by itemId
    var jsonObjStr = JSON.stringify({ id: itemId });
    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, itemRelationName, jsonObjStr, true, true);

    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 400) {
        alert("Item not found.");
        return;
    }

    // Populate the form fields with the existing data
    var data = JSON.parse(jsonObj.data).record;
    $("#itemId").val(data.id);
    $("#itemName").val(data.name);
    $("#openingStock").val(data.openingStock);
    $("#uom").val(data.uom);

    // Enable the form fields for editing
    disableForm(false);
    
    // Disable the "new" button and enable the "save" button
    $("#new").prop("disabled", true);
    $("#save").prop("disabled", false);
}


function resetForm() {
    // Clear form fields
    $("#itemId").val("");
    $("#itemName").val("");
    $("#openingStock").val("");
    $("#uom").val("");

    // Re-enable the form fields for new input
    disableForm(false);

    // Manage button states
    $("#new").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#edit").prop("disabled", true);
}


function checkItemExistence() {
    var itemId = $("#itemId").val();

    if (itemId === "") {
        return;
    }

    var jsonStr = {
        id: itemId
    };

    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, itemRelationName, JSON.stringify(jsonStr));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        alert("Item ID already exists. Please enter a new ID or edit the existing item.");
        disableForm(true);
        $("#edit").prop("disabled", false);
    } else {
        disableForm(false);
        $("#save").prop("disabled", false);
    }
}

initItemForm();
