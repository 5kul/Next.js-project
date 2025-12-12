// test-emily.js
const axios = require('axios');

async function testEmily() {
  try {
    console.log('Testing with Emily credentials...');
    
    const response = await axios.post('https://dummyjson.com/auth/login', {
      username: 'emilys',
      password: 'emilyspass'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('\n✅ SUCCESS! Response received:');
    console.log('- User ID:', response.data.id);
    console.log('- Name:', response.data.firstName, response.data.lastName);
    console.log('- Email:', response.data.email);
    console.log('- Token exists:', !!response.data.accessToken);
    
    return true;
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('- Status:', error.response?.status);
    console.error('- Message:', error.response?.data?.message || error.message);
    
    // Aur credentials try karein
    console.log('\nTrying alternative credentials...');
    await tryAlternatives();
    return false;
  }
}

async function tryAlternatives() {
  const alternatives = [
    { username: 'atuny0', password: '9uQFF1Lh' },
    { username: 'hbingley1', password: 'CQutx25i8r' },
    { username: 'dpettegre6', password: 'YVmhktgYVS' },
    { username: 'kminchelle', password: '0lelplR' } // Last mein try karein
  ];
  
  for (const cred of alternatives) {
    try {
      const res = await axios.post('https://dummyjson.com/auth/login', cred, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000
      });
      console.log(`✅ ${cred.username}: WORKING (ID: ${res.data.id})`);
    } catch (err) {
      console.log(`❌ ${cred.username}: Failed`);
    }
  }
}

testEmily();