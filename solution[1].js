const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function convertToBase10(value, base) {
    return BigInt(parseInt(value, base));
}

function lagrangeInterpolation(points, k) {
    let secret = 0n;
    
    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }
        
        let term = (yi * numerator) / denominator;
        secret += term;
    }
    
    return secret;
}

function processTestCase(testData, testName) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`${testName}`);
    console.log("=".repeat(50));
    
    const n = testData.keys.n;
    const k = testData.keys.k;
    
    console.log(`n (total roots provided): ${n}`);
    console.log(`k (minimum roots required): ${k}`);
    console.log(`Polynomial degree: ${k - 1}\n`);
    
    const points = [];
    
    for (let i = 1; i <= n; i++) {
        if (testData[i.toString()]) {
            const point = testData[i.toString()];
            const base = parseInt(point.base);
            const value = point.value;
            
            const x = BigInt(i);
            const y = convertToBase10(value, base);
            
            points.push({ x, y });
            
            console.log(`Point ${i}: x = ${x}, y = ${y}`);
            console.log(`  (Original: base ${base}, value "${value}")`);
        }
    }
    
    // Display Final points in the required format
    console.log(`\nFinal points:\n`);
    const pointsStr = points.map(p => `(${p.x},${p.y})`).join(', ');
    console.log(pointsStr);
    
    const secret = lagrangeInterpolation(points, k);
    
    console.log(`\n${"*".repeat(50)}`);
    console.log(`SECRET (Constant term c): ${secret}`);
    console.log("*".repeat(50));
    
    return secret;
}

function main() {
    console.log("\n╔════════════════════════════════════════════════╗");
    console.log("║   SHAMIR'S SECRET SHARING - SOLUTION          ║");
    console.log("║   Polynomial Reconstruction using Lagrange     ║");
    console.log("╚════════════════════════════════════════════════╝");
    
    console.log("\nSelect which test case to run:");
    console.log("1. Test Case 1");
    console.log("2. Test Case 2");
    console.log("3. Both Test Cases");
    
    rl.question('\nEnter your choice (1, 2, or 3): ', (choice) => {
        console.log("");
        
        if (choice === '1') {
            // Run only Test Case 1
            const testcase1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
            const secret1 = processTestCase(testcase1, "TEST CASE 1");
            
            console.log(`\n${"=".repeat(50)}`);
            console.log("RESULT");
            console.log("=".repeat(50));
            console.log(`Test Case 1 Secret: ${secret1}`);
            console.log("=".repeat(50));
            
            const results = {
                testCase1: {
                    secret: secret1.toString(),
                    n: testcase1.keys.n,
                    k: testcase1.keys.k
                }
            };
            
            fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
            console.log("\n✓ Results saved to output.json");
            
        } else if (choice === '2') {
            // Run only Test Case 2
            const testcase2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));
            const secret2 = processTestCase(testcase2, "TEST CASE 2");
            
            console.log(`\n${"=".repeat(50)}`);
            console.log("RESULT");
            console.log("=".repeat(50));
            console.log(`Test Case 2 Secret: ${secret2}`);
            console.log("=".repeat(50));
            
            const results = {
                testCase2: {
                    secret: secret2.toString(),
                    n: testcase2.keys.n,
                    k: testcase2.keys.k
                }
            };
            
            fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
            console.log("\n✓ Results saved to output.json");
            
        } else if (choice === '3') {
            // Run both test cases
            const testcase1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
            const secret1 = processTestCase(testcase1, "TEST CASE 1");
            
            const testcase2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));
            const secret2 = processTestCase(testcase2, "TEST CASE 2");
            
            console.log(`\n${"=".repeat(50)}`);
            console.log("SUMMARY OF RESULTS");
            console.log("=".repeat(50));
            console.log(`Test Case 1 Secret: ${secret1}`);
            console.log(`Test Case 2 Secret: ${secret2}`);
            console.log("=".repeat(50));
            
            const results = {
                testCase1: {
                    secret: secret1.toString(),
                    n: testcase1.keys.n,
                    k: testcase1.keys.k
                },
                testCase2: {
                    secret: secret2.toString(),
                    n: testcase2.keys.n,
                    k: testcase2.keys.k
                }
            };
            
            fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
            console.log("\n✓ Results saved to output.json");
            
        } else {
            console.log("Invalid choice! Please run the program again and enter 1, 2, or 3.");
        }
        
        rl.close();
    });
}

main();