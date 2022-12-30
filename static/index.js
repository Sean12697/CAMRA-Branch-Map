let map, layerGroup;

window.addEventListener("load", (event) => {
    map = L.map('map').setView([53.479159,-2.242726], 11);
    layerGroup = L.layerGroup().addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{attr}', {attr: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    loadBranchOptions();
    addBranchSelectionListener();
});

function loadBranchOptions() {
    let select = document.getElementById("branches"); 
    data.forEach(branch => {
        let el = document.createElement("option");
        el.text = branch.name;
        el.value = branch.id;
        select.add(el);
    });
}

function addBranchSelectionListener() {
    let select = document.getElementById("branches");
    select.addEventListener("change", () => {
        if (select.value != "na") {
            loadBranch(select.value);
        } else {
            removeAllLayers();
        }
    })
}

function loadBranch(branchId) {
    removeAllLayers();
    let layer = new L.GeoJSON.AJAX(data.find(branchData => branchData.id == branchId).data); 
    layer.addTo(layerGroup);
    // layer.addTo(map);
}

function removeAllLayers() {
    layerGroup.clearLayers();
}