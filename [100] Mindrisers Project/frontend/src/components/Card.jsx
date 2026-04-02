export default function Card({ title, desc, price, image, imgDesc, stock }) {
  return (
    <div className="shrink-0 group w-60 rounded-xl p-2 bg-white cursor-pointer flex flex-col items-center">
      <div className="h-40 w-full rounded-xl">
        <img
          src={image}
          alt={imgDesc}
          className="h-full w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>

      <h2 className="mt-2 text-sm font-medium">{title}</h2>
      <p className="font-medium">
        From $<span>{price}</span>
      </p>
    </div>
  );
}
