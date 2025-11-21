/**
 * Generate alternatives.json from database
 * 
 * This script fetches all courses and prerequisites from the database
 * and generates an alternatives.json file with prerequisite information.
 */

const db = require('../config');

/**
 * Fetch all prerequisites from database
 */
function fetchAllPrerequisites() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT course, prereq FROM Prerequisites ORDER BY course, prereq';
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

/**
 * Fetch all courses from database
 */
function fetchAllCourses() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT DISTINCT class_name FROM Courses ORDER BY class_name';
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.map(row => row.class_name));
            }
        });
    });
}

/**
 * Group prerequisites by course
 * Returns: { courseName: [prereq1, prereq2, ...] }
 */
function groupPrerequisitesByCourse(prerequisites) {
    const grouped = {};
    
    prerequisites.forEach(({ course, prereq }) => {
        if (!grouped[course]) {
            grouped[course] = [];
        }
        grouped[course].push(prereq);
    });
    
    return grouped;
}

/**
 * Build alternatives structure
 * For each course, create alternative groups based on prerequisites
 */
function buildAlternatives(courses, prerequisiteGroups) {
    const alternatives = {};
    
    courses.forEach(course => {
        const prereqs = prerequisiteGroups[course] || [];
        
        if (prereqs.length === 0) {
            // No prerequisites
            alternatives[course] = {
                alternatives: [[]],
                description: "No prerequisites"
            };
        } else if (prereqs.length === 1) {
            // Single prerequisite
            alternatives[course] = {
                alternatives: [[prereqs[0]]],
                description: prereqs[0]
            };
        } else {
            // Multiple prerequisites - treat as OR alternatives
            // Each prerequisite becomes its own alternative group
            alternatives[course] = {
                alternatives: prereqs.map(prereq => [prereq]),
                description: prereqs.join(' OR ')
            };
        }
    });
    
    return alternatives;
}

/**
 * Main function to generate alternatives.json
 */
async function generateAlternatives() {
    try {
        console.log('Fetching data from database...');
        
        // Fetch all data
        const [courses, prerequisites] = await Promise.all([
            fetchAllCourses(),
            fetchAllPrerequisites()
        ]);
        
        console.log(`Found ${courses.length} courses`);
        console.log(`Found ${prerequisites.length} prerequisite relationships`);
        
        // Group prerequisites by course
        const prerequisiteGroups = groupPrerequisitesByCourse(prerequisites);
        
        // Build alternatives structure
        const alternativesData = buildAlternatives(courses, prerequisiteGroups);
        
        // Create output object
        const output = {
            courseAlternatives: alternativesData
        };
        
        // Write to file
        const fs = require('fs');
        const path = require('path');
        const outputPath = path.join(__dirname, '../../frontend/src/app/pages/alternatives.json');
        
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        
        console.log(`\nSuccessfully generated alternatives.json`);
        console.log(`Output: ${outputPath}`);
        console.log(`Total courses: ${courses.length}`);
        
        // Show some statistics
        const withPrereqs = Object.values(alternativesData).filter(
            alt => alt.alternatives.length > 0 && alt.alternatives[0].length > 0
        ).length;
        const withMultipleAlternatives = Object.values(alternativesData).filter(
            alt => alt.alternatives.length > 1
        ).length;
        
        console.log(`Courses with prerequisites: ${withPrereqs}`);
        console.log(`Courses with multiple alternatives: ${withMultipleAlternatives}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error generating alternatives:', error);
        process.exit(1);
    }
}

// Run the script
generateAlternatives();
