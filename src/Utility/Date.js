export const formatDate = (dateParam)=>{
    const date = new Date(dateParam);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth()+1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return day +'.' + month +'.' + year + ' ' + hours +':' + minutes;
}
export const isInFuture = (dateParam) =>{
    const dateNow = new Date();
    const param = new Date(dateParam);;
    return param> dateNow
}
