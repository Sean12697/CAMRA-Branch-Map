const fs = require("fs");
const fse = require('fs-extra');
const branches = loadJsonSync("data/branches.json");
let options = [];

main();

function main() {
    if (!fs.existsSync("site")) fs.mkdirSync("site");
    if (!fs.existsSync("site/data")) fs.mkdirSync("site/data");
    fse.copySync("static", "site");

    // Probably should write these more Functionally (not modifying global varibles)
    addDefinedGeoJSON();
    parseOnspdData();

    fs.writeFileSync(`site/data.js`, `const data = ${JSON.stringify(options)}`);
}

function addDefinedGeoJSON() {
    branches.forEach(branch => {
        if (branch.geojson_file) {
            let branchId = branch.branch_id;
            fse.copySync(branch.geojson_file, createGeoJsonPath(branchId));
            addBranchOption(branchId);
        }
    });
}

function parseOnspdData() {
    let onspdMapping = loadJsonSync("data/onspd-mapping.json");

    Object.keys(onspdMapping).forEach(branchId => {
        let branchOnspdData = Object.keys(onspdMapping[branchId]);
        if (branchOnspdData.length > 0) {
            let onspdIds = [];

            branchOnspdData.forEach(onspdField => {
                onspdMapping[branchId][onspdField].forEach(onspdId => {
                    onspdIds.push(onspdId);
                })
            });

            let branchData = mergeGeoJsonData(onspdIds);
            fs.writeFileSync(createGeoJsonPath(branchId), JSON.stringify(branchData));
            addBranchOption(branchId);
        }
    });
}

function createGeoJsonPath(name) {
    return `site/${createSiteGeoJsonPath(name)}`;
}

function createSiteGeoJsonPath(name) {
    return `data/${name}.geojson`;
}

function addBranchOption(branchId) {
    options.push({
        id: branchId,
        name: branches.find(branch => branch.branch_id == branchId).branch,
        data: createSiteGeoJsonPath(branchId)
    });
}

function mergeGeoJsonData(onspdIds) {
    let data = {"features": [], "type": "FeatureCollection" };

    onspdIds.forEach(onspdId => {
        let onspdData = loadJsonSync(`geojson/onspd/${onspdId}.geojson`);
        data.features = data.features.concat(onspdData.features);
    });

    return data;
}


function loadJsonSync(file) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}