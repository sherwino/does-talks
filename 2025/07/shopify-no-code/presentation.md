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

#### Shopify + Liquid

###### Schema-Driven Templating in Action

---

![bg left:60% contain](https://source.unsplash.com/featured/?code,developer)

##### Why No-Code Inspires Dev Patterns

- Schema = Data model for components
- Liquid templates render dynamic content
- Dawn theme showcases component modularity
- JSON-based configuration = editable UI for non-devs

---

![bg right:55% contain](https://source.unsplash.com/featured/?shopify,theme)

**Liquid Template**

```liquid
{%- raw -%}
{% schema %}
{
  "name": "Hero banner",
  "settings": [
    { "id": "heading", "type": "text", "label": "Heading" }
  ]
}
{% endschema %}
{%- endraw -%}
```

- Declares UI controls
- Drives Shopify Theme Editor interface
- Rendered HTML auto-syncs with JSON config

---

![bg contain](https://source.unsplash.com/featured/?json,editor)

##### Schema Powers Customization

- No JS needed to create config-driven UI
- Editor populates inputs from schema
- Code and settings live together
- Encourages clean, modular section design

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

- Schema = dynamic, declarative UI
- Templates = flexible, portable layout
- Reduces bundle size vs SPA
- Devs can abstract for reuse

---

![bg left:50%](https://source.unsplash.com/featured/?developer,thinking)

### Want to Learn More?

- Liquid schema docs: [shopify.dev](https://shopify.dev/docs/themes/architecture/sections/section-schema)
- Hydrogen + React streaming: [shopify.dev/custom-storefronts/hydrogen](https://shopify.dev/docs/custom-storefronts/hydrogen)

💡 Use this structure in any templating system.

---
