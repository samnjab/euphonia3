export default function highestFreq(arrayOfObj){
    let max = arrayOfObj[0]
    arrayOfObj.forEach(item => {
        if (item.freq > max.freq) max = item
    })
    return max
}