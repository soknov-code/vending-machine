// ==========================================
// ១. មុខងារត្រួតពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត (Online/Offline Detection)
// ==========================================
window.addEventListener('offline', () => {
    alert("អ្នកបានដាច់ការតភ្ជាប់អ៊ីនធឺណិតហើយ! សូមពិនិត្យមើលសេវាឡើងវិញ។");
    // បិទប៊ូតុងទាំងអស់មិនឲ្យចុចទិញ ពេលគ្មានអ៊ីនធឺណិត
    document.querySelectorAll('.buy-btn').forEach(btn => btn.disabled = true);
});

window.addEventListener('online', () => {
    alert("ភ្ជាប់អ៊ីនធឺណិតបានជោគជ័យវិញហើយ!");
    // បើកប៊ូតុងឲ្យចុចទិញបានវិញ ពេលមានអ៊ីនធឺណិត
    document.querySelectorAll('.buy-btn').forEach(btn => btn.disabled = false);
});

// ==========================================
// ២. ចុះឈ្មោះ Service Worker សម្រាប់ PWA
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker បានចុះឈ្មោះជោគជ័យ'))
            .catch(err => console.log('បញ្ហាក្នុងការចុះឈ្មោះ Service Worker:', err));
    });
}

// ==========================================
// ៣. អនុគមន៍សម្រាប់ដំណើរការការទិញ (Buy Function)
// ==========================================
async function buyDrink(rowCommand, drinkName) {
    const modal = document.getElementById('status-modal');
    const modalText = document.getElementById('modal-text');
    const modalSubtext = document.getElementById('modal-subtext');
    const loader = document.getElementById('loader');

    // បង្ហាញផ្ទាំងកំពុងដំណើរការ (Loading Modal)
    modal.style.display = 'flex';
    loader.style.display = 'block';
    modalText.innerText = `កំពុងទូទាត់ប្រាក់...`;
    modalSubtext.innerText = `ទិញ: ${drinkName}`;

    try {
        // បាញ់ Request ទៅកាន់ Backend របស់អ្នក
        // [ចំណាំសំខាន់]: ពេលអ្នកបង្ហោះគម្រោងនេះឡើងអ៊ីនធឺណិតពិតប្រាកដ សូមកុំភ្លេចប្ដូរ 'http://localhost:3000' ទៅជា Link Server ពិតប្រាកដរបស់អ្នក
        const response = await fetch('http://localhost:3000/api/payment-webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'SUCCESS',
                machine_id: 'MACHINE_001',
                row: rowCommand
            })
        });

        if (response.ok) {
            // បើទិញជោគជ័យ
            loader.style.display = 'none';
            modalText.innerText = 'ជោគជ័យ! 🎉';
            modalSubtext.innerText = `សូមយកកំប៉ុង ${drinkName} របស់អ្នកនៅខាងក្រោម`;
            
            // បិទផ្ទាំងវិញក្រោយ ៣ វិនាទី
            setTimeout(() => {
                modal.style.display = 'none';
            }, 3000);
        } else {
            throw new Error('Payment failed');
        }

    } catch (error) {
        // បើមានបញ្ហា (ឧទាហរណ៍ Backend បិទ ឬ Error ផ្សេងៗ)
        loader.style.display = 'none';
        modalText.innerText = 'បរាជ័យ ❌';
        modalSubtext.innerText = 'មានបញ្ហាក្នុងការទាក់ទងទៅម៉ាស៊ីន។ សូមព្យាយាមម្ដងទៀត។';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }
}