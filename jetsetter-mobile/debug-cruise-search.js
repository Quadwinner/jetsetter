// Debug script for cruise search
console.log('🔍 Debugging Cruise Search...');

// Test cruise service directly
import cruiseService from './src/services/cruiseService.js';

const testSearch = async () => {
  console.log('Testing cruise search...');
  
  try {
    const result = await cruiseService.searchCruises({
      destination: 'Caribbean',
      passengers: 2
    });
    
    console.log('Search result:', result);
    
    if (result.success) {
      console.log('✅ Search successful');
      console.log('Found cruises:', result.cruises.length);
      console.log('First cruise:', result.cruises[0]);
    } else {
      console.log('❌ Search failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Search error:', error);
  }
};

testSearch();



