// seed-supabase.js
const { createClient } = require('@supabase/supabase-js');
const categoriesData = require('./src/data/categories');

// Your Supabase project URL and service role key
const SUPABASE_URL = 'https://ogalytywmafaztluhjzd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWx5dHl3bWFmYXp0bHVoanpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTk5NTMzMSwiZXhwIjoyMDY1NTcxMzMxfQ.mfvF4JOSaaryVXIjcR0_rpF6Cd7gPISfqsSDuXtWIFg';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function seedCategoriesAndSubcategories() {
  console.log('Seeding categories and subcategories...');
  for (const cat of categoriesData.categories) {
    // Insert category if not exists
    const { data: existingCat, error: catFetchError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', cat.id)
      .single();
    if (catFetchError && catFetchError.code !== 'PGRST116') {
      console.error(`Error checking category ${cat.name}:`, catFetchError.message);
      continue;
    }
    if (!existingCat) {
      const { error: catInsertError } = await supabase
        .from('categories')
        .insert({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          active: true,
          description: cat.name,
          created_at: new Date().toISOString(),
        });
      if (catInsertError) {
        console.error(`Error inserting category ${cat.name}:`, catInsertError.message);
        continue;
      } else {
        console.log(`Inserted category: ${cat.name}`);
      }
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
    // Insert subcategories
    for (const sub of cat.subcategories) {
      // Use a composite key: category_id + name
      const { data: existingSub, error: subFetchError } = await supabase
        .from('subcategories')
        .select('id')
        .eq('category_id', cat.id)
        .eq('name', sub)
        .single();
      if (subFetchError && subFetchError.code !== 'PGRST116') {
        console.error(`Error checking subcategory ${sub}:`, subFetchError.message);
        continue;
      }
      if (!existingSub) {
        const { error: subInsertError } = await supabase
          .from('subcategories')
          .insert({
            name: sub,
            category_id: cat.id,
            active: true,
            description: sub,
            created_at: new Date().toISOString(),
          });
        if (subInsertError) {
          console.error(`Error inserting subcategory ${sub}:`, subInsertError.message);
        } else {
          console.log(`Inserted subcategory: ${sub} (Category: ${cat.name})`);
        }
      } else {
        console.log(`Subcategory already exists: ${sub} (Category: ${cat.name})`);
      }
    }
  }
  console.log('Seeding complete!');
}

seedCategoriesAndSubcategories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  }); 