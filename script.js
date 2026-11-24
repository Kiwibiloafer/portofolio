document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    document.getElementById('year').textContent = new Date().getFullYear();
});

async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Urutan render
        renderProfile(data.profile);
        renderFloatingCV(data.profile); // Tombol floating
        renderSocials(data.socials);    // Ikon sosmed (Tadi error disini karena fungsinya hilang)
        renderExperience(data.experience);
        renderEducation(data.education);
        renderCertifications(data.certifications);
        renderProjects(data.projects);
        
    } catch (error) {
        console.error('Gagal memuat data:', error);
    }
}

// --- FUNGSI-FUNGSI RENDER ---

function renderProfile(profile) {
    const container = document.getElementById('profile-section');
    container.innerHTML = `
        <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img src="${profile.avatar}" alt="${profile.name}" class="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-slate-800 shadow-2xl">
        </div>
        <div class="text-center md:text-left flex-1">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">${profile.name}</h1>
            <p class="text-accent text-lg font-medium mb-4">${profile.role}</p>
            <p class="text-slate-400 leading-relaxed max-w-lg">${profile.bio}</p>
            <div class="mt-4 text-sm text-slate-500 flex items-center justify-center md:justify-start gap-2">
                <i class="fas fa-map-marker-alt"></i> ${profile.location}
            </div>
        </div>
    `;
}

// Fungsi renderSocials yang sebelumnya hilang
function renderSocials(socials) {
    const container = document.getElementById('socials-container');
    // Cek agar tidak error jika socials kosong/undefined
    if (!container || !socials) return; 

    container.innerHTML = socials.map(social => `
        <a href="${social.url}" target="_blank" class="text-2xl text-slate-400 hover:text-accent hover:-translate-y-1 transition-all duration-300">
            <i class="${social.icon}"></i>
        </a>
    `).join('');
}

function renderFloatingCV(profile) {
    const container = document.getElementById('cv-container');
    
    // Cek jika ada file CV di json, baru render tombolnya
    if (profile.cv_file) {
        container.innerHTML = `
            <a href="${profile.cv_file}" target="_blank" 
               class="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-accent text-dark font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-accent/50 hover:scale-105 transition-all duration-300 group">
                
                <i class="fas fa-file-pdf text-xl group-hover:animate-bounce"></i>
                <span>Resume</span>
                
                <span class="absolute -top-1 -right-1 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
            </a>
        `;
    }
}

function renderExperience(experiences) {
    const container = document.getElementById('experience-list');
    container.innerHTML = experiences.map(exp => `
        <div class="relative group">
            <span class="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-dark bg-slate-600 group-hover:bg-accent transition-colors duration-300"></span>
            <div class="bg-card p-6 rounded-xl border border-slate-700/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <h3 class="text-xl font-bold text-white group-hover:text-accent transition-colors">${exp.role}</h3>
                    <span class="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded mt-1 sm:mt-0 w-fit">${exp.period}</span>
                </div>
                <p class="text-slate-400 font-medium mb-2">${exp.company}</p>
                <p class="text-slate-500 text-sm leading-relaxed">${exp.desc}</p>
            </div>
        </div>
    `).join('');
}

function renderProjects(projects) {
    const container = document.getElementById('project-grid');
    container.innerHTML = projects.map(project => `
        <div class="group block bg-card rounded-xl overflow-hidden border border-slate-700/50 cursor-pointer hover:border-accent/50 transition-all duration-300" onclick="showProjectPopup(${JSON.stringify(project).replace(/"/g, '&quot;')})">
            <div class="h-48 overflow-hidden relative">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="p-5">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-bold text-white group-hover:text-accent transition-colors">${project.title}</h3>
                    <span class="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full">${project.category}</span>
                </div>
                <p class="text-slate-400 text-sm mb-4 line-clamp-2">${project.desc}</p>
                <div class="flex flex-wrap gap-2">
                    ${project.tech.map(t => `<span class="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">${typeof t === 'string' ? t : t.name}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function renderEducation(education) {
    const container = document.getElementById('education-list');
    container.innerHTML = education.map(edu => `
        <div class="flex flex-col sm:flex-row justify-between items-center bg-card p-4 rounded-lg border border-slate-800">
            <div>
                <h4 class="text-lg font-bold text-white">${edu.school}</h4>
                <p class="text-slate-400">${edu.degree}</p>
            </div>
            <span class="text-sm text-slate-500 font-mono mt-2 sm:mt-0">${edu.period}</span>
        </div>
    `).join('');
}

function renderCertifications(certifications) {
    const container = document.getElementById('certification-list');
    container.innerHTML = certifications.map(cert => `
        <div class="group block bg-card rounded-xl overflow-hidden border border-slate-700/50 cursor-pointer hover:border-accent/50 transition-all duration-300" onclick="showCertificationPopup(${JSON.stringify(cert).replace(/"/g, '&quot;')})">
            <div class="h-32 overflow-hidden relative bg-slate-800">
                <img src="${cert.image}" alt="${cert.title}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-bold text-white group-hover:text-accent transition-colors mb-2">${cert.title}</h3>
                <div class="flex items-center gap-2 text-slate-400 text-sm mb-2">
                    <i class="fas fa-building text-xs"></i>
                    <span>${cert.issuer}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-500 text-xs">
                    <i class="fas fa-calendar-alt text-xs"></i>
                    <span>${cert.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to get tech logo URL from data
function getTechLogo(tech) {
    if (typeof tech === 'object' && tech.logo) {
        return tech.logo;
    }
    // Fallback untuk backward compatibility
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/code/code-original.svg';
}

// Function to show project popup
function showProjectPopup(project) {
    const popup = document.getElementById('project-popup');
    const popupImage = document.getElementById('popup-image');
    const popupCategory = document.getElementById('popup-category');
    const popupTitle = document.getElementById('popup-title');
    const popupTimeline = document.getElementById('popup-timeline');
    const popupDescription = document.getElementById('popup-description');
    const popupTechStack = document.getElementById('popup-tech-stack');
    
    // Set popup content
    popupImage.src = project.image;
    popupImage.alt = project.title;
    popupCategory.textContent = project.category;
    popupTitle.textContent = project.title;
    popupTimeline.textContent = project.timeline || 'Timeline tidak tersedia';
    popupDescription.textContent = project.detailed_desc || project.desc;
    
    // Render tech stack with logos
    popupTechStack.innerHTML = project.tech.map(tech => {
        const techName = typeof tech === 'string' ? tech : tech.name;
        const techLogo = getTechLogo(tech);
        return `
            <div class="tech-stack-item">
                <img src="${techLogo}" alt="${techName}" class="tech-logo" onerror="this.src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/code/code-original.svg'">
                <span class="text-sm text-slate-300">${techName}</span>
            </div>
        `;
    }).join('');
    
    // Show popup
    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Function to close popup
function closeProjectPopup() {
    const popup = document.getElementById('project-popup');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore background scroll
}

// Close popup when clicking outside
document.getElementById('project-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProjectPopup();
    }
});

// Close popup when clicking close button
document.getElementById('close-popup').addEventListener('click', closeProjectPopup);

// Close popup when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProjectPopup();
        closeCertificationPopup();
    }
});

// Function to show certification popup
function showCertificationPopup(cert) {
    const popup = document.getElementById('certification-popup');
    const popupImage = document.getElementById('cert-popup-image');
    const popupTitle = document.getElementById('cert-popup-title');
    const popupIssuer = document.getElementById('cert-popup-issuer');
    const popupDate = document.getElementById('cert-popup-date');
    const popupLink = document.getElementById('cert-popup-link');
    const popupDescription = document.getElementById('cert-popup-description');
    const popupModules = document.getElementById('cert-popup-modules');
    const popupModulesContainer = document.getElementById('cert-popup-modules-container');
    
    // Set popup content
    popupImage.src = cert.image;
    popupImage.alt = cert.title;
    popupTitle.textContent = cert.title;
    popupIssuer.textContent = cert.issuer;
    popupDate.textContent = cert.date;
    popupLink.href = cert.link || '#';
    popupDescription.textContent = cert.description;
    
    // Render modules if available
    if (cert.modules && cert.modules.length > 0) {
        popupModulesContainer.style.display = 'block';
        popupModules.innerHTML = cert.modules.map(module => `
            <li class="flex items-center gap-2 text-slate-300 text-sm">
                <i class="fas fa-check-circle text-accent text-xs"></i>
                <span>${module}</span>
            </li>
        `).join('');
    } else {
        popupModulesContainer.style.display = 'none';
    }
    
    // Show popup
    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Function to close certification popup
function closeCertificationPopup() {
    const popup = document.getElementById('certification-popup');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore background scroll
}

// Close certification popup when clicking outside
document.getElementById('certification-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCertificationPopup();
    }
});

// Close certification popup when clicking close button
document.getElementById('close-cert-popup').addEventListener('click', closeCertificationPopup);