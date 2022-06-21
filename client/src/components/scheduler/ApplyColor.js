import {
    pink, purple, blue, amber, deepOrange, 
    teal, green, yellow, orange, brown, 
    blueGrey, indigo, red, cyan
} from '@mui/material/colors';

const colorArr = [
    pink[700], purple[700], amber[700], deepOrange[700], 
    blue[700], teal[700], green[700], yellow[700], 
    orange[700], brown[700], blueGrey[700], indigo[700],
    red[700], cyan[700]
]

export default function applyColor(datas) {
    let colorArrClone = JSON.parse(JSON.stringify(colorArr))
    datas.forEach((item) => {
        var color = colorArrClone[Math.floor(Math.random() * colorArrClone.length)]
        item.color = color;
        colorArrClone = colorArrClone.filter(value => value !== color)
    });
    //console.log(colorArr)
    return datas;
}