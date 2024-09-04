var baseURL = "http://api.login2explore.com:5577";
var connToken = "90932211|-31949213965352874|90963572";
var jpdbirl = "/api/irl";
var jpdbiml = "/api/iml";
var inventoryDBName = "Inventory-DB";
var itemRelationName = "Items";
var outwardRelationName = "Issues";

function setBaseUrl(url) {
    window.baseUrl = url;
    console.log("Base URL set to:", window.baseUrl);
}

setBaseUrl(baseURL);

function disableForm(bvalue) {
    $("#issueNo").prop("disabled", bvalue);
    $("#issueDate").prop("disabled", bvalue);
    $("#itemId").prop("disabled", bvalue);
    $("#quantityIssued").prop("disabled", bvalue);
}

function initItemIssueForm() {
    localStorage.clear();
    console.log("initItemIssueForm() - done");
}

function saveIssueData() {
    var issueNo = $("#issueNo").val();
    var issueDate = $("#issueDate").val();
    var itemId = $("#itemId").val();
    var quantityIssued = $("#quantityIssued").val();

    if (issueNo === "" || issueDate === "" || itemId === "" || quantityIssued === "") {
        alert("All fields are required");
        return;
    }

    var jsonStrObj = {
        issueNo: issueNo,
        issueDate: issueDate,
        itemId: itemId,
        quantityIssued: quantityIssued
    };

    var putRequest = createPUTRequest(connToken, JSON.stringify(jsonStrObj), inventoryDBName, outwardRelationName);
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(putRequest, jpdbiml);
    jQuery.ajaxSetup({ async: true });

    console.log("Data saved successfully:", jsonObj);
    resetForm();
}

function resetForm() {
    disableForm(true);
    $("#issueNo").val("");
    $("#issueDate").val("");
    $("#itemId").val("");
    $("#itemName").text("");
    $("#quantityIssued").val("");
    disableForm(false);
    $("#save").prop("disabled", true);
    $("#edit").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#first").prop("disabled", false);
    $("#prev").prop("disabled", false);
    $("#next").prop("disabled", false);
    $("#last").prop("disabled", false);
}

function checkIssueExistence() {
    var issueNo = $("#issueNo").val();
    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, outwardRelationName, JSON.stringify({ issueNo: issueNo }));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#issueDate").val(data.issueDate);
        $("#itemId").val(data.itemId);
        $("#quantityIssued").val(data.quantityIssued);
        checkItemExistence(); // Check item existence and update item name
    } else {
        $("#issueDate").val("");
        $("#itemId").val("");
        $("#quantityIssued").val("");
        $("#itemName").text("");
        alert("Issue not present. Please enter the details.");
    }
}

function checkItemExistence() {
    var itemId = $("#itemId").val();
    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, itemRelationName, JSON.stringify({ id: itemId }));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        $("#itemName").text(data.name);
    } else {
        $("#itemName").text("Item not present");
        $("#itemId").focus();
    }
}

function validateQuantity() {
    var itemId = $("#itemId").val();
    var quantityIssued = $("#quantityIssued").val();

    if (itemId === "") {
        alert("Item ID must be entered");
        $("#itemId").focus();
        return;
    }

    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, itemRelationName, JSON.stringify({ id: itemId }));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        var data = JSON.parse(jsonObj.data).record;
        var availableStock = data.openingStock; // Assuming 'openingStock' is used for available stock

        if (parseFloat(quantityIssued) > parseFloat(availableStock)) {
            alert("Quantity entered is more than available");
            $("#quantityIssued").val("");
            $("#quantityIssued").focus();
            return;
        }
    } else {
        alert("Item ID is not present");
        $("#itemId").focus();
        return;
    }
}

initItemIssueForm();
