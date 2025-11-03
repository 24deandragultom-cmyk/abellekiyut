// Ambil semua elemen penting dari DOM
const statusMessage = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const cells = document.querySelectorAll('.cell');

// Variabel status game
let gameActive = true;
let currentPlayer = 'X'; // Player X mulai lebih dulu
let gameState = ['', '', '', '', '', '', '', '', '']; // Representasi 9 kotak

// Semua kemungkinan kombinasi kemenangan (indeks sel)
const winningConditions = [
    [0, 1, 2], // Baris atas
    [3, 4, 5], // Baris tengah
    [6, 7, 8], // Baris bawah
    [0, 3, 6], // Kolom kiri
    [1, 4, 7], // Kolom tengah
    [2, 5, 8], // Kolom kanan
    [0, 4, 8], // Diagonal dari kiri atas
    [2, 4, 6]  // Diagonal dari kanan atas
];

// Pesan game
const winningMessage = () => `Yay! Player ${currentPlayer} won the 'Ohana' round! 🏆`;
const drawMessage = () => `Whoops! It's a draw. Let's start a new adventure! 🌴`;
const currentPlayerTurn = () => `It's Player ${currentPlayer}'s turn! Go!`;

// Fungsi untuk menangani klik pada sel
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Cek apakah game sudah selesai atau sel sudah terisi
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Perbarui status game dan UI
    handlePlayerMove(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Update array gameState dan tampilan sel di UI
function handlePlayerMove(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Tambahkan kelas 'x' atau 'o' untuk styling
}

// Cek apakah ada pemenang atau seri
function handleResultValidation() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        // Jika salah satu sel kosong, lanjutkan ke kondisi berikutnya
        if (a === '' || b === '' || c === '') {
            continue;
        }

        // Cek jika ketiga sel memiliki nilai yang sama
        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition;
            break;
        }
    }

    if (roundWon) {
        // Jika ada pemenang
        statusMessage.innerHTML = winningMessage();
        gameActive = false; // Hentikan game
        
        // Tandai sel yang menang untuk animasi
        winningCombo.forEach(index => {
            cells[index].classList.add('winning');
        });
        return;
    }

    // Cek apakah terjadi Seri (Draw)
    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusMessage.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // Jika belum ada pemenang atau seri, ganti pemain
    handlePlayerChange();
}

// Ganti pemain dan update pesan status
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.innerHTML = currentPlayerTurn();
}

// Fungsi untuk me-restart game
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusMessage.innerHTML = currentPlayerTurn();
    
    // Bersihkan semua sel dari nilai dan kelas
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.classList.remove('winning');
    });
}

// Daftarkan event listener
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

// Inisialisasi pesan awal
statusMessage.innerHTML = currentPlayerTurn();