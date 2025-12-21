#!/usr/bin/env node

const app = require('./server');

// Test the authentication endpoints
async function testAuth() {
    console.log('🧪 Testing Authentication System...\n');

    // Test 1: Registration endpoint (should fail without database)
    console.log('1. Testing Registration Endpoint:');
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'TestPass123',
                first_name: 'Test',
                last_name: 'User'
            })
        });
        
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Login endpoint
    console.log('2. Testing Login Endpoint:');
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'TestPass123'
            })
        });
        
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Protected endpoint (should fail without token)
    console.log('3. Testing Protected Endpoint (no token):');
    try {
        const response = await fetch('http://localhost:3000/api/auth/me');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Validation errors
    console.log('4. Testing Validation (invalid email):');
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'invalid-email',
                password: 'weak'
            })
        });
        
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log('Error:', error.message);
    }

    console.log('\n✅ Testing completed!');
    process.exit(0);
}

// Wait for server to start
setTimeout(() => {
    testAuth();
}, 2000);