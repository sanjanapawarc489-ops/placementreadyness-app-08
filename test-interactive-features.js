// Test script for interactive features
// Run this in browser console on the results page

console.log("=== Placement Readiness Platform - Interactive Features Test ===");

// Test 1: Check if skill confidence map exists
function testSkillConfidenceMap() {
  console.log("\n1. Testing skill confidence map...");
  const history = JSON.parse(localStorage.getItem("placement_readiness_history") || "[]");
  if (history.length > 0) {
    const entry = history[0];
    console.log("Entry has skillConfidenceMap:", !!entry.skillConfidenceMap);
    if (entry.skillConfidenceMap) {
      console.log("Skills and confidence:", entry.skillConfidenceMap);
      console.log("✓ Skill confidence map is working");
      return true;
    }
  }
  console.log("✗ No history entries found or missing skillConfidenceMap");
  return false;
}

// Test 2: Check live score updates
function testLiveScore() {
  console.log("\n2. Testing live score updates...");
  const scoreElement = document.querySelector('[class*="text-3xl font-bold"]');
  if (scoreElement) {
    const currentScore = parseInt(scoreElement.textContent);
    console.log("Current displayed score:", currentScore);
    console.log("✓ Live score display is working");
    return true;
  }
  console.log("✗ Could not find score element");
  return false;
}

// Test 3: Check interactive skill tags
function testInteractiveTags() {
  console.log("\n3. Testing interactive skill tags...");
  const skillButtons = document.querySelectorAll('button[aria-label*="I know this"], button[aria-label*="Need practice"]');
  console.log("Found interactive skill tags:", skillButtons.length);
  if (skillButtons.length > 0) {
    console.log("✓ Interactive skill tags are present");
    return true;
  }
  console.log("✗ No interactive skill tags found");
  return false;
}

// Test 4: Check export tools
function testExportTools() {
  console.log("\n4. Testing export tools...");
  const exportButtons = document.querySelectorAll('button[aria-label*="Copy"], button[aria-label*="Download"]');
  console.log("Found export buttons:", exportButtons.length);
  if (exportButtons.length >= 3) {
    console.log("✓ Export tools are present");
    return true;
  }
  console.log("✗ Missing export tools");
  return false;
}

// Test 5: Check Action Next box
function testActionNext() {
  console.log("\n5. Testing Action Next box...");
  const actionNextBox = document.querySelector('h3:contains("Top skills to practice"), div:contains("Great job!")');
  if (actionNextBox) {
    console.log("✓ Action Next box is present");
    return true;
  }
  console.log("✗ Action Next box not found");
  return false;
}

// Run all tests
function runAllTests() {
  const results = [
    testSkillConfidenceMap(),
    testLiveScore(),
    testInteractiveTags(),
    testExportTools(),
    testActionNext()
  ];
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log("\n=== TEST SUMMARY ===");
  console.log(`Passed: ${passed}/${total}`);
  console.log(`Success rate: ${Math.round((passed/total)*100)}%`);
  
  if (passed === total) {
    console.log("🎉 All tests passed! Interactive features are working correctly.");
  } else {
    console.log("⚠️ Some tests failed. Please check the implementation.");
  }
}

// Run the tests
runAllTests();