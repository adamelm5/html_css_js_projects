document.addEventListener('DOMContentLoaded', function() {
    const matieres = document.querySelectorAll('.matiere');
    
    matieres.forEach(matiere => {
        const header = matiere.querySelector('.matiere-header');
        
        header.addEventListener('click', function() {

            matieres.forEach(m => {
                if (m !== matiere) {
                    m.classList.remove('active');
                }
            });
            
            matiere.classList.toggle('active');
            
            const toggleBtn = matiere.querySelector('.toggle-btn');
            if (matiere.classList.contains('active')) {
                toggleBtn.textContent = '×';
            } else {
                toggleBtn.textContent = '+';
            }
        });
    });
});
