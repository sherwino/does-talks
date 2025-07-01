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

![bg right:60%](./assets/shopifylogo.png)

#### Shopify No Code Solution

###### Schema-Driven Low to No Code

---

##### Why No-Code Inspires Dev Patterns

| Traditional Approach          | Schema-Driven Approach           |
| ----------------------------- | -------------------------------- |
| Hardcoded components          | Schema-driven sections           |
| Developer edits = code deploy | Merchant edits = instant preview |
| Rigid layouts                 | Configurable templates           |
| Support tickets for changes   | Self-service customization       |

---

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

##### Schema Powers Customization

- No JS needed to create config-driven UI
- Editor populates inputs from schema
- Code and settings live together
- Encourages clean, modular section design

---

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

### Want to Learn More?

- Schema docs: [shopify.dev](https://shopify.dev/docs/themes/architecture/sections/section-schema)
- Hydrogen + React streaming: [shopify.dev/custom-storefronts/hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)

💡 Use this structure in any templating system.

---
