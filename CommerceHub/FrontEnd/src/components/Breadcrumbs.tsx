import { Link, useLocation } from "react-router";

function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="container bg-slate-50">
      <div className="py-5">
        <h1 className="text-2xl font-semibold text-slate-900">
          {pathnames.length
            ? pathnames[pathnames.length - 1]
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())
            : "Home"}
        </h1>

        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="transition hover:text-pink-600">
            Home
          </Link>

          {pathnames.map((segment, index) => {
            const to = "/" + pathnames.slice(0, index + 1).join("/");
            const label = segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

            const isLast = index === pathnames.length - 1;

            return (
              <span key={to} className="flex items-center gap-2">
                <span>.</span>
                {isLast ? (
                  <span className="text-pink-600">{label}</span>
                ) : (
                  <Link to={to} className="transition hover:text-pink-600">
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export default Breadcrumbs;