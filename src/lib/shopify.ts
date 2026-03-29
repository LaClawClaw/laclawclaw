const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export async function storefrontQuery<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2026-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const json: ShopifyResponse<T> = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }
  return json.data;
}

// Fetch all products
export async function getProducts() {
  return storefrontQuery<{
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          description: string;
          priceRange: {
            minVariantPrice: { amount: string; currencyCode: string };
          };
          images: { edges: Array<{ node: { url: string; altText: string } }> };
          variants: {
            edges: Array<{ node: { id: string; availableForSale: boolean } }>;
          };
        };
      }>;
    };
  }>(`
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  `);
}

// Create a cart
export async function createCart(
  variantId: string,
  quantity: number = 1
) {
  return storefrontQuery<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: {
          edges: Array<{
            node: {
              quantity: number;
              merchandise: { id: string; title: string };
            };
          }>;
        };
        cost: {
          totalAmount: { amount: string; currencyCode: string };
        };
      };
    };
  }>(`
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `, {
    input: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });
}
