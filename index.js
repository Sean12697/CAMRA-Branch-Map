const fs = require("fs");
const fse = require('fs-extra');
const branches = loadJsonSync("data/branches.json");
const onspdMapping = loadJsonSync("data/onspd-mapping.json");
let options = [];

main();

function main() {
    if (!fs.existsSync("site")) fs.mkdirSync("site");
    if (!fs.existsSync("site/data")) fs.mkdirSync("site/data");
    fse.copySync("static", "site");

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
            fs.writeFileSync(`site/data/${branchId}.geojson`, JSON.stringify(branchData));
            addBranchOption(branchId);
        }
    });

    fs.writeFileSync(`site/data.js`, `const data = ${JSON.stringify(options)}`);
}

function addBranchOption(branchId) {
    options.push({
        id: branchId,
        name: branches.find(branch => branch.branch_id == branchId).branch,
        data: `data/${branchId}.geojson`
    });
}

function mergeGeoJsonData(onspdIds) {
    let data = {"features": [], "type": "FeatureCollection" };

    onspdIds.forEach(onspdId => {
        let onspdData = loadJsonSync(`geojson/${onspdId}.geojson`);
        data.features = data.features.concat(onspdData.features);
    });

    return data;
}


function loadJsonSync(file) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}