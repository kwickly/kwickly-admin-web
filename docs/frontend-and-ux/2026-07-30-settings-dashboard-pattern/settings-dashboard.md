# Settings UI: Integrated Modular Dashboard Pattern

## Overview
Historically, settings pages often utilized "Consumer-style" wide banners with floating avatars or a simple split-view layout. For a professional SaaS/POS admin platform like Kwickly, these patterns are either too playful or take up unnecessary vertical space without offering high data density.

Instead, we enforce the **Integrated Modular Dashboard Pattern** for Settings and Profile pages.

## Core Principles

1. **No "Over-Designed" Banners:** Do not use large background gradients or overlapping avatar images at the top of a settings page. Keep it flat, clean, and entirely within standard cards.
2. **Integrated Header Summaries:** If a page requires a read-only summary (e.g. an Avatar, Name, and Job Role), integrate it directly into the top of the *first primary editable Card* (e.g., "Personal Information"), separated by a subtle `border-b border-border/50` rather than stacking it in a standalone card above.
3. **Avoid Repetitive Data:** If the Avatar header displays the user's name and title, do not repeat that information as large static text if it's already represented in the editable inputs immediately below it. The header should only hold uneditable contextual identifiers (Avatar, Role Badge) while the inputs handle the text.
4. **Fluid Width (No Centered Column):** Do not restrict settings forms to `max-w-7xl mx-auto`. Allow the CSS Grid layout (`grid-cols-1 lg:grid-cols-3`) to flow fluidly across the available content area width.
5. **Masonry Alignment:** Maintain clean horizontal alignments across columns by using `h-full flex flex-col` on all cards and pushing the CardFooter to the bottom using `mt-auto`. This ensures the "Save" buttons line up perfectly in the Z-pattern across all columns.

## Example Structure
```tsx
<div className="space-y-6 pb-12">
  <PageHeader title="Settings" />

  {/* Modular Grid Layout (Fluid Width) */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    {/* Left Main Panel */}
    <div className="lg:col-span-2">
      <Card className="h-full flex flex-col">
        <CardHeader>...</CardHeader>
        <CardContent className="flex-1 space-y-8">
          
          {/* Integrated Summary (No redundant text) */}
          <div className="flex justify-between items-start pb-6 border-b border-border/50">
             <Avatar />
             <RoleBadge />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
             <Input name="Full Name" />
          </div>

        </CardContent>
        <CardFooter className="mt-auto flex justify-end">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>

    {/* Right Sidebar Panel */}
    <div className="lg:col-span-1">
      <Card className="h-full flex flex-col">
        {/* ... */}
      </Card>
    </div>

  </div>
</div>
```
