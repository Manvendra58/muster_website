/**
 * scr.js
 *
 * This file contains the main JavaScript functionalities for the Muster Consultants website.
 * It handles:
 * 1. Mobile navigation toggle (hamburger menu).
 * 2. Global message display system.
 * 3. Highlighting the active link in the navigation bar.
 * 4. Form submissions for Callback, Contact, Need Help pages, and now Partnerships.
 * 5. Job search functionality for the Job Seeker page (client-side simulation).
 * 6. Admin Panel functionalities:
 * - Simple password-based login.
 * - CRUD operations (Create, Read, Update, Delete) for job listings, simulated using localStorage.
 * - Logout.
 *
 * NOTE: For a production environment, all form submissions and admin panel data
 * management (job listings) should be handled via a secure backend server and a
 * robust database (e.g., Firestore, as mentioned in guidelines, or a custom API).
 * The current implementation uses localStorage purely for front-end demonstration
 * purposes and is NOT secure or scalable for real-world data persistence.
 */

// --- Global Utility Functions ---

/**
 * Displays a global message box at the top of the screen.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' or 'error' to determine background color.
 * @param {number} duration - How long the message should be visible in milliseconds.
 */
function showGlobalMessage(message, type = 'success', duration = 3000) {
    const messageBox = document.getElementById('globalMessageBox');
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = 'global-message-box'; // Reset classes
    messageBox.classList.add('show');

    if (type === 'error') {
        messageBox.style.backgroundColor = '#DC3545'; // Bootstrap Danger Red
    } else {
        messageBox.style.backgroundColor = '#28A745'; // Bootstrap Success Green
    }

    // Force reflow to ensure transition plays
    void messageBox.offsetWidth;

    messageBox.style.opacity = '1';
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 500); // Wait for fade-out transition
    }, duration);
}

// --- Enhanced Mobile Navigation Functionality ---

/**
 * Handles the mobile navigation toggle (hamburger menu) with enhanced features.
 */
function setupMobileNavToggle() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileServicesToggle = document.getElementById('mobile-services-toggle');
    const mobileServicesDropdown = document.getElementById('mobile-services-dropdown');
    const mobileServicesCaret = document.getElementById('mobile-services-caret');

    function openMobileMenu() {
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Add focus trap for accessibility
            const firstFocusableElement = mobileMenu.querySelector('a, button');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }
    }

    function closeMobileMenu() {
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.add('-translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Return focus to menu toggle button
            if (mobileMenuToggle) mobileMenuToggle.focus();
        }
    }

    // Event listeners for mobile menu
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Enhanced SERVICES dropdown in mobile menu
    if (mobileServicesToggle && mobileServicesDropdown && mobileServicesCaret) {
        mobileServicesToggle.addEventListener('click', function() {
            const isOpen = mobileServicesDropdown.classList.contains('open');
            if (isOpen) {
                mobileServicesDropdown.classList.remove('open');
                mobileServicesCaret.classList.remove('rotate-180');
            } else {
                mobileServicesDropdown.classList.add('open');
                mobileServicesCaret.classList.add('rotate-180');
            }
        });
    }

    // Close mobile menu when clicking on a link
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('-translate-x-full')) {
            closeMobileMenu();
        }
    });

    // Touch gesture support for mobile menu
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe right to open menu (only if menu is closed and swipe starts from left edge)
        if (swipeDistance > swipeThreshold && touchStartX < 50 && mobileMenu && mobileMenu.classList.contains('-translate-x-full')) {
            openMobileMenu();
        }
        
        // Swipe left to close menu (only if menu is open)
        if (swipeDistance < -swipeThreshold && mobileMenu && !mobileMenu.classList.contains('-translate-x-full')) {
            closeMobileMenu();
        }
    }

    // Enhanced responsive behavior
    function handleResize() {
        const width = window.innerWidth;
        
        // Adjust mobile menu width based on screen size
        if (mobileMenu) {
            if (width < 480) {
                mobileMenu.style.width = '100%';
                mobileMenu.style.maxWidth = '100%';
            } else {
                mobileMenu.style.width = '320px';
                mobileMenu.style.maxWidth = '320px';
            }
        }
    }

    // Initial call and event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Legacy support for old hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links ul');
    const dropdownArrows = document.querySelectorAll('.dropdown .arrow-down');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close nav when a link is clicked
        navLinks.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Toggle dropdowns on click in mobile
        dropdownArrows.forEach(arrow => {
            arrow.parentElement.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown-content')) {
                    e.preventDefault();
                    const dropdownContent = arrow.parentElement.nextElementSibling;
                    if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                        dropdownContent.classList.toggle('show-mobile');
                        arrow.classList.toggle('rotate');
                    }
                }
            });
        });
    }
}

/**
 * Highlights the active navigation link based on the current page URL.
 */
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links ul li a');

    navLinks.forEach(link => {
        // Handle dropdown links by checking if their parent is a dropdown
        if (link.closest('.dropdown-content')) {
            // For dropdown items, match their href exactly
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
                // Also add active to the parent dropdown link if a sub-link is active
                link.closest('.dropdown').querySelector('a').classList.add('active');
            }
        } else {
            // For top-level links, match the href or check if it's the home page
            if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'home.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active'); // Ensure other links are not active
            }
        }
    });

    // Special handling for the "Request a Callback" button in nav-cta
    const navCtaBtn = document.querySelector('.nav-cta .btn');
    if (navCtaBtn && navCtaBtn.getAttribute('href') === currentPath) {
        navCtaBtn.classList.add('active');
    }
}


// --- Form Submission Handlers ---

/**
 * Handles generic form submission.
 * @param {HTMLFormElement} form - The form element.
 * @param {string} successMessage - Message to show on successful submission.
 * @param {string} errorMessage - Message to show on error.
 * @param {function} callback - Optional callback function to run on success.
 */
function handleFormSubmission(form, successMessage, errorMessage, callback = null) {
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Simulate API call delay
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real application, you would send data to a backend here.
            // Example: const response = await fetch('/api/submit', { method: 'POST', body: new FormData(form) });
            // const result = await response.json();

            // For now, simulate success
            showGlobalMessage(successMessage, 'success');
            form.reset(); // Clear form fields
            if (callback) callback(); // Run optional callback
        } catch (error) {
            console.error('Form submission error:', error);
            showGlobalMessage(errorMessage, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// --- Admin Panel Specific Functionality ---

const ADMIN_PASSWORD = 'admin'; // VERY INSECURE: Hardcoded password for demonstration!
const LOCAL_STORAGE_JOBS_KEY = 'musterConsultantsJobs';

/**
 * Simulates fetching job listings from localStorage.
 * @returns {Array} An array of job listing objects.
 */
function getJobsFromLocalStorage() {
    try {
        const jobs = localStorage.getItem(LOCAL_STORAGE_JOBS_KEY);
        return jobs ? JSON.parse(jobs) : [];
    } catch (e) {
        console.error("Error parsing jobs from localStorage:", e);
        return [];
    }
}

/**
 * Simulates saving job listings to localStorage.
 * @param {Array} jobs - An array of job listing objects.
 */
function saveJobsToLocalStorage(jobs) {
    try {
        localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(jobs));
    } catch (e) {
        console.error("Error saving jobs to localStorage:", e);
        showGlobalMessage("Failed to save data. Storage might be full.", "error");
    }
}

/**
 * Renders job listings in the admin panel.
 */
function renderAdminJobListings() {
    const jobListingsContainer = document.getElementById('adminJobListings');
    if (!jobListingsContainer) return;

    const jobs = getJobsFromLocalStorage();

    if (jobs.length === 0) {
        jobListingsContainer.innerHTML = '<p class="text-center py-4">No job listings found. Add a new job above!</p>';
        return;
    }

    jobListingsContainer.innerHTML = `
        <ul class="admin-list">
            ${jobs.map(job => `
                <li data-job-id="${job.id}">
                    <div>
                        <strong>${job.title}</strong><br>
                        <span>${job.company} - ${job.location}</span>
                    </div>
                    <div class="actions">
                        <button class="edit-btn" aria-label="Edit Job" title="Edit Job"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" aria-label="Delete Job" title="Delete Job"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;

    // Add event listeners for edit and delete buttons
    jobListingsContainer.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.closest('li').dataset.jobId;
            editJob(jobId);
        });
    });

    jobListingsContainer.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = e.currentTarget.closest('li').dataset.jobId;
            // Instead of confirm(), use a custom modal for confirmation if needed.
            // For this example, we'll proceed directly.
            deleteJob(jobId);
        });
    });
}

/**
 * Handles the Add/Edit Job Form submission.
 */
function setupJobPostForm() {
    const jobPostForm = document.getElementById('jobPostForm');
    const jobIdInput = document.getElementById('jobId');
    const jobTitleInput = document.getElementById('jobTitle');
    const jobCompanyInput = document.getElementById('jobCompany');
    const jobLocationInput = document.getElementById('jobLocation');
    const jobDescriptionTextarea = document.getElementById('jobDescription');
    const jobPostedDateInput = document.getElementById('jobPostedDate');
    const jobFormSubmitBtn = document.getElementById('jobFormSubmitBtn');
    const jobFormClearBtn = document.getElementById('jobFormClearBtn');
    const jobFormMessage = document.getElementById('jobFormMessage');

    if (!jobPostForm) return;

    jobPostForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const jobs = getJobsFromLocalStorage();
        const isEditing = jobIdInput.value !== '';
        let message = '';

        const newJob = {
            id: isEditing ? jobIdInput.value : Date.now().toString(), // Simple unique ID
            title: jobTitleInput.value.trim(),
            company: jobCompanyInput.value.trim(),
            location: jobLocationInput.value.trim(),
            description: jobDescriptionTextarea.value.trim(),
            postedDate: jobPostedDateInput.value || new Date().toISOString().slice(0, 10) // Default to today if not set
        };

        if (isEditing) {
            const index = jobs.findIndex(job => job.id === newJob.id);
            if (index !== -1) {
                jobs[index] = newJob;
                message = 'Job listing updated successfully!';
            } else {
                message = 'Error: Job not found for update.';
                showGlobalMessage(message, 'error');
                return;
            }
        } else {
            jobs.push(newJob);
            message = 'Job listing added successfully!';
        }

        saveJobsToLocalStorage(jobs);
        showGlobalMessage(message, 'success');
        jobPostForm.reset(); // Clear form
        jobIdInput.value = ''; // Clear ID for next new job
        jobFormSubmitBtn.textContent = 'Post Job';
        jobFormClearBtn.style.display = 'none';
        renderAdminJobListings(); // Re-render the list
    });

    jobFormClearBtn.addEventListener('click', () => {
        jobPostForm.reset();
        jobIdInput.value = '';
        jobFormSubmitBtn.textContent = 'Post Job';
        jobFormClearBtn.style.display = 'none';
        showGlobalMessage('Form cleared.', 'success');
    });
}

/**
 * Populates the job form with data for editing.
 * @param {string} jobId - The ID of the job to edit.
 */
function editJob(jobId) {
    const jobs = getJobsFromLocalStorage();
    const jobToEdit = jobs.find(job => job.id === jobId);

    if (jobToEdit) {
        document.getElementById('jobId').value = jobToEdit.id;
        document.getElementById('jobTitle').value = jobToEdit.title;
        document.getElementById('jobCompany').value = jobToEdit.company;
        document.getElementById('jobLocation').value = jobToEdit.location;
        document.getElementById('jobDescription').value = jobToEdit.description;
        document.getElementById('jobPostedDate').value = jobToEdit.postedDate;

        document.getElementById('jobFormSubmitBtn').textContent = 'Update Job';
        document.getElementById('jobFormClearBtn').style.display = 'inline-block';
        showGlobalMessage(`Editing job: "${jobToEdit.title}"`, 'success', 2000);
    } else {
        showGlobalMessage('Job not found for editing.', 'error');
    }
}

/**
 * Deletes a job listing.
 * @param {string} jobId - The ID of the job to delete.
 */
function deleteJob(jobId) {
    let jobs = getJobsFromLocalStorage();
    const originalLength = jobs.length;
    jobs = jobs.filter(job => job.id !== jobId);

    if (jobs.length < originalLength) {
        saveJobsToLocalStorage(jobs);
        renderAdminJobListings();
        showGlobalMessage('Job listing deleted successfully!', 'success');
    } else {
        showGlobalMessage('Error: Job not found for deletion.', 'error');
    }
}

/**
 * Handles admin login.
 */
function setupAdminLogin() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginMessage = document.getElementById('loginMessage');
    const adminLoginSection = document.getElementById('admin-login-section');
    const jobManagementSection = document.getElementById('job-management-section');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Check session on page load
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        if (adminLoginSection && jobManagementSection) {
            adminLoginSection.style.display = 'none';
            jobManagementSection.style.display = 'block';
            renderAdminJobListings();
        }
    } else {
        if (adminLoginSection) adminLoginSection.style.display = 'block';
        if (jobManagementSection) jobManagementSection.style.display = 'none';
    }


    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminPasswordInput.value === ADMIN_PASSWORD) {
                localStorage.setItem('adminLoggedIn', 'true');
                if (adminLoginSection && jobManagementSection) {
                    adminLoginSection.style.display = 'none';
                    jobManagementSection.style.display = 'block';
                    renderAdminJobListings();
                    showGlobalMessage('Logged in successfully!', 'success');
                }
            } else {
                loginMessage.textContent = 'Invalid password. Please try again.';
                loginMessage.style.color = '#DC3545';
                loginMessage.style.display = 'block';
                showGlobalMessage('Login failed.', 'error');
            }
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            if (adminLoginSection && jobManagementSection) {
                adminLoginSection.style.display = 'block';
                jobManagementSection.style.display = 'none';
                adminPasswordInput.value = ''; // Clear password field
                if (loginMessage) {
                    loginMessage.style.display = 'none';
                }
                showGlobalMessage('Logged out successfully!', 'success');
            }
        });
    }
}

// --- Page Specific Initializations ---

/**
 * Initializes functionality specific to the home.html page.
 */
function initHomePage() {
    // No specific dynamic elements mentioned for home page yet, beyond global ones.
    // If you add sliders, carousels, or interactive elements, their initialization
    // would go here.
}

/**
 * Initializes functionality specific to the about.html page.
 */
function initAboutPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the our_team.html page.
 */
function initOurTeamPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the client_success_stories.html page.
 */
function initClientSuccessStoriesPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the blog.html page.
 */
function initBlogPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the partnerships.html page.
 */
function initPartnershipsPage() {
    const partnershipInquiryForm = document.getElementById('partnershipInquiryForm');
    handleFormSubmission(
        partnershipInquiryForm,
        'Your partnership inquiry has been sent! We will review it and get back to you shortly.',
        'There was an issue sending your inquiry. Please try again.'
    );
}

/**
 * Initializes functionality specific to the career_opportunities.html page.
 */
function initCareerOpportunitiesPage() {
    // No specific dynamic elements yet.
}

/**
 * Initializes functionality specific to the callback.html page.
 */
function initCallbackPage() {
    const callbackForm = document.getElementById('callbackForm');
    handleFormSubmission(
        callbackForm,
        'Your callback request has been sent! We will contact you soon.',
        'There was an issue sending your request. Please try again.'
    );
}

/**
 * Initializes functionality specific to the company-news.html page.
 */
function initCompanyNewsPage() {
    // You might load jobs/news dynamically here from a source if needed.
    // For now, content is static HTML.
}

/**
 * Initializes functionality specific to the contact.html page.
 */
function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    handleFormSubmission(
        contactForm,
        'Your message has been sent successfully! We will get back to you shortly.',
        'There was an issue sending your message. Please try again.'
    );
}

/**
 * Initializes functionality specific to the need_help.html page.
 */
function initNeedHelpPage() {
    const helpForm = document.getElementById('helpForm');
    handleFormSubmission(
        helpForm,
        'Your query has been submitted! Our support team will review it and get back to you.',
        'There was an issue submitting your query. Please try again.'
    );
}

/**
 * Initializes functionality specific to the seeker.html page.
 */
function initJobSeekerPage() {
    const jobSearchForm = document.getElementById('jobSearchForm');

    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keywords = document.getElementById('keywords').value.trim();
            const location = document.getElementById('location').value.trim();
            const industry = document.getElementById('industry').value;

            // In a real application, you would send these search parameters
            // to a backend API to fetch filtered job listings.
            console.log('Job Search Submitted:', { keywords, location, industry });
            showGlobalMessage('Searching for jobs (simulated)...', 'success', 2000);

            // You might redirect to a job results page or dynamically update results here.
            // For now, this is a client-side simulation.
        });
    }
}

/**
 * Initializes functionality specific to the admin.html page.
 */
function initAdminPage() {
    setupAdminLogin();
    setupJobPostForm();
    // renderAdminJobListings will be called by setupAdminLogin if already logged in
    // or after successful login.
}

/**
 * Initializes functionality specific to the services.html page.
 */
function initServicesPage() {
    // No specific dynamic elements yet.
    // If you add dynamic content loading or interactive elements, their initialization
    // would go here.
}

// --- CV Upload Floating Icon and Modal Functionality ---

/**
 * Sets up the CV upload floating icon that opens Google Form
 */
function setupCVUploadIcon() {
    // Create the floating CV upload icon
    const cvUploadIcon = document.createElement('div');
    cvUploadIcon.className = 'cv-upload-icon';
    cvUploadIcon.innerHTML = '<i class="fas fa-file-upload"></i>';
    cvUploadIcon.title = 'Upload Your CV - Apply Now';
    document.body.appendChild(cvUploadIcon);

    // Event listener to open Google Form in new tab
    cvUploadIcon.addEventListener('click', function() {
        // Google Form URL for CV upload
        const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdUD-xRnH5CD3VoMmrXdMQPr7rcki4Pj9A_vXi2HJKME5jCBw/viewform?usp=header';
        
        // Open Google Form in new tab
        window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
        
        // Optional: Show a brief message that form is opening
        showGlobalMessage('Opening CV upload form...', 'success', 1500);
    });
}

// Initialize CV upload functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupCVUploadIcon();
});


// --- Main Entry Point: DOMContentLoaded ---
// Enhanced JavaScript for Muster Consultants Website
// Responsive features and performance optimizations

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animated-section-heading, .animated-paragraph, .animated-grid-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileServicesToggle = document.getElementById('mobile-services-toggle');
    const mobileServicesDropdown = document.getElementById('mobile-services-dropdown');
    const mobileServicesCaret = document.getElementById('mobile-services-caret');

    function openMobileMenu() {
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenuOverlay.classList.remove('hidden');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add focus trap for accessibility
        const firstFocusableElement = mobileMenu.querySelector('a, button');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenuOverlay.classList.add('hidden');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to menu toggle button
        mobileMenuToggle.focus();
    }

    // Event listeners for mobile menu
    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Enhanced SERVICES dropdown in mobile menu
    if (mobileServicesToggle && mobileServicesDropdown && mobileServicesCaret) {
        mobileServicesToggle.addEventListener('click', function() {
            const isOpen = mobileServicesDropdown.classList.contains('open');
            if (isOpen) {
                mobileServicesDropdown.classList.remove('open');
                mobileServicesCaret.classList.remove('rotate-180');
            } else {
                mobileServicesDropdown.classList.add('open');
                mobileServicesCaret.classList.add('rotate-180');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('-translate-x-full')) {
            closeMobileMenu();
        }
    });

    // Touch gesture support for mobile menu
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Swipe right to open menu (only if menu is closed and swipe starts from left edge)
        if (swipeDistance > swipeThreshold && touchStartX < 50 && mobileMenu && mobileMenu.classList.contains('-translate-x-full')) {
            openMobileMenu();
        }
        
        // Swipe left to close menu (only if menu is open)
        if (swipeDistance < -swipeThreshold && mobileMenu && !mobileMenu.classList.contains('-translate-x-full')) {
            closeMobileMenu();
        }
    }

    // Enhanced dropdown menu functionality
    document.querySelectorAll('.group').forEach(function(group) {
        const dropdown = group.querySelector('div.absolute');
        const trigger = group.querySelector('a.inline-flex');
        
        if (!dropdown || !trigger) return;
        
        let closeTimeout;
        
        function openMenu() {
            dropdown.classList.add('group-hover:opacity-100', 'group-hover:visible');
            dropdown.classList.remove('opacity-0', 'invisible');
            clearTimeout(closeTimeout);
        }
        
        function closeMenu() {
            closeTimeout = setTimeout(function() {
                dropdown.classList.remove('group-hover:opacity-100', 'group-hover:visible');
                dropdown.classList.add('opacity-0', 'invisible');
            }, 150);
        }
        
        group.addEventListener('mouseenter', openMenu);
        group.addEventListener('mouseleave', closeMenu);
        dropdown.addEventListener('mouseenter', openMenu);
        dropdown.addEventListener('mouseleave', closeMenu);
        trigger.addEventListener('focus', openMenu);
        trigger.addEventListener('blur', closeMenu);
    });

    // Enhanced responsive features
    function setupResponsiveFeatures() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.animated-section-heading, .animated-paragraph, .animated-grid-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Enhanced logo slider performance
        const logoSlider = document.querySelector('.logo-slider');
        if (logoSlider) {
            // Pause animation on hover for better UX
            logoSlider.addEventListener('mouseenter', function() {
                this.style.animationPlayState = 'paused';
            });
            
            logoSlider.addEventListener('mouseleave', function() {
                this.style.animationPlayState = 'running';
            });
        }

        // Performance optimization: Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Enhanced scroll performance
        let ticking = false;
        
        function updateScroll() {
            // Add scroll-based animations or effects here
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    // Enhanced accessibility features
    function setupAccessibility() {
        // Add skip link for accessibility
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-color text-white px-4 py-2 rounded z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID
        const mainContent = document.querySelector('.hero-banner');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.tabIndex = '-1';
        }

        // Enhanced keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Skip to main content
            if (e.key === 'Tab' && e.altKey) {
                e.preventDefault();
                const mainContent = document.querySelector('main') || document.querySelector('.hero-banner');
                if (mainContent) {
                    mainContent.focus();
                }
            }
        });

        // Focus styles for better accessibility
        // Remove this block to prevent programmatic focus outlines on nav links/buttons
        // document.querySelectorAll('.cta-button, .nav-link, .footer-link').forEach(el => {
        //     el.addEventListener('focus', function() {
        //         this.style.outline = '2px solid var(--primary-color)';
        //         this.style.outlineOffset = '2px';
        //     });
        //     el.addEventListener('blur', function() {
        //         this.style.outline = '';
        //         this.style.outlineOffset = '';
        //     });
        // });
    }

    // Enhanced form handling
    function setupEnhancedForms() {
        const subscribeForm = document.querySelector('.footer-subscribe-input');
        const subscribeButton = document.querySelector('.footer-subscribe-button');
        
        if (subscribeForm && subscribeButton) {
            subscribeButton.addEventListener('click', async function(e) {
                e.preventDefault();
                const email = subscribeForm.value.trim();
                
                if (!email) {
                    showGlobalMessage('Please enter your email address', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showGlobalMessage('Please enter a valid email address', 'error');
                    return;
                }
                
                subscribeButton.disabled = true;
                try {
                    // Firestore subscription logic
                    import('./firebase.js').then(({ db, collection, addDoc }) => {
                        addDoc(collection(db, "subscriptions"), { email, created: new Date() })
                            .then(() => {
                                subscribeForm.value = '';
                                showGlobalMessage('Thank you for subscribing!', 'success');
                            })
                            .catch(err => {
                                showGlobalMessage('There was an error subscribing: ' + err.message, 'error');
                            })
                            .finally(() => {
                                subscribeButton.disabled = false;
                            });
                    });
                } catch (err) {
                    showGlobalMessage('There was an error subscribing.', 'error');
                    subscribeButton.disabled = false;
                }
            });
        }

        // Add loading states for better UX
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', function() {
                if (this.href && !this.href.startsWith('#')) {
                    this.classList.add('loading');
                }
            });
        });

        // Remove loading state when page loads
        window.addEventListener('load', function() {
            document.querySelectorAll('.loading').forEach(el => {
                el.classList.remove('loading');
            });
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Initialize all enhanced features
    setupResponsiveFeatures();
    setupAccessibility();
    setupEnhancedForms();

    // Performance optimization: Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Enhanced scroll performance
    let ticking = false;
    
    function updateScroll() {
        // Add scroll-based animations or effects here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);

    // Form validation and enhancement
    const subscribeForm = document.querySelector('.footer-subscribe-input');
    const subscribeButton = document.querySelector('.footer-subscribe-button');
    
    if (subscribeForm && subscribeButton) {
        subscribeButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const email = subscribeForm.value.trim();
            
            if (!email) {
                showGlobalMessage('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showGlobalMessage('Please enter a valid email address', 'error');
                return;
            }
            
            subscribeButton.disabled = true;
            try {
                // Firestore subscription logic
                import('./firebase.js').then(({ db, collection, addDoc }) => {
                    addDoc(collection(db, "subscriptions"), { email, created: new Date() })
                        .then(() => {
                            subscribeForm.value = '';
                            showGlobalMessage('Thank you for subscribing!', 'success');
                        })
                        .catch(err => {
                            showGlobalMessage('There was an error subscribing: ' + err.message, 'error');
                        })
                        .finally(() => {
                            subscribeButton.disabled = false;
                        });
                });
            } catch (err) {
                showGlobalMessage('There was an error subscribing.', 'error');
                subscribeButton.disabled = false;
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Enhanced accessibility
    document.addEventListener('keydown', function(e) {
        // Skip to main content
        if (e.key === 'Tab' && e.altKey) {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('.hero-banner');
            if (mainContent) {
                mainContent.focus();
            }
        }
    });

    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-color text-white px-4 py-2 rounded z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const mainContent = document.querySelector('.hero-banner');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.tabIndex = '-1';
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData && perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                    console.warn('Page load time is slow. Consider optimizing images and scripts.');
                }
            }, 0);
        });
    }

    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Enhanced logo slider performance
    const logoSlider = document.querySelector('.logo-slider');
    if (logoSlider) {
        // Pause animation on hover for better UX
        logoSlider.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        logoSlider.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }

    // Add loading states for better UX
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function() {
            if (this.href && !this.href.startsWith('#')) {
                this.classList.add('loading');
            }
        });
    });

    // Remove loading state when page loads
    window.addEventListener('load', function() {
        document.querySelectorAll('.loading').forEach(el => {
            el.classList.remove('loading');
        });
    });

    // Enhanced responsive behavior
    function handleResize() {
        const width = window.innerWidth;
        
        // Adjust mobile menu width based on screen size
        if (mobileMenu) {
            if (width < 480) {
                mobileMenu.style.width = '100%';
                mobileMenu.style.maxWidth = '100%';
            } else {
                mobileMenu.style.width = '320px';
                mobileMenu.style.maxWidth = '320px';
            }
        }
    }

    // Initial call and event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup function for memory management
    window.addEventListener('beforeunload', function() {
        // Clean up any event listeners or timers if needed
        if (observer) observer.disconnect();
    });

});

// Export functions for potential external use
window.MusterConsultants = {
    openMobileMenu: function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    closeMobileMenu: function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        if (mobileMenu && mobileMenuOverlay) {
            mobileMenu.classList.add('-translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};
