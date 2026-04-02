export default function Card({title,desc,price,image,imgDesc,stock}){
    return(
        <div className="p-4 w-70 h-116  bg-[#d6d6d6] rounded-xl flex flex-col justify-between">
            <div className="mb-4 bg-white rounded-3xl">
                <img src={image} alt={imgDesc} />
            </div>
            <h2 className="font-semibold ">{title}</h2>
            <p  className="text-xs mb-4">{desc}</p>
            <div className="flex justify-between">
            <p>$<span className="text-3xl">{price}</span></p>
            <p className="flex justify-center items-end">{stock}</p>
            </div>
        </div>
    )
}