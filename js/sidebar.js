const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebar-toggle")

if (sidebar && sidebarToggle) { // toggle della libreria laterale (valido su tutte le pagine)
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed")
  })
}
