var baseURL = "http://api.login2explore.com:5577";
var connToken = "90932211|-31949213965352874|90963572";
var jpdbirl = "/api/irl";
var jpdbiml = "/api/iml";
var inventoryDBName = "Inventory-DB";
var inwardRelationName = "Inward";
var itemRelationName = "Items";

function setBaseUrl(url) {
    // Assuming you are setting a global variable for the base URL
    window.baseUrl = url;
    console.log("Base URL set to:", window.baseUrl);
}

setBaseUrl(baseURL);

function disableForm(bvalue) {
    $("#receiptNo").prop("disabled", bvalue);
    $("#receiptDate").prop("disabled", bvalue);
    $("#itemId").prop("disabled", bvalue);
    $("#quantity").prop("disabled", bvalue);
}

function resetForm() {
    disableForm(false);
    $("#receiptNo").val("");
    $("#receiptDate").val("");
    $("#itemId").val("");
    $("#quantity").val("");
    $("#itemName").text(""); // Clear item name display
    $("#save").prop("disabled", false);
}

function checkReceiptExistence() {
    var receiptNo = $("#receiptNo").val();
    if (receiptNo === "") {
        alert("Receipt No is required");
        $("#receiptNo").focus();
        return;
    }

    var receiptNoObj = { id: receiptNo };
    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, inwardRelationName, JSON.stringify(receiptNoObj));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#receiptDate").val(data.receiptDate);
        $("#itemId").val(data.itemId);
        $("#quantity").val(data.quantity);
        checkItemExistence(); // Automatically check and display item name
    } else {
        alert("Receipt No not found, please enter the details.");
        $("#receiptDate").focus();
    }
}

function checkItemExistence() {
    var itemId = $("#itemId").val();
    if (itemId === "") {
        alert("Item ID is required");
        $("#itemId").focus();
        return;
    }

    var itemIdObj = { id: itemId };
    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, itemRelationName, JSON.stringify(itemIdObj));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#itemName").text(data.name); // Display item name
    } else {
        alert("Item not present");
        $("#itemId").focus();
    }
}

function saveInwardData() {
    var receiptNo = $("#receiptNo").val();
    var receiptDate = $("#receiptDate").val();
    var itemId = $("#itemId").val();
    var quantity = $("#quantity").val();

    if (receiptNo === "" || receiptDate === "" || itemId === "" || quantity === "") {
        alert("All fields are required");
        return;
    }

    var jsonStrObj = {
        id: receiptNo,
        receiptDate: receiptDate,
        itemId: itemId,
        quantity: quantity
    };

    var putRequest = createPUTRequest(connToken, JSON.stringify(jsonStrObj), inventoryDBName, inwardRelationName);
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(putRequest, jpdbiml);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        alert("Data saved successfully");
        resetForm();
    } else {
        alert("Error saving data");
    }
}

$(document).ready(function() {
    resetForm();
});
