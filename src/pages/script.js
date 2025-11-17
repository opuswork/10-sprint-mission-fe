document.addEventListener('DOMContentLoaded', function() {
    const sortToggle = document.querySelector('.sort-toggle');
    const mobileSortDropdown = document.querySelector('.mobile-sort-dropdown');
    const sortOptions = document.querySelectorAll('.sort-option');
    const sortSelect = document.querySelector('.sort-select');

    // Toggle mobile sort options
    sortToggle?.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileSortDropdown.style.display = 
            mobileSortDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Handle sort option selection
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.dataset.value;
            sortSelect.value = value; // Update desktop select
            mobileSortDropdown.style.display = 'none';
            // Here you would trigger the actual sorting logic
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-controls')) {
            mobileSearchContainer.style.display = 'none';
            mobileSortDropdown.style.display = 'none';
        }
    });
});