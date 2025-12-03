// No complex scripts needed for the sketchbook theme
// Just simple interactions

document.addEventListener('DOMContentLoaded', () => {
    console.log("Notebook opened!");

    // Maybe add a simple random rotation to sticky notes on load for more "messy" feel
    const notes = document.querySelectorAll('.sticky-note');
    notes.forEach(note => {
        const randomRot = Math.random() * 6 - 3; // Random between -3 and 3
        note.style.transform = `rotate(${randomRot}deg)`;
    });
});