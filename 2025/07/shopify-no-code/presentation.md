---
marp: false
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
</style>

<!-- Shopify Dawn Theme Example -->

![bg right:60%](https://source.unsplash.com/featured/?ecommerce,website)

#### Shopify Templates

###### Schema-Driven No-Code Architecture

---

![bg left:60% contain](https://source.unsplash.com/featured/?code,developer)

##### Why No-Code Inspires Dev Patterns

| Traditional Approach          | Schema-Driven Approach           |
| ----------------------------- | -------------------------------- |
| Hardcoded components          | Schema-driven sections           |
| Developer edits = code deploy | Merchant edits = instant preview |
| Rigid layouts                 | Configurable templates           |
| Support tickets for changes   | Self-service customization       |

---

![bg right:55% contain](https://source.unsplash.com/featured/?shopify,theme)

**Shopify Template**

```text
<!-- schema tag defines editable settings -->
// schema
{
  "name": "Hero banner",
  "settings": [
    { "id": "heading", "type": "text", "label": "Heading" },
    { "id": "image", "type": "image_picker", "label": "Background" },
    { "id": "color", "type": "color", "label": "Text Color" },
    { "id": "show_button", "type": "checkbox", "label": "Show CTA" }
  ]
}
// end schema
```

- Declares UI controls
- Drives Shopify Theme Editor interface
- Rendered HTML auto-syncs with JSON config

---

![bg right:45% contain](https://source.unsplash.com/featured/?interface,controls)

##### Schema Types = UI Controls

| Schema Type    | Generated UI Control  |
| -------------- | --------------------- |
| `text`         | Text input field      |
| `image_picker` | Media library browser |
| `color`        | Color picker widget   |
| `checkbox`     | Toggle switch         |
| `select`       | Dropdown menu         |
| `range`        | Slider with min/max   |

💡 **One JSON schema = Dynamic admin interface**

---

![bg contain](https://source.unsplash.com/featured/?json,editor)

##### Schema Powers Customization

- No JS needed to create config-driven UI
- Editor populates inputs from schema
- Code and settings live together
- Encourages clean, modular section design

---

![bg left:40% contain](https://source.unsplash.com/featured/?react,hydrogen)

### Shopify Hydrogen + React

**Schema-driven components in modern frameworks**

```tsx
// Hydrogen component with schema
export const HeroBanner = ({ heading, image, color }) => (
  <section style={{ color }}>
    <img src={image} alt="" />
    <h1>{heading}</h1>
  </section>
);

HeroBanner.schema = {
  name: "Hero Banner",
  settings: [
    { id: "heading", type: "text", label: "Heading" },
    { id: "image", type: "image_picker", label: "Background" },
    { id: "color", type: "color", label: "Text Color" },
  ],
};
```

✅ React components + Schema definitions = Best of both worlds

---

![bg left:45%](https://source.unsplash.com/featured/?preview,template)

**On Your Storefront**

- Preview: [obrevaro.shopify.com](https://obrevaro.shopify.com)
- Source: [github.com/obrevaro/miami-heat](https://github.com/obrevaro/miami-heat)
- Dawn section: [`sections/hero.liquid`](https://github.com/obrevaro/miami-heat/blob/main/sections/hero.liquid)

✅ Modular
✅ Editable
✅ Theming via config

---

![bg right](https://source.unsplash.com/featured/?performance,bundle)

### Dev Takeaways

**Architecture Pattern:**
Schema Definition → Theme Editor UI → Merchant Config → Storefront Render

**Apply This To:**

- CMSs, page builders, design systems
- Any user-configurable components

**Benefits:**

- Reduces support burden (merchants self-serve)
- Maintains performance (server-side rendering)
- Clean separation: structure (dev) vs. content (merchant)

---

![bg left:50%](https://source.unsplash.com/featured/?developer,thinking)

### Want to Learn More?

- Schema docs: [shopify.dev](https://shopify.dev/docs/themes/architecture/sections/section-schema)
- Hydrogen + React streaming: [shopify.dev/custom-storefronts/hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)

💡 Use this structure in any templating system.

---
