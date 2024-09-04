var baseURL = "http://api.login2explore.com:5577";
var connToken = "90932211|-31949213965352874|90963572";
var jpdbirl = "/api/irl";
var inventoryDBName = "Inventory-DB";
var itemRelationName = "Items";
var inwardRelationName = "Inward";
var outwardRelationName = "Issues";

setBaseUrl(baseURL);

function setBaseUrl(url) {
    window.baseUrl = url;
    console.log("Base URL set to:", window.baseUrl);
}

function generateReport() {
    var startItemId = $("#startItemId").val();
    var endItemId = $("#endItemId").val();

    if (!startItemId || !endItemId) {
        alert("Please enter both start and end Item IDs.");
        return;
    }

    var items = getItems(startItemId, endItemId);
    displayReport(items);
}
function generateReport() {
    var startItemId = $("#startItemId").val();
    var endItemId = $("#endItemId").val();

    if (!startItemId || !endItemId) {
        alert("Please enter both start and end Item IDs.");
        return;
    }

    var items = getItems(startItemId, endItemId);
    displayReport(items);
}


function getItems(startItemId, endItemId) {
    var items = [];
    var itemId = parseInt(startItemId);
    var endId = parseInt(endItemId);

    while (itemId <= endId) {
        var itemData = fetchItem(itemId.toString());

        var itemName = "Not Found";
        var openingStock = 0;

        if (itemData) {
            itemName = itemData.name;
            openingStock = parseFloat(itemData.openingStock);
        }

        var inwardQty = getTotalQuantity(itemId, inwardRelationName, "quantity");
        var outwardQty = getTotalQuantity(itemId, outwardRelationName, "quantityIssued");

        var currentStock = openingStock + inwardQty - outwardQty;
        items.push({ id: itemId, name: itemName, stock: currentStock });

        itemId++;
    }

    return items;
}

function fetchItem(itemId) {
    var getRequest = createGET_BY_KEYRequest(connToken, inventoryDBName, itemRelationName, JSON.stringify({ id: itemId }));
    jQuery.ajaxSetup({ async: false });
    var jsonObj = executeCommand(getRequest, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    if (jsonObj.status === 200) {
        return JSON.parse(jsonObj.data).record;
    }
    return null;
}

function getTotalQuantity(itemId, relationName, qtyField) {
    var request = createGET_BY_KEYRequest(connToken, inventoryDBName, relationName, JSON.stringify({ itemId: itemId }));
    jQuery.ajaxSetup({ async: false });
    var data = executeCommand(request, jpdbirl);
    jQuery.ajaxSetup({ async: true });

    var totalQty = 0;
    if (data.status === 200) {
        var records = JSON.parse(data.data).records || [];
        records.forEach(record => {
            if (record[qtyField] !== undefined) {
                totalQty += parseFloat(record[qtyField]);
            }
        });
    }
    return totalQty;
}

function displayReport(items) {
    var tableBody = $("#itemReportTable tbody");
    tableBody.empty();

    items.forEach(item => {
        var row = `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.stock}</td>
        </tr>`;
        tableBody.append(row);
    });
}
