const topBar = document.querySelector('#top-bar');

const exteriorColorSection = document.querySelector('#exterior-buttons')
const interiorColorSection = document.querySelector('#interior-buttons')

const exteriorImage = document.querySelector('#exterior-image')
const interiorImage = document.querySelector('#interior-image')

const wheelsColorSection = document.querySelector('#wheel-buttons')

const performanceBtn = document.querySelector('#performance-btn');
const totalPrice = document.querySelector('#total-price')
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox')
const accessoriesCheckBoxes = document.querySelectorAll('.accessory-form-checkbox');

const downPaymentElement = document.querySelector('#down-payment')
const monthlyPaymentElement = document.querySelector('#monthly-payment')
const regionDropdown = document.querySelector('#region-button')

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
    'Performance Wheels': false,
    'Performance Package': false,
    'Full Self-Driving': false,
}

const pricing = {
  'Performance Wheels': 2500,
  'Performance Package': 5000,
  'Full Self-Driving': 8500,
  Accessories: {
    'Center Console Trays': 35,
    'Sunshade': 105,
    'All-Weather Interior Liners': 225,
  },
};

// Update total price in the UI
const updateTotalPrice = ()=>{
    currentPrice  =  basePrice;

    // performance wheel options 
    currentPrice= selectedOptions['Performance Wheels'] ? currentPrice+pricing['Performance Wheels'] : currentPrice;

    // performance package options 
    currentPrice= selectedOptions['Performance Package'] ? currentPrice+pricing['Performance Package'] : currentPrice;
    
    // performance package options 
    currentPrice= selectedOptions['Full Self-Driving'] ? currentPrice+pricing['Full Self-Driving'] : currentPrice;

    // accessory Checkboxes
    accessoriesCheckBoxes.forEach((checkbox)=>{

        const accessoryLabel = checkbox.closest('label').querySelector('span').textContent.trim();
        console.log(accessoryLabel)
        accessoryPrice  = pricing['Accessories'][accessoryLabel]

        if(checkbox.checked){
            currentPrice+=accessoryPrice;
        }

    });

    totalPrice.textContent = `$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();
}

const updatePaymentBreakdown = () => {
  // Calculate down payment
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate loan details (assuming 60-month loan and 3% interest rate)
  const loanTermMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1+monthlyInterestRate,loanTermMonths)) / (Math.pow(1+monthlyInterestRate,loanTermMonths) - 1 );
  monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`
};

// Image Mapping

const exteriorImages = {
    'Stealth Grey': './images/model-y-stealth-grey.jpg',
    'Pearl White': './images/model-y-pearl-white.jpg',
    'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/model-y-solid-black.jpg',
    'Ultra Red': './images/model-y-ultra-red.jpg',
    'Quicksilver': './images/model-y-quicksilver.jpg',
};

const interiorImages = {
    Dark: './images/model-y-interior-dark.jpg',
    Light: './images/model-y-interior-light.jpg',
};

// Handle Top Bar On Scroll
const handleScroll = ()=>{
    const atTop = window.scrollY === 0 ;
    topBar.classList.toggle('visible-bar',atTop);
    topBar.classList.toggle('hidden-bar',!atTop);
}
      
// Handle color Selection
const handleColorButtonClick = (event) => {
    let button;

    if (event.target.tagName === 'IMG') {
        button = event.target.closest('button')
    } else if (event.target.tagName === 'BUTTON') {
        button = event.target;
    }

    if (button) {
        const buttons = event.currentTarget.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.classList.remove('btn-selected');
        });
        button.classList.add('btn-selected')
    }

    // chage Exterior Image  
    if (event.currentTarget === exteriorColorSection) {
        selectedColor = button.querySelector('img').alt;
        updateExteriorImage();
    }
    // chage Interior Image  
    if (event.currentTarget === interiorColorSection) {
        const color = button.querySelector('img').alt;
        interiorImage.src = interiorImages[color];
    }
}

const handleRegionButtonClick = (event)=>{
    let button ;
    if(event.target.tagName === 'I'){
        button = event.target.closest('button')
    }else if(event.target.tagName==='BUTTON'){
        button = event.target.closest('button') 
    }
    button.classList.toggle('btn-selected')
    const regionDropdownClass = document.querySelector('#region-dropdown');
     const mainSection = document.querySelector('#mainSection');

    regionDropdownClass.classList.toggle('hidden');
    mainSection.classList.toggle('hidden');
    
   
}

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`);
};

// Wheel Selection
const handleWheelButtonClick = (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttons = event.currentTarget.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.classList.remove('bg-gray-700', 'text-white');
        });
        event.target.classList.add('bg-gray-700', 'text-white')

        selectedOptions['Performance Wheels'] = event.target.textContent.includes('Performance');
        updateExteriorImage();
        updateTotalPrice();
    }
};

// Performance Package selection
const handlePerfromanceButtonClick= ()=>{
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    selectedOptions['Performance Package'] = isSelected;
    updateTotalPrice();
}

// full-self-driving- Selection
const fullSelfDrivingChange = ()=>{
    const isSelected = fullSelfDrivingCheckbox.checked;
    selectedOptions['Full Self-Driving'] = isSelected;
    updateTotalPrice();
}

accessoriesCheckBoxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',()=>updateTotalPrice());
});

// Initial Update Total Price
updateTotalPrice();


// Event Listener
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll))

exteriorColorSection.addEventListener('click', handleColorButtonClick)
interiorColorSection.addEventListener('click', handleColorButtonClick)
wheelsColorSection.addEventListener('click', handleWheelButtonClick)
performanceBtn.addEventListener('click',handlePerfromanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('change',fullSelfDrivingChange)
regionDropdown.addEventListener('click',handleRegionButtonClick)