// Kyanos Launch Site JavaScript
// Progressive form handling, state/district data, city suggestions

document.addEventListener('DOMContentLoaded', function() {
    initSignupTabs();
    initWebsiteCheck();
    initCampaignForm();
    initAgencyForm();
    initMobileMenu();
    initSmoothScroll();
});

// ============================================
// SIGNUP TABS
// ============================================

function initSignupTabs() {
    const tabs = document.querySelectorAll('.signup-tab');
    const tabContents = document.querySelectorAll('.signup-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;

            // Update tab buttons
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ============================================
// WEBSITE CHECK / CMS DETECTION
// ============================================

function initWebsiteCheck() {
    const checkBtn = document.getElementById('check-website-btn');
    const websiteInput = document.getElementById('campaign-website');
    const cmsDetection = document.getElementById('cms-detection');
    const cmsChecking = document.getElementById('cms-checking');
    const cmsResult = document.getElementById('cms-result');
    const cmsError = document.getElementById('cms-error');
    const cmsName = document.getElementById('cms-name');
    const detectedCmsInput = document.getElementById('detected-cms');
    const cmsManual = document.getElementById('cms-manual');

    if (!checkBtn) return;

    checkBtn.addEventListener('click', async () => {
        const url = websiteInput.value.trim();

        if (!url) {
            alert('Please enter a website URL first.');
            return;
        }

        // Ensure URL has protocol
        let checkUrl = url;
        if (!checkUrl.startsWith('http://') && !checkUrl.startsWith('https://')) {
            checkUrl = 'https://' + checkUrl;
            websiteInput.value = checkUrl;
        }

        // Show checking state
        cmsDetection.classList.remove('hidden');
        cmsChecking.classList.remove('hidden');
        cmsResult.classList.add('hidden');
        cmsError.classList.add('hidden');
        checkBtn.disabled = true;
        checkBtn.textContent = 'Checking...';

        // Set up a timeout to cancel if it takes too long
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('timeout')), 8000);
        });

        try {
            const detected = await Promise.race([
                detectCMS(checkUrl),
                timeoutPromise
            ]);

            cmsChecking.classList.add('hidden');
            cmsResult.classList.remove('hidden');
            cmsName.textContent = detected.name;
            detectedCmsInput.value = detected.id;

            // Set up confirmation radio handlers
            setupCmsConfirmation(detected.id);

        } catch (error) {
            cmsChecking.classList.add('hidden');

            // Show timeout-friendly message and let them select manually
            if (error.message === 'timeout') {
                showManualCMSSelection('Check timed out. Please select your CMS:');
            } else {
                showManualCMSSelection('Could not check website. Please select your CMS:');
            }
            console.error('Website check failed:', error);
        }

        checkBtn.disabled = false;
        checkBtn.textContent = 'Check Site';
    });

    function showManualCMSSelection(message) {
        cmsResult.classList.remove('hidden');
        cmsName.textContent = 'Could not detect';
        document.getElementById('detected-cms').value = 'detection-failed';

        // Show manual selection immediately
        cmsManual.classList.remove('hidden');
        cmsManual.querySelector('label').textContent = message;

        // Hide the confirmation radios since we're going straight to manual
        const confirmDiv = cmsResult.querySelector('.cms-confirm');
        if (confirmDiv) {
            confirmDiv.style.display = 'none';
        }

        setupCmsConfirmation('unknown');
    }
}

async function detectCMS(url) {
    // Use a CORS proxy or server-side endpoint in production
    // For now, we'll use a simple approach that works for demo

    // In production, this would call your backend:
    // const response = await fetch('/api/detect-cms?url=' + encodeURIComponent(url));
    // return response.json();

    // For demo/client-side, we'll try to detect via common patterns
    // Note: This will be limited by CORS - a real implementation needs server-side

    try {
        // Try to fetch via a CORS proxy (for demo purposes)
        // In production, use your own backend
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, {
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        const html = await response.text();
        return identifyCMS(html, url);

    } catch (error) {
        // If fetch fails, try basic URL pattern detection
        return detectCMSFromURL(url);
    }
}

function identifyCMS(html, url) {
    const htmlLower = html.toLowerCase();

    // WordPress
    if (htmlLower.includes('wp-content') ||
        htmlLower.includes('wp-includes') ||
        htmlLower.includes('wordpress') ||
        html.includes('generator" content="WordPress')) {
        return { id: 'wordpress', name: 'WordPress' };
    }

    // Squarespace
    if (htmlLower.includes('squarespace') ||
        htmlLower.includes('static.squarespace.com')) {
        return { id: 'squarespace', name: 'Squarespace' };
    }

    // Wix
    if (htmlLower.includes('wix.com') ||
        htmlLower.includes('wixsite.com') ||
        htmlLower.includes('_wix_browser_sess')) {
        return { id: 'wix', name: 'Wix' };
    }

    // NationBuilder
    if (htmlLower.includes('nationbuilder') ||
        htmlLower.includes('nbcdn.net') ||
        htmlLower.includes('nationbuilder.com')) {
        return { id: 'nationbuilder', name: 'NationBuilder' };
    }

    // Webflow
    if (htmlLower.includes('webflow') ||
        htmlLower.includes('.webflow.io')) {
        return { id: 'webflow', name: 'Webflow' };
    }

    // Shopify (occasionally used)
    if (htmlLower.includes('shopify') ||
        htmlLower.includes('cdn.shopify.com')) {
        return { id: 'shopify', name: 'Shopify' };
    }

    // Weebly
    if (htmlLower.includes('weebly.com') ||
        htmlLower.includes('weeblycloud.com')) {
        return { id: 'weebly', name: 'Weebly' };
    }

    // GoDaddy Website Builder
    if (htmlLower.includes('godaddy') ||
        htmlLower.includes('secureserver.net')) {
        return { id: 'godaddy', name: 'GoDaddy Website Builder' };
    }

    return { id: 'unknown', name: 'Unknown / Custom' };
}

function detectCMSFromURL(url) {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('.squarespace.com') || urlLower.includes('sqsp.com')) {
        return { id: 'squarespace', name: 'Squarespace' };
    }
    if (urlLower.includes('.wixsite.com') || urlLower.includes('.wix.com')) {
        return { id: 'wix', name: 'Wix' };
    }
    if (urlLower.includes('.nationbuilder.com')) {
        return { id: 'nationbuilder', name: 'NationBuilder' };
    }
    if (urlLower.includes('.webflow.io')) {
        return { id: 'webflow', name: 'Webflow' };
    }
    if (urlLower.includes('.weebly.com')) {
        return { id: 'weebly', name: 'Weebly' };
    }

    // Can't determine from URL alone
    return { id: 'unknown', name: 'Could not detect' };
}

function setupCmsConfirmation(detectedId) {
    const radios = document.querySelectorAll('input[name="cms_confirmed"]');
    const cmsManual = document.getElementById('cms-manual');
    const manualSelect = document.getElementById('cms-manual-select');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'incorrect') {
                cmsManual.classList.remove('hidden');
            } else {
                cmsManual.classList.add('hidden');
                if (radio.value === 'correct') {
                    // Keep the detected value
                } else if (radio.value === 'unknown') {
                    document.getElementById('detected-cms').value = 'user-unknown';
                }
            }
        });
    });

    if (manualSelect) {
        manualSelect.addEventListener('change', () => {
            document.getElementById('detected-cms').value = manualSelect.value;

            // Show/hide the "Other" text input
            const otherInput = document.getElementById('cms-other-input');
            if (otherInput) {
                if (manualSelect.value === 'other') {
                    otherInput.classList.remove('hidden');
                    otherInput.querySelector('input').focus();
                } else {
                    otherInput.classList.add('hidden');
                }
            }
        });
    }
}

// ============================================
// STATE AND DISTRICT DATA
// ============================================

const STATES = [
    { code: 'AL', name: 'Alabama', districts: 7 },
    { code: 'AK', name: 'Alaska', districts: 1 },
    { code: 'AZ', name: 'Arizona', districts: 9 },
    { code: 'AR', name: 'Arkansas', districts: 4 },
    { code: 'CA', name: 'California', districts: 52 },
    { code: 'CO', name: 'Colorado', districts: 8 },
    { code: 'CT', name: 'Connecticut', districts: 5 },
    { code: 'DE', name: 'Delaware', districts: 1 },
    { code: 'FL', name: 'Florida', districts: 28 },
    { code: 'GA', name: 'Georgia', districts: 14 },
    { code: 'HI', name: 'Hawaii', districts: 2 },
    { code: 'ID', name: 'Idaho', districts: 2 },
    { code: 'IL', name: 'Illinois', districts: 17 },
    { code: 'IN', name: 'Indiana', districts: 9 },
    { code: 'IA', name: 'Iowa', districts: 4 },
    { code: 'KS', name: 'Kansas', districts: 4 },
    { code: 'KY', name: 'Kentucky', districts: 6 },
    { code: 'LA', name: 'Louisiana', districts: 6 },
    { code: 'ME', name: 'Maine', districts: 2 },
    { code: 'MD', name: 'Maryland', districts: 8 },
    { code: 'MA', name: 'Massachusetts', districts: 9 },
    { code: 'MI', name: 'Michigan', districts: 13 },
    { code: 'MN', name: 'Minnesota', districts: 8 },
    { code: 'MS', name: 'Mississippi', districts: 4 },
    { code: 'MO', name: 'Missouri', districts: 8 },
    { code: 'MT', name: 'Montana', districts: 2 },
    { code: 'NE', name: 'Nebraska', districts: 3 },
    { code: 'NV', name: 'Nevada', districts: 4 },
    { code: 'NH', name: 'New Hampshire', districts: 2 },
    { code: 'NJ', name: 'New Jersey', districts: 12 },
    { code: 'NM', name: 'New Mexico', districts: 3 },
    { code: 'NY', name: 'New York', districts: 26 },
    { code: 'NC', name: 'North Carolina', districts: 14 },
    { code: 'ND', name: 'North Dakota', districts: 1 },
    { code: 'OH', name: 'Ohio', districts: 15 },
    { code: 'OK', name: 'Oklahoma', districts: 5 },
    { code: 'OR', name: 'Oregon', districts: 6 },
    { code: 'PA', name: 'Pennsylvania', districts: 17 },
    { code: 'RI', name: 'Rhode Island', districts: 2 },
    { code: 'SC', name: 'South Carolina', districts: 7 },
    { code: 'SD', name: 'South Dakota', districts: 1 },
    { code: 'TN', name: 'Tennessee', districts: 9 },
    { code: 'TX', name: 'Texas', districts: 38 },
    { code: 'UT', name: 'Utah', districts: 4 },
    { code: 'VT', name: 'Vermont', districts: 1 },
    { code: 'VA', name: 'Virginia', districts: 11 },
    { code: 'WA', name: 'Washington', districts: 10 },
    { code: 'WV', name: 'West Virginia', districts: 2 },
    { code: 'WI', name: 'Wisconsin', districts: 8 },
    { code: 'WY', name: 'Wyoming', districts: 1 },
    { code: 'DC', name: 'Washington, D.C.', districts: 0 }
];

// Major cities by state for monitoring suggestions
const STATE_CITIES = {
    'AL': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'],
    'AK': ['Anchorage', 'Fairbanks', 'Juneau'],
    'AZ': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Tempe'],
    'AR': ['Little Rock', 'Fort Smith', 'Fayetteville'],
    'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno'],
    'CO': ['Denver', 'Colorado Springs', 'Aurora', 'Boulder', 'Fort Collins'],
    'CT': ['Hartford', 'New Haven', 'Bridgeport', 'Stamford'],
    'DE': ['Wilmington', 'Dover', 'Newark'],
    'FL': ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'West Palm Beach'],
    'GA': ['Atlanta', 'Augusta', 'Savannah', 'Columbus', 'Macon'],
    'HI': ['Honolulu', 'Hilo', 'Kailua'],
    'ID': ['Boise', 'Meridian', 'Nampa'],
    'IL': ['Chicago', 'Aurora', 'Rockford', 'Springfield', 'Naperville'],
    'IN': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'],
    'IA': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City'],
    'KS': ['Wichita', 'Kansas City', 'Topeka', 'Overland Park'],
    'KY': ['Louisville', 'Lexington', 'Bowling Green'],
    'LA': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'],
    'ME': ['Portland', 'Lewiston', 'Bangor'],
    'MD': ['Baltimore', 'Silver Spring', 'Bethesda', 'Rockville', 'Annapolis'],
    'MA': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
    'MI': ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Flint'],
    'MN': ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'],
    'MS': ['Jackson', 'Gulfport', 'Hattiesburg', 'Biloxi'],
    'MO': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
    'MT': ['Billings', 'Missoula', 'Great Falls', 'Helena'],
    'NE': ['Omaha', 'Lincoln', 'Bellevue'],
    'NV': ['Las Vegas', 'Reno', 'Henderson', 'North Las Vegas'],
    'NH': ['Manchester', 'Nashua', 'Concord'],
    'NJ': ['Newark', 'Jersey City', 'Trenton', 'Camden', 'Paterson'],
    'NM': ['Albuquerque', 'Santa Fe', 'Las Cruces'],
    'NY': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers'],
    'NC': ['Charlotte', 'Raleigh', 'Durham', 'Greensboro', 'Winston-Salem', 'Asheville'],
    'ND': ['Fargo', 'Bismarck', 'Grand Forks'],
    'OH': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'],
    'OK': ['Oklahoma City', 'Tulsa', 'Norman'],
    'OR': ['Portland', 'Salem', 'Eugene', 'Bend'],
    'PA': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Harrisburg', 'Scranton'],
    'RI': ['Providence', 'Warwick', 'Cranston'],
    'SC': ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
    'SD': ['Sioux Falls', 'Rapid City', 'Aberdeen'],
    'TN': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
    'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
    'UT': ['Salt Lake City', 'Provo', 'West Valley City', 'Ogden'],
    'VT': ['Burlington', 'Montpelier', 'Rutland'],
    'VA': ['Virginia Beach', 'Norfolk', 'Richmond', 'Arlington', 'Alexandria', 'Fairfax'],
    'WA': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Olympia'],
    'WV': ['Charleston', 'Huntington', 'Morgantown'],
    'WI': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha'],
    'WY': ['Cheyenne', 'Casper', 'Laramie'],
    'DC': ['Washington, D.C.']
};

// Race level to tier mapping
const RACE_TIERS = {
    'us-senate': 'full',
    'us-house': 'full',
    'governor': 'full',
    'statewide': 'full',
    'state-senate': 'core',
    'state-house': 'core',
    'mayor': 'limited',
    'county': 'limited',
    'city-council': 'limited',
    'school-board': 'limited',
    'other-local': 'limited'
};

// Jurisdiction field configuration by race type
const JURISDICTION_CONFIG = {
    'mayor': { label: 'City', placeholder: 'Start typing city name...', hint: 'Select your city or choose "Other" to enter manually.', dataType: 'cities' },
    'county': { label: 'County', placeholder: 'Start typing county name...', hint: 'Select your county or choose "Other" to enter manually.', dataType: 'counties' },
    'city-council': { label: 'City', placeholder: 'Start typing city name...', hint: 'Select your city or choose "Other" to enter manually.', dataType: 'cities' },
    'school-board': { label: 'School District', placeholder: 'Start typing district name...', hint: 'Select your district or choose "Other" to enter manually.', dataType: 'districts' },
    'other-local': { label: 'Jurisdiction', placeholder: 'Start typing or select Other...', hint: 'Select from suggestions or choose "Other" to enter manually.', dataType: 'cities' }
};

// Counties by state (major counties)
const STATE_COUNTIES = {
    'AL': ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Shelby', 'Baldwin', 'Tuscaloosa', 'Lee', 'Morgan', 'Calhoun'],
    'AK': ['Anchorage', 'Fairbanks North Star', 'Matanuska-Susitna', 'Kenai Peninsula', 'Juneau'],
    'AZ': ['Maricopa', 'Pima', 'Pinal', 'Yavapai', 'Yuma', 'Mohave', 'Coconino', 'Cochise'],
    'AR': ['Pulaski', 'Benton', 'Washington', 'Sebastian', 'Faulkner', 'Saline', 'Craighead', 'Garland'],
    'CA': ['Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino', 'Santa Clara', 'Alameda', 'Sacramento', 'Contra Costa', 'Fresno', 'San Francisco', 'Ventura', 'San Mateo', 'Kern', 'San Joaquin'],
    'CO': ['Denver', 'El Paso', 'Arapahoe', 'Jefferson', 'Adams', 'Larimer', 'Boulder', 'Douglas', 'Weld', 'Pueblo'],
    'CT': ['Fairfield', 'Hartford', 'New Haven', 'New London', 'Litchfield', 'Middlesex', 'Tolland', 'Windham'],
    'DE': ['New Castle', 'Sussex', 'Kent'],
    'FL': ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Pinellas', 'Duval', 'Lee', 'Polk', 'Brevard'],
    'GA': ['Fulton', 'Gwinnett', 'Cobb', 'DeKalb', 'Chatham', 'Cherokee', 'Clayton', 'Henry', 'Forsyth', 'Richmond'],
    'HI': ['Honolulu', 'Hawaii', 'Maui', 'Kauai'],
    'ID': ['Ada', 'Canyon', 'Kootenai', 'Bonneville', 'Twin Falls', 'Bannock'],
    'IL': ['Cook', 'DuPage', 'Lake', 'Will', 'Kane', 'McHenry', 'Winnebago', 'Madison', 'St. Clair', 'Champaign'],
    'IN': ['Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph', 'Elkhart', 'Tippecanoe', 'Vanderburgh', 'Porter', 'Hendricks'],
    'IA': ['Polk', 'Linn', 'Scott', 'Johnson', 'Black Hawk', 'Woodbury', 'Dubuque', 'Story', 'Dallas', 'Pottawattamie'],
    'KS': ['Johnson', 'Sedgwick', 'Shawnee', 'Wyandotte', 'Douglas', 'Leavenworth', 'Riley', 'Butler', 'Reno', 'Saline'],
    'KY': ['Jefferson', 'Fayette', 'Kenton', 'Boone', 'Warren', 'Hardin', 'Daviess', 'Campbell', 'Bullitt', 'Madison'],
    'LA': ['East Baton Rouge', 'Jefferson', 'Orleans', 'St. Tammany', 'Caddo', 'Calcasieu', 'Lafayette', 'Ouachita', 'Rapides', 'Bossier'],
    'ME': ['Cumberland', 'York', 'Penobscot', 'Kennebec', 'Androscoggin', 'Aroostook', 'Oxford', 'Hancock'],
    'MD': ['Montgomery', 'Prince George\'s', 'Baltimore County', 'Anne Arundel', 'Howard', 'Baltimore City', 'Harford', 'Frederick', 'Carroll', 'Charles'],
    'MA': ['Middlesex', 'Worcester', 'Essex', 'Suffolk', 'Norfolk', 'Bristol', 'Plymouth', 'Hampden', 'Barnstable', 'Hampshire'],
    'MI': ['Wayne', 'Oakland', 'Macomb', 'Kent', 'Genesee', 'Washtenaw', 'Ingham', 'Ottawa', 'Kalamazoo', 'Saginaw'],
    'MN': ['Hennepin', 'Ramsey', 'Dakota', 'Anoka', 'Washington', 'St. Louis', 'Olmsted', 'Scott', 'Wright', 'Carver'],
    'MS': ['Hinds', 'Harrison', 'DeSoto', 'Rankin', 'Jackson', 'Madison', 'Lee', 'Forrest', 'Lauderdale', 'Lowndes'],
    'MO': ['St. Louis County', 'Jackson', 'St. Charles', 'St. Louis City', 'Greene', 'Clay', 'Jefferson', 'Boone', 'Cass', 'Platte'],
    'MT': ['Yellowstone', 'Missoula', 'Gallatin', 'Flathead', 'Cascade', 'Lewis and Clark', 'Ravalli', 'Silver Bow'],
    'NE': ['Douglas', 'Lancaster', 'Sarpy', 'Hall', 'Buffalo', 'Lincoln', 'Scotts Bluff', 'Dakota'],
    'NV': ['Clark', 'Washoe', 'Carson City', 'Douglas', 'Elko', 'Lyon', 'Nye'],
    'NH': ['Hillsborough', 'Rockingham', 'Merrimack', 'Strafford', 'Grafton', 'Cheshire', 'Belknap', 'Carroll'],
    'NJ': ['Bergen', 'Middlesex', 'Essex', 'Hudson', 'Monmouth', 'Ocean', 'Union', 'Passaic', 'Camden', 'Morris'],
    'NM': ['Bernalillo', 'Doña Ana', 'Santa Fe', 'Sandoval', 'San Juan', 'Valencia', 'McKinley', 'Lea'],
    'NY': ['Kings', 'Queens', 'New York', 'Suffolk', 'Bronx', 'Nassau', 'Westchester', 'Erie', 'Monroe', 'Richmond'],
    'NC': ['Mecklenburg', 'Wake', 'Guilford', 'Forsyth', 'Cumberland', 'Durham', 'Buncombe', 'Gaston', 'New Hanover', 'Union'],
    'ND': ['Cass', 'Burleigh', 'Grand Forks', 'Ward', 'Williams', 'Stark', 'Morton', 'Stutsman'],
    'OH': ['Cuyahoga', 'Franklin', 'Hamilton', 'Summit', 'Montgomery', 'Lucas', 'Butler', 'Stark', 'Lorain', 'Mahoning'],
    'OK': ['Oklahoma', 'Tulsa', 'Cleveland', 'Canadian', 'Comanche', 'Rogers', 'Payne', 'Wagoner', 'Creek', 'Garfield'],
    'OR': ['Multnomah', 'Washington', 'Clackamas', 'Lane', 'Marion', 'Jackson', 'Deschutes', 'Linn', 'Douglas', 'Yamhill'],
    'PA': ['Philadelphia', 'Allegheny', 'Montgomery', 'Bucks', 'Delaware', 'Lancaster', 'Chester', 'York', 'Berks', 'Lehigh'],
    'RI': ['Providence', 'Kent', 'Washington', 'Newport', 'Bristol'],
    'SC': ['Greenville', 'Richland', 'Charleston', 'Horry', 'Spartanburg', 'Lexington', 'York', 'Berkeley', 'Anderson', 'Beaufort'],
    'SD': ['Minnehaha', 'Pennington', 'Lincoln', 'Brown', 'Brookings', 'Codington', 'Meade', 'Lawrence'],
    'TN': ['Shelby', 'Davidson', 'Knox', 'Hamilton', 'Rutherford', 'Williamson', 'Sumner', 'Montgomery', 'Wilson', 'Blount'],
    'TX': ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Collin', 'Hidalgo', 'El Paso', 'Denton', 'Fort Bend', 'Montgomery', 'Williamson', 'Cameron', 'Nueces', 'Bell'],
    'UT': ['Salt Lake', 'Utah', 'Davis', 'Weber', 'Washington', 'Cache', 'Tooele', 'Box Elder'],
    'VT': ['Chittenden', 'Rutland', 'Washington', 'Windsor', 'Franklin', 'Addison', 'Bennington', 'Windham'],
    'VA': ['Fairfax', 'Prince William', 'Virginia Beach', 'Loudoun', 'Chesterfield', 'Henrico', 'Norfolk', 'Arlington', 'Richmond City', 'Newport News'],
    'WA': ['King', 'Pierce', 'Snohomish', 'Spokane', 'Clark', 'Thurston', 'Kitsap', 'Yakima', 'Whatcom', 'Benton'],
    'WV': ['Kanawha', 'Berkeley', 'Cabell', 'Monongalia', 'Wood', 'Raleigh', 'Putnam', 'Harrison'],
    'WI': ['Milwaukee', 'Dane', 'Waukesha', 'Brown', 'Racine', 'Outagamie', 'Winnebago', 'Kenosha', 'Rock', 'Marathon'],
    'WY': ['Laramie', 'Natrona', 'Campbell', 'Sweetwater', 'Fremont', 'Albany', 'Sheridan', 'Teton'],
    'DC': ['Washington, D.C.']
};

// School districts by state (major districts)
const STATE_SCHOOL_DISTRICTS = {
    'AL': ['Birmingham City', 'Mobile County', 'Jefferson County', 'Montgomery County', 'Huntsville City', 'Tuscaloosa City'],
    'AK': ['Anchorage School District', 'Fairbanks North Star Borough', 'Matanuska-Susitna Borough', 'Kenai Peninsula Borough'],
    'AZ': ['Mesa Unified', 'Tucson Unified', 'Gilbert Unified', 'Chandler Unified', 'Scottsdale Unified', 'Phoenix Union', 'Tempe Union', 'Paradise Valley Unified'],
    'AR': ['Little Rock', 'Springdale', 'Bentonville', 'Fort Smith', 'Rogers', 'Pulaski County Special'],
    'CA': ['Los Angeles Unified', 'San Diego Unified', 'Long Beach Unified', 'Fresno Unified', 'Santa Ana Unified', 'San Francisco Unified', 'Oakland Unified', 'Sacramento City Unified', 'San Jose Unified', 'Elk Grove Unified'],
    'CO': ['Denver Public', 'Jefferson County', 'Douglas County', 'Cherry Creek', 'Aurora Public', 'Boulder Valley', 'Poudre', 'Adams 12 Five Star'],
    'CT': ['Hartford', 'New Haven', 'Bridgeport', 'Stamford', 'Waterbury', 'Norwalk', 'Danbury', 'Greenwich'],
    'DE': ['Christina', 'Red Clay Consolidated', 'Brandywine', 'Colonial', 'Appoquinimink', 'Capital'],
    'FL': ['Miami-Dade County', 'Broward County', 'Hillsborough County', 'Orange County', 'Palm Beach County', 'Duval County', 'Pinellas County', 'Polk County'],
    'GA': ['Gwinnett County', 'Cobb County', 'Fulton County', 'DeKalb County', 'Atlanta Public', 'Cherokee County', 'Clayton County', 'Forsyth County'],
    'HI': ['Hawaii Department of Education'],
    'ID': ['Boise Independent', 'West Ada', 'Nampa', 'Pocatello', 'Idaho Falls', 'Twin Falls'],
    'IL': ['Chicago Public', 'Elgin U-46', 'Rockford', 'Indian Prairie', 'Naperville', 'Springfield', 'Plainfield'],
    'IN': ['Indianapolis Public', 'Fort Wayne Community', 'Evansville Vanderburgh', 'South Bend Community', 'Hamilton Southeastern', 'Carmel Clay'],
    'IA': ['Des Moines Independent', 'Cedar Rapids Community', 'Davenport Community', 'Iowa City Community', 'Sioux City Community', 'Waterloo Community'],
    'KS': ['Wichita', 'Olathe', 'Shawnee Mission', 'Blue Valley', 'Kansas City', 'Topeka'],
    'KY': ['Jefferson County', 'Fayette County', 'Kenton County', 'Boone County', 'Warren County', 'Hardin County'],
    'LA': ['East Baton Rouge Parish', 'Jefferson Parish', 'Orleans Parish', 'St. Tammany Parish', 'Caddo Parish', 'Calcasieu Parish'],
    'ME': ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn', 'Biddeford'],
    'MD': ['Montgomery County', 'Prince George\'s County', 'Baltimore County', 'Anne Arundel County', 'Baltimore City', 'Howard County', 'Harford County', 'Frederick County'],
    'MA': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'New Bedford', 'Quincy'],
    'MI': ['Detroit Public', 'Utica Community', 'Ann Arbor', 'Dearborn', 'Grand Rapids', 'Lansing', 'Troy', 'Rochester Community'],
    'MN': ['Minneapolis', 'St. Paul', 'Anoka-Hennepin', 'Rosemount-Apple Valley-Eagan', 'Rochester', 'Osseo', 'Minnetonka', 'Lakeville'],
    'MS': ['Jackson Public', 'DeSoto County', 'Rankin County', 'Madison County', 'Harrison County', 'Lee County'],
    'MO': ['St. Louis Public', 'Kansas City', 'Springfield', 'Columbia', 'Rockwood', 'Francis Howell', 'Parkway', 'Hazelwood'],
    'MT': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena', 'Butte'],
    'NE': ['Omaha Public', 'Lincoln Public', 'Millard Public', 'Elkhorn Public', 'Papillion-La Vista', 'Bellevue Public'],
    'NV': ['Clark County', 'Washoe County', 'Carson City', 'Elko County', 'Douglas County'],
    'NH': ['Manchester', 'Nashua', 'Concord', 'Dover', 'Rochester', 'Salem'],
    'NJ': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Woodbridge', 'Toms River', 'Trenton', 'Camden'],
    'NM': ['Albuquerque', 'Las Cruces', 'Santa Fe', 'Rio Rancho', 'Farmington', 'Hobbs'],
    'NY': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon'],
    'NC': ['Wake County', 'Charlotte-Mecklenburg', 'Guilford County', 'Cumberland County', 'Forsyth County', 'Durham Public', 'Gaston County', 'Union County'],
    'ND': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Mandan'],
    'OH': ['Columbus City', 'Cleveland Metropolitan', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'South-Western City', 'Lakota Local'],
    'OK': ['Oklahoma City', 'Tulsa', 'Edmond', 'Norman', 'Broken Arrow', 'Moore', 'Putnam City'],
    'OR': ['Portland', 'Salem-Keizer', 'Beaverton', 'Hillsboro', 'Eugene', 'North Clackamas', 'Tigard-Tualatin', 'Bend-La Pine'],
    'PA': ['Philadelphia', 'Pittsburgh', 'Central Bucks', 'North Penn', 'Allentown', 'Reading', 'Lower Merion', 'Parkland'],
    'RI': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence', 'Woonsocket'],
    'SC': ['Greenville County', 'Charleston County', 'Horry County', 'Richland One', 'Richland Two', 'Lexington One', 'Spartanburg District 7'],
    'SD': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Watertown', 'Brookings', 'Mitchell'],
    'TN': ['Shelby County', 'Metro Nashville', 'Knox County', 'Hamilton County', 'Rutherford County', 'Williamson County', 'Sumner County', 'Montgomery County'],
    'TX': ['Houston ISD', 'Dallas ISD', 'Cypress-Fairbanks ISD', 'Northside ISD', 'Fort Worth ISD', 'Austin ISD', 'Arlington ISD', 'Katy ISD', 'North East ISD', 'Plano ISD', 'Frisco ISD', 'Lewisville ISD'],
    'UT': ['Granite', 'Jordan', 'Davis', 'Alpine', 'Canyons', 'Salt Lake City', 'Weber', 'Washington County'],
    'VA': ['Fairfax County', 'Prince William County', 'Virginia Beach City', 'Loudoun County', 'Chesterfield County', 'Henrico County', 'Chesapeake', 'Arlington County'],
    'WA': ['Seattle', 'Spokane', 'Tacoma', 'Kent', 'Federal Way', 'Bellevue', 'Everett', 'Lake Washington', 'Northshore', 'Highline'],
    'WV': ['Kanawha County', 'Berkeley County', 'Cabell County', 'Monongalia County', 'Wood County', 'Raleigh County'],
    'WI': ['Milwaukee', 'Madison Metropolitan', 'Kenosha Unified', 'Racine Unified', 'Green Bay Area', 'Appleton Area', 'Waukesha', 'Eau Claire Area'],
    'WY': ['Laramie County #1', 'Natrona County #1', 'Campbell County #1', 'Sweetwater County #1', 'Fremont County #1', 'Albany County #1'],
    'DC': ['DC Public Schools']
};

// ============================================
// CAMPAIGN FORM LOGIC
// ============================================

function initCampaignForm() {
    const form = document.getElementById('campaign-form');
    if (!form) return;

    const raceLevel = document.getElementById('race-level');
    const stateSelect = document.getElementById('state');
    const districtSelect = document.getElementById('district');
    const districtGroup = document.getElementById('district-group');

    // Populate state dropdown
    populateStates(stateSelect);

    // Race level change - show tier and reveal next sections
    raceLevel.addEventListener('change', function() {
        const value = this.value;
        if (!value) {
            hideAllSections();
            return;
        }

        // Show tier badge
        showTierBadge(value);

        // Show location section
        showSection('location-section');

        // Get jurisdiction elements
        const jurisdictionGroup = document.getElementById('jurisdiction-group');
        const jurisdictionLabel = document.getElementById('jurisdiction-label');
        const jurisdictionInput = document.getElementById('jurisdiction');
        const jurisdictionHint = document.getElementById('jurisdiction-hint');

        // Show/hide district based on race type
        const needsDistrict = ['us-house', 'state-senate', 'state-house'].includes(value);
        if (needsDistrict) {
            districtGroup.style.display = 'block';
            // Update label for state races
            const districtLabel = document.getElementById('district-label');
            if (value === 'us-house') {
                districtLabel.innerHTML = 'Congressional District <span class="required">*</span>';
            } else {
                districtLabel.innerHTML = 'District <span class="required">*</span>';
            }
        } else {
            districtGroup.style.display = 'none';
        }

        // Show/hide jurisdiction field for local races
        const localConfig = JURISDICTION_CONFIG[value];
        if (localConfig) {
            jurisdictionGroup.style.display = 'block';
            jurisdictionLabel.innerHTML = localConfig.label + ' <span class="required">*</span>';
            jurisdictionInput.placeholder = localConfig.placeholder;
            jurisdictionHint.textContent = localConfig.hint;
        } else {
            jurisdictionGroup.style.display = 'none';
        }
    });

    // State change - populate districts if needed, suggest cities
    stateSelect.addEventListener('change', function() {
        const stateCode = this.value;
        const raceType = raceLevel.value;

        if (!stateCode) return;

        // Populate districts based on race type
        if (raceType === 'us-house') {
            populateDistricts(districtSelect, stateCode, 'congressional');
        } else if (raceType === 'state-senate') {
            populateDistricts(districtSelect, stateCode, 'state-senate');
        } else if (raceType === 'state-house') {
            populateDistricts(districtSelect, stateCode, 'state-house');
        }

        // Initialize autocomplete for local races
        const localConfig = JURISDICTION_CONFIG[raceType];
        if (localConfig) {
            initAutocomplete('jurisdiction', 'jurisdiction-dropdown', localConfig.dataType, stateCode);
        }

        // Show suggested cities
        suggestCities(stateCode);

        // Show next sections
        showSection('candidate-section');

        // Show opponent section for non-local races
        if (RACE_TIERS[raceType] !== 'limited') {
            showSection('opponent-section');
        }

        showSection('contact-section');
        showSection('summary-section');
    });

    // District change - refine city suggestions if needed
    districtSelect.addEventListener('change', function() {
        // Could refine cities based on district, but state-level is usually sufficient
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitCampaignForm(form);
    });
}

function hideAllSections() {
    document.getElementById('tier-notice').classList.add('hidden');
    document.getElementById('tier-full').classList.add('hidden');
    document.getElementById('tier-core').classList.add('hidden');
    document.getElementById('tier-limited').classList.add('hidden');
    document.getElementById('location-section').classList.add('hidden');
    document.getElementById('candidate-section').classList.add('hidden');
    document.getElementById('opponent-section').classList.add('hidden');
    document.getElementById('contact-section').classList.add('hidden');
    document.getElementById('summary-section').classList.add('hidden');
    document.getElementById('suggested-cities').classList.add('hidden');
    document.getElementById('district-group').style.display = 'none';
    document.getElementById('jurisdiction-group').style.display = 'none';
}

function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
}

function showTierBadge(raceLevel) {
    const tier = RACE_TIERS[raceLevel];
    const tierNotice = document.getElementById('tier-notice');

    // Hide all badges first
    document.getElementById('tier-full').classList.add('hidden');
    document.getElementById('tier-core').classList.add('hidden');
    document.getElementById('tier-limited').classList.add('hidden');

    // Show appropriate badge
    tierNotice.classList.remove('hidden');
    document.getElementById('tier-' + tier).classList.remove('hidden');
}

function populateStates(selectElement) {
    selectElement.innerHTML = '<option value="">Select state...</option>';
    STATES.forEach(state => {
        const option = document.createElement('option');
        option.value = state.code;
        option.textContent = state.name;
        selectElement.appendChild(option);
    });
}

function populateDistricts(selectElement, stateCode, districtType) {
    const state = STATES.find(s => s.code === stateCode);
    selectElement.innerHTML = '<option value="">Select district...</option>';

    if (districtType === 'congressional') {
        // Congressional districts - we have the data
        if (state && state.districts > 1) {
            for (let i = 1; i <= state.districts; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = 'District ' + i;
                selectElement.appendChild(option);
            }
        } else if (state && state.districts === 1) {
            const option = document.createElement('option');
            option.value = 'at-large';
            option.textContent = 'At-Large';
            selectElement.appendChild(option);
        }
    } else if (districtType === 'state-senate' || districtType === 'state-house') {
        // State legislative districts - provide reasonable range
        // Most states have 30-67 senate districts and 40-203 house districts
        const maxDistrict = (districtType === 'state-senate') ? 67 : 150;
        for (let i = 1; i <= maxDistrict; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = 'District ' + i;
            selectElement.appendChild(option);
        }
        // Add "Other" option for states with higher numbers
        const otherOption = document.createElement('option');
        otherOption.value = 'other';
        otherOption.textContent = 'Other (higher number)';
        selectElement.appendChild(otherOption);
    }
}

function suggestCities(stateCode) {
    const citiesContainer = document.getElementById('cities-list');
    const citiesSection = document.getElementById('suggested-cities');

    const cities = STATE_CITIES[stateCode] || [];

    if (cities.length === 0) {
        citiesSection.classList.add('hidden');
        return;
    }

    // Show top 3-4 cities
    const topCities = cities.slice(0, 4);
    citiesContainer.innerHTML = topCities.map(city =>
        `<span class="city-chip">${city}, ${stateCode}</span>`
    ).join('');

    citiesSection.classList.remove('hidden');
}

function submitCampaignForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add suggested cities
    const cityChips = document.querySelectorAll('#cities-list .city-chip');
    data.suggested_cities = Array.from(cityChips).map(chip => chip.textContent);

    // Add timestamp
    data.submitted_at = new Date().toISOString();
    data.form_type = 'campaign_application';

    console.log('Campaign application data:', data);

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        form.innerHTML = `
            <div class="success-message">
                <h3>Application Received!</h3>
                <p>Thank you for applying to the Kyanos 2026 Trial Program. We'll review your application and respond within two business days.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">Check your email at <strong>${data.email}</strong> for confirmation and next steps.</p>
            </div>
        `;

        // Scroll to success message
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
}

// ============================================
// AGENCY FORM LOGIC
// ============================================

function initAgencyForm() {
    const form = document.getElementById('agency-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitAgencyForm(form);
    });
}

function submitAgencyForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.submitted_at = new Date().toISOString();
    data.form_type = 'agency_interest';

    console.log('Agency interest data:', data);

    // Simulate API call
    setTimeout(() => {
        form.innerHTML = `
            <div class="success-message">
                <h3>Thanks for Your Interest!</h3>
                <p>We'll reach out soon to discuss partnership opportunities for your agency.</p>
            </div>
        `;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
}

// ============================================
// NAVIGATION AND UX
// ============================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-open');
        menuBtn.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            menuBtn.classList.remove('open');
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// AUTOCOMPLETE FUNCTIONALITY
// ============================================

let currentAutocompleteState = null;

function initAutocomplete(inputId, dropdownId, dataType, stateCode) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);

    if (!input || !dropdown) return;

    // Get data based on type
    let data = [];
    if (dataType === 'cities') {
        data = STATE_CITIES[stateCode] || [];
    } else if (dataType === 'counties') {
        data = STATE_COUNTIES[stateCode] || [];
    } else if (dataType === 'districts') {
        data = STATE_SCHOOL_DISTRICTS[stateCode] || [];
    }

    currentAutocompleteState = {
        input,
        dropdown,
        data,
        dataType,
        stateCode,
        highlightedIndex: -1,
        isCustomValue: false
    };

    // Input event - filter and show dropdown
    input.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        showAutocompleteResults(query);
    });

    // Focus event - show all options
    input.addEventListener('focus', function() {
        const query = this.value.toLowerCase().trim();
        showAutocompleteResults(query);
    });

    // Blur event - hide dropdown (with delay for click)
    input.addEventListener('blur', function() {
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 200);
    });

    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.autocomplete-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentAutocompleteState.highlightedIndex = Math.min(
                currentAutocompleteState.highlightedIndex + 1,
                items.length - 1
            );
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentAutocompleteState.highlightedIndex = Math.max(
                currentAutocompleteState.highlightedIndex - 1,
                0
            );
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentAutocompleteState.highlightedIndex >= 0 && items[currentAutocompleteState.highlightedIndex]) {
                items[currentAutocompleteState.highlightedIndex].click();
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.add('hidden');
        }
    });
}

function showAutocompleteResults(query) {
    const { input, dropdown, data, dataType, stateCode } = currentAutocompleteState;

    // Filter results
    let filtered = data.filter(item =>
        item.toLowerCase().includes(query)
    );

    // Limit to top 10 matches
    filtered = filtered.slice(0, 10);

    // Build dropdown HTML
    let html = '';

    if (filtered.length > 0) {
        filtered.forEach((item, index) => {
            const suffix = dataType === 'counties' ? ' County' : '';
            html += `<div class="autocomplete-item" data-value="${item}" data-index="${index}">${item}${suffix}</div>`;
        });
    } else if (query.length > 0) {
        html += `<div class="autocomplete-no-results">No matches found</div>`;
    }

    // Always add "Other" option
    html += `<div class="autocomplete-item other-option" data-value="__OTHER__">Other (enter manually)</div>`;

    dropdown.innerHTML = html;
    dropdown.classList.remove('hidden');
    currentAutocompleteState.highlightedIndex = -1;

    // Add click handlers
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function() {
            selectAutocompleteItem(this.dataset.value);
        });
    });
}

function selectAutocompleteItem(value) {
    const { input, dropdown, dataType } = currentAutocompleteState;

    if (value === '__OTHER__') {
        // Clear and let them type
        input.value = '';
        input.placeholder = 'Type your jurisdiction...';
        input.focus();
        currentAutocompleteState.isCustomValue = true;
    } else {
        const suffix = dataType === 'counties' ? ' County' : '';
        input.value = value + suffix;
        document.getElementById('jurisdiction-value').value = value;
        currentAutocompleteState.isCustomValue = false;
    }

    dropdown.classList.add('hidden');
}

function updateHighlight(items) {
    items.forEach((item, index) => {
        if (index === currentAutocompleteState.highlightedIndex) {
            item.classList.add('highlighted');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('highlighted');
        }
    });
}

function updateAutocompleteData(stateCode) {
    if (!currentAutocompleteState) return;

    const { dataType } = currentAutocompleteState;

    if (dataType === 'cities') {
        currentAutocompleteState.data = STATE_CITIES[stateCode] || [];
    } else if (dataType === 'counties') {
        currentAutocompleteState.data = STATE_COUNTIES[stateCode] || [];
    } else if (dataType === 'districts') {
        currentAutocompleteState.data = STATE_SCHOOL_DISTRICTS[stateCode] || [];
    }

    currentAutocompleteState.stateCode = stateCode;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Form validation helper
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUrl(url) {
    if (!url) return true; // Optional fields
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Add mobile menu styles dynamically
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .nav-links.mobile-open {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            gap: 1rem;
        }
        .mobile-menu-btn.open span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-btn.open span:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-btn.open span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }
`;
document.head.appendChild(mobileStyles);
