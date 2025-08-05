// public/js/walletWatcher.js

window.isLoggingOut = window.isLoggingOut || false; // Flag untuk mencegah duplicate execution

// 🟢 Sync dengan window flag kalau ada
if (typeof window !== 'undefined' && window.isLoggingOut) {
  isLoggingOut = true;
}

async function handleLogout() {
   // Cegah eksekusi ganda
  if (window.isLoggingOut) return;
  window.isLoggingOut = true;

  try {
    await axios.get('/auth/logout');
  } catch (err) {
    console.warn('Logout failed:', err);
  }
  
  Swal.fire ({
    icon: 'error',
    title: 'Oops...',
    text: 'Wallet disconnected. Logging out...',
    timer: 1500,
    timerProgressBar: true,
    showConfirmButton: false
  });
  
  setTimeout(() => {
    window.location.href = '/auth/login';
  }, 1500);
}


async function checkAuthStatus() {
  // Cegah eksekusi jika sedang logout
  if (window.isLoggingOut) return;

  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const tokenCheck = await axios.get('/auth/check-token');

    if (accounts.length === 0 || !tokenCheck.data.valid) {
      handleLogout()

    //   await axios.get('/auth/logout');
    //   setTimeout(() => {
    //   window.location.href = '/auth/login';
    // }, 3000)
    }
  } catch (err) {
    console.warn('⚠️ Wallet/JWT check failed:', err);
  }
}

function startWalletWatcher() {
  if (typeof window.ethereum === 'undefined') return;

  // Set interval polling
  setInterval(checkAuthStatus, 3000);

  // Listener jika akun wallet berubah
  ethereum.on('accountsChanged', async (accounts) => {

    // Cegah eksekusi jika sedang logout
    if (window.isLoggingOut) return;

    if (accounts.length === 0) {
      handleLogout()

      // await axios.get('/auth/logout');
      // window.location.href = '/auth/login';
    }
  });
}

// 🟢 PENTING: jalankan watcher setelah DOM ready
window.addEventListener('DOMContentLoaded', () => {
  startWalletWatcher();
});
