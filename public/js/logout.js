async function logout() {
  const result = await Swal.fire({
    title: "Yakin logout?",
    text: "Kamu akan keluar dari sesi ini",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    // ⚠️ Tambahkan ini biar walletWatcher gak ikut manggil handleLogout()
    window.isLoggingOut = true;

    try {
      const logoutRes = await axios.get("/auth/logout");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: logoutRes.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal logout. Coba lagi.",
      });
    }
  }
}
