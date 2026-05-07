function showSuccessBanner(message = 'Report submitted successfully!') {
    let banner = document.getElementById('submissionSuccessBanner');

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'submissionSuccessBanner';
        banner.setAttribute('role', 'status');
        banner.style.position = 'fixed';
        banner.style.top = '78px';
        banner.style.right = '24px';
        banner.style.zIndex = '10000';
        banner.style.maxWidth = '420px';
        banner.style.padding = '14px 18px';
        banner.style.borderRadius = '8px';
        banner.style.background = 'linear-gradient(135deg, #59AF29 0%, #254911 100%)';
        banner.style.color = '#ffffff';
        banner.style.boxShadow = '0 10px 24px rgba(37, 73, 17, 0.28)';
        banner.style.fontFamily = 'Inter, Segoe UI, Arial, sans-serif';
        banner.style.fontSize = '14px';
        banner.style.fontWeight = '700';
        banner.style.letterSpacing = '0';
        banner.style.lineHeight = '1.4';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-10px)';
        banner.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        document.body.appendChild(banner);
    }

    banner.textContent = message;
    requestAnimationFrame(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
    });

    clearTimeout(window.submissionSuccessBannerTimer);
    window.submissionSuccessBannerTimer = setTimeout(() => {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-10px)';
    }, 3500);
}
async function submitReport() {
    // Manually collect all form data
    const data = {
        // Header fields
        type: document.querySelector('[name="report_type"]')?.value || 'Community Needs Assessment Consolidated Report',
        department: document.getElementById('department')?.value || '',
        date_submitted: document.getElementById('date_submitted')?.value || '',
        
        // Section A-C fields
        date_conduct: document.querySelector('[name="date_conduct"]')?.value || '',
        participants: document.querySelector('[name="participants"]')?.value || '',
        location: document.querySelector('[name="location"]')?.value || '',
        
        // Section I fields
        family_profile: document.querySelector('[name="family_profile"]')?.value || '',
        community_concern: document.querySelector('[name="community_concern"]')?.value || '',
        other_identified_needs: document.querySelector('[name="other_identified_needs"]')?.value || '',
        
        // Section II fields - Kabayani Programs
        kabayani_ng_panginoon: document.querySelector('[name="kabayani_ng_panginoon"]')?.value || '',
        kabayani_ng_kalikasan: document.querySelector('[name="kabayani_ng_kalikasan"]')?.value || '',
        kabayani_ng_buhay: document.querySelector('[name="kabayani_ng_buhay"]')?.value || '',
        kabayani_ng_turismo: document.querySelector('[name="kabayani_ng_turismo"]')?.value || '',
        kabayani_ng_kultura: document.querySelector('[name="kabayani_ng_kultura"]')?.value || '',
        
        // Section III fields - Outreach Program
        title_of_program: document.querySelector('[name="title_of_program"]')?.value || '',
        objectives: document.querySelector('[name="objectives"]')?.value || '',
        beneficiaries: document.querySelector('[name="beneficiaries"]')?.value || '',
        
        // Section IV fields - Allocation of Resources
        from_school: document.querySelector('[name="from_school"]')?.value || '',
        from_community: document.querySelector('[name="from_community"]')?.value || '',
        
        // These fields will be overwritten by PHP session data
        // but we include them to match database columns
        created_by_name: '',  // Will be set by PHP
        role: '',             // Will be set by PHP
        user_id: '',          // Will be set by PHP
        feedback: '',         // Default empty
        status: 'pending',    // Default status
        archived: 'not archived' // Default archived status
    };
    
    // Remove empty fields to let database defaults work
    Object.keys(data).forEach(key => {
        if (data[key] === '') {
            delete data[key];
        }
    });
    
    
    try {
        const response = await fetch("post.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        
        
        // Get the response text first
        const responseText = await response.text();
        
        // Try to parse as JSON
        try {
            const result = JSON.parse(responseText);
            
            if(result.success){
                showSuccessBanner("Report submitted successfully!");
                // Clear all fields after successful submission
                document.querySelectorAll('textarea, input[type="text"]').forEach(field => {
                    field.value = '';
                });
            } else {
                alert("Error: " + (result.error || "Unknown error"));
                if(result.received) {
                }
            }
        } catch (parseError) {
            alert("Server returned invalid JSON. Check console for details.");
        }
        
    } catch(err){
        alert("An unexpected error occurred. Please check the console for details.");
    }
}
