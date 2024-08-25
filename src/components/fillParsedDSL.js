// full-fill the incomplete Dsl input by users

export function fillParsedDsl(parsedDSL) {
    let data_part = parsedDSL.data;
    let draw_part = parsedDSL.draw;
    data_part.forEach((component) => {
        switch (component.type) {
            case "array":
            case "tree":
            case "linkedlist":
            case "stack":
                let structure_len = component["attributes"]["structure"].length;

                //fill value
                component["attributes"]["value"] = component["attributes"]["value"]? component["attributes"]["value"]: [];
                for (let i = 0; i < structure_len; i++) {
                    if (!component["attributes"]["value"][i]) {
                        component["attributes"]["value"][i] = component["attributes"]["structure"][i].slice(); 
                    }
                    else {
                        let cur_value_len = component["attributes"]["value"][i].length;
                        let cur_structure_len =  component["attributes"]["structure"][i].length;
                        component["attributes"]["value"][i] = component["attributes"]["value"][i].concat(component["attributes"]["structure"][i].slice(cur_value_len - cur_structure_len));
                    }
                }

                //fill id
                component["attributes"]["id"] = component["attributes"]["id"]? component["attributes"]["id"]: [];
                for (let i = 0; i < structure_len; i++) {
                    if (!component["attributes"]["id"][i]) {
                        component["attributes"]["id"][i] = component["attributes"]["structure"][i].slice(); 
                    }
                    else {
                        let cur_id_len = component["attributes"]["id"][i].length;
                        let cur_structure_len =  component["attributes"]["structure"][i].length;
                        component["attributes"]["id"][i] = component["attributes"]["id"][i].concat(component["attributes"]["structure"][i].slice(cur_id_len - cur_structure_len));
                    }
                }

                // fill color
                component["attributes"]["color"] = component["attributes"]["color"]? component["attributes"]["color"]: [];
                for (let i = 0; i < structure_len; i++) {
                    if (!component["attributes"]["color"][i]) {
                        component["attributes"]["color"][i] =Array(component["attributes"]["structure"][i].length).fill("null"); 
                    }
                    else {
                        let cur_color_len = component["attributes"]["color"][i].length;
                        let cur_structure_len =  component["attributes"]["structure"][i].length;
                        component["attributes"]["color"][i] = component["attributes"]["color"][i].concat(Array(cur_structure_len-cur_color_len).fill("null"));
                    }
                }

                // fill arrow
                component["attributes"]["arrow"] = component["attributes"]["arrow"]? component["attributes"]["arrow"]: [];
                for (let i = 0; i < structure_len; i++) {
                    if (!component["attributes"]["arrow"][i]) {
                        component["attributes"]["arrow"][i] =Array(component["attributes"]["structure"][i].length).fill("null"); 
                    }
                    else {
                        let cur_arrow_len = component["attributes"]["arrow"][i].length;
                        let cur_structure_len =  component["attributes"]["structure"][i].length;
                        component["attributes"]["arrow"][i] = component["attributes"]["arrow"][i].concat(Array(cur_structure_len-cur_arrow_len).fill("null"));
                    }
                }

                // fill hidden 
                component["attributes"]["hidden"] = component["attributes"]["hidden"]? component["attributes"]["hidden"]: [];
                for (let i = 0; i < structure_len; i++) {
                    if (!component["attributes"]["hidden"][i]) {
                        component["attributes"]["hidden"][i] =Array(component["attributes"]["structure"][i].length).fill("false"); 
                    }
                    else {
                        let cur_hidden_len = component["attributes"]["hidden"][i].length;
                        let cur_structure_len =  component["attributes"]["structure"][i].length;
                        component["attributes"]["hidden"][i] = component["attributes"]["hidden"][i].concat(Array(cur_structure_len-cur_hidden_len).fill("false"));
                    }
                }

                break;
            case "graph":
                let id_len = component["attributes"]["id"].length;

                // fill structure
                component["attributes"]["structure"] = component["attributes"]["structure"]? component["attributes"]["strucure"]: [];
                for (let i = 0; i < id_len; i++) {
                    if (!component["attributes"]["structure"][i]) {
                        component["attributes"]["structure"][i] = component["attributes"]["id"][i].slice(); 
                    }
                    else {
                        let cur_id_len = component["attributes"]["id"][i].length;
                        let cur_structure_len =  component["attributes"]["structure"][i].length;
                        component["attributes"]["id"][i] = component["attributes"]["strcture"][i].concat(component["attributes"]["id"][i].slice(cur_structure_len - cur_id_len));
                    }
                }

                // fill value
                component["attributes"]["value"] = component["attributes"]["value"]? component["attributes"]["value"]: [];
                for (let i = 0; i < id_len; i++) {
                    if (!component["attributes"]["value"][i]) {
                        component["attributes"]["value"][i] = component["attributes"]["id"][i].slice(); 
                    }
                    else {
                        let cur_value_len = component["attributes"]["value"][i].length;
                        let cur_id_len =  component["attributes"]["id"][i].length;
                        component["attributes"]["value"][i] = component["attributes"]["id"][i].concat(component["attributes"]["id"][i].slice(cur_value_len - cur_id_len));
                    }
                }

                // fill color
                component["attributes"]["color"] = component["attributes"]["color"]? component["attributes"]["color"]: [];
                for (let i = 0; i < id_len; i++) {
                    if (!component["attributes"]["color"][i]) {
                        component["attributes"]["color"][i] =Array(component["attributes"]["id"][i].length).fill("null"); 
                    }
                    else {
                        let cur_color_len = component["attributes"]["color"][i].length;
                        let cur_id_len =  component["attributes"]["id"][i].length;
                        component["attributes"]["color"][i] = component["attributes"]["color"][i].concat(Array(cur_id_len-cur_color_len).fill("null"));
                    }
                }

                // fill arrow
                component["attributes"]["arrow"] = component["attributes"]["arrow"]? component["attributes"]["arrow"]: [];
                for (let i = 0; i < id_len; i++) {
                    if (!component["attributes"]["arrow"][i]) {
                        component["attributes"]["arrow"][i] =Array(component["attributes"]["id"][i].length).fill("null"); 
                    }
                    else {
                        let cur_arrow_len = component["attributes"]["arrow"][i].length;
                        let cur_id_len =  component["attributes"]["id"][i].length;
                        component["attributes"]["arrow"][i] = component["attributes"]["arrow"][i].concat(Array(cur_id_len-cur_arrow_len).fill("null"));
                    }
                }

                // fill hidden
                component["attributes"]["hidden"] = component["attributes"]["hidden"]? component["attributes"]["hidden"]: [];
                for (let i = 0; i < id_len; i++) {
                    if (!component["attributes"]["hidden"][i]) {
                        component["attributes"]["hidden"][i] =Array(component["attributes"]["id"][i].length).fill("null"); 
                    }
                    else {
                        let cur_hidden_len = component["attributes"]["hidden"][i].length;
                        let cur_id_len =  component["attributes"]["id"][i].length;
                        component["attributes"]["hidden"][i] = component["attributes"]["hidden"][i].concat(Array(cur_id_len-cur_hidden_len).fill("null"));
                    }
                }
                
                break;
            case "matrix":
                // fill id
                component["attributes"]["id"] = component["attributes"]["structure"].slice();

                // fill value
                component["attributes"]["value"] = component["attributes"]["structure"].slice();

                // fill color
                component["attributes"]["color"] = component["attributes"]["color"]? component["attributes"]["color"] : [];
                for (let i = 0; i < component["attributes"]["structure"].length; i++) {
                    let cur_structure = component["attributes"]["structure"][i];
                    if (!component["attributes"]["color"][i]) {component["attributes"]["color"][i] = [];}
                    let cur_color = component["attributes"]["color"][i];
                    for (let row = 0; row < cur_structure.length; row++) {
                        if (!cur_color[row]) { cur_color[row] = []; }
                        for (let col=0; col < cur_structure[row].length; col++) {
                            if (!cur_color[row][col]) {cur_color[row][col] = "null";}
                        }
                    }
                }

                // fill arrow
                component["attributes"]["arrow"] = component["attributes"]["arrow"]? component["attributes"]["arrow"] : [];
                for (let i = 0; i < component["attributes"]["structure"].length; i++) {
                    let cur_structure = component["attributes"]["structure"][i];
                    if (!component["attributes"]["arrow"][i]) {component["attributes"]["arrow"][i] = [];}
                    let cur_arrow = component["attributes"]["arrow"][i];
                    for (let row = 0; row < cur_structure.length; row++) {
                        if (!cur_arrow[row]) { cur_arrow[row] = []; }
                        for (let col=0; col < cur_structure[row].length; col++) {
                            if (!cur_arrow[row][col]) {cur_arrow[row][col] = "null";}
                        }
                    }
                }

                // fill hidden
                component["attributes"]["hidden"] = component["attributes"]["hidden"]? component["attributes"]["hidden"] : [];
                for (let i = 0; i < component["attributes"]["structure"].length; i++) {
                    let cur_structure = component["attributes"]["structure"][i];
                    if (!component["attributes"]["hidden"][i]) {component["attributes"]["hidden"][i] = [];}
                    let cur_hidden = component["attributes"]["hidden"][i];
                    for (let row = 0; row < cur_structure.length; row++) {
                        if (!cur_hidden[row]) { cur_hidden[row] = []; }
                        for (let col=0; col < cur_structure[row].length; col++) {
                            if (!cur_hidden[row][col]) {cur_hidden[row][col] = "null";}
                        }
                    }
                }
                break;
            default:
                console.log("fillParsedDSL, no matching component type!");
                break;
        }       
    })
    const result =  {
        data: data_part,
        draw: draw_part
    };
    return result;
}