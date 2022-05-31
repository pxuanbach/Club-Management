import {
    pink, purple, blue, amber, deepOrange, 
    teal, green, yellow, orange, brown, 
    blueGrey, indigo, red, cyan
} from '@mui/material/colors';

let colorArr = [
    pink[700], purple[700], amber[700], deepOrange[700], 
    blue[700], teal[700], green[700], yellow[700], 
    orange[700], brown[700], blueGrey[700], indigo[700],
    red[700], cyan[700]
]

export default function applyColor(datas) {
    //console.log(typeof datas)
    datas.forEach((item) => {
        var color = colorArr[Math.floor(Math.random() * colorArr.length)]
        item.color = color;
        colorArr = colorArr.filter(value => value !== color)
        //console.log(color, colorArr)
    });

    return datas;
}