const fs = require("fs");
const createId = (name) => name.replace(/[^A-Za-z ]/gm, "").replace(/ /gm, "-").replace(/[-]+/gm, "-").toLowerCase();

let branches = JSON.parse(fs.readFileSync("branches.json", "utf-8"));
branches.map(b => { 
    b.branch_id = createId(b.branch);
    b.region_id = createId(b.region);
    return b; 
})

fs.writeFileSync("branches.json", JSON.stringify(branches))