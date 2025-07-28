import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test user first
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test Chef',
      image: null,
    },
  })

  // Create some test recipes
  const recipes = [
    {
      title: 'Classic Vanilla Cake',
      description: 'A moist and fluffy vanilla cake perfect for any occasion',
      ingredients: JSON.stringify(['2 cups flour', '1 cup sugar', '3 eggs', '1 tsp vanilla']),
      instructions: JSON.stringify(['Mix ingredients', 'Bake at 350F for 30 minutes']),
      images: JSON.stringify(['https://example.com/vanilla-cake.jpg']),
      prepTime: 20,
      cookTime: 30,
      servings: 8,
      difficulty: 'Easy',
      category: 'Desserts',
      userId: testUser.id,
    },
    {
      title: 'Vegetarian Pasta',
      description: 'Fresh vegetables with pasta in a creamy sauce',
      ingredients: JSON.stringify(['1 lb pasta', '2 cups mixed vegetables', '1 cup cream']),
      instructions: JSON.stringify(['Cook pasta', 'Sauté vegetables', 'Combine with cream']),
      images: JSON.stringify(['https://example.com/veggie-pasta.jpg']),
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: 'Medium',
      category: 'Main Course',
      userId: testUser.id,
    },
    {
      title: 'Breakfast Pancakes',
      description: 'Fluffy pancakes perfect for weekend mornings',
      ingredients: JSON.stringify(['2 cups flour', '2 eggs', '1 cup milk', 'maple syrup']),
      instructions: JSON.stringify(['Mix batter', 'Cook on griddle', 'Serve with syrup']),
      images: JSON.stringify(['https://example.com/pancakes.jpg']),
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: 'Easy',
      category: 'Breakfast',
      userId: testUser.id,
    },
  ]

  for (const recipe of recipes) {
    // Check if recipe already exists
    const existingRecipe = await prisma.recipe.findFirst({
      where: { title: recipe.title }
    })
    
    if (!existingRecipe) {
      await prisma.recipe.create({
        data: recipe
      })
      console.log(`✅ Created recipe: ${recipe.title}`)
    } else {
      console.log(`⏭️  Recipe already exists: ${recipe.title}`)
    }
  }

  console.log('✅ Test recipes created successfully!')
  
  // Verify recipes were created
  const count = await prisma.recipe.count()
  console.log(`📊 Total recipes in database: ${count}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
