export function getSortParams(sortBy) {
  switch (sortBy) {
    case "name_asc":
      return { orderby: "title", order: "asc" };
    case "name_desc":
      return { orderby: "title", order: "desc" };
    case "price_asc":
      return { orderby: "price", order: "asc" };
    case "price_desc":
      return { orderby: "price", order: "desc" };
    default:
      return {};
  }
}

export function resolveNlCategoryId(id, categories, locale) {
  if (!id) return undefined;
  const cat = categories.find((c) => String(c.id) === String(id));
  if (!cat) return id;
  return locale === "en" ? cat._nlId || cat.id : cat.id;
}
