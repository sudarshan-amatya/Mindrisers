export const Button=({btnName,onClick,color})=>{
    return(
        <button className={`${color} rounded-xl px-3 h-10 cursor-pointer min-w-16 mx-1`} onClick={onClick}>{btnName}</button>
    )
}