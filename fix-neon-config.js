// One-time script to update Neon DB with correct address and WA numbers
// Run after deploy: open the live site and paste this in the browser console,
// OR we can build it into a temporary API endpoint.

// This script will be run via the deployed site's browser console.
const SCRIPT = `
// === PASTE THIS IN BROWSER CONSOLE ON THE LIVE SITE ===
(async () => {
  try {
    // First, get current config from Neon
    const getRes = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', key: 'site_config' })
    });
    const getData = await getRes.json();
    const currentConfig = getData.data || {};
    
    console.log('Current config from Neon:', currentConfig);
    
    // Update with correct values
    const updatedConfig = {
      ...currentConfig,
      address: "Toko: Ruko Jambu Raya Perumnas Kamal\\nHomestore Madura: Jl Jeruk 6 no 4 Perumnas Kamal Bangkalan\\nHomestore Surabaya: Jl Wonorejo 3 Tegalsari Surabaya",
      whatsappNumber: "6285880021020",
      whatsappDisplay: "0858-8002-1020",
      whatsappNumber2: "6287853094053",
      whatsappDisplay2: "0878-5309-4053",
    };
    
    // Save back to Neon
    const saveRes = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'set', 
        key: 'site_config', 
        data: updatedConfig,
        username: currentConfig.adminUsername || 'admin',
        password: currentConfig.adminPassword || 'admin123'
      })
    });
    const saveData = await saveRes.json();
    
    if (saveData.success) {
      console.log('✅ Neon DB updated successfully!');
      console.log('Updated config:', updatedConfig);
      // Clear local cache so it picks up new data
      localStorage.removeItem('aybucket_config_v1');
      console.log('🔄 Local cache cleared. Reloading...');
      setTimeout(() => location.reload(), 1000);
    } else {
      console.error('❌ Failed to save:', saveData);
    }
  } catch (e) {
    console.error('❌ Error:', e);
  }
})();
// === END ===
`;

console.log(SCRIPT);
