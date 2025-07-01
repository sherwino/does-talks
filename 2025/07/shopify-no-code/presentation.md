---
marp: true
theme: uncover
---

<style>
  :root {
    --color-background: #fff;
    --color-background-code: #fff;
    --color-background-paginate: rgba(128, 128, 128, 0.05);
    --color-foreground: #444;
    --color-highlight: #99c;
    --color-highlight-hover: #aaf;
    --color-highlight-heading: #99c;
    --color-header: #bbb;
    --color-header-shadow: transparent;
  }
  
  section {
    font-size: 28px;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-size: 1.2em;
  }
  
  code {
    font-size: 0.75em;
  }
  
  pre {
    font-size: 0.65em;
  }
  
  table {
    font-size: 0.8em;
  }
  
  ul, ol {
    font-size: 0.9em;
  }
</style>

<!-- Slide 1: Title -->

![bg right:50%](./assets/shopifylogo.png)

# Shopify Schema-Driven Architecture

### Liquid, CMS, Caching & Hydrogen Deep Dive

---

<!-- Slide 2: Liquid Templating Engine -->

## Liquid Templating Engine

**Server-Side Rendering Process:**

```liquid
<!-- sections/hero.liquid -->
<section class="hero" style="background: {{ section.settings.bg_color }}">
  <img src="{{ section.settings.image | img_url: '1920x' }}"
       alt="{{ section.settings.image.alt }}">
  <h1 style="color: {{ section.settings.text_color }}">
    {{ section.settings.heading }}
  </h1>
</section>

{% schema %}
{
  "name": "Hero Section",
  "settings": [
    {"id": "heading", "type": "text", "label": "Heading"},
    {"id": "image", "type": "image_picker", "label": "Image"},
    {"id": "bg_color", "type": "color", "default": "#ffffff"},
    {"id": "text_color", "type": "color", "default": "#000000"}
  ]
}
{% endschema %}
```

**Key Points:** Schema → Theme Editor UI → Settings Object → Liquid Variables

---

<!-- Slide 3: CMS Integration & Data Flow -->

## CMS Integration & Data Flow

**Theme Editor → Settings Storage:**

```json
// Stored in shop's theme settings
{
  "sections": {
    "hero-banner": {
      "type": "hero",
      "settings": {
        "heading": "Welcome to Our Store",
        "bg_color": "#f8f9fa",
        "text_color": "#333333",
        "image": "products/hero-image.jpg"
      }
    }
  }
}
```

**Liquid Access Pattern:**

```liquid
{{ section.settings.heading }}        // "Welcome to Our Store"
{{ section.settings.bg_color }}       // "#f8f9fa"
{{ section.settings.image.url }}      // Full image URL
```

**Flow:** CMS Edit → JSON Store → Server Render → HTML Output

---

<!-- Slide 4: Dynamic Styles & Configuration -->

## User Configs Drive Styles & Logic

**CSS Custom Properties Pattern:**

```liquid
<style>
  .hero-{{ section.id }} {
    --bg-color: {{ section.settings.bg_color }};
    --text-color: {{ section.settings.text_color }};
    --font-size: {{ section.settings.font_size }}px;
    background: var(--bg-color);
    color: var(--text-color);
  }

  {% if section.settings.enable_parallax %}
  .hero-{{ section.id }} {
    background-attachment: fixed;
  }
  {% endif %}
</style>

<section class="hero-{{ section.id }}">
  {% for block in section.blocks %}
    {% case block.type %}
      {% when 'heading' %}
        <h1>{{ block.settings.text }}</h1>
      {% when 'button' %}
        <a href="{{ block.settings.url }}">{{ block.settings.label }}</a>
    {% endcase %}
  {% endfor %}
</section>
```

---

<!-- Slide 5: JSON Diff & Change Detection -->

## Incremental Updates & JSON Diffs

**Theme Editor Change Detection:**

```javascript
// Only changed settings sent to server
const changeset = {
  "sections.hero-banner.settings.heading": "New Heading Text",
  "sections.hero-banner.settings.bg_color": "#ff6b35",
};

// PATCH request with minimal payload
fetch("/admin/themes/123/settings.json", {
  method: "PATCH",
  body: JSON.stringify({ settings: changeset }),
});
```

**Server Processing:**

```ruby
# Rails backend merges changes
current_settings.deep_merge!(changeset)
ThemeRenderer.invalidate_cache(section_id)
```

**Benefits:** Minimal bandwidth, faster saves, granular cache invalidation

---

<!-- Slide 6: Caching Strategy -->

## Multi-Layer Caching

**1. Theme Asset Caching:**

```liquid
{{ 'theme.css' | asset_url }}
// → https://cdn.shopify.com/s/files/1/theme.css?v=12345678
```

**2. Section-Level Caching:**

```ruby
# Server-side fragment caching
cache_key = "section:#{section.id}:#{settings_hash}:#{product_ids_hash}"
Rails.cache.fetch(cache_key, expires_in: 1.hour) do
  render_section(section, settings, products)
end
```

**3. CDN Edge Caching:**

- Static assets: Long-term cache (1 year)
- Dynamic content: Short cache (5-15 min) with ESI
- Geographic distribution via Shopify's CDN

**4. Cache Invalidation:**

```ruby
# When settings change
invalidate_pattern("section:#{section_id}:*")
```

---

<!-- Slide 7: Hydrogen Architecture -->

## Hydrogen (React) Equivalent

**Schema-Driven React Components:**

```tsx
// app/components/Hero.tsx
export function Hero({ heading, bgColor, textColor, image }: HeroProps) {
  return (
    <section
      className="hero"
      style={
        {
          "--bg-color": bgColor,
          "--text-color": textColor,
        } as CSSProperties
      }
    >
      <img src={image} alt="" />
      <h1>{heading}</h1>
    </section>
  );
}

// Schema definition for Hydrogen admin
Hero.schema = {
  name: "Hero Section",
  settings: [
    { id: "heading", type: "text", label: "Heading" },
    { id: "bgColor", type: "color", label: "Background" },
    { id: "textColor", type: "color", label: "Text Color" },
    { id: "image", type: "image_picker", label: "Image" },
  ],
};
```

---

<!-- Slide 8: Hydrogen Data Flow & SSR -->

## Hydrogen: Data Flow & SSR

**Server-Side Rendering with Streaming:**

```tsx
// app/routes/$.tsx - Catch-all route
export async function loader({ params, context }: LoaderArgs) {
  const { page } = await context.storefront.query(PAGE_QUERY, {
    variables: { handle: params["*"] },
  });

  return defer({
    page: await page,
    sections: page.sections, // Settings from Shopify admin
  });
}

export default function Page() {
  const { page, sections } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Await resolve={sections}>
        {(resolvedSections) =>
          resolvedSections.map((section) => (
            <DynamicSection key={section.id} {...section} />
          ))
        }
      </Await>
    </Suspense>
  );
}
```

---

<!-- Slide 9: Hydrogen Caching & Performance -->

## Hydrogen Caching & Performance

**1. Oxygen Edge Caching:**

```tsx
// app/entry.server.tsx
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  // Hydrogen auto-manages cache headers
  return new Response(markup, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      Vary: "Accept-Encoding",
    },
  });
}
```

**2. GraphQL Caching:**

```tsx
// Automatic query caching with cache policies
const { page } = await storefront.query(PAGE_QUERY, {
  cache: storefront.CacheShort(), // 1 minute
  variables: { handle },
});
```

**3. Sub-request Caching:**

```tsx
// Component-level caching
export function ProductGrid({ collection }: { collection: string }) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <Await
        resolve={storefront.query(PRODUCTS_QUERY, {
          cache: storefront.CacheLong(), // 1 hour
          variables: { collection },
        })}
      >
        {(products) => <ProductList products={products} />}
      </Await>
    </Suspense>
  );
}
```

---

<!-- Slide 10: Key Takeaways -->

## Architecture Patterns & Takeaways

**Schema-Driven Design Benefits:**

- ✅ **Separation of Concerns:** Dev defines structure, merchants control content
- ✅ **Performance:** Server-side rendering + multi-layer caching
- ✅ **DX/UX:** One schema definition drives both code and admin UI
- ✅ **Incremental Updates:** JSON diffs minimize data transfer

**Implementation Patterns:**
| Aspect | Liquid/Theme | Hydrogen/React |
|--------|-------------|----------------|
| **Rendering** | Server-side only | SSR + Client hydration |
| **Caching** | Fragment + CDN | Edge + GraphQL layers |
| **Updates** | Full page reload | Streaming + suspense |
| **Schema** | JSON in comments | JS objects |

**Apply To:** CMSs, page builders, design systems, any user-configurable UI

**Resources:**

- Liquid: [shopify.dev/docs/themes](https://shopify.dev/docs/themes)
- Hydrogen: [shopify.dev/docs/custom-storefronts/hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)
