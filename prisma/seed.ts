import "dotenv/config";
import { PrismaClient, Prisma, OrderType, OrderStatus, Locale } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed script for Mc Mallek — pizzeria de Draâ Ben Khedda (Tizi Ouzou).
 * Idempotent : vide les tables (par dépendance) puis reconstitue un jeu
 * de données représentatif (catégories, produits, variantes, options,
 * zones de livraison et un bon de commande type).
 */
async function main() {
  // ── Nettoyage (enfant → parent) ─────────────────────────────────────
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.optionValue.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.optionGroup.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.deliveryZone.deleteMany({});

  // ── Catégories ───────────────────────────────────────────────────────
  const categories = await Promise.all(
    [
      { name_fr: "Pizzas", name_ar: "بيتزا", slug: "pizzas", display_order: 0 },
      { name_fr: "Burgers", name_ar: "برجر", slug: "burgers", display_order: 1 },
      { name_fr: "Sandwichs", name_ar: "ساندويتش", slug: "sandwichs", display_order: 2 },
      { name_fr: "Paninis", name_ar: "بانيني", slug: "paninis", display_order: 3 },
      { name_fr: "Accompagnements", name_ar: "مُرافقات", slug: "accompagnements", display_order: 4 },
      { name_fr: "Boissons", name_ar: "مشروبات", slug: "boissons", display_order: 5 },
    ].map((c) =>
      prisma.category.create({ data: { ...c, is_active: true } }),
    ),
  );
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  // ── Produits ─────────────────────────────────────────────────────────
  const products = await Promise.all(
    [
      {
        category_id: cat["pizzas"]!,
        name_fr: "Margherita",
        name_ar: "مارغريتا",
        description_fr: "Sauce tomate, mozzarella, basilic frais.",
        description_ar: "صلصة طماطم، موتزاريلا، أوراق نعناع طازجة.",
        base_price: "1200.00",
        image_url: "https://placehold.co/400x400/ffc107/111827?text=Margherita",
      },
      {
        category_id: cat["pizzas"]!,
        name_fr: "Pepperoni",
        name_ar: "بابريوني",
        description_fr: "Sauce tomate, mozzarella, pepperoni épicé.",
        description_ar: "صلصة طماطم، موتزاريلا، بابريوني متوابل.",
        base_price: "1450.00",
        image_url: "https://placehold.co/400x400/ef4444/ffffff?text=Pepperoni",
      },
      {
        category_id: cat["pizzas"]!,
        name_fr: "4 Fromages",
        name_ar: "أربعة أجبان",
        description_fr: "Époisses, roquefort, gorgonzola, mozzarella.",
        description_ar: "إيبواز، روكفورت، غورغونزولا، موتزاريلا.",
        base_price: "1550.00",
        image_url: "https://placehold.co/400x400/8b5cf6/ffffff?text=4+Fromages",
      },
      {
        category_id: cat["pizzas"]!,
        name_fr: "Végétarienne",
        name_ar: "نباتية بالخضار",
        description_fr: "Sauce tomate, légumes grillés, mozzarella.",
        description_ar: "صلصة طماطم، خضار مشوية، موتزاريلا.",
        base_price: "1350.00",
        image_url: "https://placehold.co/400x400/22c55e/ffffff?text=Vegetarienne",
      },
      {
        category_id: cat["burgers"]!,
        name_fr: "Mc Mallek",
        name_ar: "ماك مالك",
        description_fr: "Double steak haché, fromage, laitue, sauce spéciale.",
        description_ar: "لحم مفروم مشوي مزدوج، جبن، خس، صلصة خاصة.",
        base_price: "1600.00",
        image_url: "https://placehold.co/400x400/f59e0b/111827?text=Mc+Mallek",
      },
      {
        category_id: cat["burgers"]!,
        name_fr: "Cheeseburger",
        name_ar: "تشيز برجر",
        description_fr: "Steak haché, fromage, cornichon, ketchup.",
        description_ar: "لحم مفروم، جبن، مخلل، كاتشاب.",
        base_price: "1400.00",
        image_url: "https://placehold.co/400x400/a16207/ffffff?text=Cheeseburger",
      },
      {
        category_id: cat["sandwichs"]!,
        name_fr: "Chicken Tikka",
        name_ar: "تيكا دجاج",
        description_fr: "Poulet tikka, salade, sauce yaourt au cumin.",
        description_ar: "دجاج تيكا، سلطة، صلصة الزبادي بالكمون.",
        base_price: "1350.00",
        image_url: "https://placehold.co/400x400/f97316/ffffff?text=Chicken+Tikka",
      },
      {
        category_id: cat["paninis"]!,
        name_fr: "Jambon Fromage",
        name_ar: "لحم و أجبان",
        description_fr: "Jambon blanc, mozzarella, field salad, herbes.",
        description_ar: "لحم مشوي، موتزاريلا، سلطة، أعشاب.",
        base_price: "1300.00",
        image_url: "https://placehold.co/400x400/dc2626/ffffff?text=Jambon+Fromage",
      },
      {
        category_id: cat["paninis"]!,
        name_fr: "Végétarien",
        name_ar: "نباتي بالبقولياد",
        description_fr: "Poivrons, courgette, feta, sauce tomate.",
        description_ar: "فلفل ألوان، كوسا، فتا، صلصة طماطم.",
        base_price: "1250.00",
        image_url: "https://placehold.co/400x400/16a34a/ffffff?text=Vegetarien",
      },
      {
        category_id: cat["accompagnements"]!,
        name_fr: "Frites",
        name_ar: "بطاطا مقلية",
        description_fr: "Frites croustillantes, sel de mer.",
        description_ar: "بطاطس مقرمش، ملح البحر.",
        base_price: "450.00",
        image_url: "https://placehold.co/400x400/e2d694/111827?text=Frites",
      },
      {
        category_id: cat["accompagnements"]!,
        name_fr: "Onion Rings",
        name_ar: "خواقع بصل",
        description_fr: "Anneaux de oignon, panure dorée.",
        description_ar: "حلقات بصلية، نخت مقرمش.",
        base_price: "550.00",
        image_url: "https://placehold.co/400x400/f59e0b/111827?text=Onion+Rings",
      },
      {
        category_id: cat["boissons"]!,
        name_fr: "Hamoud Boualem",
        name_ar: "حمود بوعليم",
        description_fr: "Boisson locale algérienne au malt et à la citronnelle.",
        description_ar: "مشروب محلي جزائري بالشوفان والكمون.",
        base_price: "350.00",
        image_url: "https://placehold.co/400x400/10b981/ffffff?text=Hamoud+Boualem",
      },
      {
        category_id: cat["boissons"]!,
        name_fr: "Coca Cola",
        name_ar: "كوكا كولا",
        description_fr: "Classique, 33cl.",
        description_ar: "كلاسيكي، 33 سانتيليتر.",
        base_price: "300.00",
        image_url: "https://placehold.co/400x400/1d4ed8/ffffff?text=Coca+Cola",
      },
      {
        category_id: cat["boissons"]!,
        name_fr: "Eau Minérale",
        name_ar: "ماء معدني",
        description_fr: "Bouteille de 50cl.",
        description_ar: "زجاجة بسعة 50 سانتيليتر.",
        base_price: "200.00",
        image_url: "https://placehold.co/400x400/0e7490/ffffff?text=Eau+Minérale",
      },
    ].map((p) =>
      prisma.product.create({
        data: { ...p, is_available: true },
      }),
    ),
  );
  const prod = Object.fromEntries(products.map((p) => [p.name_fr, p]));

  // ── Variantes de taille ──────────────────────────────────────────────
  const margherita = prod["Margherita"]!;
  const burger = prod["Mc Mallek"]!;
  const hamoud = prod["Hamoud Boualem"]!;

  await prisma.productVariant.createMany({
    data: [
      { product_id: margherita.id, name_fr: "Petite", name_ar: "صغيرة", price_override: "1100.00" },
      { product_id: margherita.id, name_fr: "Grande", name_ar: "كبير", price_override: "1400.00" },
      { product_id: margherita.id, name_fr: "Familiale", name_ar: "عائلي", price_override: "1700.00" },
      { product_id: hamoud.id, name_fr: "33cl", name_ar: "33 سانتيليتر", price_override: "350.00" },
      { product_id: hamoud.id, name_fr: "1.5L", name_ar: "1.5 لتر", price_override: "600.00" },
    ],
  });

  // ── Groupes d'options (avec leurs valeurs) ───────────────────────────
  await prisma.optionGroup.create({
    data: {
      product_id: margherita.id,
      name_fr: "Crust",
      name_ar: "القشر",
      is_required: true,
      max_selections: 1,
      optionValues: {
        create: [
          { name_fr: "Fine", name_ar: "رفيع", price_supplement: "0.00" },
          { name_fr: "Épaisse", name_ar: "سميك", price_supplement: "100.00" },
        ],
      },
    },
  });

  await prisma.optionGroup.create({
    data: {
      product_id: margherita.id,
      name_fr: "Suppléments",
      name_ar: "الإضافات",
      is_required: false,
      max_selections: 999,
      optionValues: {
        create: [
          { name_fr: "Fromage", name_ar: "جبن", price_supplement: "150.00" },
          { name_fr: "Pepperoni", name_ar: "بابريوني", price_supplement: "200.00" },
          { name_fr: "Champignons", name_ar: "فطر", price_supplement: "100.00" },
          { name_fr: "Olives", name_ar: "زيتون", price_supplement: "80.00" },
        ],
      },
    },
  });

  await prisma.optionGroup.create({
    data: {
      product_id: burger.id,
      name_fr: "Cuisson",
      name_ar: "الطهي",
      is_required: true,
      max_selections: 1,
      optionValues: {
        create: [
          { name_fr: "Bien cuit", name_ar: "مطبوخ جيدا", price_supplement: "0.00" },
          { name_fr: "À point", name_ar: "على النار", price_supplement: "0.00" },
          { name_fr: "Bien saignant", name_ar: "مسلوق", price_supplement: "0.00" },
        ],
      },
    },
  });

  await prisma.optionGroup.create({
    data: {
      product_id: burger.id,
      name_fr: "Suppléments",
      name_ar: "الإضافات",
      is_required: false,
      max_selections: 999,
      optionValues: {
        create: [
          { name_fr: "Fromage supplémentaire", name_ar: "جبن إضافي", price_supplement: "100.00" },
          { name_fr: "Bacon", name_ar: "لحم مقدد", price_supplement: "150.00" },
          { name_fr: "Oignon caramélisé", name_ar: "بصل كراميلي", price_supplement: "80.00" },
        ],
      },
    },
  });

  // ── Zones de livraison (Draâ Ben Khedda + environs) ──────────────────
  const zones = await Promise.all(
    [
      { name_fr: "Draâ Ben Khedda", name_ar: "دعاء بن الخضة", fee_dzd: "150.00" },
      { name_fr: "Tizi Ouzou", name_ar: "تيزي وزو", fee_dzd: "250.00" },
      { name_fr: "Aït Lounid", name_ar: "عين لونيد", fee_dzd: "300.00" },
    ].map((z) =>
      prisma.deliveryZone.create({ data: { ...z, is_active: true } }),
    ),
  );
  const zone = Object.fromEntries(zones.map((z) => [z.name_fr, z]));

  // ── Commande type (démo : OrderItem avec snapshot produit) ──────────
  const item1Unit = 1400.0; // Margherita « Grande »
  const item2Unit = 1600.0; // Mc Mallek (base)
  const deliveryFee = Number(zone["Draâ Ben Khedda"]!.fee_dzd);
  const item1Total = item1Unit * 2;
  const item2Total = item2Unit * 1;
  const orderTotal = item1Total + item2Total + deliveryFee;

  const order = await prisma.order.create({
    data: {
      order_number: "ORD-2024-0001",
      customer_name: "Younès Mallek",
      customer_phone: "+213 7 71 12 34 56",
      type: OrderType.DELIVERY,
      zone_id: zone["Draâ Ben Khedda"]!.id,
      address_details: "12 Rue du 5 Juillet, Draâ Ben Khedda",
      status: OrderStatus.CONFIRMED,
      total_amount: orderTotal.toFixed(2),
      locale: Locale.fr,
      orderItems: {
        create: [
          {
            product_snapshot: {
              product_id: margherita.id,
              product_name_fr: margherita.name_fr,
              product_name_ar: margherita.name_ar,
              product_image_url: margherita.image_url,
              variant_name_fr: "Grande",
              variant_name_ar: "كبير",
              unit_price: "1400.00",
              selected_options: [
                {
                  group_fr: "Crust",
                  group_ar: "القشر",
                  value_fr: "Fine",
                  value_ar: "رفيع",
                  price_supplement: "0.00",
                },
                {
                  group_fr: "Suppléments",
                  group_ar: "الإضافات",
                  value_fr: "Pepperoni",
                  value_ar: "بابريوني",
                  price_supplement: "200.00",
                },
              ],
            } as Prisma.InputJsonValue,
            quantity: 2,
            unit_price: "1400.00",
            total_price: item1Total.toFixed(2),
          },
          {
            product_snapshot: {
              product_id: burger.id,
              product_name_fr: burger.name_fr,
              product_name_ar: burger.name_ar,
              product_image_url: burger.image_url,
              variant_name_fr: null,
              variant_name_ar: null,
              unit_price: "1600.00",
              selected_options: [],
            } as Prisma.InputJsonValue,
            quantity: 1,
            unit_price: "1600.00",
            total_price: item2Total.toFixed(2),
          },
        ],
      },
    },
  });

  console.log(`🍕 Seed Mc Mallek terminé — commande #${order.order_number}`);
}

main()
  .catch((e) => {
    console.error("❌ Échec du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
