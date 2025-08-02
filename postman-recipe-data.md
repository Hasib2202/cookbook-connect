# Cookbook Connect - Sample Recipe Data for Postman

Use these JSON payloads to create sample recipes in your Cookbook Connect application via Postman.

**Endpoint:** `POST https://cookbook-connect-six.vercel.app/api/recipes`
**Headers:**

- `Content-Type: application/json`
- `Authorization: Bearer <your-jwt-token>` (if authentication required)

---

## Recipe 1: Classic Spaghetti Carbonara

```json
{
  "title": "Classic Spaghetti Carbonara",
  "description": "A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper. Simple ingredients, extraordinary flavor!",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/carbonara.jpg",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 4,
  "difficulty": "Medium",
  "category": "Italian",
  "ingredients": "400g spaghetti\n200g pancetta or guanciale, diced\n4 large eggs\n100g Pecorino Romano cheese, grated\n100g Parmigiano-Reggiano cheese, grated\nFreshly ground black pepper\nSalt for pasta water",
  "instructions": "1. Bring a large pot of salted water to boil and cook spaghetti until al dente.\n2. While pasta cooks, fry pancetta in a large pan until crispy.\n3. In a bowl, whisk eggs with grated cheeses and black pepper.\n4. Drain pasta, reserving 1 cup pasta water.\n5. Add hot pasta to pancetta pan, remove from heat.\n6. Quickly stir in egg mixture, adding pasta water gradually to create creamy sauce.\n7. Serve immediately with extra cheese and black pepper."
}
```

---

## Recipe 2: Chicken Tikka Masala

```json
{
  "title": "Chicken Tikka Masala",
  "description": "Tender marinated chicken in a rich, creamy tomato-based sauce with aromatic spices. A beloved Indian-British fusion dish.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/tikka-masala.jpg",
  "prepTime": 30,
  "cookTime": 45,
  "servings": 6,
  "difficulty": "Medium",
  "category": "Indian",
  "ingredients": "1kg chicken breast, cubed\n1 cup plain yogurt\n2 tbsp lemon juice\n2 tsp garam masala\n1 tsp cumin\n1 tsp paprika\n4 cloves garlic, minced\n1 inch ginger, grated\n2 tbsp vegetable oil\n1 large onion, diced\n400g canned tomatoes\n1 cup heavy cream\nFresh cilantro\nSalt and pepper",
  "instructions": "1. Marinate chicken in yogurt, lemon juice, half the spices, garlic, and ginger for 2+ hours.\n2. Thread chicken onto skewers and grill until cooked through.\n3. In a large pan, sauté onions until golden.\n4. Add remaining spices, cook 1 minute.\n5. Add tomatoes, simmer 10 minutes.\n6. Stir in cream and grilled chicken.\n7. Simmer 10 minutes until sauce thickens.\n8. Garnish with cilantro and serve with rice or naan."
}
```

---

## Recipe 3: Japanese Ramen Bowl

```json
{
  "title": "Homemade Japanese Ramen Bowl",
  "description": "Rich, flavorful ramen with tender pork, soft-boiled eggs, and fresh vegetables in a savory broth.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/ramen.jpg",
  "prepTime": 45,
  "cookTime": 180,
  "servings": 4,
  "difficulty": "Hard",
  "category": "Japanese",
  "ingredients": "400g fresh ramen noodles\n1kg pork bones\n500g pork belly\n4 soft-boiled eggs\n2 green onions, sliced\n1 sheet nori seaweed\n100g bamboo shoots\n2 cloves garlic\n1 piece ginger\n2 tbsp miso paste\n1 tbsp soy sauce\nSesame oil\nSalt to taste",
  "instructions": "1. Simmer pork bones for 3-4 hours to make rich broth.\n2. Cook pork belly separately until tender, then slice.\n3. Prepare soft-boiled eggs (6-7 minutes), marinate in soy sauce.\n4. Cook ramen noodles according to package instructions.\n5. Heat bowls and add miso paste.\n6. Ladle hot broth into bowls, stir to dissolve miso.\n7. Add noodles, arrange pork, eggs, and vegetables on top.\n8. Garnish with green onions, nori, and sesame oil."
}
```

---

## Recipe 4: Classic Beef Tacos

```json
{
  "title": "Classic Beef Tacos",
  "description": "Seasoned ground beef in crispy taco shells with fresh toppings. Perfect for family dinner or party appetizers.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/beef-tacos.jpg",
  "prepTime": 10,
  "cookTime": 15,
  "servings": 4,
  "difficulty": "Easy",
  "category": "Mexican",
  "ingredients": "500g ground beef\n1 onion, diced\n2 cloves garlic, minced\n1 tbsp chili powder\n1 tsp cumin\n1 tsp paprika\n1/2 tsp oregano\nSalt and pepper\n8 taco shells\n1 cup lettuce, shredded\n2 tomatoes, diced\n1 cup cheddar cheese, shredded\n1/2 cup sour cream\nHot sauce (optional)",
  "instructions": "1. Cook ground beef in a large skillet over medium heat.\n2. Add onion and garlic, cook until softened.\n3. Add spices, cook 1 minute until fragrant.\n4. Season with salt and pepper.\n5. Warm taco shells according to package directions.\n6. Fill shells with beef mixture.\n7. Top with lettuce, tomatoes, cheese, and sour cream.\n8. Serve with hot sauce on the side."
}
```

---

## Recipe 5: French Coq au Vin

```json
{
  "title": "Coq au Vin (Chicken in Wine)",
  "description": "Traditional French braised chicken dish with red wine, mushrooms, and pearl onions. Elegant comfort food at its finest.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/coq-au-vin.jpg",
  "prepTime": 30,
  "cookTime": 90,
  "servings": 6,
  "difficulty": "Medium",
  "category": "French",
  "ingredients": "1 whole chicken, cut into pieces\n4 strips bacon, chopped\n200g pearl onions\n250g mushrooms, quartered\n3 cloves garlic, minced\n2 tbsp flour\n750ml red wine\n250ml chicken stock\n2 bay leaves\n2 sprigs fresh thyme\n2 tbsp butter\nSalt and pepper\nFresh parsley",
  "instructions": "1. Cook bacon in a large Dutch oven until crispy, remove.\n2. Season chicken with salt and pepper, brown in bacon fat.\n3. Remove chicken, sauté onions and mushrooms until golden.\n4. Add garlic, cook 1 minute.\n5. Sprinkle flour over vegetables, stir to combine.\n6. Add wine, stock, herbs, and bacon.\n7. Return chicken to pot, bring to simmer.\n8. Cover and braise 1 hour until tender.\n9. Finish with butter and fresh parsley."
}
```

---

## Recipe 6: Thai Green Curry

```json
{
  "title": "Thai Green Curry with Chicken",
  "description": "Aromatic and spicy Thai curry with tender chicken, vegetables, and fragrant herbs in coconut milk.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/green-curry.jpg",
  "prepTime": 20,
  "cookTime": 25,
  "servings": 4,
  "difficulty": "Medium",
  "category": "Thai",
  "ingredients": "500g chicken thigh, sliced\n400ml coconut milk\n3 tbsp green curry paste\n1 Thai eggplant, cubed\n100g green beans\n1 red bell pepper, sliced\n2 kaffir lime leaves\n1 tbsp fish sauce\n1 tbsp palm sugar\n1 Thai basil bunch\n2 Thai chilies\nJasmine rice for serving",
  "instructions": "1. Heat 1/3 of coconut milk in a wok until oil separates.\n2. Add green curry paste, fry until fragrant.\n3. Add chicken, cook until no longer pink.\n4. Add remaining coconut milk, bring to simmer.\n5. Add vegetables, lime leaves, fish sauce, and sugar.\n6. Simmer 10-15 minutes until vegetables are tender.\n7. Stir in Thai basil and chilies.\n8. Serve immediately over jasmine rice."
}
```

---

## Recipe 7: Mediterranean Grilled Salmon

```json
{
  "title": "Mediterranean Grilled Salmon",
  "description": "Fresh salmon fillet with Mediterranean herbs, lemon, and olive oil. Healthy and delicious weeknight dinner.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/grilled-salmon.jpg",
  "prepTime": 15,
  "cookTime": 12,
  "servings": 4,
  "difficulty": "Easy",
  "category": "Mediterranean",
  "ingredients": "4 salmon fillets (150g each)\n1/4 cup olive oil\n2 lemons, juiced and zested\n3 cloves garlic, minced\n2 tsp dried oregano\n1 tsp dried thyme\n1/2 cup cherry tomatoes, halved\n1/4 cup kalamata olives\n1/4 cup red onion, thinly sliced\nFresh dill\nSalt and pepper",
  "instructions": "1. Marinate salmon in olive oil, lemon juice, garlic, and herbs for 30 minutes.\n2. Preheat grill to medium-high heat.\n3. Season salmon with salt and pepper.\n4. Grill salmon 4-5 minutes per side until cooked through.\n5. Meanwhile, toss tomatoes, olives, and onion with lemon zest.\n6. Serve salmon topped with tomato mixture.\n7. Garnish with fresh dill and lemon wedges.\n8. Serve with grilled vegetables or rice."
}
```

---

## Recipe 8: Classic Caesar Salad

```json
{
  "title": "Classic Caesar Salad",
  "description": "Crisp romaine lettuce with creamy Caesar dressing, parmesan cheese, and crunchy croutons. Timeless favorite!",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/caesar-salad.jpg",
  "prepTime": 20,
  "cookTime": 10,
  "servings": 4,
  "difficulty": "Easy",
  "category": "American",
  "ingredients": "2 large romaine lettuce heads\n1/2 cup mayonnaise\n2 tbsp lemon juice\n2 tsp Dijon mustard\n2 cloves garlic, minced\n4 anchovy fillets, minced\n1/2 cup Parmesan cheese, grated\n2 cups bread cubes\n3 tbsp olive oil\nSalt and pepper\nExtra Parmesan for serving",
  "instructions": "1. Toss bread cubes with olive oil, salt, and pepper.\n2. Bake at 200°C for 8-10 minutes until golden and crispy.\n3. Wash and chop romaine lettuce into bite-sized pieces.\n4. Whisk together mayonnaise, lemon juice, mustard, garlic, and anchovies.\n5. Gradually whisk in Parmesan cheese.\n6. Toss lettuce with dressing until well coated.\n7. Top with croutons and extra Parmesan.\n8. Serve immediately while croutons are crispy."
}
```

---

## Recipe 9: Korean Bulgogi

```json
{
  "title": "Korean Bulgogi (Marinated Beef)",
  "description": "Sweet and savory marinated beef, grilled to perfection. Serve with rice and kimchi for authentic Korean experience.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/bulgogi.jpg",
  "prepTime": 240,
  "cookTime": 10,
  "servings": 4,
  "difficulty": "Easy",
  "category": "Korean",
  "ingredients": "600g ribeye steak, thinly sliced\n1/2 cup soy sauce\n2 tbsp brown sugar\n1 tbsp sesame oil\n1 Asian pear, grated\n4 cloves garlic, minced\n1 inch ginger, grated\n2 green onions, chopped\n1 tbsp toasted sesame seeds\n1 onion, sliced\nSteamed rice for serving\nKimchi for serving",
  "instructions": "1. Freeze beef for 1 hour, then slice paper-thin against the grain.\n2. Mix soy sauce, brown sugar, sesame oil, pear, garlic, and ginger.\n3. Marinate beef in mixture for 4+ hours or overnight.\n4. Heat grill or large skillet over high heat.\n5. Cook beef in batches, 1-2 minutes per side.\n6. Add sliced onions in final batch.\n7. Garnish with green onions and sesame seeds.\n8. Serve with steamed rice and kimchi."
}
```

---

## Recipe 10: Chocolate Lava Cake

```json
{
  "title": "Individual Chocolate Lava Cakes",
  "description": "Decadent chocolate cakes with molten centers. Perfect dessert for special occasions or romantic dinners.",
  "images": "https://res.cloudinary.com/demo/image/upload/v1234567890/lava-cake.jpg",
  "prepTime": 15,
  "cookTime": 12,
  "servings": 4,
  "difficulty": "Medium",
  "category": "Dessert",
  "ingredients": "100g dark chocolate, chopped\n100g butter\n2 large eggs\n2 large egg yolks\n1/4 cup granulated sugar\n2 tbsp all-purpose flour\nPinch of salt\nButter for ramekins\nCocoa powder for dusting\nVanilla ice cream\nPowdered sugar\nFresh berries",
  "instructions": "1. Preheat oven to 220°C. Butter and dust 4 ramekins with cocoa.\n2. Melt chocolate and butter in double boiler until smooth.\n3. Whisk whole eggs, egg yolks, and sugar until thick.\n4. Fold in melted chocolate mixture.\n5. Gently fold in flour and salt until just combined.\n6. Divide batter among prepared ramekins.\n7. Bake 10-12 minutes until edges are firm but centers jiggle.\n8. Let rest 1 minute, then invert onto plates.\n9. Dust with powdered sugar, serve with ice cream and berries."
}
```

---

## How to Use in Postman:

1. **Set up authentication** first (login to get JWT token)
2. **Copy each JSON payload** above
3. **Create a new POST request** for each recipe
4. **Set endpoint:** `https://cookbook-connect-six.vercel.app/api/recipes`
5. **Add headers:** Content-Type: application/json
6. **Paste JSON in request body**
7. **Send request** to create recipe

These recipes cover various cuisines, difficulty levels, and cooking times to showcase your application's versatility!
