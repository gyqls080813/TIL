document.addEventListener('DOMContentLoaded', () => {
    const arrayContainer = document.getElementById('bs-array-container');
    const searchBtn = document.getElementById('bs-search-btn');
    const resetBtn = document.getElementById('bs-reset-btn');
    const targetInput = document.getElementById('target-value');
    const outputDiv = document.getElementById('bs-output');

    let array = [];
    let low = 0;
    let high = 0;
    let mid = 0;
    let stepTimeout;

    function generateArray() {
        array = Array.from({ length: 15 }, (_, i) => i * 2 + 3); // Sorted array [3, 5, 7, ...]
    }

    function renderArray(pointers = {}) {
        arrayContainer.innerHTML = '';
        array.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('bs-cell');
            cell.innerHTML = `
                <span class="bs-index">${index}</span>
                ${value}
                <span class="bs-pointer low">L</span>
                <span class="bs-pointer mid">M</span>
                <span class="bs-pointer high">H</span>
            `;

            if (pointers.low === index) cell.classList.add('low');
            if (pointers.high === index) cell.classList.add('high');
            if (pointers.mid === index) cell.classList.add('mid');
            
            arrayContainer.appendChild(cell);
        });
    }

    function log(message) {
        outputDiv.innerHTML += message + '\n';
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    function reset() {
        clearTimeout(stepTimeout);
        outputDiv.innerHTML = '';
        generateArray();
        renderArray();
        log('Simulator reset. Array generated.');
    }

    function search() {
        clearTimeout(stepTimeout);
        outputDiv.innerHTML = '';
        const target = parseInt(targetInput.value, 10);

        if (isNaN(target)) {
            log('Please enter a valid number.');
            return;
        }

        log(`Searching for target: ${target}`);
        
        low = 0;
        high = array.length - 1;
        let step = 1;

        function searchStep() {
            if (low > high) {
                log(`\nTarget ${target} not found in the array.`);
                renderArray(); // Clear pointers
                return;
            }

            mid = Math.floor(low + (high - low) / 2);
            log(`\nStep ${step++}:`);
            log(`  - Low: ${low}, High: ${high}`);
            log(`  - Midpoint is at index ${mid} (value: ${array[mid]})`);
            renderArray({ low, high, mid });

            if (array[mid] === target) {
                log(`  - Target found at index ${mid}!`);
                setTimeout(() => {
                    const midCell = arrayContainer.children[mid];
                    if(midCell) midCell.style.backgroundColor = '#5cb85c';
                    if(midCell) midCell.style.color = 'white';
                }, 500);
                return;
            } else if (array[mid] < target) {
                log(`  - ${array[mid]} < ${target}. Adjusting search space to the right half.`);
                low = mid + 1;
            } else {
                log(`  - ${array[mid]} > ${target}. Adjusting search space to the left half.`);
                high = mid - 1;
            }

            stepTimeout = setTimeout(searchStep, 2000); // 2-second delay between steps
        }

        searchStep();
    }

    searchBtn.addEventListener('click', search);
    resetBtn.addEventListener('click', reset);

    // Initial setup
    reset();
});