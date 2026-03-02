// Test script to verify skill extraction functionality
const { extractSkills, SKILL_CATEGORIES } = require('./lib/skills');

console.log('Testing skill extraction functionality...\n');

// Test 1: JD with various skills
const testJD1 = `
We are looking for a Software Engineer with expertise in:
- Strong knowledge of Data Structures and Algorithms
- Proficiency in Java and JavaScript
- Experience with React and Node.js
- Database skills with SQL and MongoDB
- Cloud experience with AWS and Docker
- Knowledge of testing frameworks like Jest and Cypress
`;

console.log('Test 1: JD with various skills');
console.log('Input:', testJD1);
const skills1 = extractSkills(testJD1);
console.log('Extracted Skills:', JSON.stringify(skills1, null, 2));

// Test 2: JD with minimal skills
const testJD2 = `
Software Engineering position for fresh graduates.
Passion for technology and willingness to learn.
`;

console.log('\nTest 2: JD with minimal skills');
console.log('Input:', testJD2);
const skills2 = extractSkills(testJD2);
console.log('Extracted Skills:', JSON.stringify(skills2, null, 2));

// Test 3: JD with advanced skills
const testJD3 = `
Senior Full Stack Developer role:
- 5+ years of experience with Java, Python, and TypeScript
- Expert in React, Next.js, and Node.js
- Deep knowledge of system design and scalability
- Experience with AWS, Kubernetes, and CI/CD pipelines
- Proficient in PostgreSQL and Redis
- Testing with Selenium and JUnit
`;

console.log('\nTest 3: JD with advanced skills');
console.log('Input:', testJD3);
const skills3 = extractSkills(testJD3);
console.log('Extracted Skills:', JSON.stringify(skills3, null, 2));

console.log('\nTesting completed!');