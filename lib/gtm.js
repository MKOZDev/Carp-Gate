// lib/gtm.js

export function pushEvent(event) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null }); // clear previous ecommerce
  window.dataLayer.push(event);
}

function mapItem(product, quantity = 1, index = 0) {
  return {
    item_id: String(product.id),
    item_name: product.name,
    price: parseFloat(product.price || 0),
    quantity,
    index,
    item_brand: "Tandem Baits",
    item_category: product.categories?.[0]?.name || "",
  };
}

// view_item_list — na listach produktów (shop, category)
export function gtmViewItemList(products, listName = "Shop") {
  pushEvent({
    event: "view_item_list",
    ecommerce: {
      item_list_name: listName,
      items: products.map((p, i) => mapItem(p, 1, i)),
    },
  });
}

// select_item — kliknięcie w produkt z listy
export function gtmSelectItem(product, listName = "Shop", index = 0) {
  pushEvent({
    event: "select_item",
    ecommerce: {
      item_list_name: listName,
      items: [mapItem(product, 1, index)],
    },
  });
}

// view_item — strona produktu
export function gtmViewItem(product) {
  pushEvent({
    event: "view_item",
    ecommerce: {
      currency: "EUR",
      value: parseFloat(product.price || 0),
      items: [mapItem(product)],
    },
  });
}

// add_to_cart
export function gtmAddToCart(product, quantity = 1, variation = null) {
  const price = parseFloat(variation?.price || product.price || 0);
  pushEvent({
    event: "add_to_cart",
    ecommerce: {
      currency: "EUR",
      value: price * quantity,
      items: [
        {
          ...mapItem(product, quantity),
          price,
          ...(variation
            ? {
                item_variant: variation.attributes
                  ?.map((a) => a.option)
                  .join(", "),
              }
            : {}),
        },
      ],
    },
  });
}

// remove_from_cart
export function gtmRemoveFromCart(product, quantity = 1, variation = null) {
  const price = parseFloat(variation?.price || product.price || 0);
  pushEvent({
    event: "remove_from_cart",
    ecommerce: {
      currency: "EUR",
      value: price * quantity,
      items: [
        {
          ...mapItem(product, quantity),
          price,
        },
      ],
    },
  });
}

// view_cart
export function gtmViewCart(cart) {
  const items = cart.map((item, i) => ({
    ...mapItem(item.product, item.quantity, i),
    price: parseFloat(item.variation?.price || item.product.price || 0),
  }));
  const value = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  pushEvent({
    event: "view_cart",
    ecommerce: {
      currency: "EUR",
      value,
      items,
    },
  });
}
