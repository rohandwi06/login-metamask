async function login() {
  if (!window.ethereum) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'MetaMask belum terpasang!'
    });
  }

  // Force re-request permission
  await ethereum.request({
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }],
  });

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const address = accounts[0];

  const nonceRes = await axios.post(`/auth/nonce`, {address});
  const hashedMessage = nonceRes.data.nonce;

  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [hashedMessage, address],
  });

  const loginRes = await axios.post('/auth/login', {
    address,
    signature,
    hashedMessage,
  });

  // SweetAlert untuk sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: loginRes.data.message
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/';
      }
    });

   setTimeout(() => {
      window.location.href = '/';
    }, 5000); // 1 detik delay
}